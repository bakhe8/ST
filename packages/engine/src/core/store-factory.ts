import { IStoreRepository, IDataEntityRepository, IThemeRepository, BrandingSchema } from '@vtdr/contracts';
import { SeederService } from '../providers/seeder-service.js';
import { SynchronizationService } from '../providers/synchronization-service.js';


// StoreFactory ينشئ متجر مستقل تلقائياً مع بيانات افتراضية
export class StoreFactory {
    constructor(
        private storeRepo: IStoreRepository,
        private dataEntityRepo: IDataEntityRepository,
        private themeRepo: IThemeRepository,
        private seeder?: SeederService,
        private sync?: SynchronizationService
    ) { }

    /**
     * ينشئ متجر جديد مع بيانات demo (منتجات، أقسام، بيانات متجر)
     */
    public async createStore(data: {
        title: string;
        defaultLocale?: string;
        defaultCurrency?: string;
        brandingJson?: string;
        blueprintId?: string;
        autoSeed?: boolean;
        syncUrl?: string;
        parentStoreId?: string;
        isMaster?: boolean;
    }, tx?: any) {
        if (tx) {
            return this.internalCreateStore(data, tx);
        }
        return this.storeRepo.transaction(async (newTx) => {
            return this.internalCreateStore(data, newTx);
        });
    }

    private async internalCreateStore(data: {
        title: string;
        defaultLocale?: string;
        defaultCurrency?: string;
        brandingJson?: string;
        blueprintId?: string;
        autoSeed?: boolean;
        syncUrl?: string;
        parentStoreId?: string;
        isMaster?: boolean;
    }, tx: any) {
        // 1. تحديد بيانات الثيم الأساسي (Dynamic resolution)
        let defaultThemeId = 'theme-raed-master';
        let defaultThemeVersionId = '8cb2d06c-e048-4cf0-886f-7311870812ce';

        const themes = await this.themeRepo.listAll();
        if (themes.length > 0) {
            defaultThemeId = themes[0].id;
            if (themes[0].versions && themes[0].versions.length > 0) {
                defaultThemeVersionId = themes[0].versions[0].id;
            }
        }

        // 1.5 Validating branding if provided
        let brandingJson = '{}';
        if (data.brandingJson) {
            const raw = typeof data.brandingJson === 'string' ? JSON.parse(data.brandingJson) : data.brandingJson;
            brandingJson = JSON.stringify(BrandingSchema.parse(raw));
        }

        // 2. إنشاء المتجر مباشرة مع إعدادات الثيم (Store-First)
        const store = await this.storeRepo.create({
            title: data.title,
            defaultLocale: data.defaultLocale || 'ar-SA',
            defaultCurrency: data.defaultCurrency || 'SAR',
            brandingJson,
            themeId: defaultThemeId,
            themeVersionId: defaultThemeVersionId,
            parentStoreId: data.parentStoreId,
            isMaster: data.isMaster
        }, tx);

        // 4. Automatic Operations (Phase B)
        if (data.syncUrl && this.sync) {
            console.log(`[StoreFactory] Auto-Syncing from: ${data.syncUrl}`);
            await this.sync.syncStoreData(store.id, data.syncUrl, tx);
        } else if (data.autoSeed && this.seeder) {
            console.log(`[StoreFactory] Auto-Seeding store: ${store.id}`);
            await this.seeder.seedStoreData(store.id, 20, tx);
        }

        return store;
    }

    public async getStore(id: string, tx?: any) {
        return this.storeRepo.getById(id, tx);
    }

    public async listStores(tx?: any) {
        return this.storeRepo.listAll(tx);
    }

    public async listMasterStores() {
        const all = await this.listStores();
        return all.filter((s: any) => s.isMaster);
    }

    public async updateStore(id: string, data: any, tx?: any) {
        return this.storeRepo.update(id, data, tx);
    }

    public async deleteStore(id: string, tx?: any) {
        console.log(`[StoreFactory] Deleting store and all data for: ${id}`);
        await this.dataEntityRepo.clearByStore(id, tx);
        return this.storeRepo.delete(id, tx);
    }

    public async cloneStore(id: string, tx?: any) {
        if (tx) {
            return this.internalCloneStore(id, tx);
        }
        return this.storeRepo.transaction(async (newTx) => {
            return this.internalCloneStore(id, newTx);
        });
    }

    private async internalCloneStore(id: string, tx: any) {
        console.log(`[StoreFactory] Cloning store: ${id}`);
        const original = await this.getStore(id, tx);
        if (!original) throw new Error('Original store not found');

        // 1. Create new store record
        const clone = await this.createStore({
            title: `${original.title} (Copy)`,
            defaultLocale: original.defaultLocale,
            defaultCurrency: original.defaultCurrency,
            brandingJson: original.brandingJson,
            parentStoreId: original.parentStoreId,
            isMaster: false // Clones are not masters by default
        }, tx);

        // 2. Clone data entities
        const rawEntities = await this.dataEntityRepo.listAllByStore(id, tx);
        for (const raw of rawEntities) {
            const payload = JSON.parse(raw.payloadJson);
            await this.dataEntityRepo.create(clone.id, raw.entityType, payload, tx);
        }

        return clone;
    }
}
