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
});
