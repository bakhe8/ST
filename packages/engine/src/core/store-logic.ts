import { IDataEntityRepository, IStoreRepository, StoreSettingsSchema, BrandingSchema } from '@vtdr/contracts';
import { StoreFactory } from './store-factory.js';

export class StoreLogic {
    constructor(
        private storeRepo: IStoreRepository,
        private dataEntityRepo: IDataEntityRepository
    ) { }

    public async getStore(id: string, tx?: any) {
        return this.storeRepo.getById(id, tx);
    }

    public async getFullState(id: string, tx?: any) {
        return this.storeRepo.getById(id, tx);
    }

    public async updateSettings(storeId: string, settings: any, tx?: any) {
        const validated = StoreSettingsSchema.parse(settings);
        return this.storeRepo.update(storeId, {
            settingsJson: JSON.stringify(validated)
        }, tx);
    }

    public async updateBranding(storeId: string, branding: any, tx?: any) {
        const validated = BrandingSchema.parse(branding);
        return this.storeRepo.update(storeId, {
            brandingJson: JSON.stringify(validated)
        }, tx);
    }

    public async getThemeSettings(storeId: string, tx?: any): Promise<Record<string, any>> {
        const store: any = await this.storeRepo.getById(storeId, tx);
        if (!store) return {};

        const parseObject = (value: any): Record<string, any> => {
            if (!value) return {};
            try {
                const parsed = JSON.parse(value);
                return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
            } catch {
                return {};
            }
        };

        const themeSettings = parseObject(store.themeSettingsJson);
        if (Object.keys(themeSettings).length > 0) {
            return themeSettings;
        }

        // Compatibility fallback for stores saved before themeSettingsJson was introduced.
        return parseObject(store.brandingJson);
    }

    public async updateThemeSettings(storeId: string, values: Record<string, any>, tx?: any) {
        const incoming =
            values && typeof values === 'object' && !Array.isArray(values) ? values : {};

        const store: any = await this.storeRepo.getById(storeId, tx);
        const parseObject = (value: any): Record<string, any> => {
            if (!value) return {};
            try {
                const parsed = JSON.parse(value);
                return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
            } catch {
                return {};
            }
        };

        const existing = parseObject(store?.themeSettingsJson);
        const merged: Record<string, any> = {
            ...existing,
            ...incoming
        };

        // Preserve non-target page compositions while allowing partial updates.
        if (existing.page_compositions || incoming.page_compositions) {
            merged.page_compositions = {
                ...(existing.page_compositions && typeof existing.page_compositions === 'object' ? existing.page_compositions : {}),
                ...(incoming.page_compositions && typeof incoming.page_compositions === 'object' ? incoming.page_compositions : {})
            };
        }

        return this.storeRepo.update(storeId, {
            themeSettingsJson: JSON.stringify(merged)
        }, tx);
    }

    public async createDataEntity(storeId: string, type: string, payload: any, tx?: any) {
        return this.dataEntityRepo.create(storeId, type, payload, tx);
    }

    public async getDataEntity(storeId: string, type: string, key: string, tx?: any) {
        return this.dataEntityRepo.getById(storeId, type, key, tx);
    }

    public async upsertDataEntity(storeId: string, type: string, key: string, payload: any, tx?: any) {
        return this.dataEntityRepo.upsertByEntityKey(storeId, type, key, payload, tx);
    }

    public async deleteDataEntity(storeId: string, type: string, key: string, tx?: any) {
        return this.dataEntityRepo.deleteByEntityKey(storeId, type, key, tx);
    }

    public async clearDataEntities(storeId: string, tx?: any) {
        return this.dataEntityRepo.clearByStore(storeId, tx);
    }

    public async getDataEntities(storeId: string, type: string, tx?: any) {
        const store = await this.storeRepo.getById(storeId, tx);
        const localEntities = await this.dataEntityRepo.getByStoreAndType(storeId, type, tx);

        if (store?.parentStoreId) {
            console.log(`[SimulationLogic] Inheriting ${type} from parent: ${store.parentStoreId}`);
            const parentEntities = await this.getDataEntities(store.parentStoreId, type, tx);

            // Merge logic: Local overrides parent by entityKey (if available)
            const merged = new Map();

            // Add parent entities first
            parentEntities.forEach((ent: any) => {
                const key = ent.entityKey || ent.id || JSON.stringify(ent);
                merged.set(key, ent);
            });

            // Override with local entities
            localEntities.forEach((ent: any) => {
                const key = ent.entityKey || ent.id || JSON.stringify(ent);
                merged.set(key, ent);
            });

            return Array.from(merged.values());
        }

        return localEntities;
    }

    public async promoteToMaster(storeId: string, tx?: any) {
        console.log(`[SimulationLogic] Promoting store to master: ${storeId}`);
        return this.storeRepo.update(storeId, { isMaster: true }, tx);
    }

    public async inheritFrom(storeId: string, parentStoreId: string | null, tx?: any) {
        if (parentStoreId) {
            // 1. Block Self-Inheritance
            if (storeId === parentStoreId) {
                throw new Error('A store cannot inherit from itself.');
            }

            // 2. Block Circular Chains (e.g. A -> B -> A)
            const hasCycle = await this.detectCycle(storeId, parentStoreId, tx);
            if (hasCycle) {
                throw new Error(`Circular inheritance detected: Store ${storeId} is already a parent (directly or indirectly) of ${parentStoreId}.`);
            }
        }

        console.log(`[SimulationLogic] Setting parent for store ${storeId} -> ${parentStoreId}`);
        return this.storeRepo.update(storeId, { parentStoreId }, tx);
    }

    private async detectCycle(childId: string, potentialParentId: string, tx?: any): Promise<boolean> {
        let currentParentId: string | null = potentialParentId;
        const visited = new Set<string>([childId]);

        while (currentParentId) {
            if (visited.has(currentParentId)) {
                return true; // Found a circular reference
            }

            if (currentParentId === childId) {
                return true; // Redundant but safe check for self
            }

            visited.add(currentParentId);
            const parent = await this.storeRepo.getById(currentParentId, tx);
            currentParentId = parent?.parentStoreId || null;
        }

        return false;
    }

    public async getWebhooks(storeId: string, tx?: any): Promise<any[]> {
        const store = await this.storeRepo.getById(storeId, tx);
        // Webhooks logic will be moved to Store model or a dedicated table if needed
        return [];
    }

    public async updateWebhooks(storeId: string, webhooks: any[]) {
        // Implementation TBD for Store-First
        return { success: true };
    }
}
