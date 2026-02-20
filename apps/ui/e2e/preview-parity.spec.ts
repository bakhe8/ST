import { expect, test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const API_BASE = 'http://127.0.0.1:3001';
const PREVIEW_CORE_PATHS = ['/', '/products', '/categories', '/brands', '/blog'] as const;
const PREVIEW_EXTENDED_PATHS = [
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
] as const;
const PREVIEW_PATHS = [...PREVIEW_CORE_PATHS, ...PREVIEW_EXTENDED_PATHS] as const;

type CoreRoutePath = (typeof PREVIEW_PATHS)[number];

interface EntityCounts {
    products: number;
    categories: number;
    brands: number;
    blogArticles: number;
}

interface PreviewFixture {
    storeId: string;
    themeId: string;
    themeVersion: string;
    counts: EntityCounts;
}

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

function hasTemplatePageMarker(html: string, expectedTemplateId: string): boolean {
    const variants = [
        `templatePageId: "${expectedTemplateId}"`,
        `templatePageId:"${expectedTemplateId}"`,
        `templatePageId: '${expectedTemplateId}'`,
        `templatePageId:'${expectedTemplateId}'`
    ];
    return variants.some((marker) => html.includes(marker));
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

async function fetchEntityCounts(request: any, storeId: string): Promise<EntityCounts> {
    const headers = { 'X-VTDR-Store-Id': storeId };

    const [productsRes, categoriesRes, brandsRes, blogArticlesRes] = await Promise.all([
        request.get(`${API_BASE}/api/v1/products`, { headers }),
        request.get(`${API_BASE}/api/v1/categories`, { headers }),
        request.get(`${API_BASE}/api/v1/brands`, { headers }),
        request.get(`${API_BASE}/api/v1/blog/articles`, { headers })
    ]);

    expect(productsRes.ok()).toBe(true);
    expect(categoriesRes.ok()).toBe(true);
    expect(brandsRes.ok()).toBe(true);
    expect(blogArticlesRes.ok()).toBe(true);

    const [productsJson, categoriesJson, brandsJson, blogArticlesJson] = await Promise.all([
        productsRes.json(),
        categoriesRes.json(),
        brandsRes.json(),
        blogArticlesRes.json()
    ]);

    return {
        products: extractArrayData(productsJson).length,
        categories: extractArrayData(categoriesJson).length,
        brands: extractArrayData(brandsJson).length,
        blogArticles: extractArrayData(blogArticlesJson).length
    };
}

async function createPreviewFixture(request: any): Promise<PreviewFixture> {
    const syncResponse = await request.post(`${API_BASE}/api/themes/sync`);
    expect(syncResponse.ok()).toBe(true);

    const createResponse = await request.post(`${API_BASE}/api/stores`, {
        data: {
            title: `E2E Parity ${Date.now()}`,
            seedProfile: 'general'
        }
    });
    expect(createResponse.ok()).toBe(true);
    const createPayload = await createResponse.json();
    const storeId = String(createPayload?.data?.id || '').trim();
    expect(storeId).toBeTruthy();

    const storeResponse = await request.get(`${API_BASE}/api/stores/${storeId}`);
    expect(storeResponse.ok()).toBe(true);
    const storePayload = await storeResponse.json();
    const themeId = String(storePayload?.data?.themeId || '').trim();
    const themeVersion = String(storePayload?.data?.themeVersion?.version || '').trim();
    expect(themeId).toBeTruthy();
    expect(themeVersion).toBeTruthy();

    const counts = await fetchEntityCounts(request, storeId);

    return { storeId, themeId, themeVersion, counts };
}

test.describe('VTDR Preview Browser Parity Gate', () => {
    test('renders preview routes with semantic parity markers (core + extended storefront)', async ({ page, request }) => {
        const { storeId, themeId, themeVersion, counts } = await createPreviewFixture(request);
        const previewBase = `/preview/${storeId}/${themeId}/${themeVersion}`;

        const pageErrors: string[] = [];
        const consoleErrors: string[] = [];
        const routeFailures: string[] = [];
        let activeRoutePath: CoreRoutePath | 'bootstrap' = 'bootstrap';

        const pushRouteFailure = (routePath: CoreRoutePath, message: string) => {
            routeFailures.push(`[${themeId}][${routePath}] ${message}`);
        };

        page.on('pageerror', (error) => {
            pageErrors.push(`[${themeId}][${activeRoutePath}] ${String(error)}`);
        });
        page.on('console', (message) => {
            if (message.type() === 'error') {
                consoleErrors.push(`[${themeId}][${activeRoutePath}] ${message.text()}`);
            }
        });

        for (const routePath of PREVIEW_PATHS) {
            activeRoutePath = routePath;
            const url =
                routePath === '/'
                    ? `${previewBase}?page=index&viewport=desktop&refresh=0`
                    : `${previewBase}${routePath}?viewport=desktop&refresh=0`;

            const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
            if (!response) {
                pushRouteFailure(routePath, 'navigation returned no response');
                continue;
            }
            if (response.status() >= 500) {
                pushRouteFailure(routePath, `response status is ${response.status()} (expected < 500)`);
                continue;
            }

            await page.waitForLoadState('networkidle');
            const html = await page.content();
            const bodyText = await page.locator('body').innerText();

            if (!html.toLowerCase().includes('<html')) {
                pushRouteFailure(routePath, 'rendered document is missing <html>');
            }
            if (html.includes('Renderer Error') || html.includes('Preview rendering failed')) {
                pushRouteFailure(routePath, 'rendered document contains renderer error marker');
            }
            if (routePath !== '/' && html.includes('content--single-page')) {
                pushRouteFailure(routePath, 'route resolved to page-single fallback template');
            }
            if (routePath !== '/' && html.includes('item-id="=desktop&refresh=0"')) {
                pushRouteFailure(routePath, 'route emitted malformed page id marker (=desktop&refresh=0)');
            }

            const expectedTemplateId = ROUTE_TEMPLATE_EXPECTATIONS[routePath];
            if (expectedTemplateId && !hasTemplatePageMarker(html, expectedTemplateId)) {
                pushRouteFailure(routePath, `route context missing expected templatePageId "${expectedTemplateId}"`);
            }

            const routeMarkers = ROUTE_MARKER_EXPECTATIONS[routePath] || [];
            if (routeMarkers.length > 0 && !routeMarkers.some((marker) => html.includes(marker))) {
                pushRouteFailure(routePath, `route missing expected semantic marker(s): ${routeMarkers.join(', ')}`);
            }

            if (routePath === '/products') {
                const productsListCount = await page.locator('salla-products-list').count();
                if (productsListCount === 0) {
                    pushRouteFailure(routePath, 'missing <salla-products-list> component');
                }
                if (counts.products > 0) {
                    await page.waitForTimeout(2500);
                    const productCards = page.locator('custom-salla-product-card, .s-product-card-entry');
                    try {
                        await expect(productCards.first()).toBeVisible({ timeout: 15000 });
                    } catch {
                        pushRouteFailure(routePath, 'products API has data but no visible product cards were rendered');
                    }
                }
                if (bodyText.includes('pages.categories.sorting')) {
                    pushRouteFailure(routePath, 'raw translation key leaked: pages.categories.sorting');
                }
            }

            if (routePath === '/categories') {
                const productsListCount = await page.locator('salla-products-list').count();
                if (productsListCount === 0) {
                    pushRouteFailure(routePath, 'missing category/product list runtime component');
                }
                if (counts.categories === 0) {
                    pushRouteFailure(routePath, 'categories API returned no entities for categories page parity');
                }
                if (bodyText.includes('pages.categories.sorting')) {
                    pushRouteFailure(routePath, 'raw translation key leaked: pages.categories.sorting');
                }
            }

            if (routePath === '/brands') {
                if (counts.brands === 0) {
                    pushRouteFailure(routePath, 'brands API returned no entities for brands page parity');
                }
                if (counts.brands > 0) {
                    const brandItems = page.locator('.brand-item');
                    try {
                        await expect(brandItems.first()).toBeVisible({ timeout: 15000 });
                    } catch {
                        pushRouteFailure(routePath, 'brands API has data but no visible .brand-item was rendered');
                    }
                }
                if (bodyText.includes('pages.brands.non_brands')) {
                    pushRouteFailure(routePath, 'raw translation key leaked: pages.brands.non_brands');
                }
            }

            if (routePath === '/blog') {
                if (counts.blogArticles === 0) {
                    pushRouteFailure(routePath, 'blog API returned no articles for blog page parity');
                }
                if (counts.blogArticles > 0) {
                    await page.waitForTimeout(2000);
                    const articleCards = page.locator('.post-entry, .blog-slider__slide');
                    const articleCount = await articleCards.count();
                    const blogCategoryLinks = page.locator('#filters-menu a[href*="/blog"], .dropdown__menu a[href*="/blog"]');
                    const blogCategoryLinkCount = await blogCategoryLinks.count();
                    if (articleCount === 0 && blogCategoryLinkCount === 0) {
                        pushRouteFailure(
                            routePath,
                            'blog API has data but blog page rendered neither article cards nor category navigation entries'
                        );
                    }
                }
                if (bodyText.includes('pages.blog_categories.categories')) {
                    pushRouteFailure(routePath, 'raw translation key leaked: pages.blog_categories.categories');
                }
                if (bodyText.includes('pages.blog_categories.no_articles')) {
                    pushRouteFailure(routePath, 'raw translation key leaked: pages.blog_categories.no_articles');
                }
            }
        }

        const criticalConsoleErrors = consoleErrors.filter((text) => {
            const lower = text.toLowerCase();
            return (
                lower.includes('uncaught') ||
                lower.includes('syntaxerror') ||
                lower.includes('typeerror') ||
                lower.includes('referenceerror') ||
                lower.includes('failed to fetch') ||
                lower.includes('404 (not found)')
            );
        });

        const routeFailureBuckets = PREVIEW_PATHS.reduce(
            (acc, routePath) => {
                acc[routePath] = routeFailures
                    .filter((entry) => entry.startsWith(`[${themeId}][${routePath}]`))
                    .map((entry) => entry.replace(/^\[[^\]]+\]\[[^\]]+\]\s*/, ''));
                return acc;
            },
            {} as Record<CoreRoutePath, string[]>
        );

        const routeMetrics = PREVIEW_PATHS.map((routePath) => ({
            routePath,
            status: routeFailureBuckets[routePath].length > 0 ? 'fail' : 'pass',
            failures: routeFailureBuckets[routePath]
        }));
        const routesChecked = routeMetrics.length;
        const routesPassed = routeMetrics.filter((item) => item.status === 'pass').length;
        const routesFailed = routeMetrics.filter((item) => item.status === 'fail').length;
        const successRatio = routesChecked > 0 ? routesPassed / routesChecked : 0;
        const overallPass =
            routesFailed === 0 && criticalConsoleErrors.length === 0 && pageErrors.length === 0;

        writeJsonArtifact(process.env.VTDR_PARITY_BROWSER_METRICS_FILE || '', {
            generatedAt: new Date().toISOString(),
            suite: 'preview-browser-parity',
            storeId,
            themeId,
            themeVersion,
            entityCounts: counts,
            summary: {
                routesChecked,
                routesPassed,
                routesFailed,
                successRatio,
                criticalConsoleErrors: criticalConsoleErrors.length,
                pageErrors: pageErrors.length,
                pass: overallPass
            },
            routes: routeMetrics,
            diagnostics: {
                routeFailures,
                criticalConsoleErrors,
                pageErrors
            }
        });

        expect(
            routeFailures,
            routeFailures.length ? `Preview semantic parity failures:\n${routeFailures.join('\n')}` : 'all routes passed'
        ).toEqual([]);
        expect(
            criticalConsoleErrors,
            criticalConsoleErrors.length
                ? `Critical browser console errors:\n${criticalConsoleErrors.join('\n')}`
                : 'no critical console errors'
        ).toEqual([]);
        expect(
            pageErrors,
            pageErrors.length ? `Unhandled page errors:\n${pageErrors.join('\n')}` : 'no page errors'
        ).toEqual([]);
    });
});
