import { Router, Response } from 'express';
import { StoreFactory, StoreLogic, SeederService, SynchronizationService } from '@vtdr/engine';
import { StoreRequest } from '../middlewares/context.middleware.js';
import { ok, fail } from '../utils/api-response.js';

export function createStoreRoutes(
    storeFactory: StoreFactory,
    storeLogic: StoreLogic,
    seeder: SeederService,
    synchronizer: SynchronizationService,
    contextMiddleware?: any
) {
    const router = Router();

    // 1. Global (Context-less) routes
    router.get('/', async (req, res) => {
        const stores = await storeFactory.listStores();
        return ok(res, stores);
    });

    router.post('/', async (req, res) => {
        const store = await storeFactory.createStore(req.body);
        return ok(res, store);
    });

    // 2. Context-scoped routes (using :id)
    const mw = contextMiddleware || ((req: any, res: any, next: any) => next());

    router.get('/:id', mw, async (req: StoreRequest, res: Response) => {
        return ok(res, req.store);
    });

    router.post('/:id/clone', mw, async (req: StoreRequest, res: Response) => {
        try {
            const clone = await storeFactory.cloneStore(req.storeId!);
            return ok(res, clone);
        } catch (error: any) {
            return fail(res, 500, error.message);
        }
    });

    router.patch('/:id', mw, async (req: StoreRequest, res: Response) => {
        const store = await storeFactory.updateStore(req.storeId!, req.body);
        return ok(res, store);
    });

    router.post('/:id/promote', mw, async (req: StoreRequest, res: Response) => {
        try {
            const store = await storeLogic.promoteToMaster(req.storeId!);
            return ok(res, store);
        } catch (error: any) {
            return fail(res, 500, error.message);
        }
    });

    router.post('/:id/inherit', mw, async (req: StoreRequest, res: Response) => {
        try {
            const { parentStoreId } = req.body;
            const store = await storeLogic.inheritFrom(req.storeId!, parentStoreId);
            return ok(res, store);
        } catch (error: any) {
            return fail(res, 500, error.message);
        }
    });

    router.patch('/:id/settings', mw, async (req: StoreRequest, res: Response) => {
        const { settings } = req.body;
        if (!settings) return fail(res, 400, 'Settings are required');
        try {
            const updated = await storeLogic.updateSettings(req.storeId!, settings);
            return ok(res, updated);
        } catch (error) {
            return fail(res, 500, 'Failed to update settings');
        }
    });

    router.post('/:id/seed', mw, async (req: StoreRequest, res: Response) => {
        try {
            const count = req.body.productCount || 20;
            const result = await seeder.seedStoreData(req.storeId!, count);
            return ok(res, result);
        } catch (error) {
            return fail(res, 500, 'Seeding failed');
        }
    });

    router.post('/:id/sync', mw, async (req: StoreRequest, res: Response) => {
        const { storeUrl } = req.body;
        if (!storeUrl) return fail(res, 400, 'storeUrl is required');
        try {
            const result = await synchronizer.syncStoreData(req.storeId!, storeUrl);
            return ok(res, result);
        } catch (error: any) {
            return fail(res, 500, `Synchronization failed: ${error.message}`);
        }
    });

    router.delete('/:id/data', mw, async (req: StoreRequest, res: Response) => {
        try {
            await storeLogic.clearDataEntities(req.storeId!);
            return ok(res, null, 200, { message: 'Store data cleared' });
        } catch (error) {
            return fail(res, 500, 'Failed to clear data');
        }
    });

    router.delete('/:id', mw, async (req: StoreRequest, res: Response) => {
        try {
            await storeFactory.deleteStore(req.storeId!);
            return ok(res, null, 200, { message: 'Store and all associated data deleted' });
        } catch (error: any) {
            return fail(res, 500, error.message);
        }
    });

    return router;
}
