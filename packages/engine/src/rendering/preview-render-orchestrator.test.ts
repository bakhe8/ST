import { describe, expect, it, vi } from 'vitest';
import type { RuntimeContext } from '@vtdr/contracts';
import { PreviewRenderOrchestrator, resolveWildcardPath } from './preview-render-orchestrator.js';

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
        themeVersionId: 'tv-a-1'
    },
    page: {
        id: 'index',
        components: []
    },
    settings: {},
    translations: {},
    products: [],
    categories: [],
    brands: [],
    pages: [],
    blog_articles: [],
    blog_categories: []
});

describe('PreviewRenderOrchestrator', () => {
    it('renders preview html through the full orchestration flow', async () => {
        const context = baseContext();
        const engine = {
            buildContext: vi.fn().mockResolvedValue(context)
        } as any;
        const renderer = {
            renderPage: vi.fn().mockResolvedValue('<html>preview-ok</html>')
        } as any;
        const storeLogic = {
            getDataEntity: vi.fn().mockResolvedValue(null),
            getDataEntities: vi.fn().mockResolvedValue([])
        } as any;
        const themeRegistry = {
            getTheme: vi.fn().mockResolvedValue({
                id: 'theme-a',
                versions: [{ id: 'tv-a-1', version: '1.0.0' }]
            })
        };

        const orchestrator = new PreviewRenderOrchestrator(engine, renderer, storeLogic, themeRegistry);
        const result = await orchestrator.render({
            store: {
                id: 'store-1',
                themeId: 'theme-a',
                themeVersionId: 'tv-a-1'
            },
            requestedThemeId: 'theme-a',
            requestedVersion: '1.0.0',
            query: { page: 'index' },
            wildcardPath: ''
        });

        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.status).toBe(200);
            expect(result.html).toContain('preview-ok');
            expect(result.metrics.storeId).toBe('store-1');
            expect(result.metrics.themeId).toBe('theme-a');
            expect(result.metrics.pageId).toBe('index');
            expect(result.metrics.totalMs).toBeGreaterThanOrEqual(0);
        }
        expect(engine.buildContext).toHaveBeenCalledWith('store-1', 'index', {
            themeId: 'theme-a',
            themeVersionId: 'tv-a-1'
        });
        const baseline = orchestrator.getRenderBaseline(20);
        expect(baseline.samples).toBe(1);
        expect(baseline.avgTotalMs).toBeGreaterThanOrEqual(0);
    });

    it('returns 404 when store context is missing', async () => {
        const orchestrator = new PreviewRenderOrchestrator(
            { buildContext: vi.fn() } as any,
            { renderPage: vi.fn() } as any,
            { getDataEntity: vi.fn(), getDataEntities: vi.fn() } as any,
            { getTheme: vi.fn() }
        );

        const result = await orchestrator.render({
            store: null,
            query: {}
        });

        expect(result).toEqual({
            ok: false,
            status: 404,
            message: 'Store context not found'
        });
    });

    it('returns 404 when requested theme version is invalid', async () => {
        const orchestrator = new PreviewRenderOrchestrator(
            { buildContext: vi.fn() } as any,
            { renderPage: vi.fn() } as any,
            { getDataEntity: vi.fn(), getDataEntities: vi.fn() } as any,
            {
                getTheme: vi.fn().mockResolvedValue({
                    id: 'theme-a',
                    versions: [{ id: 'tv-a-1', version: '1.0.0' }]
                })
            }
        );

        const result = await orchestrator.render({
            store: {
                id: 'store-1',
                themeId: 'theme-a',
                themeVersionId: 'tv-a-1'
            },
            requestedThemeId: 'theme-a',
            requestedVersion: '9.9.9',
            query: {}
        });

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.status).toBe(404);
        }
    });

    it('builds store runtime context for /render endpoint flow', async () => {
        const context = baseContext();
        const engine = {
            buildContext: vi.fn().mockResolvedValue(context)
        } as any;

        const orchestrator = new PreviewRenderOrchestrator(
            engine,
            { renderPage: vi.fn() } as any,
            { getDataEntity: vi.fn(), getDataEntities: vi.fn() } as any,
            { getTheme: vi.fn() }
        );

        const result = await orchestrator.buildStoreContext('store-1');
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.status).toBe(200);
            expect(result.context.storeId).toBe('store-1');
        }
        expect(engine.buildContext).toHaveBeenCalledWith('store-1');
    });

    it('returns zero baseline before any render sample', () => {
        const orchestrator = new PreviewRenderOrchestrator(
            { buildContext: vi.fn() } as any,
            { renderPage: vi.fn() } as any,
            { getDataEntity: vi.fn(), getDataEntities: vi.fn() } as any,
            { getTheme: vi.fn() }
        );

        expect(orchestrator.getRenderBaseline()).toEqual({
            samples: 0,
            avgTotalMs: 0,
            p95TotalMs: 0,
            avgRenderMs: 0
        });
    });
});

describe('resolveWildcardPath', () => {
    it('joins splat array params into a normalized route token', () => {
        expect(resolveWildcardPath(['products', 'item-1'])).toBe('products/item-1');
    });

    it('supports scalar wildcard values', () => {
        expect(resolveWildcardPath('checkout')).toBe('checkout');
    });
});
