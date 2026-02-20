import { describe, expect, it } from 'vitest';
import type { RuntimeContext } from '@vtdr/contracts';
import { bindPreviewContext, resolvePreviewTarget } from './preview-context-service.js';

const baseContext = (): RuntimeContext => ({
    storeId: 'store-1',
    theme: {
        id: 'theme-a',
        name: 'Theme A',
        version: '1.0.0',
        author: 'VTDR'
    },
    hooks: {},
    store: {
        id: 'store-1',
        name: 'Store 1',
        locale: 'ar-SA',
        currency: 'SAR',
        branding: {},
        settings: {},
        themeId: 'theme-a',
        themeVersionId: 'tv-1'
    },
    page: {
        id: 'index',
        components: []
    },
    settings: {},
    translations: {}
});

describe('resolvePreviewTarget', () => {
    it('maps product deep-link to product/single target', () => {
        const target = resolvePreviewTarget(undefined, 'products/my-product');
        expect(target).toEqual({
            pageId: 'product/single',
            routePath: '/products/my-product',
            entityRef: 'my-product'
        });
    });

    it('strips locale prefix before resolving route semantics', () => {
        const target = resolvePreviewTarget(undefined, 'ar/blog/category/news');
        expect(target).toEqual({
            pageId: 'blog/index',
            routePath: '/blog/category/news',
            collectionRef: 'news'
        });
    });

    it('supports query-only customer orders route', () => {
        const target = resolvePreviewTarget('customer/orders', '');
        expect(target).toEqual({
            pageId: 'customer/orders/index',
            routePath: '/customer/orders'
        });
    });
});

