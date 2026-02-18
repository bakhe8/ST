import { StoreLogic } from '../core/store-logic.js';
import { SchemaService } from '../core/schema-service.js';
import { IThemeFileProvider } from '../infra/theme-file-provider.interface.js';

export class SimulatorService {
    private readonly defaultProductPlaceholder = '/themes/theme-raed-master/public/images/placeholder.png';

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

    private normalizePriceValue(value: any, fallbackCurrency = 'SAR') {
        if (value && typeof value === 'object') {
            const amount = this.toNumber(value.amount, this.toNumber(value.value, 0));
            const currency = String(value.currency || fallbackCurrency);
            return { amount, currency };
        }
        if (typeof value === 'number' || typeof value === 'string') {
            return { amount: this.toNumber(value, 0), currency: fallbackCurrency };
        }
        return { amount: 0, currency: fallbackCurrency };
    }

    private sanitizeImageUrl(url: any) {
        if (typeof url !== 'string') return '';
        const normalized = url.trim();
        if (!normalized) return '';

        if (/^(https?:)?\/\/via\.placeholder\.com/i.test(normalized)) {
            return this.defaultProductPlaceholder;
        }

        return normalized;
    }

    private normalizeProductImages(data: any) {
        const directImages = Array.isArray(data?.images) ? data.images : [];
        const normalizedFromArray = directImages
            .filter((img: any) => img && (typeof img === 'string' || img.url))
            .map((img: any, index: number) => {
                if (typeof img === 'string') {
                    const url = this.sanitizeImageUrl(img);
                    return {
                        id: this.generateEntityId('img'),
                        url,
                        alt: `Image ${index + 1}`,
                        is_default: index === 0
                    };
                }
                const url = this.sanitizeImageUrl(img.url);
                return {
                    id: String(img.id || this.generateEntityId('img')),
                    url,
                    alt: String(img.alt || `Image ${index + 1}`),
                    is_default: Boolean(img.is_default ?? index === 0)
                };
            })
            .filter((img: any) => img.url);

        if (normalizedFromArray.length > 0) {
            const main = normalizedFromArray.find((img: any) => img.is_default) || normalizedFromArray[0];
            return {
                images: normalizedFromArray,
                main_image: main?.url || normalizedFromArray[0]?.url,
                thumbnail: normalizedFromArray[0]?.url
            };
        }

        const candidate = this.sanitizeImageUrl(data?.main_image || data?.image?.url || data?.thumbnail);
        if (!candidate) {
            return {
                images: [],
                main_image: undefined,
                thumbnail: undefined
            };
        }

        const single = {
            id: this.generateEntityId('img'),
            url: String(candidate),
            alt: 'Main',
            is_default: true
        };
        return {
            images: [single],
            main_image: single.url,
            thumbnail: single.url
        };
    }

    private normalizeProductOptions(data: any) {
        const options = Array.isArray(data?.options) ? data.options : [];
        return options.map((option: any) => ({
            id: String(option?.id || this.generateEntityId('opt')),
            name: String(option?.name || option?.title || 'Option'),
            type: String(option?.type || 'select'),
            values: Array.isArray(option?.values)
                ? option.values.map((value: any) => ({
                    id: String(value?.id || this.generateEntityId('opt_val')),
                    name: String(value?.name || value?.label || 'Value'),
                    price: this.toNumber(value?.price, 0),
                    is_default: Boolean(value?.is_default),
                    color: value?.color ? String(value.color) : undefined
                }))
                : []
        }));
    }

    private normalizeProductVariants(data: any) {
        const variants = Array.isArray(data?.variants) ? data.variants : [];
        return variants.map((variant: any) => {
            const price = this.normalizePriceValue(variant?.price ?? data?.price);
            return {
                id: String(variant?.id || this.generateEntityId('variant')),
                sku: variant?.sku ? String(variant.sku) : undefined,
                quantity: this.normalizeQuantity(variant?.quantity ?? variant?.stock ?? 0, 0),
                is_available: variant?.is_available !== false,
                price,
                options: Array.isArray(variant?.options) ? variant.options : []
            };
        });
    }

