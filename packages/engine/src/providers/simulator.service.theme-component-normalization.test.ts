import { describe, expect, it, vi } from 'vitest';
import { SimulatorService } from './simulator.service.js';

describe('SimulatorService theme component source normalization', () => {
    it('normalizes source aliases, infers missing sources, and backfills variable-list sources', async () => {
        const storeLogic = {
            getStore: vi.fn().mockResolvedValue({
                id: 'store-1',
                themeId: 'theme-fixture'
            }),
            getDataEntities: vi.fn().mockImplementation(async (_storeId: string, type: string) => {
                const byType: Record<string, any[]> = {
                    product: [
                        {
                            id: 'prd-1',
                            name: 'Product 1',
                            slug: 'product-1',
                            url: '/products/product-1',
                            price: { amount: 120, currency: 'SAR' },
                            regular_price: { amount: 150, currency: 'SAR' },
                            sale_price: { amount: 120, currency: 'SAR' },
                            images: [{ id: 'img-1', url: '/images/p1.png', alt: 'P1' }],
                            category_ids: ['cat-1'],
                            categories: [{ id: 'cat-1', name: 'Category 1' }],
                            brand: { id: 'brand-1', name: 'Brand 1' }
                        }
                    ],
                    category: [{ id: 'cat-1', name: 'Category 1', slug: 'category-1', url: '/categories/category-1' }],
                    brand: [{ id: 'brand-1', name: 'Brand 1', slug: 'brand-1', url: '/brands/brand-1' }],
                    page: [{ id: 'about-us', title: 'About', slug: 'about-us', url: '/pages/about-us' }],
                    blog_article: [{ id: 'post-1', title: 'Post 1', slug: 'post-1', url: '/blog/post-1' }],
                    blog_articles: [],
                    blog_category: [{ id: 'blog-cat-1', title: 'Blog Category 1', slug: 'blog-category-1', url: '/blog/categories/blog-category-1' }],
                    blog_categories: [],
                    specialOffer: [{ id: 'offer-1', title: 'Offer 1', slug: 'offer-1', url: '/offers/offer-1' }],
                    offer: [],
                    review: [],
                    product_review: [],
                    question: [],
                    product_question: []
                };
                return byType[type] || [];
            })
        } as any;

        const schemaService = {
            getModelSchema: vi.fn().mockReturnValue(null)
        } as any;

        const themeRuntimeAdapter = {
            getThemeComponents: vi.fn().mockResolvedValue([
                {
                    key: 'cmp-1',
                    title: { ar: 'Fixture Component', en: 'Fixture Component' },
                    path: 'home.fixture',
                    fields: [
                        {
                            id: 'select_category',
                            type: 'items',
                            format: 'dropdown-list',
                            label: 'اختر التصنيف',
                            source: ''
                        },
                        {
                            id: 'select_brand',
                            type: 'items',
                            format: 'dropdown-list',
                            label: 'اختر الماركة',
                            source: 'brand'
                        },
                        {
                            id: 'dynamic_url',
                            type: 'items',
                            format: 'variable-list',
                            source: 'custom',
                            sources: [
                                { key: 'product', value: 'product', label: 'Product' },
                                { key: 'post', value: 'post', label: 'Post' }
                            ]
                        },
                        {
                            id: 'fallback_url',
                            type: 'items',
                            format: 'variable-list',
                            source: ''
                        }
                    ]
                }
            ]),
            getThemeSettings: vi.fn().mockResolvedValue([]),
            getThemeSchema: vi.fn().mockResolvedValue(null),
            themeExists: vi.fn().mockResolvedValue(true),
            resolvePlaceholderImage: vi.fn().mockReturnValue('/images/placeholder.png')
        } as any;

        const service = new SimulatorService(storeLogic, schemaService, themeRuntimeAdapter);
        const response: any = await service.getThemeComponents('store-1');
        expect(response).toBeTruthy();

        expect(response.success).toBe(true);
        expect(Array.isArray(response.data.components)).toBe(true);
        expect(response.data.components).toHaveLength(1);

        const fields = response.data.components[0].fields || [];
        const byId = new Map(fields.map((field: any) => [String(field?.id), field]));

        const categoryField: any = byId.get('select_category');
        expect(categoryField?.source).toBe('categories');
        expect(Array.isArray(categoryField?.options)).toBe(true);
        expect(categoryField.options).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ value: 'cat-1', label: 'Category 1' })
            ])
        );

        const brandField: any = byId.get('select_brand');
        expect(brandField?.source).toBe('brands');
        expect(Array.isArray(brandField?.options)).toBe(true);
        expect(brandField.options).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ value: 'brand-1', label: 'Brand 1' })
            ])
        );

        const dynamicUrlField: any = byId.get('dynamic_url');
        const dynamicSources = (dynamicUrlField?.variableSources || []).map((entry: any) => entry.value);
        expect(dynamicSources).toEqual(expect.arrayContaining(['products', 'blog_articles']));
        expect(Array.isArray(dynamicUrlField?.variableOptions?.products)).toBe(true);
        expect(dynamicUrlField.variableOptions.products).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ value: 'prd-1' })
            ])
        );
        expect(Array.isArray(dynamicUrlField?.variableOptions?.blog_articles)).toBe(true);
        expect(dynamicUrlField.variableOptions.blog_articles).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ value: 'post-1' })
            ])
        );

        const fallbackField: any = byId.get('fallback_url');
        const fallbackSources = (fallbackField?.variableSources || []).map((entry: any) => entry.value);
        expect(fallbackSources).toEqual(expect.arrayContaining(['products', 'categories', 'custom']));
        expect(Array.isArray(fallbackField?.variableOptions?.products)).toBe(true);
        expect(fallbackField.variableOptions.products.length).toBeGreaterThan(0);
    });
});