describe('bindPreviewContext', () => {
    it('injects theme binding and preview viewport metadata into runtime context', () => {
        const context = baseContext();
        bindPreviewContext({
            context,
            target: { pageId: 'index', routePath: '/' },
            query: {},
            viewport: 'mobile',
            theme: {
                themeId: 'theme-b',
                themeVersionId: 'tv-2',
                themeVersion: '2.0.0'
            }
        });

        expect(context.theme.id).toBe('theme-b');
        expect(context.theme.version).toBe('2.0.0');
        expect(context.store.themeId).toBe('theme-b');
        expect(context.store.themeVersionId).toBe('tv-2');
        expect((context.settings as any).__preview_viewport).toBe('mobile');
        expect((context as any).__preview.viewport).toBe('mobile');
        expect((context.page as any).template_id).toBe('index');
    });

    it('applies global runtime variable contract for store/products/blog/cart/customer', () => {
        const context = baseContext();
        (context as any).products = [
            {
                id: 'p-1',
                name: 'Product 1',
                price: { amount: 120, currency: 'SAR' },
                brand: { id: 'b-1', name: 'Brand 1' },
                categories: [{ id: 'c-1', name: 'Category 1' }]
            }
        ];
        (context as any).orders = [
            {
                id: 'o-1',
                reference_id: 'VTDR-1',
                customer: { id: 'u-1', name: 'Ali Test', email: 'ali@example.com', mobile: '+966500000001' },
                total: 120
            }
        ];
        (context as any).blog_categories = [{ id: 'bc-1', name: 'Blog Category' }];
        (context as any).blog_articles = [{ id: 'ba-1', title: 'Article 1', category_id: 'bc-1' }];

        bindPreviewContext({
            context,
            target: { pageId: 'index', routePath: '/' },
            query: {},
            viewport: 'desktop',
            theme: {
                themeId: 'theme-a',
                themeVersionId: 'tv-1',
                themeVersion: '1.0.0'
            }
        });

        expect((context as any).store.settings.cart.apply_coupon_enabled).toBe(true);
        expect((context as any).cart).toBeDefined();
        expect((context as any).checkout).toBeDefined();
        expect((context as any).user.type).toBe('guest');
        expect((context as any).customer.id).toBe((context as any).user.id);
        expect((context as any).products[0].brand_id).toBe('b-1');
        expect((context as any).products[0].category_ids).toContain('c-1');
        expect((context as any).blog.articles).toHaveLength(1);
        expect((context as any).blog.categories).toHaveLength(1);
        expect((context as any).translations['pages.categories.sorting']).toBe('الفرز');
    });

    it('normalizes provided authenticated user and exposes customer alias', () => {
        const context = baseContext();
        (context as any).user = {
            id: 'user-1',
            type: 'user',
            is_authenticated: true,
            name: 'Mohammed Ali',
            email: 'user@example.com',
            mobile: '+966500000002'
        };

        bindPreviewContext({
            context,
            target: { pageId: 'index', routePath: '/' },
            query: {},
            viewport: 'desktop',
            theme: {
                themeId: 'theme-a',
                themeVersionId: 'tv-1',
                themeVersion: '1.0.0'
            }
        });

        expect((context as any).user.is_authenticated).toBe(true);
        expect((context as any).user.first_name).toBe('Mohammed');
        expect((context as any).customer.email).toBe('user@example.com');
        expect((context as any).customer.mobile).toBe('+966500000002');
    });

    it('builds product/single advanced context contract (options, donation, offer, similar products)', () => {
        const context = baseContext();
        (context as any).products = [
            {
                id: 'product-base',
                name: 'Base Product',
                type: 'product',
                price: { amount: 100, currency: 'SAR' },
                regular_price: { amount: 120, currency: 'SAR' },
                sale_price: { amount: 100, currency: 'SAR' },
                brand: { id: 'brand-1', name: 'Brand 1' },
                categories: [{ id: 'cat-1', name: 'Category 1' }],
                options: [
                    {
                        id: 'opt-size',
                        name: 'Size',
                        type: 'select',
                        values: [
                            { id: 'opt-size-s', name: 'S', price: 0 },
                            { id: 'opt-size-m', name: 'M', price: 10 }
                        ]
                    }
                ],
                donation: {
                    collected_amount: 250,
                    target_amount: 1000,
                    target_end_date: '2099-01-01T00:00:00.000Z'
                }
            },
            {
                id: 'product-related-1',
                name: 'Related Product 1',
                price: { amount: 80, currency: 'SAR' },
                sale_price: { amount: 80, currency: 'SAR' },
                regular_price: { amount: 95, currency: 'SAR' },
                brand: { id: 'brand-1', name: 'Brand 1' },
                categories: [{ id: 'cat-1', name: 'Category 1' }]
            },
            {
                id: 'product-related-2',
                name: 'Related Product 2',
                price: { amount: 90, currency: 'SAR' },
                sale_price: { amount: 90, currency: 'SAR' },
                regular_price: { amount: 110, currency: 'SAR' },
                brand: { id: 'brand-2', name: 'Brand 2' },
                categories: [{ id: 'cat-1', name: 'Category 1' }]
            }
        ];
        (context as any).specialOffers = [
            {
                id: 'offer-1',
                title: 'Special Offer 1',
                product_ids: ['product-base', 'product-related-1'],
                category_ids: ['cat-1']
            }
        ];

        bindPreviewContext({
            context,
            target: { pageId: 'product/single', routePath: '/products/product-base', entityRef: 'product-base' },
            query: {},
            viewport: 'desktop',
            theme: {
                themeId: 'theme-a',
                themeVersionId: 'tv-1',
                themeVersion: '1.0.0'
            }
        });

        expect((context as any).page.template_id).toBe('product/single');
        expect((context as any).product.id).toBe('product-base');
        expect(Array.isArray((context as any).product.options)).toBe(true);
        expect(Array.isArray((context as any).product.options[0].details)).toBe(true);
        expect((context as any).product.options[0].details).toHaveLength(2);
        expect(Boolean((context as any).product.donation)).toBe(true);
        expect(Number((context as any).product.donation.target_percent)).toBe(25);
        expect(Boolean((context as any).product.donation.can_donate)).toBe(true);
        expect((context as any).offer.id).toBe('offer-1');
        expect(Array.isArray((context as any).similar_products)).toBe(true);
        expect((context as any).similar_products.map((entry: any) => String(entry.id))).toContain('product-related-1');
        expect((context as any).similar_products.map((entry: any) => String(entry.id))).not.toContain('product-base');
    });
});
