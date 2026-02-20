import type { RuntimeContext } from '@vtdr/contracts';

type PreviewViewport = 'desktop' | 'mobile';

type ResolvedHomeComponent = {
    path: string;
    name: string;
    data: Record<string, any>;
};

export class HomeComponentsResolver {
    private normalizePageToken(value: any): string {
        return String(value || '')
            .trim()
            .toLowerCase()
            .replace(/\\/g, '/');
    }

    private pushUnique(target: string[], value: string) {
        const normalized = String(value || '').trim();
        if (!normalized) return;
        if (!target.includes(normalized)) target.push(normalized);
    }

    private resolveCompositionPageKeys(templatePageIdRaw: any): string[] {
        const templatePageId = this.normalizePageToken(templatePageIdRaw);
        const keys: string[] = [];

        switch (templatePageId) {
            case '':
            case 'index':
            case 'home':
                this.pushUnique(keys, 'home');
                break;
            case 'product/single':
            case 'product-single':
                this.pushUnique(keys, 'product-single');
                break;
            case 'product/index':
            case 'products':
            case 'product':
                this.pushUnique(keys, 'product-list');
                this.pushUnique(keys, 'category');
                break;
            case 'category/index':
            case 'categories':
            case 'category':
                this.pushUnique(keys, 'category');
                this.pushUnique(keys, 'product-list');
                break;
            case 'cart':
            case 'checkout':
                this.pushUnique(keys, 'cart');
                break;
            case 'customer/profile':
            case 'profile':
                this.pushUnique(keys, 'profile');
                break;
            case 'customer/orders/index':
            case 'orders':
            case 'orders-list':
                this.pushUnique(keys, 'orders-list');
                break;
            case 'customer/orders/single':
            case 'order-details':
                this.pushUnique(keys, 'order-details');
                this.pushUnique(keys, 'orders-list');
                break;
            case 'customer/wishlist':
            case 'wishlist':
                this.pushUnique(keys, 'wishlist');
                break;
            case 'customer/notifications':
            case 'notifications':
                this.pushUnique(keys, 'notifications');
                break;
            case 'blog/index':
            case 'blog':
            case 'blog-list':
                this.pushUnique(keys, 'blog-list');
                break;
            case 'blog/single':
            case 'blog-single':
                this.pushUnique(keys, 'blog-single');
                break;
            case 'brands/index':
            case 'brands':
            case 'brands-list':
                this.pushUnique(keys, 'brands-list');
                break;
            case 'brands/single':
            case 'brand-single':
                this.pushUnique(keys, 'brand-single');
                break;
            case 'thank-you':
                this.pushUnique(keys, 'thank-you');
                break;
            case 'landing-page':
                this.pushUnique(keys, 'landing-page');
                break;
            case 'page-single':
                this.pushUnique(keys, 'page-single');
                break;
            default: {
                if (!templatePageId.includes('/')) this.pushUnique(keys, templatePageId);
                break;
            }
        }

        if (keys.length === 0) this.pushUnique(keys, 'home');
        return keys;
    }

    private getPathRuleForPageKey(pageKeyRaw: string): { include: string[]; exclude: string[] } {
        const pageKey = this.normalizePageToken(pageKeyRaw);
        switch (pageKey) {
            case 'home':
                return { include: ['home'], exclude: [] };
            case 'product-single':
                return { include: ['product.single'], exclude: [] };
            case 'product-list':
                return { include: ['product'], exclude: ['product.single'] };
            case 'category':
                return { include: ['category'], exclude: [] };
            case 'cart':
                return { include: ['cart'], exclude: [] };
            case 'profile':
                return { include: ['customer.profile'], exclude: [] };
            case 'orders-list':
                return { include: ['customer.orders'], exclude: ['customer.orders.single'] };
            case 'order-details':
                return { include: ['customer.orders.single'], exclude: [] };
            case 'wishlist':
                return { include: ['customer.wishlist'], exclude: [] };
            case 'notifications':
                return { include: ['customer.notifications'], exclude: [] };
            case 'blog-list':
                return { include: ['blog'], exclude: ['blog.single'] };
            case 'blog-single':
                return { include: ['blog.single'], exclude: [] };
            case 'brands-list':
                return { include: ['brands'], exclude: ['brands.single'] };
            case 'brand-single':
                return { include: ['brands.single'], exclude: [] };
            case 'thank-you':
                return { include: ['thank-you'], exclude: [] };
            case 'landing-page':
                return { include: ['landing-page'], exclude: [] };
            case 'page-single':
                return { include: ['page-single'], exclude: [] };
            default:
                return { include: [pageKey], exclude: [] };
        }
    }

