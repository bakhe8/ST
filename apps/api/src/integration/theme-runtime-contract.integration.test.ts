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

const PREVIEW_CORE_PATHS = ['/', '/products', '/categories', '/brands', '/blog'];

describe('Theme Runtime Contract v1 compatibility', () => {
    let apiProcess: ChildProcessWithoutNullStreams | null = null;
    let apiPort = 0;
    let baseUrl = '';
    let dbFile = '';
    let dbUrl = '';
    const repoRoot = path.resolve(process.cwd(), '../..');

    beforeAll(async () => {
        apiPort = await findFreePort();
        baseUrl = `http://127.0.0.1:${apiPort}`;
        dbFile = path.join(os.tmpdir(), `vtdr-contract-${Date.now()}-${Math.random().toString(36).slice(2)}.db`);
        dbUrl = createDbUrl(dbFile);
        const sourceDb = path.join(repoRoot, 'packages', 'data', 'prisma', 'dev.db');
        fs.copyFileSync(sourceDb, dbFile);

        apiProcess = spawnShell('npm exec tsx apps/api/src/index.ts', {
            cwd: repoRoot,
            env: {
                ...process.env,
                DATABASE_URL: dbUrl,
                PORT: String(apiPort)
            },
            stdio: 'pipe'
        });

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

    it('validates canonical preview/runtime contract for every discovered theme', async () => {
        const syncRes = await fetch(`${baseUrl}/api/themes/sync`, { method: 'POST' });
        expect(syncRes.status).toBe(200);
        const syncJson: any = await syncRes.json();
        expect(syncJson.success).toBe(true);
        expect(Number(syncJson.data?.synced || 0)).toBeGreaterThan(0);

        const themesRes = await fetch(`${baseUrl}/api/themes`);
        expect(themesRes.status).toBe(200);
        const themesJson: any = await themesRes.json();
        expect(themesJson.success).toBe(true);
        const themes = Array.isArray(themesJson.data) ? themesJson.data : [];
        expect(themes.length).toBeGreaterThan(0);

        const failures: string[] = [];

        for (const theme of themes) {
            const themeId = String(theme?.id || '').trim();
            const versions = Array.isArray(theme?.versions) ? theme.versions : [];
            const firstVersion = versions[0];
            const themeVersionId = String(firstVersion?.id || '').trim();
            const themeVersion = String(firstVersion?.version || '').trim();

            if (!themeId || !themeVersionId || !themeVersion) {
                failures.push(
                    `[${themeId || 'unknown-theme'}] Missing version record (themeVersionId/themeVersion)`
                );
                continue;
            }

            const createStoreRes = await fetch(`${baseUrl}/api/stores`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: `Contract ${themeId}` })
            });
            if (createStoreRes.status !== 200) {
                failures.push(`[${themeId}] Failed to create store (status=${createStoreRes.status})`);
                continue;
            }
            const createStoreJson: any = await createStoreRes.json();
            const storeId = String(createStoreJson?.data?.id || '').trim();
            if (!storeId) {
                failures.push(`[${themeId}] Missing storeId after create`);
                continue;
            }

            const updateStoreRes = await fetch(`${baseUrl}/api/stores/${storeId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    themeId,
                    themeVersionId
                })
            });
            if (updateStoreRes.status !== 200) {
                failures.push(`[${themeId}] Failed to bind store to theme (status=${updateStoreRes.status})`);
                continue;
            }

            const contextHeaders = {
                'X-VTDR-Store-Id': storeId,
                'Context-Store-Id': storeId
            };

            const productsRes = await fetch(`${baseUrl}/api/v1/products`, { headers: contextHeaders });
            if (productsRes.status !== 200) {
                failures.push(`[${themeId}] GET /api/v1/products failed (status=${productsRes.status})`);
            }

            const menusRes = await fetch(`${baseUrl}/api/v1/menus/header`, { headers: contextHeaders });
            if (menusRes.status !== 200) {
                failures.push(`[${themeId}] GET /api/v1/menus/header failed (status=${menusRes.status})`);
            } else {
                const menusJson: any = await menusRes.json();
                const menuItems = Array.isArray(menusJson?.data) ? menusJson.data : [];
                if (menuItems.length === 0) {
                    failures.push(`[${themeId}] Header menu is empty`);
                }
            }

            const componentsRes = await fetch(`${baseUrl}/api/v1/theme/components`, { headers: contextHeaders });
            if (componentsRes.status !== 200) {
                failures.push(`[${themeId}] GET /api/v1/theme/components failed (status=${componentsRes.status})`);
            } else {
                const componentsJson: any = await componentsRes.json();
                if (!Array.isArray(componentsJson?.data?.components)) {
                    failures.push(`[${themeId}] Theme components payload is not normalized`);
                }
            }

            const settingsRes = await fetch(`${baseUrl}/api/v1/theme/settings`, { headers: contextHeaders });
            if (settingsRes.status !== 200) {
                failures.push(`[${themeId}] GET /api/v1/theme/settings failed (status=${settingsRes.status})`);
            }

            const homePreviewRes = await fetch(
                `${baseUrl}/preview/${storeId}/${themeId}/${themeVersion}?page=index&viewport=desktop`
            );
            if (homePreviewRes.status !== 200) {
                failures.push(`[${themeId}] Preview index failed (status=${homePreviewRes.status})`);
            } else {
                const homeHtml = await homePreviewRes.text();
                const lower = homeHtml.toLowerCase();
                if (!lower.includes('<html')) {
                    failures.push(`[${themeId}] Preview index missing <html>`);
                }
                if (
                    homeHtml.includes('Renderer Error') ||
                    homeHtml.includes('Render Error') ||
                    homeHtml.includes('Preview rendering failed')
                ) {
                    failures.push(`[${themeId}] Preview index returned render error marker`);
                }
                if (!homeHtml.includes('/sdk-bridge.js')) {
                    failures.push(`[${themeId}] sdk-bridge injection missing from preview HTML`);
                }
            }

            for (const routePath of PREVIEW_CORE_PATHS.filter((item) => item !== '/')) {
                const previewRes = await fetch(
                    `${baseUrl}/preview/${storeId}/${themeId}/${themeVersion}${routePath}?viewport=desktop`
                );
                if (previewRes.status !== 200) {
                    failures.push(`[${themeId}] Preview route ${routePath} failed (status=${previewRes.status})`);
                    continue;
                }
                const html = await previewRes.text();
                const lower = html.toLowerCase();
                if (!lower.includes('<html')) {
                    failures.push(`[${themeId}] Preview route ${routePath} missing <html>`);
                }
                if (html.includes('Renderer Error') || html.includes('Render Error')) {
                    failures.push(`[${themeId}] Preview route ${routePath} contains render error marker`);
                }
            }

            const localePreviewRes = await fetch(
                `${baseUrl}/preview/${storeId}/${themeId}/${themeVersion}/ar/products?viewport=desktop`
            );
            if (localePreviewRes.status !== 200) {
                failures.push(`[${themeId}] Preview localized route /ar/products failed (status=${localePreviewRes.status})`);
            }

            const bridgeRes = await fetch(`${baseUrl}/sdk-bridge.js`);
            if (bridgeRes.status !== 200) {
                failures.push(`[${themeId}] GET /sdk-bridge.js failed (status=${bridgeRes.status})`);
            } else {
                const bridgeText = await bridgeRes.text();
                if (!bridgeText.includes('resolvePreviewBasePath')) {
                    failures.push(`[${themeId}] sdk-bridge.js missing preview navigation adapter`);
                }
            }
        }

        expect(
            failures,
            failures.length
                ? `Theme Runtime Contract v1 failures:\n${failures.join('\n')}`
                : 'all themes passed'
        ).toEqual([]);
    }, 180000);
});

