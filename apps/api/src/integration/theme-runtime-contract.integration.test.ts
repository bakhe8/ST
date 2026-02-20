import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { spawn, type ChildProcessWithoutNullStreams } from 'child_process';
import fs from 'fs';
import net from 'net';
import os from 'os';
import path from 'path';

type JsonMap = Record<string, any>;

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

function resolveApiStartCommand(repoRoot: string): string {
    // Always run the API through tsx in integration tests.
    // The monorepo runtime imports workspace source entrypoints and may fail when
    // forcing `node apps/api/dist/index.js` in isolated test environments.
    return 'npm exec tsx apps/api/src/index.ts';
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

function extractArrayData(payload: any): any[] {
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.items)) return payload.data.items;
    return [];
}

function writeJsonArtifact(filePath: string, payload: unknown) {
    const targetPath = String(filePath || '').trim();
    if (!targetPath) return;
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, JSON.stringify(payload, null, 2), 'utf8');
}

function parseThemeFailureEntry(input: string) {
    const match = String(input || '').match(/^\[([^\]]+)\](?:\[([^\]]+)\])?\s([\s\S]*)$/);
    if (!match) return null;
    return {
        themeId: String(match[1] || '').trim(),
        routePath: String(match[2] || '').trim(),
        message: String(match[3] || '').trim()
    };
}

function asPath(value: unknown): string {
    const raw = String(value || '').trim();
    if (!raw) return '';
    try {
        const parsed = new URL(raw);
        return parsed.pathname || '';
    } catch {
        return raw.startsWith('/') ? raw : `/${raw.replace(/^\/+/, '')}`;
    }
}

function normalizeDeepLinkCandidate(rawPath: unknown): string {
    const pathOnly = asPath(rawPath).replace(/\/+$/, '');
    if (!pathOnly || pathOnly === '/') return '';
    if (pathOnly.startsWith('/preview') || pathOnly.startsWith('/themes')) return '';
    if (/\.[a-z0-9]{2,8}$/i.test(pathOnly)) return '';
    return pathOnly;
}

function pickEntityToken(entity: JsonMap, keys: string[]): string {
    for (const key of keys) {
        const value = String(entity?.[key] || '').trim();
        if (value) return value;
    }
    return '';
}

const PREVIEW_CORE_PATHS = ['/', '/products', '/categories', '/brands', '/blog'];
const PREVIEW_NAVIGATION_PATHS = [
    ...PREVIEW_CORE_PATHS,
    '/cart',
    '/checkout',
    '/loyalty',
    '/thank-you',
    '/landing-page',
    '/customer/profile',
    '/customer/orders',
    '/customer/wishlist',
    '/customer/notifications',
    '/customer/wallet'
];

const ROUTE_TEMPLATE_EXPECTATIONS: Record<string, string> = {
    '/products': 'product/index',
    '/categories': 'product/index',
    '/brands': 'brands/index',
    '/blog': 'blog/index',
    '/cart': 'cart',
    '/checkout': 'checkout',
    '/loyalty': 'loyalty',
    '/thank-you': 'thank-you',
    '/landing-page': 'landing-page',
    '/customer/profile': 'customer/profile',
    '/customer/orders': 'customer/orders/index',
    '/customer/wishlist': 'customer/wishlist',
    '/customer/notifications': 'customer/notifications',
    '/customer/wallet': 'customer/wallet'
};

const ROUTE_MARKER_EXPECTATIONS: Record<string, string[]> = {
    '/cart': ['<salla-conditional-offer'],
    '/checkout': ['vtdr-checkout.js'],
    '/loyalty': ['<salla-loyalty'],
    '/thank-you': ['salla.order.show({order_id:'],
    '/landing-page': ['landing-page'],
    '/customer/profile': ['<salla-user-settings'],
    '/customer/orders': ['<salla-user-menu'],
    '/customer/wishlist': ['source="wishlist"'],
    '/customer/notifications': ['<salla-notifications'],
    '/customer/wallet': ['<salla-wallet']
};

