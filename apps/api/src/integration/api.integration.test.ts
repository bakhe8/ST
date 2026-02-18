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

async function waitForHealth(baseUrl: string, timeoutMs = 120000) {
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

function collectVariableListFields(fields: any[]): any[] {
    if (!Array.isArray(fields)) return [];
    const result: any[] = [];
    for (const field of fields) {
        if (!field || typeof field !== 'object') continue;
        if (field.type === 'items' && field.format === 'variable-list') {
            result.push(field);
        }
        if (Array.isArray(field.fields)) {
            result.push(...collectVariableListFields(field.fields));
        }
    }
    return result;
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
    }, 300000);

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
        const selectedProductId = String(productsJson.data[0]?.id || '');
        const selectedProductHref = String(productsJson.data[0]?.url || `/products/${selectedProductId}`);
        expect(selectedProductId).toBeTruthy();

        const themeComponentsRes = await fetch(`${baseUrl}/api/v1/theme/components`, {
            headers: contextHeaders
        });
        expect(themeComponentsRes.status).toBe(200);
        const themeComponentsJson: any = await themeComponentsRes.json();
        expect(themeComponentsJson.success).toBe(true);
        expect(Array.isArray(themeComponentsJson.data.components)).toBe(true);
        const homeBrands = themeComponentsJson.data.components.find((c: any) => c.path === 'home.brands');
        const homeMainLinks = themeComponentsJson.data.components.find((c: any) => c.path === 'home.main-links');
        const homeSquareBanners = themeComponentsJson.data.components.find((c: any) => c.path === 'home.enhanced-square-banners');
        const homeSliderProducts = themeComponentsJson.data.components.find((c: any) => c.path === 'home.slider-products-with-header');
        const variableListFields = (themeComponentsJson.data.components || []).flatMap((component: any) =>
            collectVariableListFields(component?.fields || [])
        );
        const brandsField = homeBrands?.fields?.find((f: any) => f.id === 'brands');
        const categoriesField = homeMainLinks?.fields?.find((f: any) => f.id === 'categories');
        const productsField = homeSliderProducts?.fields?.find((f: any) => f.id === 'products');
        const blogArticlesVariableField = variableListFields.find((field: any) =>
            Array.isArray(field?.variableOptions?.blog_articles)
        );
        const blogCategoriesVariableField = variableListFields.find((field: any) =>
            Array.isArray(field?.variableOptions?.blog_categories)
        );
        expect(Array.isArray(brandsField?.options)).toBe(true);
        expect(brandsField.options.length).toBeGreaterThan(0);
        expect(Array.isArray(categoriesField?.options)).toBe(true);
        expect(categoriesField.options.length).toBeGreaterThan(0);
        expect(Array.isArray(productsField?.options)).toBe(true);
        expect(productsField.options.length).toBeGreaterThan(0);
        expect(Array.isArray(blogArticlesVariableField?.variableOptions?.blog_articles)).toBe(true);
        expect((blogArticlesVariableField?.variableOptions?.blog_articles || []).length).toBeGreaterThan(0);
        expect(Array.isArray(blogCategoriesVariableField?.variableOptions?.blog_categories)).toBe(true);
        expect((blogCategoriesVariableField?.variableOptions?.blog_categories || []).length).toBeGreaterThan(0);
        expect(homeMainLinks).toBeTruthy();
        expect(homeSquareBanners).toBeTruthy();

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

        const componentsRes = await fetch(`${baseUrl}/api/v1/theme/components`, {
            headers: contextHeaders
        });
        expect(componentsRes.status).toBe(200);
        const componentsJson: any = await componentsRes.json();
        const homeComponent = (componentsJson.data.components || []).find((c: any) =>
            String(c.path || '').startsWith('home.') &&
            Array.isArray(c.fields) &&
            c.fields.some((f: any) => f.id === 'title')
        );
        expect(homeComponent).toBeTruthy();
        const mainLinksComponentId = String(homeMainLinks?.key || homeMainLinks?.path || '');
        const squareBannersComponentId = String(homeSquareBanners?.key || homeSquareBanners?.path || '');
        expect(mainLinksComponentId).toBeTruthy();
        expect(squareBannersComponentId).toBeTruthy();

        const visualCategoryId = `vtdr-visual-cat-${Date.now()}`;
        const visualCategoryName = `VTDR Visual Category ${Date.now()}`;
        const createVisualCategoryRes = await fetch(`${baseUrl}/api/v1/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...contextHeaders
            },
            body: JSON.stringify({
                id: visualCategoryId,
                name: visualCategoryName,
                parentId: '',
                url: '/vtdr-visual-category',
                order: 999
            })
        });
        expect(createVisualCategoryRes.status).toBe(201);

        const savePageCompositionRes = await fetch(`${baseUrl}/api/v1/theme/settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...contextHeaders
            },
            body: JSON.stringify({
                page_compositions: {
                    home: [
                        {
                            id: 'home-main-links',
                            componentId: mainLinksComponentId,
                            props: {
                                title: 'VTDR Visual Main Links',
                                show_cats: true,
                                show_controls: true,
                                categories: [visualCategoryId]
                            }
                        },
                        {
                            id: 'home-main-links-links',
                            componentId: mainLinksComponentId,
                            props: {
                                title: 'VTDR Visual Links',
                                show_cats: false,
                                links: [
                                    {
                                        'links.icon': 'sicon-store2',
                                        'links.title': 'VTDR Product Link',
                                        'links.url': {
                                            type: 'products',
                                            value: selectedProductId
                                        },
                                        'links.url__type': 'products',
                                        'links.url__value': selectedProductId
                                    }
                                ]
                            }
                        },
                        {
                            id: 'home-square-banners',
                            componentId: squareBannersComponentId,
                            props: {
                                banners: [
                                    {
                                        'banners.image': 'https://cdn.salla.network/vtdr/banner.jpg',
                                        'banners.title': 'VTDR Banner Link',
                                        'banners.description': 'VTDR Banner Link Description',
                                        'banners.url': {
                                            type: 'products',
                                            value: selectedProductId
                                        },
                                        'banners.url__type': 'products',
                                        'banners.url__value': selectedProductId
                                    }
                                ]
                            }
                        },
                        {
                            id: 'home-1',
                            componentId: String(homeComponent.key),
                            props: { title: 'VTDR Visual Marker' }
                        },
                        {
                            id: 'home-hidden',
                            componentId: String(homeComponent.key),
                            visibility: {
                                enabled: false,
                                viewport: 'all'
                            },
                            props: { title: 'VTDR Hidden Marker' }
                        },
                        {
                            id: 'home-desktop-only',
                            componentId: String(homeComponent.key),
                            visibility: {
                                enabled: true,
                                viewport: 'desktop'
                            },
                            props: { title: 'VTDR Desktop Marker' }
                        },
                        {
                            id: 'home-mobile-only',
                            componentId: String(homeComponent.key),
                            visibility: {
                                enabled: true,
                                viewport: 'mobile'
                            },
                            props: { title: 'VTDR Mobile Marker' }
                        }
                    ]
                }
            })
        });
        expect(savePageCompositionRes.status).toBe(200);
        const savePageCompositionJson: any = await savePageCompositionRes.json();
        expect(savePageCompositionJson.success).toBe(true);

        const getThemeSettingsRes = await fetch(`${baseUrl}/api/v1/theme/settings`, {
            headers: contextHeaders
        });
        expect(getThemeSettingsRes.status).toBe(200);
        const getThemeSettingsJson: any = await getThemeSettingsRes.json();
        expect(getThemeSettingsJson.success).toBe(true);
        expect(getThemeSettingsJson.data.values.header_is_sticky).toBe(false);
        expect(getThemeSettingsJson.data.values.sticky_add_to_cart).toBe(true);
        const savedHomeCompositions = getThemeSettingsJson.data.values.page_compositions.home;
        expect(Array.isArray(savedHomeCompositions)).toBe(true);
        expect(savedHomeCompositions.some((entry: any) => entry.componentId === String(homeComponent.key))).toBe(true);
        expect(savedHomeCompositions.some((entry: any) => entry.componentId === mainLinksComponentId)).toBe(true);

        const previewAfterCompositionRes = await fetch(
            `${baseUrl}/preview/${storeId}/${themeId}/${themeVersion}?page=index`
        );
        expect(previewAfterCompositionRes.status).toBe(200);
        const previewAfterCompositionHtml = await previewAfterCompositionRes.text();
        expect(previewAfterCompositionHtml).toContain('VTDR Visual Marker');
        expect(previewAfterCompositionHtml).toContain('VTDR Visual Main Links');
        expect(previewAfterCompositionHtml).toContain(visualCategoryName);
        expect(previewAfterCompositionHtml).toContain('VTDR Product Link');
        expect(previewAfterCompositionHtml).toContain('VTDR Banner Link');
        expect(previewAfterCompositionHtml).toContain('VTDR Desktop Marker');
        expect(previewAfterCompositionHtml).not.toContain('VTDR Mobile Marker');
        expect(previewAfterCompositionHtml).not.toContain('VTDR Hidden Marker');
        expect(previewAfterCompositionHtml).toContain(selectedProductHref);

        const previewMobileRes = await fetch(
            `${baseUrl}/preview/${storeId}/${themeId}/${themeVersion}?page=index&viewport=mobile`
        );
        expect(previewMobileRes.status).toBe(200);
        const previewMobileHtml = await previewMobileRes.text();
        expect(previewMobileHtml).toContain('VTDR Mobile Marker');
        expect(previewMobileHtml).not.toContain('VTDR Desktop Marker');
        expect(previewMobileHtml).not.toContain('VTDR Hidden Marker');
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

    it('covers store lifecycle operations clone/promote/inherit/seed/sync validations', async () => {
        const syncThemesRes = await fetch(`${baseUrl}/api/themes/sync`, { method: 'POST' });
        expect(syncThemesRes.status).toBe(200);

        const parentStoreRes = await fetch(`${baseUrl}/api/stores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Lifecycle Parent Store', autoSeed: false })
        });
        expect(parentStoreRes.status).toBe(200);
        const parentStoreJson: any = await parentStoreRes.json();
        const parentStoreId = parentStoreJson.data.id as string;

        const childStoreRes = await fetch(`${baseUrl}/api/stores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Lifecycle Child Store', autoSeed: false })
        });
        expect(childStoreRes.status).toBe(200);
        const childStoreJson: any = await childStoreRes.json();
        const childStoreId = childStoreJson.data.id as string;

        const promoteRes = await fetch(`${baseUrl}/api/stores/${parentStoreId}/promote`, {
            method: 'POST'
        });
        expect(promoteRes.status).toBe(200);
        const promoteJson: any = await promoteRes.json();
        expect(promoteJson.success).toBe(true);
        expect(promoteJson.data.isMaster).toBe(true);

        const inheritRes = await fetch(`${baseUrl}/api/stores/${childStoreId}/inherit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ parentStoreId })
        });
        expect(inheritRes.status).toBe(200);
        const inheritJson: any = await inheritRes.json();
        expect(inheritJson.success).toBe(true);
        expect(inheritJson.data.parentStoreId).toBe(parentStoreId);

        const cloneRes = await fetch(`${baseUrl}/api/stores/${parentStoreId}/clone`, {
            method: 'POST'
        });
        expect(cloneRes.status).toBe(200);
        const cloneJson: any = await cloneRes.json();
        expect(cloneJson.success).toBe(true);
        expect(cloneJson.data.id).toBeTruthy();
        expect(cloneJson.data.id).not.toBe(parentStoreId);

        const seedRes = await fetch(`${baseUrl}/api/stores/${childStoreId}/seed`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productCount: 4 })
        });
        expect(seedRes.status).toBe(200);
        const seedJson: any = await seedRes.json();
        expect(seedJson.success).toBe(true);
        expect(seedJson.data.stats.products).toBe(4);

        const syncMissingUrlRes = await fetch(`${baseUrl}/api/stores/${childStoreId}/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        expect(syncMissingUrlRes.status).toBe(400);
        const syncMissingUrlJson: any = await syncMissingUrlRes.json();
        expect(syncMissingUrlJson.success).toBe(false);
        expect(syncMissingUrlJson.error).toContain('storeUrl is required');

        const syncInvalidUrlRes = await fetch(`${baseUrl}/api/stores/${childStoreId}/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ storeUrl: 'not-a-url' })
        });
        expect(syncInvalidUrlRes.status).toBe(500);
        const syncInvalidUrlJson: any = await syncInvalidUrlRes.json();
        expect(syncInvalidUrlJson.success).toBe(false);
        expect(syncInvalidUrlJson.error).toContain('Invalid Salla store URL');
    }, 120000);

    it('supports cart lifecycle endpoints used by sdk bridge', async () => {
        const createStoreRes = await fetch(`${baseUrl}/api/stores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Cart Store', autoSeed: false })
        });
        expect(createStoreRes.status).toBe(200);
        const createStoreJson: any = await createStoreRes.json();
        const storeId = createStoreJson.data.id as string;

        const contextHeaders = {
            'Content-Type': 'application/json',
            'X-VTDR-Store-Id': storeId
        };

        const addRes = await fetch(`${baseUrl}/api/v1/cart/items`, {
            method: 'POST',
            headers: contextHeaders,
            body: JSON.stringify({ product_id: 'prod_1', quantity: 2, price: 15 })
        });
        expect(addRes.status).toBe(201);
        const addJson: any = await addRes.json();
        expect(addJson.success).toBe(true);
        expect(addJson.data.totals.items_count).toBe(2);

        const detailsRes = await fetch(`${baseUrl}/api/v1/cart`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(detailsRes.status).toBe(200);
        const detailsJson: any = await detailsRes.json();
        expect(detailsJson.success).toBe(true);
        expect(detailsJson.data.items.length).toBe(1);
        expect(detailsJson.data.totals.subtotal).toBe(30);

        const updateRes = await fetch(`${baseUrl}/api/v1/cart/items/prod_1`, {
            method: 'PATCH',
            headers: contextHeaders,
            body: JSON.stringify({ quantity: 3 })
        });
        expect(updateRes.status).toBe(200);
        const updateJson: any = await updateRes.json();
        expect(updateJson.data.totals.items_count).toBe(3);

        const deleteRes = await fetch(`${baseUrl}/api/v1/cart/items/prod_1`, {
            method: 'DELETE',
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(deleteRes.status).toBe(200);
        const deleteJson: any = await deleteRes.json();
        expect(deleteJson.data.items.length).toBe(0);
    });

    it('supports inventory stock filters/sorting and enforces cart stock limits', async () => {
        const createStoreRes = await fetch(`${baseUrl}/api/stores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Inventory Store', autoSeed: false })
        });
        expect(createStoreRes.status).toBe(200);
        const createStoreJson: any = await createStoreRes.json();
        const storeId = createStoreJson.data.id as string;

        const contextHeaders = {
            'Content-Type': 'application/json',
            'X-VTDR-Store-Id': storeId,
            'Context-Store-Id': storeId
        };

        const createInStockRes = await fetch(`${baseUrl}/api/v1/products`, {
            method: 'POST',
            headers: contextHeaders,
            body: JSON.stringify({
                id: 'inv-in-stock',
                name: 'In Stock Product',
                price: { amount: 150, currency: 'SAR' },
                quantity: 5,
                max_quantity: 5,
                is_available: true,
                status: 'sale'
            })
        });
        expect(createInStockRes.status).toBe(201);

        const createOutStockRes = await fetch(`${baseUrl}/api/v1/products`, {
            method: 'POST',
            headers: contextHeaders,
            body: JSON.stringify({
                id: 'inv-out-stock',
                name: 'Out Stock Product',
                price: { amount: 80, currency: 'SAR' },
                quantity: 0,
                max_quantity: 1,
                is_available: false,
                status: 'out-and-notify'
            })
        });
        expect(createOutStockRes.status).toBe(201);

        const createMidStockRes = await fetch(`${baseUrl}/api/v1/products`, {
            method: 'POST',
            headers: contextHeaders,
            body: JSON.stringify({
                id: 'inv-mid-stock',
                name: 'Mid Stock Product',
                price: { amount: 110, currency: 'SAR' },
                quantity: 3,
                max_quantity: 3,
                is_available: true,
                status: 'sale'
            })
        });
        expect(createMidStockRes.status).toBe(201);

        const inStockListRes = await fetch(`${baseUrl}/api/v1/products?status=in-stock`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(inStockListRes.status).toBe(200);
        const inStockListJson: any = await inStockListRes.json();
        expect(inStockListJson.data.some((entry: any) => entry.id === 'inv-in-stock')).toBe(true);
        expect(inStockListJson.data.some((entry: any) => entry.id === 'inv-mid-stock')).toBe(true);
        expect(inStockListJson.data.some((entry: any) => entry.id === 'inv-out-stock')).toBe(false);

        const outStockListRes = await fetch(`${baseUrl}/api/v1/products?status=out-of-stock`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(outStockListRes.status).toBe(200);
        const outStockListJson: any = await outStockListRes.json();
        expect(outStockListJson.data.some((entry: any) => entry.id === 'inv-out-stock')).toBe(true);
        expect(outStockListJson.data.some((entry: any) => entry.id === 'inv-in-stock')).toBe(false);

        const sortedRes = await fetch(`${baseUrl}/api/v1/products?sort=priceFromLowToTop`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(sortedRes.status).toBe(200);
        const sortedJson: any = await sortedRes.json();
        const sortedIds = (sortedJson.data || []).map((entry: any) => String(entry.id));
        expect(sortedIds.slice(0, 3)).toEqual(['inv-out-stock', 'inv-mid-stock', 'inv-in-stock']);

        const addOutStockCartRes = await fetch(`${baseUrl}/api/v1/cart/items`, {
            method: 'POST',
            headers: contextHeaders,
            body: JSON.stringify({
                product_id: 'inv-out-stock',
                quantity: 1
            })
        });
        expect(addOutStockCartRes.status).toBe(400);
        const addOutStockCartJson: any = await addOutStockCartRes.json();
        expect(addOutStockCartJson.success).toBe(false);

        const addInStockCartRes = await fetch(`${baseUrl}/api/v1/cart/items`, {
            method: 'POST',
            headers: contextHeaders,
            body: JSON.stringify({
                product_id: 'inv-in-stock',
                quantity: 3
            })
        });
        expect(addInStockCartRes.status).toBe(201);
        const addInStockCartJson: any = await addInStockCartRes.json();
        expect(addInStockCartJson.success).toBe(true);
        expect(addInStockCartJson.data.totals.items_count).toBe(3);

        const addBeyondLimitRes = await fetch(`${baseUrl}/api/v1/cart/items`, {
            method: 'POST',
            headers: contextHeaders,
            body: JSON.stringify({
                product_id: 'inv-in-stock',
                quantity: 3
            })
        });
        expect(addBeyondLimitRes.status).toBe(400);
        const addBeyondLimitJson: any = await addBeyondLimitRes.json();
        expect(addBeyondLimitJson.success).toBe(false);
        expect(String(addBeyondLimitJson.error?.message || addBeyondLimitJson.error || '')).toContain('Maximum available quantity');

        const updateBeyondLimitRes = await fetch(`${baseUrl}/api/v1/cart/items/inv-in-stock`, {
            method: 'PATCH',
            headers: contextHeaders,
            body: JSON.stringify({
                quantity: 6
            })
        });
        expect(updateBeyondLimitRes.status).toBe(400);

        const updateWithinLimitRes = await fetch(`${baseUrl}/api/v1/cart/items/inv-in-stock`, {
            method: 'PATCH',
            headers: contextHeaders,
            body: JSON.stringify({
                quantity: 5
            })
        });
        expect(updateWithinLimitRes.status).toBe(200);
        const updateWithinLimitJson: any = await updateWithinLimitRes.json();
        expect(updateWithinLimitJson.success).toBe(true);
        expect(updateWithinLimitJson.data.totals.items_count).toBe(5);
    });

    it('supports menus read/write with nested items for preview navigation', async () => {
        const createStoreRes = await fetch(`${baseUrl}/api/stores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Menus Store', autoSeed: false })
        });
        expect(createStoreRes.status).toBe(200);
        const createStoreJson: any = await createStoreRes.json();
        const storeId = createStoreJson.data.id as string;

        const contextHeaders = {
            'Content-Type': 'application/json',
            'X-VTDR-Store-Id': storeId,
            'Context-Store-Id': storeId
        };

        const initialHeaderRes = await fetch(`${baseUrl}/api/v1/menus/header`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(initialHeaderRes.status).toBe(200);
        const initialHeaderJson: any = await initialHeaderRes.json();
        expect(Array.isArray(initialHeaderJson.data)).toBe(true);
        expect(initialHeaderJson.data.length).toBeGreaterThan(0);

        const putHeaderRes = await fetch(`${baseUrl}/api/v1/menus/header`, {
            method: 'PUT',
            headers: contextHeaders,
            body: JSON.stringify({
                items: [
                    {
                        id: 'header-home',
                        title: 'الرئيسية',
                        url: '/',
                        order: 1,
                        children: []
                    },
                    {
                        id: 'header-main',
                        title: 'الأقسام',
                        url: '/categories',
                        order: 2,
                        children: [
                            {
                                id: 'header-main-sub',
                                title: 'قسم تجريبي',
                                url: '/categories/demo',
                                order: 1
                            }
                        ]
                    }
                ]
            })
        });
        expect(putHeaderRes.status).toBe(200);
        const putHeaderJson: any = await putHeaderRes.json();
        expect(Array.isArray(putHeaderJson.data)).toBe(true);
        expect(putHeaderJson.data.some((item: any) => item.id === 'header-main')).toBe(true);

        const getHeaderRes = await fetch(`${baseUrl}/api/v1/menus/header`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(getHeaderRes.status).toBe(200);
        const getHeaderJson: any = await getHeaderRes.json();
        const headerMain = (getHeaderJson.data || []).find((item: any) => item.id === 'header-main');
        expect(headerMain).toBeTruthy();
        expect(Array.isArray(headerMain.children)).toBe(true);
        expect(headerMain.children[0]?.title).toBe('قسم تجريبي');

        const putFooterRes = await fetch(`${baseUrl}/api/v1/menus/footer`, {
            method: 'PUT',
            headers: contextHeaders,
            body: JSON.stringify({
                items: [
                    {
                        id: 'footer-pages',
                        title: 'روابط مهمة',
                        url: '/pages',
                        order: 1,
                        children: []
                    }
                ]
            })
        });
        expect(putFooterRes.status).toBe(200);

        const getFooterRes = await fetch(`${baseUrl}/api/v1/menus/footer`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(getFooterRes.status).toBe(200);
        const getFooterJson: any = await getFooterRes.json();
        expect(Array.isArray(getFooterJson.data)).toBe(true);
        expect(getFooterJson.data[0]?.title).toBe('روابط مهمة');
    });

    it('supports reviews/questions CRUD and updates product feedback metrics', async () => {
        const syncThemesRes = await fetch(`${baseUrl}/api/themes/sync`, { method: 'POST' });
        expect(syncThemesRes.status).toBe(200);

        const createStoreRes = await fetch(`${baseUrl}/api/stores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Feedback Store', autoSeed: false })
        });
        expect(createStoreRes.status).toBe(200);
        const createStoreJson: any = await createStoreRes.json();
        const storeId = createStoreJson.data.id as string;

        const contextHeaders = {
            'Content-Type': 'application/json',
            'X-VTDR-Store-Id': storeId,
            'Context-Store-Id': storeId
        };

        const createProductRes = await fetch(`${baseUrl}/api/v1/products`, {
            method: 'POST',
            headers: contextHeaders,
            body: JSON.stringify({
                id: 'product-feedback',
                name: 'Feedback Product',
                price: { amount: 120, currency: 'SAR' },
                images: [{ url: '/themes/theme-raed-master/public/images/placeholder.png' }]
            })
        });
        expect(createProductRes.status).toBe(201);

        const createReview1Res = await fetch(`${baseUrl}/api/v1/reviews`, {
            method: 'POST',
            headers: contextHeaders,
            body: JSON.stringify({
                id: 'review-1',
                product_id: 'product-feedback',
                stars: 5,
                content: 'ممتاز جدًا',
                customer_name: 'عميل 1'
            })
        });
        expect(createReview1Res.status).toBe(201);

        const createReview2Res = await fetch(`${baseUrl}/api/v1/reviews`, {
            method: 'POST',
            headers: contextHeaders,
            body: JSON.stringify({
                id: 'review-2',
                product_id: 'product-feedback',
                stars: 3,
                content: 'جيد',
                customer_name: 'عميل 2'
            })
        });
        expect(createReview2Res.status).toBe(201);

        const productAfterReviewsRes = await fetch(`${baseUrl}/api/v1/products/product-feedback`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(productAfterReviewsRes.status).toBe(200);
        const productAfterReviewsJson: any = await productAfterReviewsRes.json();
        expect(productAfterReviewsJson.data.rating.count).toBe(2);
        expect(productAfterReviewsJson.data.rating.stars).toBe(4);
        expect(Array.isArray(productAfterReviewsJson.data.comments)).toBe(true);
        expect(productAfterReviewsJson.data.comments.length).toBe(2);

        const updateReviewRes = await fetch(`${baseUrl}/api/v1/reviews/review-2`, {
            method: 'PUT',
            headers: contextHeaders,
            body: JSON.stringify({
                stars: 4,
                content: 'جيد جدًا'
            })
        });
        expect(updateReviewRes.status).toBe(200);

        const productAfterReviewUpdateRes = await fetch(`${baseUrl}/api/v1/products/product-feedback`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(productAfterReviewUpdateRes.status).toBe(200);
        const productAfterReviewUpdateJson: any = await productAfterReviewUpdateRes.json();
        expect(productAfterReviewUpdateJson.data.rating.count).toBe(2);
        expect(productAfterReviewUpdateJson.data.rating.stars).toBe(4.5);

        const createQuestionRes = await fetch(`${baseUrl}/api/v1/questions`, {
            method: 'POST',
            headers: contextHeaders,
            body: JSON.stringify({
                id: 'question-1',
                product_id: 'product-feedback',
                question: 'هل المنتج متوفر الآن؟',
                customer_name: 'زائر 1'
            })
        });
        expect(createQuestionRes.status).toBe(201);

        const updateQuestionRes = await fetch(`${baseUrl}/api/v1/questions/question-1`, {
            method: 'PUT',
            headers: contextHeaders,
            body: JSON.stringify({
                answer: 'نعم، المنتج متوفر وجاهز للشحن',
                is_answered: true
            })
        });
        expect(updateQuestionRes.status).toBe(200);

        const questionsByProductRes = await fetch(`${baseUrl}/api/v1/products/product-feedback/questions`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(questionsByProductRes.status).toBe(200);
        const questionsByProductJson: any = await questionsByProductRes.json();
        expect(Array.isArray(questionsByProductJson.data)).toBe(true);
        expect(questionsByProductJson.data.length).toBeGreaterThan(0);
        expect(questionsByProductJson.data[0].is_answered).toBe(true);

        const productAfterQuestionRes = await fetch(`${baseUrl}/api/v1/products/product-feedback`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(productAfterQuestionRes.status).toBe(200);
        const productAfterQuestionJson: any = await productAfterQuestionRes.json();
        expect(productAfterQuestionJson.data.questions_count).toBeGreaterThan(0);

        const deleteReviewRes = await fetch(`${baseUrl}/api/v1/reviews/review-1`, {
            method: 'DELETE',
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(deleteReviewRes.status).toBe(200);

        const deleteQuestionRes = await fetch(`${baseUrl}/api/v1/questions/question-1`, {
            method: 'DELETE',
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(deleteQuestionRes.status).toBe(200);
    });

    it('supports brands/offers CRUD and propagates brand options into theme components', async () => {
        const syncThemesRes = await fetch(`${baseUrl}/api/themes/sync`, { method: 'POST' });
        expect(syncThemesRes.status).toBe(200);

        const createStoreRes = await fetch(`${baseUrl}/api/stores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Brand Offer Store', autoSeed: false })
        });
        expect(createStoreRes.status).toBe(200);
        const createStoreJson: any = await createStoreRes.json();
        const storeId = createStoreJson.data.id as string;

        const contextHeaders = {
            'Content-Type': 'application/json',
            'X-VTDR-Store-Id': storeId,
            'Context-Store-Id': storeId
        };

        const createBrandRes = await fetch(`${baseUrl}/api/v1/brands`, {
            method: 'POST',
            headers: contextHeaders,
            body: JSON.stringify({
                id: 'brand-vtdr',
                name: 'VTDR Brand',
                logo: '/themes/theme-raed-master/public/images/placeholder.png',
                banner: '/themes/theme-raed-master/public/images/placeholder.png'
            })
        });
        expect(createBrandRes.status).toBe(201);

        const listBrandsRes = await fetch(`${baseUrl}/api/v1/brands`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(listBrandsRes.status).toBe(200);
        const listBrandsJson: any = await listBrandsRes.json();
        expect(Array.isArray(listBrandsJson.data)).toBe(true);
        expect(listBrandsJson.data.some((entry: any) => entry.id === 'brand-vtdr')).toBe(true);

        const themeComponentsRes = await fetch(`${baseUrl}/api/v1/theme/components`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(themeComponentsRes.status).toBe(200);
        const themeComponentsJson: any = await themeComponentsRes.json();
        const homeBrands = (themeComponentsJson.data.components || []).find((c: any) => c.path === 'home.brands');
        const brandsField = homeBrands?.fields?.find((f: any) => f.id === 'brands');
        expect(Array.isArray(brandsField?.options)).toBe(true);
        expect(brandsField.options.some((opt: any) => opt.value === 'brand-vtdr')).toBe(true);

        const updateBrandRes = await fetch(`${baseUrl}/api/v1/brands/brand-vtdr`, {
            method: 'PUT',
            headers: contextHeaders,
            body: JSON.stringify({ name: 'VTDR Brand Updated' })
        });
        expect(updateBrandRes.status).toBe(200);

        const getBrandRes = await fetch(`${baseUrl}/api/v1/brands/brand-vtdr`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(getBrandRes.status).toBe(200);
        const getBrandJson: any = await getBrandRes.json();
        expect(getBrandJson.data.name).toBe('VTDR Brand Updated');

        const createOfferRes = await fetch(`${baseUrl}/api/v1/offers`, {
            method: 'POST',
            headers: contextHeaders,
            body: JSON.stringify({
                id: 'offer-vtdr',
                title: 'VTDR Offer',
                discount_type: 'percentage',
                discount_value: 15,
                starts_at: '2026-02-01',
                ends_at: '2026-12-31',
                is_active: true
            })
        });
        expect(createOfferRes.status).toBe(201);

        const listOffersRes = await fetch(`${baseUrl}/api/v1/offers`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(listOffersRes.status).toBe(200);
        const listOffersJson: any = await listOffersRes.json();
        expect(Array.isArray(listOffersJson.data)).toBe(true);
        expect(listOffersJson.data.some((entry: any) => entry.id === 'offer-vtdr')).toBe(true);

        const updateOfferRes = await fetch(`${baseUrl}/api/v1/offers/offer-vtdr`, {
            method: 'PUT',
            headers: contextHeaders,
            body: JSON.stringify({
                discount_value: 25,
                is_active: false
            })
        });
        expect(updateOfferRes.status).toBe(200);

        const getOfferRes = await fetch(`${baseUrl}/api/v1/offers/offer-vtdr`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(getOfferRes.status).toBe(200);
        const getOfferJson: any = await getOfferRes.json();
        expect(getOfferJson.data.discount_value).toBe(25);
        expect(getOfferJson.data.is_active).toBe(false);

        const deleteBrandRes = await fetch(`${baseUrl}/api/v1/brands/brand-vtdr`, {
            method: 'DELETE',
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(deleteBrandRes.status).toBe(200);

        const themeComponentsAfterDeleteRes = await fetch(`${baseUrl}/api/v1/theme/components`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(themeComponentsAfterDeleteRes.status).toBe(200);
        const themeComponentsAfterDeleteJson: any = await themeComponentsAfterDeleteRes.json();
        const homeBrandsAfterDelete = (themeComponentsAfterDeleteJson.data.components || []).find((c: any) => c.path === 'home.brands');
        const brandsFieldAfterDelete = homeBrandsAfterDelete?.fields?.find((f: any) => f.id === 'brands');
        expect(Array.isArray(brandsFieldAfterDelete?.options)).toBe(true);
        expect(brandsFieldAfterDelete.options.some((opt: any) => opt.value === 'brand-vtdr')).toBe(false);

        const deleteOfferRes = await fetch(`${baseUrl}/api/v1/offers/offer-vtdr`, {
            method: 'DELETE',
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(deleteOfferRes.status).toBe(200);

        const offersAfterDeleteRes = await fetch(`${baseUrl}/api/v1/offers`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(offersAfterDeleteRes.status).toBe(200);
        const offersAfterDeleteJson: any = await offersAfterDeleteRes.json();
        expect(offersAfterDeleteJson.data.some((entry: any) => entry.id === 'offer-vtdr')).toBe(false);
    });

    it('supports blog content CRUD and propagates to theme variable-list options', async () => {
        const syncThemesRes = await fetch(`${baseUrl}/api/themes/sync`, { method: 'POST' });
        expect(syncThemesRes.status).toBe(200);

        const createStoreRes = await fetch(`${baseUrl}/api/stores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Blog Domain Store', autoSeed: false })
        });
        expect(createStoreRes.status).toBe(200);
        const createStoreJson: any = await createStoreRes.json();
        const storeId = createStoreJson.data.id as string;

        const contextHeaders = {
            'Content-Type': 'application/json',
            'X-VTDR-Store-Id': storeId,
            'Context-Store-Id': storeId
        };

        const createCategoryRes = await fetch(`${baseUrl}/api/v1/blog/categories`, {
            method: 'POST',
            headers: contextHeaders,
            body: JSON.stringify({
                id: 'blog-cat-tech',
                name: 'تقنية',
                slug: 'tech'
            })
        });
        expect(createCategoryRes.status).toBe(201);

        const createArticleRes = await fetch(`${baseUrl}/api/v1/blog/articles`, {
            method: 'POST',
            headers: contextHeaders,
            body: JSON.stringify({
                id: 'blog-article-vtdr',
                title: 'VTDR Blog Article',
                slug: 'vtdr-blog-article',
                summary: 'Summary for VTDR blog article',
                category_id: 'blog-cat-tech'
            })
        });
        expect(createArticleRes.status).toBe(201);
        const createArticleJson: any = await createArticleRes.json();
        expect(createArticleJson.success).toBe(true);
        expect(createArticleJson.data.url).toContain('/blog/');

        const listArticlesRes = await fetch(`${baseUrl}/api/v1/blog/articles`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(listArticlesRes.status).toBe(200);
        const listArticlesJson: any = await listArticlesRes.json();
        expect(Array.isArray(listArticlesJson.data)).toBe(true);
        expect(listArticlesJson.data.some((entry: any) => entry.id === 'blog-article-vtdr')).toBe(true);

        const themeComponentsRes = await fetch(`${baseUrl}/api/v1/theme/components`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(themeComponentsRes.status).toBe(200);
        const themeComponentsJson: any = await themeComponentsRes.json();
        const variableListFields = (themeComponentsJson.data.components || []).flatMap((component: any) =>
            collectVariableListFields(component?.fields || [])
        );
        const articleOptions = variableListFields.flatMap((field: any) =>
            Array.isArray(field?.variableOptions?.blog_articles) ? field.variableOptions.blog_articles : []
        );
        const categoryOptions = variableListFields.flatMap((field: any) =>
            Array.isArray(field?.variableOptions?.blog_categories) ? field.variableOptions.blog_categories : []
        );
        expect(articleOptions.some((opt: any) => opt.value === 'blog-article-vtdr')).toBe(true);
        expect(categoryOptions.some((opt: any) => opt.value === 'blog-cat-tech')).toBe(true);

        const updateArticleRes = await fetch(`${baseUrl}/api/v1/blog/articles/blog-article-vtdr`, {
            method: 'PUT',
            headers: contextHeaders,
            body: JSON.stringify({
                title: 'VTDR Blog Article Updated',
                summary: 'Updated summary'
            })
        });
        expect(updateArticleRes.status).toBe(200);

        const getUpdatedArticleRes = await fetch(`${baseUrl}/api/v1/blog/articles/blog-article-vtdr`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(getUpdatedArticleRes.status).toBe(200);
        const getUpdatedArticleJson: any = await getUpdatedArticleRes.json();
        expect(getUpdatedArticleJson.data.title).toBe('VTDR Blog Article Updated');

        const deleteCategoryRes = await fetch(`${baseUrl}/api/v1/blog/categories/blog-cat-tech`, {
            method: 'DELETE',
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(deleteCategoryRes.status).toBe(200);
        const deleteCategoryJson: any = await deleteCategoryRes.json();
        expect(deleteCategoryJson.success).toBe(true);

        const getArticleAfterCategoryDeleteRes = await fetch(`${baseUrl}/api/v1/blog/articles/blog-article-vtdr`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(getArticleAfterCategoryDeleteRes.status).toBe(200);
        const getArticleAfterCategoryDeleteJson: any = await getArticleAfterCategoryDeleteRes.json();
        expect(String(getArticleAfterCategoryDeleteJson.data.category_id || '')).toBe('');
    });

    it('normalizes product/category parity contracts and keeps preview functional', async () => {
        const syncThemesRes = await fetch(`${baseUrl}/api/themes/sync`, { method: 'POST' });
        expect(syncThemesRes.status).toBe(200);

        const createStoreRes = await fetch(`${baseUrl}/api/stores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Parity Store', autoSeed: false })
        });
        expect(createStoreRes.status).toBe(200);
        const createStoreJson: any = await createStoreRes.json();
        const storeId = createStoreJson.data.id as string;

        const contextHeaders = {
            'Content-Type': 'application/json',
            'X-VTDR-Store-Id': storeId,
            'Context-Store-Id': storeId
        };

        const rootCategoryRes = await fetch(`${baseUrl}/api/v1/categories`, {
            method: 'POST',
            headers: contextHeaders,
            body: JSON.stringify({
                id: 'cat-root',
                name: 'Root Category',
                parentId: 'root',
                order: 1
            })
        });
        expect(rootCategoryRes.status).toBe(201);

        const childCategoryRes = await fetch(`${baseUrl}/api/v1/categories`, {
            method: 'POST',
            headers: contextHeaders,
            body: JSON.stringify({
                id: 'cat-child',
                name: 'Child Category',
                parent_id: 'cat-root',
                order: 2
            })
        });
        expect(childCategoryRes.status).toBe(201);

        const categoriesRes = await fetch(`${baseUrl}/api/v1/categories`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(categoriesRes.status).toBe(200);
        const categoriesJson: any = await categoriesRes.json();
        const rootCategory = categoriesJson.data.find((c: any) => c.id === 'cat-root');
        const childCategory = categoriesJson.data.find((c: any) => c.id === 'cat-child');
        expect(rootCategory).toBeTruthy();
        expect(rootCategory.parent_id).toBeNull();
        expect(rootCategory.parentId).toBe('');
        expect(childCategory).toBeTruthy();
        expect(childCategory.parent_id).toBe('cat-root');
        expect(childCategory.parentId).toBe('cat-root');

        const createProductRes = await fetch(`${baseUrl}/api/v1/products`, {
            method: 'POST',
            headers: contextHeaders,
            body: JSON.stringify({
                id: 'prod-parity-1',
                name: 'Parity Product',
                price: { amount: 120, currency: 'SAR' },
                images: [
                    {
                        url: 'https://via.placeholder.com/300',
                        alt: 'Main',
                        is_default: true
                    }
                ],
                categories: [{ id: 'cat-child', name: 'Child Category' }],
                options: [
                    {
                        name: 'Size',
                        type: 'select',
                        values: [{ name: 'S', price: 0 }, { name: 'M', price: 10 }]
                    }
                ],
                variants: [
                    {
                        sku: 'SKU-M',
                        quantity: 7,
                        price: { amount: 130, currency: 'SAR' }
                    }
                ]
            })
        });
        expect(createProductRes.status).toBe(201);

        const getProductRes = await fetch(`${baseUrl}/api/v1/products/prod-parity-1`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(getProductRes.status).toBe(200);
        const getProductJson: any = await getProductRes.json();
        const product = getProductJson.data;
        expect(Array.isArray(product.category_ids)).toBe(true);
        expect(product.category_ids).toContain('cat-child');
        expect(Array.isArray(product.categories)).toBe(true);
        expect(product.categories.some((c: any) => c.id === 'cat-child')).toBe(true);
        expect(Array.isArray(product.images)).toBe(true);
        expect(product.images.length).toBeGreaterThan(0);
        expect(product.main_image).toBeTruthy();
        expect(product.main_image).toContain('/themes/theme-raed-master/public/images/placeholder.png');
        expect(Array.isArray(product.options)).toBe(true);
        expect(product.options[0].values.length).toBe(2);
        expect(Array.isArray(product.variants)).toBe(true);
        expect(product.variants[0].quantity).toBe(7);
        expect(product.variants[0].price.amount).toBe(130);

        const updateProductRes = await fetch(`${baseUrl}/api/v1/products/prod-parity-1`, {
            method: 'PUT',
            headers: contextHeaders,
            body: JSON.stringify({
                category_ids: ['cat-root'],
                images: [],
                main_image: '/themes/theme-raed-master/public/images/placeholder.png',
                variants: [{ sku: 'SKU-ROOT', quantity: 3, price: 200 }]
            })
        });
        expect(updateProductRes.status).toBe(200);

        const getUpdatedProductRes = await fetch(`${baseUrl}/api/v1/products/prod-parity-1`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(getUpdatedProductRes.status).toBe(200);
        const getUpdatedProductJson: any = await getUpdatedProductRes.json();
        const updatedProduct = getUpdatedProductJson.data;
        expect(updatedProduct.category_ids).toContain('cat-root');
        expect(updatedProduct.categories.some((c: any) => c.id === 'cat-root')).toBe(true);
        expect(Array.isArray(updatedProduct.images)).toBe(true);
        expect(updatedProduct.images.length).toBeGreaterThan(0);
        expect(updatedProduct.main_image).toContain('/themes/theme-raed-master/public/images/placeholder.png');
        expect(updatedProduct.variants[0].quantity).toBe(3);
        expect(updatedProduct.variants[0].price.amount).toBe(200);

        const deleteCategoryRes = await fetch(`${baseUrl}/api/v1/categories/cat-root`, {
            method: 'DELETE',
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(deleteCategoryRes.status).toBe(200);
        const deleteCategoryJson: any = await deleteCategoryRes.json();
        expect(deleteCategoryJson.success).toBe(true);
        expect(deleteCategoryJson.data.updatedProducts).toBeGreaterThanOrEqual(1);

        const categoriesAfterDeleteRes = await fetch(`${baseUrl}/api/v1/categories`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(categoriesAfterDeleteRes.status).toBe(200);
        const categoriesAfterDeleteJson: any = await categoriesAfterDeleteRes.json();
        expect(categoriesAfterDeleteJson.data.some((c: any) => c.id === 'cat-root')).toBe(false);
        const childAfterDelete = categoriesAfterDeleteJson.data.find((c: any) => c.id === 'cat-child');
        expect(childAfterDelete).toBeTruthy();
        expect(childAfterDelete.parent_id).toBeNull();
        expect(childAfterDelete.parentId).toBe('');

        const productAfterDeleteRes = await fetch(`${baseUrl}/api/v1/products/prod-parity-1`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(productAfterDeleteRes.status).toBe(200);
        const productAfterDeleteJson: any = await productAfterDeleteRes.json();
        expect(productAfterDeleteJson.data.category_ids.includes('cat-root')).toBe(false);

        const storeRes = await fetch(`${baseUrl}/api/stores/${storeId}`);
        expect(storeRes.status).toBe(200);
        const storeJson: any = await storeRes.json();
        const themeId = storeJson.data.themeId as string;
        const themeVersion = storeJson.data.themeVersion.version as string;

        const previewRes = await fetch(`${baseUrl}/preview/${storeId}/${themeId}/${themeVersion}?page=index`);
        expect(previewRes.status).toBe(200);
        const previewHtml = await previewRes.text();
        expect(previewHtml.toLowerCase()).toContain('<html');
    }, 120000);

    it('supports customer journey parity for wishlist/orders pages and APIs', async () => {
        const syncThemesRes = await fetch(`${baseUrl}/api/themes/sync`, { method: 'POST' });
        expect(syncThemesRes.status).toBe(200);

        const createStoreRes = await fetch(`${baseUrl}/api/stores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Customer Journey Store', autoSeed: true })
        });
        expect(createStoreRes.status).toBe(200);
        const createStoreJson: any = await createStoreRes.json();
        const storeId = createStoreJson.data.id as string;

        const contextHeaders = {
            'Content-Type': 'application/json',
            'X-VTDR-Store-Id': storeId,
            'Context-Store-Id': storeId
        };

        const createProductRes = await fetch(`${baseUrl}/api/v1/products`, {
            method: 'POST',
            headers: contextHeaders,
            body: JSON.stringify({
                id: 'wishlist-preview-product',
                name: 'Wishlist Preview Product',
                price: { amount: 145, currency: 'SAR' },
                quantity: 8,
                is_available: true,
                status: 'sale'
            })
        });
        expect(createProductRes.status).toBe(201);

        const addWishlistRes = await fetch(`${baseUrl}/api/v1/wishlist/items`, {
            method: 'POST',
            headers: contextHeaders,
            body: JSON.stringify({ product_id: 'wishlist-preview-product' })
        });
        expect(addWishlistRes.status).toBe(201);
        const addWishlistJson: any = await addWishlistRes.json();
        expect(addWishlistJson.success).toBe(true);
        expect(addWishlistJson.data.product_ids).toContain('wishlist-preview-product');

        const getWishlistRes = await fetch(`${baseUrl}/api/v1/wishlist`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(getWishlistRes.status).toBe(200);
        const getWishlistJson: any = await getWishlistRes.json();
        expect(Array.isArray(getWishlistJson.data.product_ids)).toBe(true);
        expect(getWishlistJson.data.product_ids).toContain('wishlist-preview-product');

        const wishlistProductsRes = await fetch(`${baseUrl}/api/v1/products?source=wishlist`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(wishlistProductsRes.status).toBe(200);
        const wishlistProductsJson: any = await wishlistProductsRes.json();
        expect(Array.isArray(wishlistProductsJson.data)).toBe(true);
        expect(wishlistProductsJson.data.some((entry: any) => entry.id === 'wishlist-preview-product')).toBe(true);

        const toggleWishlistRes = await fetch(`${baseUrl}/api/v1/wishlist/toggle`, {
            method: 'POST',
            headers: contextHeaders,
            body: JSON.stringify({ product_id: 'wishlist-preview-product' })
        });
        expect(toggleWishlistRes.status).toBe(200);
        const toggleWishlistJson: any = await toggleWishlistRes.json();
        expect(toggleWishlistJson.success).toBe(true);
        expect(toggleWishlistJson.data.action).toBe('removed');

        const wishlistProductsAfterToggleRes = await fetch(`${baseUrl}/api/v1/products?source=wishlist`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(wishlistProductsAfterToggleRes.status).toBe(200);
        const wishlistProductsAfterToggleJson: any = await wishlistProductsAfterToggleRes.json();
        expect(wishlistProductsAfterToggleJson.data.some((entry: any) => entry.id === 'wishlist-preview-product')).toBe(false);

        const addCartItemRes = await fetch(`${baseUrl}/api/v1/cart/items`, {
            method: 'POST',
            headers: contextHeaders,
            body: JSON.stringify({
                product_id: 'wishlist-preview-product',
                quantity: 1
            })
        });
        expect(addCartItemRes.status).toBe(201);

        const startCheckoutRes = await fetch(`${baseUrl}/api/v1/checkout/start`, {
            method: 'POST',
            headers: contextHeaders,
            body: JSON.stringify({})
        });
        expect(startCheckoutRes.status).toBe(201);

        const addressCheckoutRes = await fetch(`${baseUrl}/api/v1/checkout/address`, {
            method: 'PATCH',
            headers: contextHeaders,
            body: JSON.stringify({
                name: 'VTDR Customer',
                email: 'customer@vtdr.test',
                mobile: '+966500000001',
                country: 'SA',
                city: 'Riyadh',
                district: 'Olaya',
                street: 'King Fahad Rd',
                postal_code: '12211'
            })
        });
        expect(addressCheckoutRes.status).toBe(200);

        const checkoutDetailsRes = await fetch(`${baseUrl}/api/v1/checkout`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(checkoutDetailsRes.status).toBe(200);
        const checkoutDetailsJson: any = await checkoutDetailsRes.json();
        const shippingMethodId = String(checkoutDetailsJson.data.available_shipping_methods?.[0]?.id || '');
        const paymentMethodId = String(checkoutDetailsJson.data.available_payment_methods?.[0]?.id || '');
        expect(shippingMethodId).toBeTruthy();
        expect(paymentMethodId).toBeTruthy();

        const shippingCheckoutRes = await fetch(`${baseUrl}/api/v1/checkout/shipping`, {
            method: 'PATCH',
            headers: contextHeaders,
            body: JSON.stringify({ method_id: shippingMethodId })
        });
        expect(shippingCheckoutRes.status).toBe(200);

        const paymentCheckoutRes = await fetch(`${baseUrl}/api/v1/checkout/payment`, {
            method: 'PATCH',
            headers: contextHeaders,
            body: JSON.stringify({ method_id: paymentMethodId })
        });
        expect(paymentCheckoutRes.status).toBe(200);

        const confirmCheckoutRes = await fetch(`${baseUrl}/api/v1/checkout/confirm`, {
            method: 'POST',
            headers: contextHeaders,
            body: JSON.stringify({})
        });
        expect(confirmCheckoutRes.status).toBe(200);
        const confirmCheckoutJson: any = await confirmCheckoutRes.json();
        const orderId = String(confirmCheckoutJson.data?.order?.id || '');
        expect(orderId).toBeTruthy();

        const listOrdersRes = await fetch(`${baseUrl}/api/v1/orders`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(listOrdersRes.status).toBe(200);
        const listOrdersJson: any = await listOrdersRes.json();
        expect(Array.isArray(listOrdersJson.data)).toBe(true);
        expect(listOrdersJson.data.some((entry: any) => String(entry.id) === orderId)).toBe(true);

        const getOrderRes = await fetch(`${baseUrl}/api/v1/orders/${orderId}`, {
            headers: { 'X-VTDR-Store-Id': storeId }
        });
        expect(getOrderRes.status).toBe(200);

        const storeRes = await fetch(`${baseUrl}/api/stores/${storeId}`);
        expect(storeRes.status).toBe(200);
        const storeJson: any = await storeRes.json();
        const themeId = storeJson.data.themeId as string;
        const themeVersion = storeJson.data.themeVersion.version as string;

        const customerOrdersPreviewRes = await fetch(
            `${baseUrl}/preview/${storeId}/${themeId}/${themeVersion}/customer/orders`
        );
        const customerOrdersPreviewHtml = await customerOrdersPreviewRes.text();
        expect(customerOrdersPreviewRes.status, customerOrdersPreviewHtml.slice(0, 600)).toBe(200);
        expect(customerOrdersPreviewHtml.toLowerCase()).toContain('<html');
        expect(customerOrdersPreviewHtml).not.toContain('Renderer Error');
        expect(customerOrdersPreviewHtml).not.toContain('Render Error');

        const customerSingleOrderPreviewRes = await fetch(
            `${baseUrl}/preview/${storeId}/${themeId}/${themeVersion}/customer/orders/${orderId}`
        );
        const customerSingleOrderPreviewHtml = await customerSingleOrderPreviewRes.text();
        expect(customerSingleOrderPreviewRes.status, customerSingleOrderPreviewHtml.slice(0, 600)).toBe(200);
        expect(customerSingleOrderPreviewHtml.toLowerCase()).toContain('<html');
        expect(customerSingleOrderPreviewHtml).not.toContain('Renderer Error');
        expect(customerSingleOrderPreviewHtml).not.toContain('Render Error');

        const customerWishlistPreviewRes = await fetch(
            `${baseUrl}/preview/${storeId}/${themeId}/${themeVersion}/customer/wishlist`
        );
        expect(customerWishlistPreviewRes.status).toBe(200);
        const customerWishlistPreviewHtml = await customerWishlistPreviewRes.text();
        expect(customerWishlistPreviewHtml.toLowerCase()).toContain('<html');
        expect(customerWishlistPreviewHtml).not.toContain('Renderer Error');
        expect(customerWishlistPreviewHtml).not.toContain('Render Error');
    }, 120000);
});
