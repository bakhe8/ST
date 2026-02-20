import { Request } from 'express';
import { StoreLogic } from '@vtdr/engine';

export class ContextResolver {
    constructor(private storeLogic: StoreLogic) { }

    private readHeaderValue(req: Request, headerName: string): string | null {
        const raw = req.headers[headerName];
        if (Array.isArray(raw)) {
            const first = raw.find((entry) => typeof entry === 'string' && entry.trim());
            return first ? String(first).trim() : null;
        }
        if (typeof raw === 'string' && raw.trim()) {
            return raw.trim();
        }
        return null;
    }

    private extractStoreIdFromPreviewPath(rawPath: string): string | null {
        const pathValue = String(rawPath || '').trim();
        if (!pathValue) return null;
        const previewMatch = pathValue.match(/^\/preview\/([^\/?#]+)/);
        if (!previewMatch) return null;
        const value = String(previewMatch[1] || '').trim();
        return value || null;
    }

    /**
     * Resovles the Store ID from a request with explicit priority.
     * 1. Header (x-vtdr-store-id) - Standard
     * 2. Header (context-store-id) - Legacy compatibility fallback (API internal only)
     * 3. Query Parameter (store_id)
     * 4. Route Parameters (:storeId or :id)
     * 5. URL Path (/preview/:storeId/...)
     * 6. Referer Path (/preview/:storeId/...) for SDK calls that omit context headers/query
     */
    public async resolveStoreId(req: Request): Promise<string | null> {
        // 1. Canonical header
        const canonicalHeaderId = this.readHeaderValue(req, 'x-vtdr-store-id');
        if (canonicalHeaderId) return canonicalHeaderId;

        // 2. Legacy fallback header (internal compatibility only)
        const legacyHeaderId = this.readHeaderValue(req, 'context-store-id');
        if (legacyHeaderId) return legacyHeaderId;

        // 3. Query
        if (req.query.store_id && typeof req.query.store_id === 'string') {
            const queryStoreId = req.query.store_id.trim();
            if (queryStoreId) return queryStoreId;
        }

        // 4. Route params
        const params = req.params as Record<string, string | undefined>;
        const paramId = params?.storeId || params?.id;
        if (paramId) {
            return paramId;
        }

        // 5. Path Parsing (Regex)
        // Match /preview/[uuid-or-id]/...
        const fromPath = this.extractStoreIdFromPreviewPath(req.path || '');
        if (fromPath) {
            return fromPath;
        }

        // 6. Referer header fallback for browser runtime requests hitting /api/v1/*
        const referer = req.headers.referer;
        if (typeof referer === 'string' && referer.trim()) {
            try {
                const refererUrl = new URL(referer);
                const fromReferer = this.extractStoreIdFromPreviewPath(refererUrl.pathname || '');
                if (fromReferer) {
                    return fromReferer;
                }
            } catch {
                // Ignore malformed referer values.
            }
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