    private async normalizeProductCategories(storeId: string, categoriesInput: any) {
        const refs = Array.isArray(categoriesInput) ? categoriesInput : [];
        const ids = new Set<string>();
        const fallbackById = new Map<string, any>();

        for (const ref of refs) {
            if (typeof ref === 'string' || typeof ref === 'number') {
                ids.add(String(ref));
                continue;
            }
            if (ref && typeof ref === 'object' && ref.id != null) {
                const id = String(ref.id);
                ids.add(id);
                fallbackById.set(id, { ...ref, id });
            }
        }

        const allCategories = await this.storeLogic.getDataEntities(storeId, 'category');
        const categoryById = new Map<string, any>();
        (allCategories || []).forEach((category: any) => {
            if (category?.id != null) {
                categoryById.set(String(category.id), category);
            }
        });

        const categoryIds = Array.from(ids);
        const categories = categoryIds.map((id) => {
            const fromStore = categoryById.get(id);
            if (fromStore) return fromStore;
            const fallback = fallbackById.get(id);
            if (fallback) return fallback;
            return { id, name: id };
        });

        return { category_ids: categoryIds, categories };
    }

    private async normalizeProductPayload(storeId: string, data: any, key: string) {
        const base = this.normalizeEntityPayload(data, key);
        const images = this.normalizeProductImages(base);
        const categoriesFromInput = base?.category_ids ?? base?.categories ?? [];
        const categories = await this.normalizeProductCategories(storeId, categoriesFromInput);
        const currency = String(base?.price?.currency || base?.sale_price?.currency || base?.regular_price?.currency || 'SAR');
        const price = this.normalizePriceValue(base?.price, currency);
        const regularPrice = this.normalizePriceValue(base?.regular_price || { amount: price.amount }, currency);
        const salePrice = this.normalizePriceValue(base?.sale_price || { amount: price.amount }, currency);

        return {
            ...base,
            ...images,
            ...categories,
            price,
            regular_price: regularPrice,
            sale_price: salePrice,
            options: this.normalizeProductOptions(base),
            variants: this.normalizeProductVariants(base)
        };
    }

    private normalizeCategoryPayload(data: any, key: string) {
        const base = this.normalizeEntityPayload(data, key);
        const rawParent = base?.parentId ?? base?.parent_id ?? '';
        const parentValue = String(rawParent || '').trim();
        const parent_id = parentValue && parentValue !== 'root' ? parentValue : null;

        return {
            ...base,
            id: key,
            parent_id,
            parentId: parent_id || '',
            order: Number.isFinite(Number(base?.order)) ? Number(base.order) : 0
        };
    }

