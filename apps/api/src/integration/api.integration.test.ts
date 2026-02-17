import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { spawn, type ChildProcessWithoutNullStreams } from 'child_process';
import fs from 'fs';
import net from 'net';
import os from 'os';
import path from 'path';

function spawnShell(command: string, options: any) {
    if (process.platform === 'win32') {
        return spawn('cmd.exe', ['/d', '/s', '/c', command], options);
    }
    return spawn('sh', ['-lc', command], options);
}

function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function createDbUrl(filePath: string) {
    return `file:${filePath.replace(/\\/g, '/')}`;
}

async function findFreePort(): Promise<number> {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.on('error', reject);
        server.listen(0, '127.0.0.1', () => {
            const address = server.address();
            if (!address || typeof address === 'string') {
                server.close();
                return reject(new Error('Failed to resolve free port'));
            }
            const { port } = address;
            server.close(() => resolve(port));
        });
    });
}

async function waitForHealth(baseUrl: string, timeoutMs = 30000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        try {
            const res = await fetch(`${baseUrl}/api/health`);
            if (res.ok) return;
        } catch {
            // Retry until timeout.
        }
        await wait(500);
    }
    throw new Error('API health check timeout');
}

describe('VTDR API integration (Store-First)', () => {
    let apiProcess: ChildProcessWithoutNullStreams | null = null;
    let apiPort = 0;
    let baseUrl = '';
    let dbFile = '';
    let dbUrl = '';
    const repoRoot = path.resolve(process.cwd(), '../..');

    beforeAll(async () => {
        apiPort = await findFreePort();
        baseUrl = `http://127.0.0.1:${apiPort}`;
        dbFile = path.join(os.tmpdir(), `vtdr-int-${Date.now()}-${Math.random().toString(36).slice(2)}.db`);
        dbUrl = createDbUrl(dbFile);
        const sourceDb = path.join(repoRoot, 'packages', 'data', 'prisma', 'dev.db');
        fs.copyFileSync(sourceDb, dbFile);

        apiProcess = spawnShell(
            'npm exec tsx apps/api/src/index.ts',
            {
                cwd: repoRoot,
                env: {
                    ...process.env,
                    DATABASE_URL: dbUrl,
                    PORT: String(apiPort)
                },
                stdio: 'pipe'
            }
        );

        await waitForHealth(baseUrl);
    }, 120000);

    afterAll(async () => {
        if (apiProcess && !apiProcess.killed) {
            apiProcess.kill('SIGTERM');
            await wait(1000);
            if (!apiProcess.killed) {
                apiProcess.kill('SIGKILL');
            }
        }

        for (const suffix of ['', '-journal', '-wal', '-shm']) {
            const file = `${dbFile}${suffix}`;
            if (file && fs.existsSync(file)) {
                try {
                    fs.rmSync(file, { force: true });
                } catch {
                    // Ignore cleanup errors for locked temp files on Windows.
                }
            }
        }
    });

    it('covers themes -> stores -> simulator -> preview -> theme settings', async () => {
        const syncRes = await fetch(`${baseUrl}/api/themes/sync`, { method: 'POST' });
        expect(syncRes.status).toBe(200);
        const syncJson: any = await syncRes.json();
        expect(syncJson.success).toBe(true);
        expect(syncJson.data.synced).toBeGreaterThan(0);

        const createRes = await fetch(`${baseUrl}/api/stores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Integration Store', autoSeed: true })
        });
        expect(createRes.status).toBe(200);
        const createJson: any = await createRes.json();
        expect(createJson.success).toBe(true);
        const storeId = createJson.data.id as string;
        expect(storeId).toBeTruthy();

        const contextHeaders = {
            'X-VTDR-Store-Id': storeId,
            'Context-Store-Id': storeId
        };

        const productsRes = await fetch(`${baseUrl}/api/v1/products`, {
            headers: contextHeaders
        });
        expect(productsRes.status).toBe(200);
        const productsJson: any = await productsRes.json();
        expect(productsJson.success).toBe(true);
        expect(Array.isArray(productsJson.data)).toBe(true);

        const storeRes = await fetch(`${baseUrl}/api/stores/${storeId}`, {
            headers: contextHeaders
        });
        expect(storeRes.status).toBe(200);
        const storeJson: any = await storeRes.json();
        expect(storeJson.success).toBe(true);

        const themeId = storeJson.data.themeId as string;
        const themeVersion = storeJson.data.themeVersion.version as string;

        const previewRes = await fetch(
            `${baseUrl}/preview/${storeId}/${themeId}/${themeVersion}?page=index`
        );
        expect(previewRes.status).toBe(200);
        const previewHtml = await previewRes.text();
        expect(previewHtml.toLowerCase()).toContain('<html');

        const saveThemeSettingsRes = await fetch(`${baseUrl}/api/v1/theme/settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...contextHeaders
            },
            body: JSON.stringify({
                header_is_sticky: false,
                sticky_add_to_cart: true
            })
        });
        expect(saveThemeSettingsRes.status).toBe(200);
        const saveThemeSettingsJson: any = await saveThemeSettingsRes.json();
        expect(saveThemeSettingsJson.success).toBe(true);

        const getThemeSettingsRes = await fetch(`${baseUrl}/api/v1/theme/settings`, {
            headers: contextHeaders
        });
        expect(getThemeSettingsRes.status).toBe(200);
        const getThemeSettingsJson: any = await getThemeSettingsRes.json();
        expect(getThemeSettingsJson.success).toBe(true);
        expect(getThemeSettingsJson.data.values.header_is_sticky).toBe(false);
        expect(getThemeSettingsJson.data.values.sticky_add_to_cart).toBe(true);
    }, 120000);

    it('returns unified error when store context is missing', async () => {
        const res = await fetch(`${baseUrl}/api/v1/products`);
        expect(res.status).toBe(400);
        const json: any = await res.json();
        expect(json.success).toBe(false);
        expect(json.status).toBe(400);
        expect(json.error).toContain('Store context missing');
    });

    it('returns unified error when store context is invalid', async () => {
        const res = await fetch(`${baseUrl}/api/v1/products`, {
            headers: { 'X-VTDR-Store-Id': 'store-does-not-exist' }
        });
        expect(res.status).toBe(400);
        const json: any = await res.json();
        expect(json.success).toBe(false);
        expect(json.status).toBe(400);
        expect(json.error).toContain('Invalid store context');
    });

    it('returns unified error for unknown api route', async () => {
        const res = await fetch(`${baseUrl}/api/this-route-does-not-exist`);
        expect(res.status).toBe(404);
        const json: any = await res.json();
        expect(json.success).toBe(false);
        expect(json.status).toBe(404);
        expect(json.error).toContain('not found');
    });

    it('returns 404 envelope for simulator resource not found with valid context', async () => {
        const createRes = await fetch(`${baseUrl}/api/stores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'NotFound Context Store', autoSeed: false })
        });
        expect(createRes.status).toBe(200);
        const createJson: any = await createRes.json();
        const storeId = createJson.data.id as string;

        const res = await fetch(`${baseUrl}/api/v1/products/non-existing-product`, {
            headers: {
                'X-VTDR-Store-Id': storeId
            }
        });
        expect(res.status).toBe(404);
        const json: any = await res.json();
        expect(json.success).toBe(false);
        expect(json.status).toBe(404);
        expect(json.error).toContain('Product not found');
    });
});
