import { Request, Response, NextFunction } from 'express';
import { ContextResolver } from '../services/context-resolver.js';
import { fail } from '../utils/api-response.js';

export interface StoreRequest extends Request {
    storeId?: string;
    store?: any;
}

export const createContextMiddleware = (resolver: ContextResolver) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const request = req as StoreRequest;
        const storeId = await resolver.resolveStoreId(req);

        if (!storeId) {
            // Routes that should not require store context
            const isContextOptional =
                req.path === '/' ||
                req.path.startsWith('/api/health') ||
                req.path.startsWith('/api/system/status') ||
                req.path.startsWith('/stores');
            if (isContextOptional) return next();

            console.error(`[CONTEXT_ERROR] Unresolved Store Context: ${req.method} ${req.path}`);
            return fail(res, 400, 'Store context missing. Use x-vtdr-store-id header.');
        }

        const store = await resolver.resolveStore(storeId);
        if (!store) {
            console.error(`[CONTEXT_ERROR] Invalid Store ID: ${storeId}`);
            return fail(res, 400, `Invalid store context: ${storeId}`);
        }

        // Attach to request for downstream use
        request.storeId = storeId;
        request.store = store;
        next();
    };
};
