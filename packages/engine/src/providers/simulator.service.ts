import { StoreLogic } from '../core/store-logic.js';
import { SchemaService } from '../core/schema-service.js';
import { IThemeFileProvider } from '../infra/theme-file-provider.interface.js';

export class SimulatorService {
    constructor(
        private storeLogic: StoreLogic,
        private schemaService: SchemaService,
        private themeFileProvider: IThemeFileProvider
    ) { }

    private wrapResponse(data: any, status = 200) {
        const count = Array.isArray(data) ? data.length : 1;
        return {
            status,
            success: true,
            data: data,
            pagination: {
                count: count,
                total: count,
                perPage: 20,
                currentPage: 1,
                totalPages: Math.ceil(count / 20),
                links: {}
            },
            metadata: {
                timestamp: Math.floor(Date.now() / 1000),
                source: 'VTDR Simulator'
            }
        };
    }

    private mapToSchema(data: any, schemaName: string) {
        const schema = this.schemaService.getModelSchema(schemaName);
        if (!schema) return data;

        const mapItem = (item: any) => {
            const result = { ...schema, ...item };
            // Ensure ID is preserved
            if (item.id) result.id = item.id;
            return result;
        };

        return Array.isArray(data) ? data.map(mapItem) : mapItem(data);
    }

    private generateEntityId(prefix: string) {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }

    private normalizeEntityPayload(data: any, key: string) {
        return {
            ...(data || {}),
            id: key
        };
    }

    public async getProducts(storeId: string) {
        const products = await this.storeLogic.getDataEntities(storeId, 'product');
        return this.wrapResponse(this.mapToSchema(products, 'product'));
    }

    public async getProduct(storeId: string, productId: string) {
        const products = await this.storeLogic.getDataEntities(storeId, 'product');
        const product = products.find((p: any) => p.id == productId);
        if (!product) return null;
        return this.wrapResponse(this.mapToSchema(product, 'product'));
    }

    public async createProduct(storeId: string, data: any) {
        const key = String(data?.id ?? this.generateEntityId('product'));
        const payload = this.normalizeEntityPayload(data, key);
        await this.storeLogic.upsertDataEntity(storeId, 'product', key, payload);
        return this.wrapResponse(this.mapToSchema(payload, 'product'), 201);
    }

    public async updateProduct(storeId: string, productId: string, data: any) {
        const current = await this.storeLogic.getDataEntity(storeId, 'product', productId);
        const payload = this.normalizeEntityPayload({ ...(current || {}), ...(data || {}) }, productId);
        await this.storeLogic.upsertDataEntity(storeId, 'product', productId, payload);
        return this.wrapResponse(this.mapToSchema(payload, 'product'));
    }

    public async deleteProduct(storeId: string, productId: string) {
        await this.storeLogic.deleteDataEntity(storeId, 'product', productId);
        return { status: 200, success: true, data: { id: productId, deleted: true } };
    }

    public async getCategories(storeId: string) {
        const categories = await this.storeLogic.getDataEntities(storeId, 'category');
        return this.wrapResponse(this.mapToSchema(categories, 'category'));
    }

    public async getCategory(storeId: string, categoryId: string) {
        const categories = await this.storeLogic.getDataEntities(storeId, 'category');
        const category = categories.find((c: any) => c.id == categoryId);
        if (!category) return null;
        return this.wrapResponse(this.mapToSchema(category, 'category'));
    }

    public async createCategory(storeId: string, data: any) {
        const key = String(data?.id ?? this.generateEntityId('category'));
        const payload = this.normalizeEntityPayload(data, key);
        await this.storeLogic.upsertDataEntity(storeId, 'category', key, payload);
        return this.wrapResponse(this.mapToSchema(payload, 'category'), 201);
    }

    public async updateCategory(storeId: string, categoryId: string, data: any) {
        const current = await this.storeLogic.getDataEntity(storeId, 'category', categoryId);
        const payload = this.normalizeEntityPayload({ ...(current || {}), ...(data || {}) }, categoryId);
        await this.storeLogic.upsertDataEntity(storeId, 'category', categoryId, payload);
        return this.wrapResponse(this.mapToSchema(payload, 'category'));
    }

    public async deleteCategory(storeId: string, categoryId: string) {
        await this.storeLogic.deleteDataEntity(storeId, 'category', categoryId);
        return { status: 200, success: true, data: { id: categoryId, deleted: true } };
    }

    public async getMenus(storeId: string, type: string) {
        // Return a mock menu structure that Salla themes expect
        const menus = [
            { id: 1, title: 'الرئيسية', url: '/', order: 1, type: 'link' },
            { id: 2, title: 'المنتجات', url: '/products', order: 2, type: 'link' },
            { id: 3, title: 'من نحن', url: '/about-us', order: 3, type: 'link' }
        ];
        return this.wrapResponse(this.mapToSchema(menus, 'storeBlock')); // Basic block mapping
    }

    public async getStaticPages(storeId: string) {
        const pages = await this.storeLogic.getDataEntities(storeId, 'page');
        return this.wrapResponse(this.mapToSchema(pages, 'page'));
    }

    public async createStaticPage(storeId: string, data: any) {
        const key = String(data?.id ?? data?.slug ?? this.generateEntityId('page'));
        const payload = this.normalizeEntityPayload(data, key);
        await this.storeLogic.upsertDataEntity(storeId, 'page', key, payload);
        return this.wrapResponse(this.mapToSchema(payload, 'page'), 201);
    }

    public async updateStaticPage(storeId: string, pageId: string, data: any) {
        const current = await this.storeLogic.getDataEntity(storeId, 'page', pageId);
        const payload = this.normalizeEntityPayload({ ...(current || {}), ...(data || {}) }, pageId);
        await this.storeLogic.upsertDataEntity(storeId, 'page', pageId, payload);
        return this.wrapResponse(this.mapToSchema(payload, 'page'));
    }

    public async deleteStaticPage(storeId: string, pageId: string) {
        await this.storeLogic.deleteDataEntity(storeId, 'page', pageId);
        return { status: 200, success: true, data: { id: pageId, deleted: true } };
    }

    public async getThemeSettings(storeId: string) {
        const store = await this.storeLogic.getStore(storeId);
        if (!store) {
            return null;
        }

        let settings = [];
        try {
            const themeId = store.themeId;
            if (themeId) {
                const schema = await this.themeFileProvider.getThemeSettings(themeId);
                if (schema) {
                    settings = schema.settings || [];
                }
            }
        } catch (e) {
            console.error('[SIMULATOR] Failed to load dynamic theme settings via provider:', e);
            // Dynamic fallback
            settings = [
                { id: 'primary_color', label: 'Primary Color', type: 'color', value: '#3b82f6' },
                { id: 'footer_text', label: 'Footer Text', type: 'string', value: 'Powered by VTDR' }
            ];
        }

        const savedValues = await this.storeLogic.getThemeSettings(storeId);

        return this.wrapResponse({
            settings,
            values: savedValues
        });
    }

    public async updateThemeSettings(storeId: string, values: any) {
        await this.storeLogic.updateThemeSettings(storeId, values || {});
        return { status: 200, success: true, message: 'Settings saved' };
    }
}
