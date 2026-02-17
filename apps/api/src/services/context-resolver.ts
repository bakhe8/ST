import { Request } from 'express';
import { StoreLogic } from '@vtdr/engine';

export class ContextResolver {
    constructor(private storeLogic: StoreLogic) { }

    /**
     * Resovles the Store ID from a request with explicit priority.
     * 1. Header (x-vtdr-store-id) - Standard
     * 2. Header (context-store-id) - Multi-tenant compat
     * 3. Query Parameter (store_id)
     * 4. Route Parameters (:storeId or :id)
     * 5. URL Path (/preview/:storeId/...)
     */
    public async resolveStoreId(req: Request): Promise<string | null> {
        // 1 & 2. Headers
        const headerId = req.headers['x-vtdr-store-id'] || req.headers['context-store-id'];
        if (headerId && typeof headerId === 'string') {
            return headerId;
        }

        // 3. Query
        if (req.query.store_id && typeof req.query.store_id === 'string') {
            return req.query.store_id;
        }

        // 4. Route params
        const params = req.params as Record<string, string | undefined>;
        const paramId = params?.storeId || params?.id;
        if (paramId) {
            return paramId;
        }

        // 5. Path Parsing (Regex)
        // Match /preview/[uuid-or-id]/...
        const previewMatch = req.path.match(/^\/preview\/([^\/]+)/);
        if (previewMatch) {
            return previewMatch[1];
        }

        return null;
    }

    /**
     * Resolves a store entity by id.
     */
    public async resolveStore(storeId: string): Promise<any | null> {
        try {
            return await this.storeLogic.getStore(storeId);
        } catch (e) {
            console.error(`[CONTEXT_RESOLVER] Store lookup error for ${storeId}:`, e);
            return null;
        }
    }

    /**
     * Validates that the store exists in the database.
     */
    public async validateContext(storeId: string): Promise<boolean> {
        const store = await this.resolveStore(storeId);
        return !!store;
    }
}
