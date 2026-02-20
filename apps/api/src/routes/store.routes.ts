import { Router, Response } from 'express';
import { StoreManagementOrchestrator } from '@vtdr/engine';
import { StoreRequest } from '../middlewares/context.middleware.js';
import { fail, ok } from '../utils/api-response.js';

type StoreRouteResult<T = any> =
    | { ok: true; status: number; data: T }
    | { ok: false; status: number; message: string };

const sendStoreResult = (res: Response, result: StoreRouteResult) => {
    if (!result.ok) return fail(res, result.status, result.message);
    return ok(res, result.data, result.status);
};

export function createStoreRoutes(
    storeManagementOrchestrator: StoreManagementOrchestrator,
    contextMiddleware?: any
) {
    const router = Router();
    const mw = contextMiddleware || ((req: any, _res: any, next: any) => next());

    router.get('/', async (_req, res) => {
        const stores = await storeManagementOrchestrator.listStores();
        return ok(res, stores);
    });

    router.post('/', async (req, res) => {
        const store = await storeManagementOrchestrator.createStore(req.body);
        return ok(res, store);
    });

    router.get('/:id', mw, async (req: StoreRequest, res: Response) => ok(res, req.store));

    router.post('/:id/clone', mw, async (req: StoreRequest, res: Response) => {
        const result = await storeManagementOrchestrator.cloneStore(req.storeId!);
        return sendStoreResult(res, result);
    });

    router.patch('/:id', mw, async (req: StoreRequest, res: Response) => {
        try {
            const store = await storeManagementOrchestrator.updateStore(req.storeId!, req.body);
            return ok(res, store);
        } catch (error: any) {
            return fail(res, error?.status || 500, error?.message || 'Failed to update store');
        }
    });

    router.post('/:id/promote', mw, async (req: StoreRequest, res: Response) => {
        const result = await storeManagementOrchestrator.promoteStore(req.storeId!);
        return sendStoreResult(res, result);
    });

    router.post('/:id/inherit', mw, async (req: StoreRequest, res: Response) => {
        const result = await storeManagementOrchestrator.inheritStore(req.storeId!, req.body?.parentStoreId);
        return sendStoreResult(res, result);
    });

    router.patch('/:id/settings', mw, async (req: StoreRequest, res: Response) => {
        const result = await storeManagementOrchestrator.updateSettings(req.storeId!, req.body?.settings);
        return sendStoreResult(res, result);
    });

    router.post('/:id/seed', mw, async (req: StoreRequest, res: Response) => {
        const result = await storeManagementOrchestrator.seedStore(
            req.storeId!,
            req.body?.productCount,
            req.body?.seedProfile
        );
        return sendStoreResult(res, result);
    });

    router.post('/:id/sync', mw, async (req: StoreRequest, res: Response) => {
        const result = await storeManagementOrchestrator.syncStore(req.storeId!, req.body?.storeUrl);
        return sendStoreResult(res, result);
    });

    router.delete('/:id/data', mw, async (req: StoreRequest, res: Response) => {
        const result = await storeManagementOrchestrator.clearStoreData(req.storeId!);
        return sendStoreResult(res, result);
    });

    router.delete('/:id', mw, async (req: StoreRequest, res: Response) => {
        const result = await storeManagementOrchestrator.deleteStore(req.storeId!);
        return sendStoreResult(res, result);
    });

    return router;
}
