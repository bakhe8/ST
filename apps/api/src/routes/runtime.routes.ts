import { Router, Response } from 'express';
import { CompositionEngine, RendererService, StoreLogic } from '@vtdr/engine';
import { StoreRequest } from '../middlewares/context.middleware.js';
import { fail, ok } from '../utils/api-response.js';

export function createRuntimeRoutes(
    engine: CompositionEngine,
    renderer: RendererService,
    storeLogic: StoreLogic,
    themeRegistry: any
) {
    const router = Router();

    router.get('/preview/:storeId/:themeId/:version', async (req: StoreRequest, res: Response) => {
        try {
            const { themeId } = req.params;
            const pageId = req.query.page as string || 'home';

            // Use the store from context (middleware-resolved)
            const store = req.store;
            if (!store) return res.status(404).send('Store context not found');

            const context = await engine.buildContext(store.id, pageId);
            if (!context) return res.status(500).send('Failed to build context');

            let html = await renderer.renderPage(context, store.themeId);

            // Fallback: If 'home' not found, try 'index'
            if (pageId === 'home' && html.includes('Render Error') && html.includes('home.twig')) {
                context.page.id = 'index';
                html = await renderer.renderPage(context, store.themeId);
            }

            res.status(200).type('text/html').send(html);
        } catch (error: any) {
            res.status(500).send(`Preview rendering failed: ${error.message}`);
        }
    });

    router.post('/render', async (req: StoreRequest, res: Response) => {
        if (!req.storeId) return fail(res, 400, 'Store context required');

        const context = await engine.buildContext(req.storeId);
        if (!context) return fail(res, 404, 'Store not found');

        return ok(res, { context });
    });

    return router;
}