const hasTemplatePageMarker = (html: string, expectedTemplateId: string): boolean => {
    const variants = [
        `templatePageId: "${expectedTemplateId}"`,
        `templatePageId:"${expectedTemplateId}"`,
        `templatePageId: '${expectedTemplateId}'`,
        `templatePageId:'${expectedTemplateId}'`
    ];
    return variants.some((marker) => html.includes(marker));
};

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

        apiProcess = spawnShell(resolveApiStartCommand(repoRoot), {
            cwd: repoRoot,
            env: {
                ...process.env,
                DATABASE_URL: dbUrl,
                PORT: String(apiPort)
            },
            stdio: 'pipe'
        });

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
        let crossThemePreviewValidated = false;

        for (const theme of themes) {
            const themeId = String(theme?.id || '').trim();
            const versions = Array.isArray(theme?.versions) ? theme.versions : [];
            const firstVersion = versions[0];
            const themeVersionId = String(firstVersion?.id || '').trim();
            const themeVersion = String(firstVersion?.version || '').trim();
            const pushRouteFailure = (routePath: string, message: string) =>
                failures.push(`[${themeId}][${routePath}] ${message}`);

            if (!themeId || !themeVersionId || !themeVersion) {
                failures.push(
                    `[${themeId || 'unknown-theme'}] Missing version record (themeVersionId/themeVersion)`
                );
                continue;
            }

            const createStoreRes = await fetch(`${baseUrl}/api/stores`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: `Contract ${themeId}`, autoSeed: true })
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

            const fetchEntityCollections = async () => {
                const [productsRes, categoriesRes, brandsRes, blogArticlesRes] = await Promise.all([
                    fetch(`${baseUrl}/api/v1/products`, { headers: contextHeaders }),
                    fetch(`${baseUrl}/api/v1/categories`, { headers: contextHeaders }),
                    fetch(`${baseUrl}/api/v1/brands`, { headers: contextHeaders }),
                    fetch(`${baseUrl}/api/v1/blog/articles`, { headers: contextHeaders })
                ]);

                const collections = {
                    products: [] as JsonMap[],
                    categories: [] as JsonMap[],
                    brands: [] as JsonMap[],
                    blogArticles: [] as JsonMap[]
                };

                if (productsRes.status !== 200) {
                    failures.push(`[${themeId}] GET /api/v1/products failed (status=${productsRes.status})`);
                } else {
                    const productsJson: any = await productsRes.json();
                    collections.products = extractArrayData(productsJson) as JsonMap[];
                }

                if (categoriesRes.status !== 200) {
                    failures.push(`[${themeId}] GET /api/v1/categories failed (status=${categoriesRes.status})`);
                } else {
                    const categoriesJson: any = await categoriesRes.json();
                    collections.categories = extractArrayData(categoriesJson) as JsonMap[];
                }

                if (brandsRes.status !== 200) {
                    failures.push(`[${themeId}] GET /api/v1/brands failed (status=${brandsRes.status})`);
                } else {
                    const brandsJson: any = await brandsRes.json();
                    collections.brands = extractArrayData(brandsJson) as JsonMap[];
                }

                if (blogArticlesRes.status !== 200) {
                    failures.push(`[${themeId}] GET /api/v1/blog/articles failed (status=${blogArticlesRes.status})`);
                } else {
                    const blogArticlesJson: any = await blogArticlesRes.json();
                    collections.blogArticles = extractArrayData(blogArticlesJson) as JsonMap[];
                }

                return collections;
            };

            let { products, categories, brands, blogArticles } = await fetchEntityCollections();

            if (
                products.length === 0 &&
                categories.length === 0 &&
                brands.length === 0 &&
                blogArticles.length === 0
            ) {
                const seedRes = await fetch(`${baseUrl}/api/stores/${storeId}/seed`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productCount: 12 })
                });
                if (seedRes.status !== 200) {
                    failures.push(`[${themeId}] POST /api/stores/${storeId}/seed failed (status=${seedRes.status})`);
                } else {
                    const seeded = await fetchEntityCollections();
                    products = seeded.products;
                    categories = seeded.categories;
                    brands = seeded.brands;
                    blogArticles = seeded.blogArticles;
                }
            }
            const firstBrandName = String(brands[0]?.name || '').trim();

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
                if (!homeHtml.includes('window.__VTDR_NAV_SHIM__')) {
                    failures.push(`[${themeId}] navigation shim marker missing from preview HTML`);
                }
                if (!homeHtml.includes('window.vtdr_context')) {
                    failures.push(`[${themeId}] vtdr runtime context script missing from preview HTML`);
                }
                if (!homeHtml.includes('window.__VTDR_PREVIEW_NAV__')) {
                    failures.push(`[${themeId}] shared preview navigation API missing from preview HTML`);
                }
                if (!homeHtml.includes('__VTDR_API_CONTEXT_SHIM__')) {
                    failures.push(`[${themeId}] preview API context shim marker missing from preview HTML`);
                }
                if (!homeHtml.includes('"api":"/api/v1"')) {
                    failures.push(`[${themeId}] preview store.api is not normalized to /api/v1`);
                }
                if (homeHtml.includes('"api":"http://localhost:3001/api/v1"')) {
                    failures.push(`[${themeId}] preview store.api still hardcoded to http://localhost:3001/api/v1`);
                }
                const previewBasePath = `/preview/${storeId}/${themeId}/${themeVersion}`;
                if (!homeHtml.includes(`href="${previewBasePath}`) && !homeHtml.includes(`href='${previewBasePath}`)) {
                    failures.push(`[${themeId}] home HTML missing preview-bound anchor href`);
                }
                if (homeHtml.includes('href="http://localhost:3001/"') || homeHtml.includes("href='http://localhost:3001/'")) {
                    failures.push(`[${themeId}] home HTML still contains hardcoded localhost root href`);
                }
            }

            const queryScopedProductsRes = await fetch(
                `${baseUrl}/api/v1/products?store_id=${encodeURIComponent(storeId)}&source=product.index&source_value=products`
            );
            if (queryScopedProductsRes.status !== 200) {
                failures.push(`[${themeId}] GET /api/v1/products via store_id query context failed (status=${queryScopedProductsRes.status})`);
            } else {
                const queryScopedProductsJson: any = await queryScopedProductsRes.json();
                const queryScopedProducts = extractArrayData(queryScopedProductsJson);
                if (!Array.isArray(queryScopedProducts) || queryScopedProducts.length === 0) {
                    failures.push(`[${themeId}] GET /api/v1/products via store_id query context returned empty data`);
                }
            }

            const invalidVersionRes = await fetch(
                `${baseUrl}/preview/${storeId}/${themeId}/${themeVersion}__invalid?page=index&viewport=desktop`
            );
            if (invalidVersionRes.status !== 404) {
                failures.push(
                    `[${themeId}] Preview with invalid theme version should return 404 (status=${invalidVersionRes.status})`
                );
            }

            if (!crossThemePreviewValidated && themes.length > 1) {
                const alternateTheme = themes.find((entry: any) => String(entry?.id || '') !== themeId);
                const alternateVersion = Array.isArray(alternateTheme?.versions) ? alternateTheme.versions[0] : null;
                const alternateThemeId = String(alternateTheme?.id || '').trim();
                const alternateThemeVersion = String(alternateVersion?.version || '').trim();

                if (alternateThemeId && alternateThemeVersion) {
                    const crossThemeRes = await fetch(
                        `${baseUrl}/preview/${storeId}/${alternateThemeId}/${alternateThemeVersion}?page=index&viewport=desktop`
                    );
                    if (crossThemeRes.status !== 200) {
                        failures.push(
                            `[${themeId}] Cross-theme preview failed for ${alternateThemeId}@${alternateThemeVersion} (status=${crossThemeRes.status})`
                        );
                    } else {
                        const crossThemeHtml = await crossThemeRes.text();
                        const expectedBase = `/preview/${storeId}/${alternateThemeId}/${alternateThemeVersion}`;
                        if (!crossThemeHtml.includes(expectedBase)) {
                            failures.push(
                                `[${themeId}] Cross-theme preview did not bind navigation base to ${expectedBase}`
                            );
                        }
                    }
                    crossThemePreviewValidated = true;
                }
            }

            for (const routePath of PREVIEW_NAVIGATION_PATHS.filter((item) => item !== '/')) {
                const previewRes = await fetch(
                    `${baseUrl}/preview/${storeId}/${themeId}/${themeVersion}${routePath}?viewport=desktop`
                );
                if (previewRes.status !== 200) {
                    pushRouteFailure(routePath, `Preview route failed (status=${previewRes.status})`);
                    continue;
                }
                const html = await previewRes.text();
                const lower = html.toLowerCase();
                if (!lower.includes('<html')) {
                    pushRouteFailure(routePath, 'Preview route missing <html>');
                }
                if (html.includes('Renderer Error') || html.includes('Render Error')) {
                    pushRouteFailure(routePath, 'Preview route contains render error marker');
                }
                if (!html.includes('__VTDR_API_CONTEXT_SHIM__')) {
                    pushRouteFailure(routePath, 'Preview route missing API context shim marker');
                }
                if (routePath === '/products' && !html.includes('"api":"/api/v1"')) {
                    pushRouteFailure(routePath, 'Preview route missing normalized store.api (/api/v1)');
                }
                if (routePath === '/products' && html.includes('"api":"http://localhost:3001/api/v1"')) {
                    pushRouteFailure(routePath, 'Preview route still hardcoded to localhost API origin');
                }

                if (routePath !== '/' && html.includes('content--single-page')) {
                    pushRouteFailure(
                        routePath,
                        'Route rendered page-single fallback instead of dedicated storefront template'
                    );
                }

                if (routePath !== '/' && html.includes('item-id="=desktop&refresh=0"')) {
                    pushRouteFailure(
                        routePath,
                        'Route resolved malformed page id marker (=desktop&refresh=0)'
                    );
                }

                const expectedTemplateId = ROUTE_TEMPLATE_EXPECTATIONS[routePath];
                if (expectedTemplateId && !hasTemplatePageMarker(html, expectedTemplateId)) {
                    pushRouteFailure(
                        routePath,
                        `Route context missing expected templatePageId "${expectedTemplateId}"`
                    );
                }

                const routeMarkers = ROUTE_MARKER_EXPECTATIONS[routePath] || [];
                if (routeMarkers.length > 0 && !routeMarkers.some((marker) => html.includes(marker))) {
                    pushRouteFailure(
                        routePath,
                        `Route missing expected semantic marker(s): ${routeMarkers.join(', ')}`
                    );
                }

                if (routePath === '/products') {
                    if (products.length === 0) {
                        pushRouteFailure(routePath, 'Products API returned no items for products page parity');
                    }
                    if (!html.includes('<salla-products-list')) {
                        pushRouteFailure(routePath, 'Products page missing <salla-products-list> runtime component');
                    }
                    if (!html.includes('id="page-main-title"')) {
                        pushRouteFailure(routePath, 'Products page missing main title container (#page-main-title)');
                    }
                    if (html.includes('pages.categories.sorting')) {
                        pushRouteFailure(routePath, 'Products page leaked raw translation key pages.categories.sorting');
                    }
                }

                if (routePath === '/categories') {
                    if (categories.length === 0) {
                        pushRouteFailure(routePath, 'Categories API returned no items for categories page parity');
                    }
                    if (!html.includes('<salla-products-list')) {
                        pushRouteFailure(routePath, 'Categories page missing <salla-products-list> runtime component');
                    }
                    if (!html.includes('id="page-main-title"')) {
                        pushRouteFailure(routePath, 'Categories page missing main title container (#page-main-title)');
                    }
                    if (html.includes('pages.categories.sorting')) {
                        pushRouteFailure(routePath, 'Categories page leaked raw translation key pages.categories.sorting');
                    }
                }

                if (routePath === '/brands') {
                    if (brands.length === 0) {
                        pushRouteFailure(routePath, 'Brands API returned no items for brands page parity');
                    }
                    if (!html.includes('brands-nav') && !html.includes('brand-item')) {
                        pushRouteFailure(routePath, 'Brands page missing brands-nav / brand-item semantic markers');
                    }
                    if (firstBrandName && !html.includes(firstBrandName)) {
                        pushRouteFailure(
                            routePath,
                            `Brands page does not render any known brand token from API payload (${firstBrandName})`
                        );
                    }
                    if (brands.length > 0 && html.includes('pages.brands.non_brands')) {
                        pushRouteFailure(routePath, 'Brands page leaked empty-state translation key despite existing brands');
                    }
                }

                if (routePath === '/blog') {
                    if (blogArticles.length === 0) {
                        pushRouteFailure(routePath, 'Blog API returned no articles for blog page parity');
                    }
                    if (!html.includes('post-entry') && !html.includes('blog-slider__slide')) {
                        pushRouteFailure(routePath, 'Blog page missing post-entry/blog-slider semantic markers');
                    }
                    if (html.includes('pages.blog_categories.categories')) {
                        pushRouteFailure(routePath, 'Blog page leaked raw translation key pages.blog_categories.categories');
                    }
                    if (html.includes('pages.blog_categories.no_articles')) {
                        pushRouteFailure(routePath, 'Blog page leaked raw translation key pages.blog_categories.no_articles');
                    }
                }
            }

            const localePreviewRes = await fetch(
                `${baseUrl}/preview/${storeId}/${themeId}/${themeVersion}/ar/products?viewport=desktop`
            );
            if (localePreviewRes.status !== 200) {
                failures.push(`[${themeId}] Preview localized route /ar/products failed (status=${localePreviewRes.status})`);
            }

            const productEntity = products[0] || {};
            const productToken = pickEntityToken(productEntity, ['slug', 'id', 'key']);
            const productDeepLink =
                normalizeDeepLinkCandidate(productEntity.url) ||
                (productToken ? `/products/${productToken}` : '');

            const categoryEntity = categories[0] || {};
            const categoryToken = pickEntityToken(categoryEntity, ['slug', 'id', 'key']);
            const categoryDeepLink =
                normalizeDeepLinkCandidate(categoryEntity.url) ||
                (categoryToken ? `/categories/${categoryToken}` : '');

            const brandEntity = brands[0] || {};
            const brandToken = pickEntityToken(brandEntity, ['slug', 'id', 'key']);
            const brandDeepLink =
                normalizeDeepLinkCandidate(brandEntity.url) ||
                (brandToken ? `/brands/${brandToken}` : '');

            const blogEntity = blogArticles[0] || {};
            const blogToken = pickEntityToken(blogEntity, ['slug', 'id', 'key']);
            const blogDeepLink =
                normalizeDeepLinkCandidate(blogEntity.url) ||
                (blogToken ? `/blog/${blogToken}` : '');

            const deepLinkCandidates = [
                { label: 'product-single', routePath: productDeepLink },
                { label: 'category-single', routePath: categoryDeepLink },
                { label: 'brand-single', routePath: brandDeepLink },
                { label: 'blog-single', routePath: blogDeepLink }
            ].filter((entry) => Boolean(entry.routePath));

            if (deepLinkCandidates.length === 0) {
                failures.push(`[${themeId}] no deep-link candidate resolved from simulator entities`);
            }

            for (const candidate of deepLinkCandidates) {
                const deepLinkRes = await fetch(
                    `${baseUrl}/preview/${storeId}/${themeId}/${themeVersion}${candidate.routePath}?viewport=desktop`
                );
                if (deepLinkRes.status !== 200) {
                    failures.push(
                        `[${themeId}] Deep-link ${candidate.label} (${candidate.routePath}) failed (status=${deepLinkRes.status})`
                    );
                    continue;
                }
                const deepLinkHtml = await deepLinkRes.text();
                const deepLower = deepLinkHtml.toLowerCase();
                if (!deepLower.includes('<html')) {
                    failures.push(
                        `[${themeId}] Deep-link ${candidate.label} (${candidate.routePath}) missing <html>`
                    );
                }
                if (
                    deepLinkHtml.includes('Renderer Error') ||
                    deepLinkHtml.includes('Render Error') ||
                    deepLinkHtml.includes('Preview rendering failed')
                ) {
                    failures.push(
                        `[${themeId}] Deep-link ${candidate.label} (${candidate.routePath}) contains render error marker`
                    );
                }
                if (!deepLinkHtml.includes('window.__VTDR_PREVIEW_NAV__')) {
                    failures.push(
                        `[${themeId}] Deep-link ${candidate.label} (${candidate.routePath}) missing shared preview navigation API`
                    );
                }
            }

            const bridgeRes = await fetch(`${baseUrl}/sdk-bridge.js`);
            if (bridgeRes.status !== 200) {
                failures.push(`[${themeId}] GET /sdk-bridge.js failed (status=${bridgeRes.status})`);
            } else {
                const bridgeText = await bridgeRes.text();
                if (!bridgeText.includes('resolvePreviewBasePath')) {
                    failures.push(`[${themeId}] sdk-bridge.js missing preview navigation adapter`);
                }
                if (!bridgeText.includes('resolveAnchorFromEvent')) {
                    failures.push(`[${themeId}] sdk-bridge.js missing composed-path anchor resolver`);
                }
                if (!bridgeText.includes('__VTDR_PREVIEW_NAV__')) {
                    failures.push(`[${themeId}] sdk-bridge.js missing shared preview navigation API binding`);
                }
            }
        }

        const parsedFailures = failures
            .map((entry) => parseThemeFailureEntry(entry))
            .filter((entry): entry is NonNullable<ReturnType<typeof parseThemeFailureEntry>> => Boolean(entry));

        const themeMetrics = themes.map((theme: any) => {
            const themeId = String(theme?.id || '').trim() || 'unknown-theme';
            const themeVersion = String(theme?.versions?.[0]?.version || '').trim() || 'unknown-version';
            const scopedFailures = parsedFailures.filter((entry) => entry.themeId === themeId);
            const themeLevelFailure = scopedFailures.some((entry) => !entry.routePath);

            const coreRoutes = PREVIEW_CORE_PATHS.reduce(
                (acc, routePath) => {
                    const hasRouteFailure = scopedFailures.some((entry) => entry.routePath === routePath);
                    acc[routePath] = themeLevelFailure || hasRouteFailure ? 'fail' : 'pass';
                    return acc;
                },
                {} as Record<string, 'pass' | 'fail'>
            );

            const routesPassed = Object.values(coreRoutes).filter((status) => status === 'pass').length;
            const routesFailed = Object.values(coreRoutes).filter((status) => status === 'fail').length;

            return {
                themeId,
                themeVersion,
                routesPassed,
                routesFailed,
                coreRoutes,
                failures: scopedFailures.map((entry) =>
                    entry.routePath ? `[${entry.routePath}] ${entry.message}` : entry.message
                )
            };
        });

        const totalRoutesChecked = themeMetrics.reduce(
            (sum: number, item: { routesPassed: number; routesFailed: number }) =>
                sum + Number(item.routesPassed || 0) + Number(item.routesFailed || 0),
            0
        );
        const totalRoutesPassed = themeMetrics.reduce(
            (sum: number, item: { routesPassed: number }) => sum + Number(item.routesPassed || 0),
            0
        );
        const totalRoutesFailed = themeMetrics.reduce(
            (sum: number, item: { routesFailed: number }) => sum + Number(item.routesFailed || 0),
            0
        );
        const successRatio = totalRoutesChecked > 0 ? totalRoutesPassed / totalRoutesChecked : 0;

        writeJsonArtifact(process.env.VTDR_PARITY_CONTRACT_METRICS_FILE || '', {
            generatedAt: new Date().toISOString(),
            suite: 'theme-runtime-contract',
            summary: {
                themesDiscovered: themes.length,
                routesChecked: totalRoutesChecked,
                routesPassed: totalRoutesPassed,
                routesFailed: totalRoutesFailed,
                successRatio,
                totalFailures: failures.length,
                pass: failures.length === 0
            },
            themes: themeMetrics
        });

        expect(
            failures,
            failures.length
                ? `Theme Runtime Contract v1 failures:\n${failures.join('\n')}`
                : 'all themes passed'
        ).toEqual([]);
    }, 180000);
});
