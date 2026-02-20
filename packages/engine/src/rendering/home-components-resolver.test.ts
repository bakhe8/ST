import { describe, it, expect } from 'vitest';
import { HomeComponentsResolver } from './home-components-resolver.js';
import type { RuntimeContext } from '@vtdr/contracts';

const createContext = (overrides?: Partial<RuntimeContext>): RuntimeContext => ({
    storeId: 'store-1',
    theme: {
        id: 'theme-a',
        name: 'Theme A',
        version: '1.0.0'
    },
    store: {
        id: 'store-1',
        name: 'Store',
        locale: 'ar-SA',
        currency: 'SAR',
        branding: {},
        settings: {},
        themeId: 'theme-a',
        themeVersionId: 'ver-1'
    },
    page: {
        id: 'index',
        components: []
    },
    settings: {},
    translations: {},
    products: [
        { id: 'p1', url: '/products/p1', name: 'P1' } as any,
        { id: 'p2', url: '/products/p2', name: 'P2' } as any
    ],
    categories: [],
    brands: [],
    pages: [],
    blog_articles: [],
    blog_categories: [],
    ...(overrides || {})
});

describe('HomeComponentsResolver', () => {
    it('builds home components from theme schema and resolves product dropdown source', () => {
        const resolver = new HomeComponentsResolver();
        const context = createContext();
        const schema = {
            components: [
                {
                    key: 'home-slider',
                    path: 'home.slider',
                    fields: [
                        {
                            id: 'products',
                            type: 'items',
                            format: 'dropdown-list',
                            source: 'products'
                        }
                    ]
                }
            ]
        };

        const resolved = resolver.resolve(context, schema);
        expect(resolved.length).toBe(1);
        expect(resolved[0].path).toBe('home.slider');
        expect(Array.isArray(resolved[0].data.products)).toBe(true);
        expect(resolved[0].data.products.length).toBe(2);
        expect(resolved[0].data.product_ids_mock_str).toContain('p1');
    });

    it('respects page compositions visibility and component selection', () => {
        const resolver = new HomeComponentsResolver();
        const context = createContext({
            settings: {
                page_compositions: {
                    home: [
                        {
                            componentId: 'hidden-component',
                            visibility: { enabled: false, viewport: 'all' }
                        },
                        {
                            componentId: 'visible-component',
                            visibility: { enabled: true, viewport: 'desktop' }
                        }
                    ]
                }
            }
        });

        const schema = {
            components: [
                {
                    key: 'hidden-component',
                    path: 'home.hidden',
                    fields: []
                },
                {
                    key: 'visible-component',
                    path: 'home.visible',
                    fields: []
                }
            ]
        };

        const resolved = resolver.resolve(context, schema);
        expect(resolved.length).toBe(1);
        expect(resolved[0].path).toBe('home.visible');
    });

    it('resolves saved compositions for non-home pages via template id mapping', () => {
        const resolver = new HomeComponentsResolver();
        const context = createContext({
            page: {
                id: 'product/single',
                components: [],
                template_id: 'product/single'
            } as any,
            settings: {
                page_compositions: {
                    'product-single': [
                        {
                            componentId: 'product-offer',
                            visibility: { enabled: true, viewport: 'desktop' },
                            props: { title: 'Offer Block' }
                        }
                    ]
                }
            } as any
        });

        const schema = {
            components: [
                {
                    key: 'product-offer',
                    path: 'product.single.offer',
                    fields: [{ id: 'title', type: 'string', value: 'Default' }]
                },
                {
                    key: 'home-slider',
                    path: 'home.slider',
                    fields: []
                }
            ]
        };

        const resolved = resolver.resolve(context, schema, 'product/single');
        expect(resolved.length).toBe(1);
        expect(resolved[0].path).toBe('product.single.offer');
        expect(resolved[0].data.title).toBe('Offer Block');
    });

    it('filters product list defaults without leaking product.single components', () => {
        const resolver = new HomeComponentsResolver();
        const context = createContext({
            page: {
                id: 'product/index',
                components: [],
                template_id: 'product/index'
            } as any
        });
        const schema = {
            components: [
                {
                    key: 'product-grid',
                    path: 'product.grid',
                    fields: []
                },
                {
                    key: 'product-single-offer',
                    path: 'product.single.offer',
                    fields: []
                }
            ]
        };

        const resolved = resolver.resolve(context, schema, 'product/index');
        expect(resolved.length).toBe(1);
        expect(resolved[0].path).toBe('product.grid');
    });
});