    private normalizeQuantity(value: any, fallback = 1) {
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) return fallback;
        return Math.max(0, Math.floor(parsed));
    }

    private toNumber(value: any, fallback = 0) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    }

    private slugify(value: any, fallbackPrefix = 'item') {
        const text = String(value || '').trim();
        if (!text) return `${fallbackPrefix}-${Date.now()}`;
        const slug = text
            .toLowerCase()
            .replace(/[^a-z0-9\u0600-\u06ff]+/gi, '-')
            .replace(/^-+|-+$/g, '')
            .replace(/-+/g, '-');
        return slug || `${fallbackPrefix}-${Date.now()}`;
    }

    private pickLocalizedText(value: any) {
        if (value == null) return '';
        if (typeof value === 'string') return value;
        if (typeof value === 'object' && !Array.isArray(value)) {
            if (typeof value.ar === 'string' && value.ar.trim()) return value.ar;
            if (typeof value.en === 'string' && value.en.trim()) return value.en;
            const firstString = Object.values(value).find((entry) => typeof entry === 'string' && entry.trim());
            if (typeof firstString === 'string') return firstString;
        }
        return String(value);
    }

    private async getBlogCategoriesRaw(storeId: string) {
        const [primary, alt] = await Promise.all([
            this.storeLogic.getDataEntities(storeId, 'blog_category'),
            this.storeLogic.getDataEntities(storeId, 'blog_categories')
        ]);
        return [...(primary || []), ...(alt || [])];
    }

    private async getBlogArticlesRaw(storeId: string) {
        const [primary, alt] = await Promise.all([
            this.storeLogic.getDataEntities(storeId, 'blog_article'),
            this.storeLogic.getDataEntities(storeId, 'blog_articles')
        ]);
        return [...(primary || []), ...(alt || [])];
    }

    private normalizeBlogCategoryPayload(data: any, key: string) {
        const base = this.normalizeEntityPayload(data, key);
        const title = this.pickLocalizedText(base?.title || base?.name || key);
        const slug = this.slugify(base?.slug || title, 'blog-category');
        return {
            ...base,
            id: key,
            name: this.pickLocalizedText(base?.name || base?.title || slug),
            title,
            slug,
            description: this.pickLocalizedText(base?.description || ''),
            url: this.pickLocalizedText(base?.url || `/blog/categories/${slug}`),
            order: Number.isFinite(Number(base?.order)) ? Number(base.order) : 0
        };
    }

    private async normalizeBlogArticlePayload(storeId: string, data: any, key: string) {
        const base = this.normalizeEntityPayload(data, key);
        const title = this.pickLocalizedText(base?.title || base?.name || key);
        const slug = this.slugify(base?.slug || title, 'blog-article');
        const categoryId = String(
            base?.category_id ??
            base?.categoryId ??
            base?.category?.id ??
            ''
        ).trim();
        const categories = await this.getBlogCategoriesRaw(storeId);
        const matchedCategory = categories.find((entry: any) => String(entry?.id || '') === categoryId);

        return {
            ...base,
            id: key,
            name: this.pickLocalizedText(base?.name || base?.title || slug),
            title,
            slug,
            summary: this.pickLocalizedText(base?.summary || base?.excerpt || ''),
            description: this.pickLocalizedText(base?.description || base?.content || ''),
            image: this.sanitizeImageUrl(base?.image || base?.cover?.url) || this.defaultProductPlaceholder,
            url: this.pickLocalizedText(base?.url || `/blog/${slug}`),
            category_id: categoryId,
            category: matchedCategory
                ? {
                    id: String(matchedCategory.id),
                    name: this.pickLocalizedText(matchedCategory?.name || matchedCategory?.title || matchedCategory?.id)
                }
                : (base?.category && typeof base.category === 'object'
                    ? {
                        id: String(base.category.id || categoryId || ''),
                        name: this.pickLocalizedText(base.category.name || base.category.title || '')
                    }
                    : undefined),
            published_at: this.pickLocalizedText(base?.published_at || base?.created_at || new Date().toISOString()),
            is_published: base?.is_published !== false
        };
    }

    private extractItemSelectionIds(field: any): string[] {
        const source = field?.value ?? field?.selected ?? [];
        const raw = Array.isArray(source) ? source : [source];

        return Array.from(
            new Set(
                raw
                    .map((entry: any) => {
                        if (typeof entry === 'string' || typeof entry === 'number') {
                            return String(entry);
                        }
                        if (entry && typeof entry === 'object') {
                            if (entry.id != null) return String(entry.id);
                            if (entry.value != null) return String(entry.value);
                        }
                        return '';
                    })
                    .map((id) => id.trim())
                    .filter(Boolean)
            )
        );
    }

    private normalizeSourceKey(sourceKey: any) {
        return String(sourceKey || '').trim().toLowerCase();
    }

    private getSourceEntityKey(item: any, fallbackPrefix: string) {
        const candidate = item?.id ?? item?.slug ?? item?.key ?? item?.code ?? item?.name;
        const normalized = String(candidate || '').trim();
        return normalized || this.generateEntityId(fallbackPrefix);
    }

    private getSourceEntityUrl(sourceKey: string, item: any) {
        const source = this.normalizeSourceKey(sourceKey);
        const idOrSlug = String(item?.slug || item?.id || '').trim();

        if (source === 'products') return this.pickLocalizedText(item?.url || `/products/${idOrSlug || ''}`);
        if (source === 'categories') return this.pickLocalizedText(item?.url || `/categories/${idOrSlug || ''}`);
        if (source === 'brands') return this.pickLocalizedText(item?.url || `/brands/${idOrSlug || ''}`);
        if (source === 'pages') return this.pickLocalizedText(item?.url || `/pages/${idOrSlug || ''}`);
        if (source === 'blog_articles') return this.pickLocalizedText(item?.url || `/blog/${idOrSlug || ''}`);
        if (source === 'blog_categories') return this.pickLocalizedText(item?.url || `/blog/categories/${idOrSlug || ''}`);
        if (source === 'offers_link') return '/offers';
        if (source === 'brands_link') return '/brands';
        if (source === 'blog_link') return '/blog';
        return this.pickLocalizedText(item?.url || '');
    }

    private toVariableListOptions(sourceKey: string, items: any[]) {
        const source = this.normalizeSourceKey(sourceKey);
        const localItems = Array.isArray(items) ? items : [];

        if (source === 'offers_link') {
            return [{ value: 'offers_link', label: 'التخفيضات', url: '/offers' }];
        }
        if (source === 'brands_link') {
            return [{ value: 'brands_link', label: 'الماركات التجارية', url: '/brands' }];
        }
        if (source === 'blog_link') {
            return [{ value: 'blog_link', label: 'المدونة', url: '/blog' }];
        }
        if (source === 'custom') {
            return [];
        }

        return localItems
            .map((item: any) => {
                const id = this.getSourceEntityKey(item, source || 'entity');
                const url = this.getSourceEntityUrl(source, item);
                return {
                    value: id,
                    label: this.pickLocalizedText(item?.name || item?.title || item?.slug || id),
                    url: String(url || '')
                };
            })
            .filter((entry: any) => entry.value);
    }

    private normalizeVariableListField(field: any, sources: Record<string, any[]>) {
        const normalized = { ...(field || {}) };
        const entries = Array.isArray(normalized.sources)
            ? normalized.sources
                .map((entry: any) => {
                    const value = this.normalizeSourceKey(entry?.value ?? entry?.key);
                    if (!value) return null;
                    return {
                        ...entry,
                        key: String(entry?.key || value),
                        value
                    };
                })
                .filter(Boolean)
            : [];

        const optionsBySource: Record<string, Array<{ value: string; label: string; url: string }>> = {};
        (entries as any[]).forEach((entry: any) => {
            const value = this.normalizeSourceKey(entry?.value);
            optionsBySource[value] = this.toVariableListOptions(value, sources[value] || []);
        });

        normalized.variableSources = entries;
        normalized.variableOptions = optionsBySource;
        return normalized;
    }

    private toSelectableOptions(items: any[]) {
        return (items || [])
            .map((item: any) => {
                const id = item?.id != null ? String(item.id) : '';
                if (!id) return null;
                return {
                    value: id,
                    label: this.pickLocalizedText(item?.name || item?.title || id)
                };
            })
            .filter(Boolean) as Array<{ value: string; label: string }>;
    }

    private normalizeThemeComponentField(field: any, sources: Record<string, any[]>) {
        const normalized = { ...(field || {}) };

        if (normalized?.type === 'collection' && Array.isArray(normalized?.fields)) {
            normalized.fields = normalized.fields.map((subField: any) =>
                this.normalizeThemeComponentField(subField, sources)
            );
            return normalized;
        }

        const isVariableListField =
            String(normalized?.format || '') === 'variable-list' &&
            normalized?.type === 'items';

        if (isVariableListField) {
            return this.normalizeVariableListField(normalized, sources);
        }

        const isSourceItemsField =
            normalized?.type === 'items' && String(normalized?.format || '') === 'dropdown-list';

        if (!isSourceItemsField) {
            return normalized;
        }

        const sourceKey = String(normalized?.source || '').toLowerCase();
        const sourceItems = sources[sourceKey] || [];
        const options = this.toSelectableOptions(sourceItems);
        const selectedIds = this.extractItemSelectionIds(normalized);
        const labelByValue = new Map(options.map((opt) => [opt.value, opt.label]));

        normalized.options = options;
        normalized.selected = selectedIds.map((id) => ({
            value: id,
            label: labelByValue.get(id) || id
        }));

        return normalized;
    }

    private computeCartSummary(items: any[]) {
        const normalized = (items || []).map((item) => {
            const quantity = this.normalizeQuantity(item.quantity, 1);
            const unitPrice =
                this.toNumber(item.price) ||
                this.toNumber(item.unit_price) ||
                this.toNumber(item.sale_price?.amount) ||
                this.toNumber(item.regular_price?.amount);
            const total = unitPrice * quantity;
            return {
                ...item,
                quantity,
                unit_price: unitPrice,
                total
            };
        });

        const itemsCount = normalized.reduce((acc, item) => acc + item.quantity, 0);
        const subtotal = normalized.reduce((acc, item) => acc + item.total, 0);

        return {
            items: normalized,
            totals: {
                items_count: itemsCount,
                subtotal
            }
        };
    }

    private async getOrCreateCart(storeId: string) {
        const current = await this.storeLogic.getDataEntity(storeId, 'cart', 'default');
        if (current && typeof current === 'object') {
            const items = Array.isArray(current.items) ? current.items : [];
            return this.computeCartSummary(items);
        }

        const emptyCart = this.computeCartSummary([]);
        await this.storeLogic.upsertDataEntity(storeId, 'cart', 'default', {
            id: 'default',
            ...emptyCart
        });
        return emptyCart;
    }

    public async getCart(storeId: string) {
        const cart = await this.getOrCreateCart(storeId);
        return this.wrapResponse({
            id: 'default',
            ...cart
        });
    }

    public async addCartItem(storeId: string, data: any) {
        const cart = await this.getOrCreateCart(storeId);
        const candidateId =
            data?.id ||
            data?.item_id ||
            data?.product_id ||
            data?.product?.id ||
            this.generateEntityId('cart_item');
        const itemId = String(candidateId);
        const quantityToAdd = this.normalizeQuantity(data?.quantity, 1) || 1;

        const existingIndex = cart.items.findIndex((item: any) => String(item.id) === itemId);
        let updatedItems = [...cart.items];

        if (existingIndex >= 0) {
            const existing = updatedItems[existingIndex];
            updatedItems[existingIndex] = {
                ...existing,
                ...data,
                id: itemId,
                quantity: this.normalizeQuantity(existing.quantity, 0) + quantityToAdd
            };
        } else {
            updatedItems.push({
                ...(data || {}),
                id: itemId,
                quantity: quantityToAdd
            });
        }

        const updated = this.computeCartSummary(updatedItems);
        const payload = { id: 'default', ...updated };
        await this.storeLogic.upsertDataEntity(storeId, 'cart', 'default', payload);

        return this.wrapResponse(payload, 201);
    }

    public async updateCartItem(storeId: string, itemId: string, data: any) {
        const cart = await this.getOrCreateCart(storeId);
        const index = cart.items.findIndex((item: any) => String(item.id) === String(itemId));
        if (index < 0) return null;

        const requestedQuantity = this.normalizeQuantity(data?.quantity, 1);
        let updatedItems = [...cart.items];

        if (requestedQuantity <= 0) {
            updatedItems = updatedItems.filter((item: any) => String(item.id) !== String(itemId));
        } else {
            updatedItems[index] = {
                ...updatedItems[index],
                ...(data || {}),
                id: itemId,
                quantity: requestedQuantity
            };
        }

        const updated = this.computeCartSummary(updatedItems);
        const payload = { id: 'default', ...updated };
        await this.storeLogic.upsertDataEntity(storeId, 'cart', 'default', payload);

        return this.wrapResponse(payload);
    }

    public async deleteCartItem(storeId: string, itemId: string) {
        const cart = await this.getOrCreateCart(storeId);
        const index = cart.items.findIndex((item: any) => String(item.id) === String(itemId));
        if (index < 0) return null;

        const updatedItems = cart.items.filter((item: any) => String(item.id) !== String(itemId));
        const updated = this.computeCartSummary(updatedItems);
        const payload = { id: 'default', ...updated };
        await this.storeLogic.upsertDataEntity(storeId, 'cart', 'default', payload);

        return this.wrapResponse(payload);
    }

    public async getProducts(storeId: string) {
        const products = await this.storeLogic.getDataEntities(storeId, 'product');
        const normalized = await Promise.all(
            (products || []).map((product: any) =>
                this.normalizeProductPayload(storeId, product, String(product?.id || this.generateEntityId('product')))
            )
        );
        return this.wrapResponse(this.mapToSchema(normalized, 'product'));
    }

    public async getProduct(storeId: string, productId: string) {
        const products = await this.storeLogic.getDataEntities(storeId, 'product');
        const product = products.find((p: any) => p.id == productId);
        if (!product) return null;
        const normalized = await this.normalizeProductPayload(storeId, product, String(product.id));
        return this.wrapResponse(this.mapToSchema(normalized, 'product'));
    }

    public async createProduct(storeId: string, data: any) {
        const key = String(data?.id ?? this.generateEntityId('product'));
        const payload = await this.normalizeProductPayload(storeId, data, key);
        await this.storeLogic.upsertDataEntity(storeId, 'product', key, payload);
        return this.wrapResponse(this.mapToSchema(payload, 'product'), 201);
    }

    public async updateProduct(storeId: string, productId: string, data: any) {
        const current = await this.storeLogic.getDataEntity(storeId, 'product', productId);
        const payload = await this.normalizeProductPayload(storeId, { ...(current || {}), ...(data || {}) }, productId);
        await this.storeLogic.upsertDataEntity(storeId, 'product', productId, payload);
        return this.wrapResponse(this.mapToSchema(payload, 'product'));
    }

    public async deleteProduct(storeId: string, productId: string) {
        await this.storeLogic.deleteDataEntity(storeId, 'product', productId);
        return { status: 200, success: true, data: { id: productId, deleted: true } };
    }

    public async getCategories(storeId: string) {
        const categories = await this.storeLogic.getDataEntities(storeId, 'category');
        const normalized = (categories || []).map((category: any) =>
            this.normalizeCategoryPayload(category, String(category?.id || this.generateEntityId('category')))
        );
        return this.wrapResponse(this.mapToSchema(normalized, 'category'));
    }

    public async getCategory(storeId: string, categoryId: string) {
        const categories = await this.storeLogic.getDataEntities(storeId, 'category');
        const category = categories.find((c: any) => c.id == categoryId);
        if (!category) return null;
        const normalized = this.normalizeCategoryPayload(category, String(category.id));
        return this.wrapResponse(this.mapToSchema(normalized, 'category'));
    }

    public async createCategory(storeId: string, data: any) {
        const key = String(data?.id ?? this.generateEntityId('category'));
        const payload = this.normalizeCategoryPayload(data, key);
        await this.storeLogic.upsertDataEntity(storeId, 'category', key, payload);
        return this.wrapResponse(this.mapToSchema(payload, 'category'), 201);
    }

    public async updateCategory(storeId: string, categoryId: string, data: any) {
        const current = await this.storeLogic.getDataEntity(storeId, 'category', categoryId);
        const payload = this.normalizeCategoryPayload({ ...(current || {}), ...(data || {}) }, categoryId);
        await this.storeLogic.upsertDataEntity(storeId, 'category', categoryId, payload);
        return this.wrapResponse(this.mapToSchema(payload, 'category'));
    }

    public async deleteCategory(storeId: string, categoryId: string) {
        const deletedCategoryId = String(categoryId);

        const categories = await this.storeLogic.getDataEntities(storeId, 'category');
        const childCategories = (categories || []).filter((category: any) => {
            const parentValue = String(category?.parent_id ?? category?.parentId ?? '').trim();
            return parentValue === deletedCategoryId;
        });

        let reparentedCategories = 0;
        for (const childCategory of childCategories) {
            const childId = String(childCategory.id);
            const payload = this.normalizeCategoryPayload(
                { ...childCategory, parent_id: null, parentId: '' },
                childId
            );
            await this.storeLogic.upsertDataEntity(storeId, 'category', childId, payload);
            reparentedCategories++;
        }

        const products = await this.storeLogic.getDataEntities(storeId, 'product');
        let updatedProducts = 0;
        for (const product of products || []) {
            const productId = String(product?.id || this.generateEntityId('product'));
            const normalized = await this.normalizeProductPayload(storeId, product, productId);
            const filteredCategoryIds = (normalized.category_ids || []).filter(
                (id: string) => String(id) !== deletedCategoryId
            );
            if (filteredCategoryIds.length === (normalized.category_ids || []).length) {
                continue;
            }

            const payload = await this.normalizeProductPayload(
                storeId,
                {
                    ...normalized,
                    category_ids: filteredCategoryIds,
                    categories: filteredCategoryIds.map((id: string) => ({ id }))
                },
                productId
            );
            await this.storeLogic.upsertDataEntity(storeId, 'product', productId, payload);
            updatedProducts++;
        }

        await this.storeLogic.deleteDataEntity(storeId, 'category', categoryId);
        return {
            status: 200,
            success: true,
            data: {
                id: categoryId,
                deleted: true,
                updatedProducts,
                reparentedCategories
            }
        };
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

    public async getBlogCategories(storeId: string) {
        const categories = await this.getBlogCategoriesRaw(storeId);
        const normalized = categories.map((category: any) =>
            this.normalizeBlogCategoryPayload(category, String(category?.id || this.generateEntityId('blog_category')))
        );
        return this.wrapResponse(normalized);
    }

    public async getBlogCategory(storeId: string, categoryId: string) {
        const categories = await this.getBlogCategoriesRaw(storeId);
        const category = categories.find((entry: any) => String(entry?.id || '') === String(categoryId));
        if (!category) return null;
        return this.wrapResponse(
            this.normalizeBlogCategoryPayload(category, String(category.id))
        );
    }

    public async createBlogCategory(storeId: string, data: any) {
        const key = String(data?.id ?? this.generateEntityId('blog_category'));
        const payload = this.normalizeBlogCategoryPayload(data, key);
        await this.storeLogic.upsertDataEntity(storeId, 'blog_category', key, payload);
        return this.wrapResponse(payload, 201);
    }

    public async updateBlogCategory(storeId: string, categoryId: string, data: any) {
        const current = await this.storeLogic.getDataEntity(storeId, 'blog_category', categoryId);
        const payload = this.normalizeBlogCategoryPayload({ ...(current || {}), ...(data || {}) }, categoryId);
        await this.storeLogic.upsertDataEntity(storeId, 'blog_category', categoryId, payload);
        return this.wrapResponse(payload);
    }

    public async deleteBlogCategory(storeId: string, categoryId: string) {
        const id = String(categoryId);
        await this.storeLogic.deleteDataEntity(storeId, 'blog_category', id);
        await this.storeLogic.deleteDataEntity(storeId, 'blog_categories', id);

        const articles = await this.getBlogArticlesRaw(storeId);
        let touchedArticles = 0;
        for (const article of articles) {
            const articleId = String(article?.id || this.generateEntityId('blog_article'));
            const payload = await this.normalizeBlogArticlePayload(
                storeId,
                {
                    ...article,
                    category_id: String(article?.category_id || article?.categoryId || '') === id ? '' : (article?.category_id || article?.categoryId || ''),
                    category: String(article?.category?.id || '') === id ? undefined : article?.category
                },
                articleId
            );
            await this.storeLogic.upsertDataEntity(storeId, 'blog_article', articleId, payload);
            touchedArticles++;
        }

        return {
            status: 200,
            success: true,
            data: {
                id,
                deleted: true,
                updatedArticles: touchedArticles
            }
        };
    }

    public async getBlogArticles(storeId: string) {
        const articles = await this.getBlogArticlesRaw(storeId);
        const normalized = await Promise.all(
            (articles || []).map((article: any) =>
                this.normalizeBlogArticlePayload(storeId, article, String(article?.id || this.generateEntityId('blog_article')))
            )
        );
        return this.wrapResponse(normalized);
    }

    public async getBlogArticle(storeId: string, articleId: string) {
        const articles = await this.getBlogArticlesRaw(storeId);
        const article = articles.find((entry: any) => String(entry?.id || '') === String(articleId));
        if (!article) return null;
        const normalized = await this.normalizeBlogArticlePayload(storeId, article, String(article.id));
        return this.wrapResponse(normalized);
    }

    public async createBlogArticle(storeId: string, data: any) {
        const key = String(data?.id ?? this.generateEntityId('blog_article'));
        const payload = await this.normalizeBlogArticlePayload(storeId, data, key);
        await this.storeLogic.upsertDataEntity(storeId, 'blog_article', key, payload);
        return this.wrapResponse(payload, 201);
    }

    public async updateBlogArticle(storeId: string, articleId: string, data: any) {
        const current = await this.storeLogic.getDataEntity(storeId, 'blog_article', articleId);
        const payload = await this.normalizeBlogArticlePayload(storeId, { ...(current || {}), ...(data || {}) }, articleId);
        await this.storeLogic.upsertDataEntity(storeId, 'blog_article', articleId, payload);
        return this.wrapResponse(payload);
    }

    public async deleteBlogArticle(storeId: string, articleId: string) {
        const id = String(articleId);
        await this.storeLogic.deleteDataEntity(storeId, 'blog_article', id);
        await this.storeLogic.deleteDataEntity(storeId, 'blog_articles', id);
        return { status: 200, success: true, data: { id, deleted: true } };
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

    public async getThemeComponents(storeId: string) {
        const store = await this.storeLogic.getStore(storeId);
        if (!store) return null;

        let components = [];
        try {
            if (store.themeId) {
                const schema = await this.themeFileProvider.getThemeSettings(store.themeId);
                if (schema) {
                    const [
                        productsRaw,
                        categoriesRaw,
                        brandsRaw,
                        pagesRaw,
                        blogArticlesRaw,
                        blogArticlesAltRaw,
                        blogCategoriesRaw,
                        blogCategoriesAltRaw
                    ] = await Promise.all([
                        this.storeLogic.getDataEntities(storeId, 'product'),
                        this.storeLogic.getDataEntities(storeId, 'category'),
                        this.storeLogic.getDataEntities(storeId, 'brand'),
                        this.storeLogic.getDataEntities(storeId, 'page'),
                        this.storeLogic.getDataEntities(storeId, 'blog_article'),
                        this.storeLogic.getDataEntities(storeId, 'blog_articles'),
                        this.storeLogic.getDataEntities(storeId, 'blog_category'),
                        this.storeLogic.getDataEntities(storeId, 'blog_categories')
                    ]);

                    const products = await Promise.all(
                        (productsRaw || []).map((product: any) =>
                            this.normalizeProductPayload(
                                storeId,
                                product,
                                String(product?.id || this.generateEntityId('product'))
                            )
                        )
                    );
                    const categories = (categoriesRaw || []).map((category: any) =>
                        this.normalizeCategoryPayload(
                            category,
                            String(category?.id || this.generateEntityId('category'))
                        )
                    );
                    const brands = (brandsRaw || []).map((brand: any) => ({
                        ...(brand || {}),
                        id: String(brand?.id || this.generateEntityId('brand')),
                        name: this.pickLocalizedText(brand?.name || brand?.title || brand?.id || 'Brand'),
                        logo: this.sanitizeImageUrl(brand?.logo) || this.defaultProductPlaceholder
                    }));
                    const pages = (pagesRaw || []).map((page: any) => {
                        const id = this.getSourceEntityKey(page, 'page');
                        const slug = String(page?.slug || id);
                        return {
                            ...(page || {}),
                            id,
                            slug,
                            name: this.pickLocalizedText(page?.name || page?.title || slug),
                            title: this.pickLocalizedText(page?.title || page?.name || slug),
                            url: this.pickLocalizedText(page?.url || `/pages/${slug}`)
                        };
                    });

                    const blogArticles = [...(blogArticlesRaw || []), ...(blogArticlesAltRaw || [])].map((article: any) => {
                        const id = this.getSourceEntityKey(article, 'blog_article');
                        const slug = String(article?.slug || id);
                        return {
                            ...(article || {}),
                            id,
                            slug,
                            name: this.pickLocalizedText(article?.name || article?.title || slug),
                            title: this.pickLocalizedText(article?.title || article?.name || slug),
                            url: this.pickLocalizedText(article?.url || `/blog/${slug}`)
                        };
                    });

                    const blogCategories = [...(blogCategoriesRaw || []), ...(blogCategoriesAltRaw || [])].map((category: any) => {
                        const id = this.getSourceEntityKey(category, 'blog_category');
                        const slug = String(category?.slug || id);
                        return {
                            ...(category || {}),
                            id,
                            slug,
                            name: this.pickLocalizedText(category?.name || category?.title || slug),
                            title: this.pickLocalizedText(category?.title || category?.name || slug),
                            url: this.pickLocalizedText(category?.url || `/blog/categories/${slug}`)
                        };
                    });

                    const sources = {
                        products,
                        categories,
                        brands,
                        pages,
                        blog_articles: blogArticles,
                        blog_categories: blogCategories,
                        offers_link: [{ id: 'offers_link', name: 'التخفيضات', url: '/offers' }],
                        brands_link: [{ id: 'brands_link', name: 'الماركات التجارية', url: '/brands' }],
                        blog_link: [{ id: 'blog_link', name: 'المدونة', url: '/blog' }],
                        custom: []
                    };

                    components = (schema.components || []).map((component: any) => ({
                        ...(component || {}),
                        fields: (component?.fields || []).map((field: any) =>
                            this.normalizeThemeComponentField(field, sources)
                        )
                    }));
                }
            }
        } catch (e) {
            console.error('[SIMULATOR] Failed to load theme components via provider:', e);
        }

        return this.wrapResponse({
            components
        });
    }

    public async updateThemeSettings(storeId: string, values: any) {
        await this.storeLogic.updateThemeSettings(storeId, values || {});
        return { status: 200, success: true, message: 'Settings saved' };
    }
}
