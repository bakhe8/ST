import { TwilightSchema, ComponentInstance, Store, RuntimeContext, IStoreRepository } from '@vtdr/contracts';
import { StoreFactory } from './store-factory.js';
import { ThemeRegistry } from '../rendering/theme-registry.js';
import { ContentManager } from './content-manager.js';
import { StoreLogic } from './store-logic.js';
import { HookService } from '../webhooks/hook-service.js';
import { LocalizationService } from './localization-service.js';

const sdkInitScript = `
<script>
    window.vtdr_context = {
        bridge: true
    };
</script>
`;

export class CompositionEngine {
    constructor(
        private storeRepo: IStoreRepository,
        private themeRegistry: ThemeRegistry,
        private contentManager: ContentManager,
        private simulationLogic: StoreLogic,
        private hookService: HookService,
        private localizationService: LocalizationService
    ) { }

    private parseJsonObject(value: any): Record<string, any> {
        if (!value) return {};
        try {
            const parsed = JSON.parse(value);
            return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
        } catch {
            return {};
        }
    }

    /**
     * Merges Theme Files + Store State to produce the final Runtime Context
     */
    public async buildContext(storeId: string, pageId?: string): Promise<RuntimeContext | null> {
        // 1. Fetch Store with expanded relations
        const store = await this.storeRepo.getById(storeId);
        if (!store) return null;

        // 2. Resolve Theme Files
        const theme = await this.themeRegistry.getTheme(store.themeId);
        if (!theme) return null;

        const version = theme.versions.find((v: any) => v.id === store.themeVersionId) || theme.versions[0];
        const schema: TwilightSchema = version ? JSON.parse(version.contractJson) : { name: theme.nameAr || 'Unknown', version: '1.0.0' };

        // 3. Fetch Rich Data Entities
        const products = await this.simulationLogic.getDataEntities(storeId, 'product');
        const categories = await this.simulationLogic.getDataEntities(storeId, 'category');
        const brands = await this.simulationLogic.getDataEntities(storeId, 'brand');
        const storeEntities = await this.simulationLogic.getDataEntities(storeId, 'store');
        const orders = await this.simulationLogic.getDataEntities(storeId, 'order');
        const exportEntities = await this.simulationLogic.getDataEntities(storeId, 'export');
        const optionTemplates = await this.simulationLogic.getDataEntities(storeId, 'optionTemplate');
        const specialOffers = await this.simulationLogic.getDataEntities(storeId, 'specialOffer');
        const affiliates = await this.simulationLogic.getDataEntities(storeId, 'affiliate');
        const coupons = await this.simulationLogic.getDataEntities(storeId, 'coupon');
        const loyaltyData = await this.simulationLogic.getDataEntities(storeId, 'loyalty');
        const storeData = storeEntities[0] || {};

        // 4. Construct Final Salla-Standard Context
        const activePageId = pageId || store.activePage || 'home';
        const storeSettings = this.parseJsonObject(store.settingsJson);
        const themeSettings = this.parseJsonObject((store as any).themeSettingsJson);
        const effectiveSettings = this.mergeSettings(schema.settings, {
            ...storeSettings,
            ...themeSettings
        });

        const context: RuntimeContext = {
            storeId: storeId,
            theme: {
                id: theme.id,
                name: theme.nameAr || 'Unknown',
                version: version?.version || '1.0.0',
                author: theme.authorEmail || 'Salla'
            },
            hooks: {
                ...this.hookService.getAll(),
                'body:end': ((this.hookService.resolve('body:end') || '') + sdkInitScript)
            },
            store: {
                id: store.id,
                name: storeData.name || store.title,
                entity: storeData.entity,
                email: storeData.email,
                avatar: storeData.avatar,
                plan: storeData.plan,
                type: storeData.type,
                status: storeData.status,
                verified: storeData.verified,
                domain: storeData.domain,
                description: storeData.description || storeData.description,
                locale: store.defaultLocale || 'ar-SA',
                currency: storeData.currency || store.defaultCurrency || 'SAR',
                branding: JSON.parse((store as any).brandingJson || '{}'),
                social: storeData.social,
                licenses: storeData.licenses,
                branches: storeData.branches,
                taxes: storeData.taxes,
                shipping: storeData.shipping,
                currencies: storeData.currencies,
                languages: storeData.languages,
                settings: storeSettings,
                themeId: store.themeId,
                themeVersionId: store.themeVersionId
            },
            page: {
                id: activePageId,
                components: this.resolveComponents(schema, (store as any).componentStates || [])
            },
            settings: effectiveSettings,
            translations: LocalizationService.flatten(storeData.translations || {}),

            // Rich Data Injections
            products: products,
            categories: categories,
            brands: brands,
            orders: orders,
            exports: exportEntities,
            optionTemplates: optionTemplates,
            specialOffers: specialOffers,
            affiliates: affiliates,
            coupons: coupons,
            loyalty: loyaltyData[0] || undefined
        };

        return context;
    }

    private mergeSettings(schemaSettings: any, userSettings: any): Record<string, any> {
        const merged = { ...userSettings };
        if (Array.isArray(schemaSettings)) {
            schemaSettings.forEach(s => {
                const key = s?.id || s?.name;
                if (key && merged[key] === undefined) {
                    merged[key] = s?.value;
                }
            });
        }
        return merged;
    }

    private resolveComponents(
        schema: TwilightSchema,
        componentStates: any[]
    ): ComponentInstance[] {
        return componentStates.map(state => ({
            id: state.id,
            componentKey: state.componentPath,
            path: state.componentPath,
            title: state.componentPath.split('/').pop() || 'Component',
            settings: JSON.parse(state.settingsJson || '{}'),
            order: state.instanceOrder,
            isVisible: true
        }));
    }
}