    private pathStartsWithPrefix(pathRaw: string, prefixRaw: string): boolean {
        const path = this.normalizePageToken(pathRaw);
        const prefix = this.normalizePageToken(prefixRaw);
        if (!path || !prefix) return false;
        return path === prefix || path.startsWith(`${prefix}.`);
    }

    private resolveComponentsForPageKeys(allComponents: any[], pageKeys: string[]): any[] {
        if (!Array.isArray(allComponents) || allComponents.length === 0) return [];

        const selected = new Map<string, any>();
        pageKeys.forEach((pageKey) => {
            const rule = this.getPathRuleForPageKey(pageKey);
            allComponents.forEach((component: any) => {
                const componentPath = String(component?.path || '');
                if (!componentPath) return;

                const includeMatch = rule.include.some((prefix) =>
                    this.pathStartsWithPrefix(componentPath, prefix)
                );
                if (!includeMatch) return;

                const excluded = rule.exclude.some((prefix) =>
                    this.pathStartsWithPrefix(componentPath, prefix)
                );
                if (excluded) return;

                const mapKey = String(component?.key || componentPath);
                if (!selected.has(mapKey)) selected.set(mapKey, component);
            });
        });

        return Array.from(selected.values());
    }

    private resolveSavedCompositions(context: RuntimeContext, pageKeys: string[]): any[] | null {
        const collection = (context as any)?.settings?.page_compositions;
        if (!collection || typeof collection !== 'object') return null;

        for (const pageKey of pageKeys) {
            if (!Object.prototype.hasOwnProperty.call(collection, pageKey)) continue;
            const value = (collection as Record<string, any>)[pageKey];
            if (Array.isArray(value)) return value;
        }
        return null;
    }

    private pickLocalizedText(value: any, preferredLocale: 'ar' | 'en'): string {
        if (value == null) return '';
        if (typeof value === 'string') return value;
        if (typeof value === 'object' && !Array.isArray(value)) {
            if (typeof value[preferredLocale] === 'string' && value[preferredLocale].trim()) {
                return value[preferredLocale];
            }
            if (typeof value.ar === 'string' && value.ar.trim()) return value.ar;
            if (typeof value.en === 'string' && value.en.trim()) return value.en;
            const firstString = Object.values(value).find((entry: any) =>
                typeof entry === 'string' && entry.trim()
            );
            if (typeof firstString === 'string') return firstString;
        }
        return String(value);
    }

    private flattenCollectionItems(value: any): any[] {
        if (!Array.isArray(value)) return [];
        return value.map((item: any) => {
            if (!item || typeof item !== 'object') return item;
            const normalized: Record<string, any> = {};
            for (const key in item) {
                const cleanKey = key.includes('.') ? key.split('.').pop() : key;
                normalized[cleanKey!] = item[key];
            }
            return normalized;
        });
    }

    private ensureProductMockList(items: any[]): any[] {
        const normalized = Array.isArray(items) ? [...items] : [];
        (normalized as any).product_ids_mock_str = normalized
            .map((item: any) => item?.id)
            .filter(Boolean)
            .join(',');
        return normalized;
    }

    private extractSelectionIds(rawValue: any): string[] {
        const source = Array.isArray(rawValue) ? rawValue : [rawValue];
        return Array.from(
            new Set(
                source
                    .map((entry: any) => {
                        if (typeof entry === 'string' || typeof entry === 'number') return String(entry);
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

    private normalizeLinkUrl(value: any): string {
        const raw = String(value || '').trim();
        if (!raw) return '#';
        if (/^(https?:|mailto:|tel:|#)/i.test(raw)) return raw;
        if (raw.startsWith('/')) return raw;
        if (raw.startsWith('//')) return raw;
        return `/${raw.replace(/^\/+/, '')}`;
    }

    private getSourcePool(context: RuntimeContext, sourceKey: string): any[] {
        const source = String(sourceKey || '').toLowerCase();
        if (source === 'products') return (context as any).products || [];
        if (source === 'categories') return (context as any).categories || [];
        if (source === 'brands') return (context as any).brands || [];
        if (source === 'pages') return (context as any).pages || [];
        if (source === 'blog_articles') return (context as any).blog_articles || [];
        if (source === 'blog_categories') return (context as any).blog_categories || [];
        return [];
    }

    private resolveSourceEntityUrl(context: RuntimeContext, sourceKey: string, rawId: any): string {
        const source = String(sourceKey || '').toLowerCase();
        const id = String(rawId || '').trim();
        if (!id) return '';

        const staticMap: Record<string, string> = {
            offers_link: '/offers',
            brands_link: '/brands',
            blog_link: '/blog'
        };
        if (staticMap[source]) return staticMap[source];

        const pool = this.getSourcePool(context, source);
        const entry = pool.find((item: any) => String(item?.id || item?.slug || '') === id);

        if (source === 'products') return entry?.url || `/products/${id}`;
        if (source === 'categories') return entry?.url || `/categories/${id}`;
        if (source === 'brands') return entry?.url || `/brands/${id}`;
        if (source === 'pages') return entry?.url || `/pages/${id}`;
        if (source === 'blog_articles') return entry?.url || `/blog/${id}`;
        if (source === 'blog_categories') return entry?.url || `/blog/categories/${id}`;
        return entry?.url || '';
    }

    private resolveVariableListValue(
        context: RuntimeContext,
        rawValue: any,
        fallbackSource = '',
        fallbackValue = ''
    ): string {
        const sourceHint = String(fallbackSource || '').trim().toLowerCase();
        const valueHint = String(fallbackValue || '').trim();

        const staticSourceMap: Record<string, string> = {
            offers_link: '/offers',
            brands_link: '/brands',
            blog_link: '/blog'
        };

        if (typeof rawValue === 'string') {
            if (sourceHint === 'custom') return this.normalizeLinkUrl(rawValue);
            if (staticSourceMap[sourceHint]) return staticSourceMap[sourceHint];
            if (sourceHint && valueHint) {
                const fromSource = this.resolveSourceEntityUrl(context, sourceHint, valueHint);
                if (fromSource) return this.normalizeLinkUrl(fromSource);
            }
            return this.normalizeLinkUrl(rawValue);
        }
        if (Array.isArray(rawValue)) {
            const first = rawValue.find((entry) => entry != null);
            return this.resolveVariableListValue(context, first, sourceHint, valueHint);
        }
        if (rawValue && typeof rawValue === 'object') {
            const source =
                String(rawValue.type ?? rawValue.source ?? rawValue.__type ?? sourceHint ?? '')
                    .trim()
                    .toLowerCase();
            const typedValue =
                String(
                    rawValue.value ??
                    rawValue.id ??
                    rawValue.key ??
                    rawValue.__value ??
                    valueHint ??
                    ''
                ).trim();

            const candidate = rawValue.url ?? rawValue.path ?? rawValue.link ?? '';
            if (typeof candidate === 'string' && candidate.trim()) {
                return this.normalizeLinkUrl(candidate);
            }
            if (source === 'custom') {
                return this.normalizeLinkUrl(typedValue);
            }
            if (staticSourceMap[source]) {
                return staticSourceMap[source];
            }
            if (source && typedValue) {
                const resolved = this.resolveSourceEntityUrl(context, source, typedValue);
                if (resolved) return this.normalizeLinkUrl(resolved);
            }
            if (typedValue) {
                return this.normalizeLinkUrl(typedValue);
            }
            if (sourceHint && valueHint) {
                const resolved = this.resolveSourceEntityUrl(context, sourceHint, valueHint);
                if (resolved) return this.normalizeLinkUrl(resolved);
            }
            if (staticSourceMap[sourceHint]) {
                return staticSourceMap[sourceHint];
            }
        }
        if (sourceHint === 'custom' && valueHint) {
            return this.normalizeLinkUrl(valueHint);
        }
        if (staticSourceMap[sourceHint]) {
            return staticSourceMap[sourceHint];
        }
        if (sourceHint && valueHint) {
            const resolved = this.resolveSourceEntityUrl(context, sourceHint, valueHint);
            if (resolved) return this.normalizeLinkUrl(resolved);
        }
        return '#';
    }

    private resolveItemsBySource(
        context: RuntimeContext,
        sourceKey: string,
        rawValue: any,
        explicitOverride: boolean
    ): any[] {
        const source = String(sourceKey || '').toLowerCase();
        const pool =
            source === 'products'
                ? ((context as any).products || [])
                : source === 'categories'
                    ? ((context as any).categories || [])
                    : source === 'brands'
                        ? ((context as any).brands || [])
                        : [];

        if (!Array.isArray(pool) || pool.length === 0) {
            return source === 'products' ? this.ensureProductMockList([]) : [];
        }

        const ids = this.extractSelectionIds(rawValue);
        const byId = new Map(
            pool
                .filter((item: any) => item?.id != null)
                .map((item: any) => [String(item.id), item])
        );

        let resolved: any[] = [];
        if (ids.length > 0) {
            resolved = ids
                .map((id) => byId.get(id))
                .filter(Boolean);
        } else if (!explicitOverride) {
            const fallbackCount = source === 'products' ? 12 : 8;
            resolved = pool.slice(0, fallbackCount);
        }

        return source === 'products'
            ? this.ensureProductMockList(resolved)
            : resolved;
    }

    private resolvePreviewViewport(raw: any): PreviewViewport {
        const normalized = String(raw || 'desktop').toLowerCase();
        return normalized === 'mobile' ? 'mobile' : 'desktop';
    }

    private shouldRenderCompositionEntry(entry: any, previewViewport: PreviewViewport): boolean {
        if (!entry || typeof entry !== 'object') return false;

        const visibility =
            entry.visibility && typeof entry.visibility === 'object' ? entry.visibility : {};
        const enabled =
            typeof visibility.enabled === 'boolean'
                ? visibility.enabled
                : (typeof entry.enabled === 'boolean' ? entry.enabled : true);
        if (!enabled) return false;

        const viewportRule = String(visibility.viewport ?? entry.viewport ?? 'all').toLowerCase();
        if (!viewportRule || viewportRule === 'all') return true;
        if (viewportRule === 'mobile') return previewViewport === 'mobile';
        if (viewportRule === 'desktop') return previewViewport === 'desktop';
        return true;
    }

    private mapHomeComponent(
        context: RuntimeContext,
        preferredLocale: 'ar' | 'en',
        component: any,
        position: number,
        overrideProps?: Record<string, any>
    ): ResolvedHomeComponent {
        const data: Record<string, any> = {};
        component.fields?.forEach((f: any) => {
            if (!f.id) return;
            let val = f.value;
            if (f.type === 'collection' && Array.isArray(val)) {
                val = this.flattenCollectionItems(val);
            } else if (
                val &&
                typeof val === 'object' &&
                !Array.isArray(val) &&
                f.type !== 'items' &&
                f.type !== 'boolean'
            ) {
                val = this.pickLocalizedText(val, preferredLocale);
            }
            data[f.id] = val;
        });

        const mergedData: Record<string, any> = {
            ...data,
            ...(overrideProps && typeof overrideProps === 'object' ? overrideProps : {})
        };

        component.fields?.forEach((f: any) => {
            if (!f?.id) return;

            if (f.type === 'collection') {
                const flattenedCollection = this.flattenCollectionItems(mergedData[f.id]);
                if (!Array.isArray(flattenedCollection)) {
                    mergedData[f.id] = [];
                    return;
                }

                const variableSubFields = (f.fields || []).filter((subField: any) =>
                    subField?.type === 'items' && String(subField?.format || '') === 'variable-list'
                );

                if (variableSubFields.length === 0) {
                    mergedData[f.id] = flattenedCollection;
                    return;
                }

                mergedData[f.id] = flattenedCollection.map((item: any) => {
                    if (!item || typeof item !== 'object') return item;
                    const nextItem = { ...item };

                    variableSubFields.forEach((subField: any) => {
                        const subId = String(subField?.id || '');
                        if (!subId) return;
                        const tail = subId.includes('.') ? subId.split('.').pop() || subId : subId;

                        const rawFieldValue = nextItem[tail] ?? nextItem[subId];
                        const typedSource =
                            nextItem[`${tail}__type`] ??
                            nextItem[`${subId}__type`] ??
                            '';
                        const typedValue =
                            nextItem[`${tail}__value`] ??
                            nextItem[`${subId}__value`] ??
                            '';

                        nextItem[tail] = this.resolveVariableListValue(context, rawFieldValue, typedSource, typedValue);
                    });

                    return nextItem;
                });
                return;
            }

            if (String(f.format || '') === 'variable-list') {
                mergedData[f.id] = this.resolveVariableListValue(context, mergedData[f.id]);
                return;
            }

            if (f.type === 'items' && String(f.format || '') === 'dropdown-list') {
                const explicitOverride = Boolean(
                    overrideProps &&
                    Object.prototype.hasOwnProperty.call(overrideProps, f.id)
                );
                mergedData[f.id] = this.resolveItemsBySource(context, f.source, mergedData[f.id], explicitOverride);
                return;
            }

            if (
                mergedData[f.id] &&
                typeof mergedData[f.id] === 'object' &&
                !Array.isArray(mergedData[f.id]) &&
                f.type !== 'boolean'
            ) {
                mergedData[f.id] = this.pickLocalizedText(mergedData[f.id], preferredLocale);
            }
        });

        const fallbackProducts =
            (component.path.includes('product') || component.path.includes('slider') || component.path.includes('banner'))
                ? ((context as any).products || [])
                : [];
        const componentProducts = Array.isArray(mergedData.products)
            ? this.ensureProductMockList(mergedData.products)
            : this.ensureProductMockList(fallbackProducts);

        return {
            path: component.path,
            name: component.path,
            data: {
                ...component,
                ...mergedData,
                position,
                products: componentProducts,
                product_ids_mock: componentProducts.map((p: any) => p.id),
                product_ids_mock_str: (componentProducts as any).product_ids_mock_str
            }
        };
    }

    public resolve(context: RuntimeContext, themeSchema: any, templatePageIdRaw?: string): ResolvedHomeComponent[] {
        const twilight = themeSchema || {};
        if (!Array.isArray(twilight.components)) return [];

        const preferredLocale: 'ar' | 'en' = context.store?.locale?.startsWith('ar') ? 'ar' : 'en';
        const templatePageId =
            templatePageIdRaw ??
            (context.page as any)?.template_id ??
            context.page?.id ??
            'index';
        const pageKeys = this.resolveCompositionPageKeys(templatePageId);
        const pageComponents = this.resolveComponentsForPageKeys(twilight.components, pageKeys);

        const savedCompositions = this.resolveSavedCompositions(context, pageKeys);
        const previewViewport = this.resolvePreviewViewport(
            (context as any)?.__preview?.viewport ?? (context as any)?.settings?.__preview_viewport
        );

        if (Array.isArray(savedCompositions)) {
            const byKey = new Map<string, any>();
            const byPath = new Map<string, any>();
            const componentSource = pageComponents.length > 0 ? pageComponents : twilight.components;
            componentSource.forEach((component: any) => {
                byKey.set(String(component.key), component);
                byPath.set(String(component.path), component);
            });

            return savedCompositions
                .filter((entry: any) => this.shouldRenderCompositionEntry(entry, previewViewport))
                .map((entry: any, index: number) => {
                    const componentId = String(entry?.componentId || entry?.id || '');
                    if (!componentId) return null;
                    const component = byKey.get(componentId) || byPath.get(componentId);
                    if (!component) return null;
                    const props = entry?.props && typeof entry.props === 'object' ? entry.props : {};
                    return this.mapHomeComponent(context, preferredLocale, component, index, props);
                })
                .filter(Boolean) as ResolvedHomeComponent[];
        }

        return pageComponents.map((component: any, index: number) =>
            this.mapHomeComponent(context, preferredLocale, component, index)
        );
    }
}
