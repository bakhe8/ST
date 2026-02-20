import { StoreLogic } from '../core/store-logic.js';
import { SchemaService } from '../core/schema-service.js';
import type { IThemeRuntimeAdapter } from '../infra/theme-runtime-adapter.interface.js';

export class SimulatorService {
    constructor(
        private storeLogic: StoreLogic,
        private schemaService: SchemaService,
        private themeRuntimeAdapter: IThemeRuntimeAdapter
    ) { }

    private get defaultProductPlaceholder(): string {
        return this.themeRuntimeAdapter.resolvePlaceholderImage();
    }

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
        return options.map((option: any) => {
            const detailsSource = Array.isArray(option?.details) ? option.details : (Array.isArray(option?.values) ? option.values : []);
            const details = detailsSource.map((value: any, index: number) => {
                const id = String(value?.id || this.generateEntityId('opt_val'));
                const name = String(value?.name || value?.label || `Value ${index + 1}`);
                const additionalPrice = this.toNumber(value?.additional_price ?? value?.price, 0);
                return {
                    ...value,
                    id,
                    name,
                    full_name: String(value?.full_name || (additionalPrice > 0 ? `${name} (+${additionalPrice})` : name)),
                    additional_price: additionalPrice,
                    price: additionalPrice,
                    option_value: value?.option_value ?? value?.value,
                    image: value?.image ? String(value.image) : undefined,
                    color: value?.color ? String(value.color) : undefined,
                    is_default: Boolean(value?.is_default),
                    is_selected: Boolean(value?.is_selected),
                    is_out: Boolean(value?.is_out)
                };
            });

            const values = details.map((entry: any) => ({
                ...entry,
                id: String(entry.id),
                name: String(entry.name),
                price: this.toNumber(entry.additional_price ?? entry.price, 0),
                is_default: Boolean(entry.is_default)
            }));

            return {
                ...option,
                id: String(option?.id || this.generateEntityId('opt')),
                name: String(option?.name || option?.title || 'Option'),
                type: String(option?.type || 'select'),
                required: Boolean(option?.required),
                placeholder: option?.placeholder ? String(option.placeholder) : '',
                details,
                values
            };
        });
    }

    private normalizeProductVariants(data: any) {
        const variants = Array.isArray(data?.variants) ? data.variants : [];
        return variants.map((variant: any) => {
            const price = this.normalizePriceValue(variant?.price ?? data?.price);
            const isInfiniteQuantity = Boolean(variant?.is_infinite_quantity);
            const quantity = isInfiniteQuantity
                ? null
                : this.normalizeQuantity(variant?.quantity ?? variant?.stock ?? 0, 0);
            const isAvailable = variant?.is_available !== false && (isInfiniteQuantity || (quantity || 0) > 0);
            return {
                id: String(variant?.id || this.generateEntityId('variant')),
                sku: variant?.sku ? String(variant.sku) : undefined,
                quantity,
                stock: quantity,
                is_infinite_quantity: isInfiniteQuantity,
                is_available: isAvailable,
                is_out_of_stock: !isAvailable,
                max_quantity: isInfiniteQuantity
                    ? this.normalizeQuantity(variant?.max_quantity, 99) || 99
                    : Math.max(1, this.normalizeQuantity(variant?.max_quantity, quantity || 1) || 1),
                price,
                options: Array.isArray(variant?.options) ? variant.options : []
            };
        });
    }

    private normalizeProductNotifyAvailability(base: any, shouldEnable: boolean) {
        if (!shouldEnable) return undefined;
        if (base?.notify_availability && typeof base.notify_availability === 'object') {
            const source = base.notify_availability;
            const channels = Array.isArray(source.channels) && source.channels.length > 0
                ? source.channels.map((entry: any) => this.pickLocalizedText(entry)).filter(Boolean)
                : ['sms', 'email'];
            return {
                ...source,
                channels,
                subscribed: Boolean(source.subscribed),
                subscribed_options: Array.isArray(source.subscribed_options) ? source.subscribed_options : [],
                options: source.options ?? true
            };
        }
        return {
            channels: ['sms', 'email'],
            subscribed: false,
            subscribed_options: [],
            options: true
        };
    }

    private resolveProductInventory(base: any, variants: any[]) {
        const explicitQuantityRaw = base?.quantity ?? base?.stock;
        const hasExplicitQuantity =
            explicitQuantityRaw !== undefined &&
            explicitQuantityRaw !== null &&
            String(explicitQuantityRaw).trim() !== '';
        const explicitIsInfinite = Boolean(base?.is_infinite_quantity);
        const explicitTrackQuantity =
            typeof base?.track_quantity === 'boolean'
                ? base.track_quantity
                : undefined;
        const allowBackorder = this.toBoolean(
            base?.allow_backorder ?? base?.can_backorder ?? base?.allow_preorder,
            false
        );

        const hasVariants = Array.isArray(variants) && variants.length > 0;
        const variantHasInfinite = hasVariants && variants.some((variant: any) => Boolean(variant?.is_infinite_quantity));
        const variantQuantitySum = hasVariants
            ? variants.reduce((sum: number, variant: any) => {
                if (variant?.is_available === false) return sum;
                return sum + this.toNumber(variant?.quantity, 0);
            }, 0)
            : 0;
        const variantHasStockInfo = hasVariants && variants.some((variant: any) =>
            variant?.quantity !== undefined &&
            variant?.quantity !== null &&
            String(variant.quantity).trim() !== ''
        );

        let quantity: number | null = null;
        let isInfiniteQuantity = false;

        if (explicitIsInfinite || variantHasInfinite) {
            isInfiniteQuantity = true;
            quantity = null;
        } else if (hasExplicitQuantity) {
            isInfiniteQuantity = false;
            quantity = this.normalizeQuantity(explicitQuantityRaw, 0);
        } else if (variantHasStockInfo || hasVariants) {
            isInfiniteQuantity = false;
            quantity = this.normalizeQuantity(variantQuantitySum, 0);
        } else {
            isInfiniteQuantity = true;
            quantity = null;
        }

        const trackQuantity = explicitTrackQuantity ?? !isInfiniteQuantity;
        if (!trackQuantity) {
            isInfiniteQuantity = true;
            quantity = null;
        }

        const reservedQuantity =
            isInfiniteQuantity || !trackQuantity
                ? 0
                : this.normalizeQuantity(base?.reserved_quantity ?? base?.reserved, 0);
        const availableQuantity =
            isInfiniteQuantity || !trackQuantity
                ? null
                : Math.max(0, this.toNumber(quantity, 0) - reservedQuantity);
        const lowStockThreshold =
            isInfiniteQuantity || !trackQuantity
                ? 0
                : this.normalizeQuantity(
                    base?.low_stock_threshold ?? base?.low_stock_limit ?? base?.minimum_quantity,
                    0
                );

        const explicitMax = this.normalizeQuantity(base?.max_quantity, 0);
        const soldQuantity = this.normalizeQuantity(base?.sold_quantity ?? base?.sales_count, 0);
        const isHiddenQuantity = Boolean(base?.is_hidden_quantity);
        const rawStatus = String(base?.status || '').trim().toLowerCase();
        const explicitAvailability =
            typeof base?.is_available === 'boolean'
                ? base.is_available
                : undefined;

        const hasAvailableStock =
            isInfiniteQuantity ||
            !trackQuantity ||
            (availableQuantity != null ? availableQuantity > 0 : (quantity || 0) > 0);
        let isAvailable = explicitAvailability ?? (hasAvailableStock || allowBackorder);
        let isOutOfStock =
            !isAvailable ||
            (trackQuantity && !isInfiniteQuantity && !allowBackorder && (availableQuantity || 0) <= 0);
        const maxQuantity = isInfiniteQuantity || !trackQuantity
            ? (explicitMax || 99)
            : allowBackorder
                ? (explicitMax || 99)
                : Math.max(1, Math.min(explicitMax || ((availableQuantity || 0) || 1), (availableQuantity || 0) || explicitMax || 1));

        let inventoryStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'backorder' | 'hidden' = 'in_stock';
        if (rawStatus === 'hidden') {
            inventoryStatus = 'hidden';
        } else if (!trackQuantity || isInfiniteQuantity) {
            inventoryStatus = 'in_stock';
        } else if ((availableQuantity || 0) <= 0) {
            inventoryStatus = allowBackorder && isAvailable ? 'backorder' : 'out_of_stock';
        } else if (lowStockThreshold > 0 && (availableQuantity || 0) <= lowStockThreshold) {
            inventoryStatus = 'low_stock';
        } else {
            inventoryStatus = 'in_stock';
        }

        let status = inventoryStatus === 'out_of_stock'
            ? ((rawStatus === 'out-and-notify' || Boolean(base?.notify_availability)) ? 'out-and-notify' : 'out')
            : 'sale';
        if (rawStatus === 'hidden') {
            status = 'hidden';
            isAvailable = false;
            isOutOfStock = true;
        }

        const notifyAvailability = this.normalizeProductNotifyAvailability(
            base,
            (inventoryStatus === 'out_of_stock' || inventoryStatus === 'backorder') &&
            status === 'out-and-notify'
        );

        const defaultAddToCartLabel =
            inventoryStatus === 'backorder'
                ? 'طلب مسبق'
                : inventoryStatus === 'out_of_stock'
                    ? 'نفد المخزون'
                    : 'أضف للسلة';

        return {
            quantity,
            stock: quantity,
            reserved_quantity: reservedQuantity,
            available_quantity: availableQuantity,
            sold_quantity: soldQuantity,
            max_quantity: maxQuantity,
            track_quantity: trackQuantity,
            allow_backorder: allowBackorder,
            low_stock_threshold: lowStockThreshold,
            inventory_status: inventoryStatus,
            is_hidden_quantity: isHiddenQuantity,
            is_infinite_quantity: isInfiniteQuantity,
            is_available: isAvailable,
            is_out_of_stock: isOutOfStock,
            can_show_remained_quantity:
                !isHiddenQuantity &&
                !isInfiniteQuantity &&
                (availableQuantity || 0) > 0 &&
                base?.can_show_remained_quantity !== false,
            can_show_sold: base?.can_show_sold !== false && soldQuantity > 0,
            notify_availability: notifyAvailability,
            status,
            add_to_cart_label: this.pickLocalizedText(base?.add_to_cart_label || defaultAddToCartLabel),
            has_options: (Array.isArray(base?.options) && base.options.length > 0) || hasVariants,
            show_availability: Boolean(base?.show_availability)
        };
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

    private collectProductCategoryIds(product: any): string[] {
        const directIds = Array.isArray(product?.category_ids)
            ? product.category_ids.map((entry: any) => {
                if (entry && typeof entry === 'object') {
                    return String(entry?.id || '').trim();
                }
                return String(entry || '').trim();
            })
            : [];
        const categoriesIds = Array.isArray(product?.categories)
            ? product.categories.map((entry: any) => {
                if (entry && typeof entry === 'object') {
                    return String(entry?.id || '').trim();
                }
                return String(entry || '').trim();
            })
            : [];
        const singleCategoryId = String(product?.category?.id ?? product?.category_id ?? '').trim();

        return Array.from(
            new Set(
                [
                    ...directIds,
                    ...categoriesIds,
                    ...(singleCategoryId ? [singleCategoryId] : [])
                ].filter(Boolean)
            )
        );
    }

    private collectProductReferenceCandidates(product: any): string[] {
        const id = String(product?.id || '').trim();
        const slug = String(product?.slug || '').trim();
        const urlTail = String(product?.url || '').trim().split('/').filter(Boolean).pop() || '';
        return Array.from(new Set([id, slug, urlTail].filter(Boolean)));
    }

    private normalizeProductDonation(base: any, fallbackAmount: number) {
        const donationSource =
            base?.donation && typeof base.donation === 'object' && !Array.isArray(base.donation)
                ? base.donation
                : {};

        const hasDonationSignal =
            Object.keys(donationSource).length > 0 ||
            base?.target_amount != null ||
            base?.collected_amount != null ||
            base?.min_amount_donating != null ||
            base?.max_amount_donating != null;

        const isDonation = this.toBoolean(
            base?.is_donation ?? (String(base?.type || '').toLowerCase() === 'donating'),
            hasDonationSignal
        );

        if (!isDonation && !hasDonationSignal) {
            return undefined;
        }

        const targetAmount = Math.max(
            0,
            this.toNumber(
                donationSource?.target_amount ??
                base?.target_amount ??
                base?.max_amount_donating,
                Math.max(1, this.toNumber(fallbackAmount, 1))
            )
        );
        const collectedAmount = Math.max(
            0,
            this.toNumber(
                donationSource?.collected_amount ??
                base?.collected_amount ??
                base?.min_amount_donating,
                0
            )
        );
        const computedPercent = targetAmount > 0
            ? Math.min(100, this.roundAmount((collectedAmount / targetAmount) * 100))
            : 0;
        const targetPercent = Math.max(
            0,
            Math.min(
                100,
                this.toNumber(donationSource?.target_percent, computedPercent)
            )
        );

        const targetEndDate = this.pickLocalizedText(
            donationSource?.target_end_date ??
            donationSource?.end_date ??
            donationSource?.ends_at ??
            base?.target_end_date ??
            ''
        );
        const parsedEndDate = targetEndDate ? new Date(targetEndDate).getTime() : NaN;
        const isExpired = Number.isFinite(parsedEndDate) && parsedEndDate < Date.now();
        const reachedTarget = targetAmount > 0 && collectedAmount >= targetAmount;

        const targetMessage = this.pickLocalizedText(
            donationSource?.target_message ??
            base?.target_message ??
            (reachedTarget ? 'تم الوصول إلى الهدف' : (isExpired ? 'انتهت الحملة' : ''))
        );

        const canDonate = donationSource?.can_donate != null
            ? Boolean(donationSource.can_donate)
            : !(reachedTarget || isExpired);

        return {
            target_message: targetMessage || undefined,
            collected_amount: collectedAmount,
            target_amount: targetAmount,
            target_percent: targetPercent,
            target_end_date: targetEndDate || undefined,
            can_donate: canDonate
        };
    }

    private async normalizeProductPayload(storeId: string, data: any, key: string) {
        const base = this.normalizeEntityPayload(data, key);
        const images = this.normalizeProductImages(base);
        const categoriesFromInput = base?.category_ids ?? base?.categories ?? [];
        const categories = await this.normalizeProductCategories(storeId, categoriesFromInput);
        const normalizedCategories = (categories.categories || []).map((entry: any) =>
            this.normalizeCategoryPayload(entry, String(entry?.id || this.generateEntityId('category')))
        );
        const currency = String(base?.price?.currency || base?.sale_price?.currency || base?.regular_price?.currency || 'SAR');
        const price = this.normalizePriceValue(base?.price, currency);
        const regularPrice = this.normalizePriceValue(base?.regular_price || { amount: price.amount }, currency);
        const salePrice = this.normalizePriceValue(base?.sale_price || { amount: price.amount }, currency);
        const normalizedOptions = this.normalizeProductOptions(base);
        const normalizedVariants = this.normalizeProductVariants(base);
        const inventory = this.resolveProductInventory(
            {
                ...base,
                options: normalizedOptions,
                variants: normalizedVariants
            },
            normalizedVariants
        );
        const name = this.pickLocalizedText(base?.name || base?.title || key);
        const slug = this.slugify(base?.slug || name || key, 'product');
        const url = this.normalizeEntityUrl(
            base?.url,
            `/products/${slug || key}`,
            ['/product', '/products']
        );
        const firstCategory = normalizedCategories[0] || null;
        const startingPriceAmount = normalizedVariants.length > 0
            ? normalizedVariants
                .map((entry: any) => this.toNumber(entry?.price?.amount, salePrice.amount))
                .filter((entry: number) => Number.isFinite(entry))
                .sort((a: number, b: number) => a - b)[0]
            : undefined;
        const baseCurrencyPrice = this.toNumber(
            base?.base_currency_price ??
            salePrice.amount ??
            price.amount,
            salePrice.amount
        );
        const weight = Math.max(0, this.toNumber(base?.weight ?? base?.shipping_weight, 0));
        const weightUnitCandidate = this.pickLocalizedText((base?.weight_unit ?? base?.weightUnit) || 'kg').toLowerCase();
        const weightUnit = ['kg', 'g', 'lb', 'oz'].includes(weightUnitCandidate)
            ? weightUnitCandidate
            : 'kg';
        const rawMetadata =
            base?.metadata && typeof base.metadata === 'object' && !Array.isArray(base.metadata)
                ? base.metadata
                : {};
        const metadata = {
            title: this.pickLocalizedText(rawMetadata?.title || base?.seo_title || ''),
            description: this.pickLocalizedText(rawMetadata?.description || base?.seo_description || ''),
            keywords: Array.isArray(rawMetadata?.keywords)
                ? rawMetadata.keywords.map((entry: any) => this.pickLocalizedText(entry)).filter(Boolean)
                : this.pickLocalizedText(rawMetadata?.keywords || '').split(',').map((entry: string) => entry.trim()).filter(Boolean),
            image: this.sanitizeImageUrl(rawMetadata?.image || base?.seo_image || '') || undefined
        };
        const customFieldsSource = Array.isArray(base?.custom_fields)
            ? base.custom_fields
            : Array.isArray(base?.customFields)
                ? base.customFields
                : [];
        const customFields = customFieldsSource
            .map((entry: any, index: number) => ({
                id: String(entry?.id || this.generateEntityId('custom_field')),
                key: this.pickLocalizedText(entry?.key || entry?.name || `field_${index + 1}`),
                value: this.pickLocalizedText(entry?.value || ''),
                type: this.pickLocalizedText(entry?.type || 'text')
            }))
            .filter((entry: any) => entry.key);
        const specsSource = Array.isArray(base?.specs)
            ? base.specs
            : Array.isArray(base?.specifications)
                ? base.specifications
                : [];
        const specs = specsSource
            .map((entry: any, index: number) => ({
                id: String(entry?.id || this.generateEntityId('spec')),
                key: this.pickLocalizedText(entry?.key || entry?.name || `spec_${index + 1}`),
                value: this.pickLocalizedText(entry?.value || '')
            }))
            .filter((entry: any) => entry.key);
        const attachmentsSource = Array.isArray(base?.attachments) ? base.attachments : [];
        const attachments = attachmentsSource
            .map((entry: any) => {
                const fileUrl = this.sanitizeImageUrl(entry?.file_url || entry?.url || entry?.file || '');
                return {
                    id: String(entry?.id || this.generateEntityId('attachment')),
                    name: this.pickLocalizedText(entry?.name || entry?.title || 'Attachment'),
                    file_url: fileUrl,
                    file_type: this.pickLocalizedText(entry?.file_type || entry?.type || '')
                };
            })
            .filter((entry: any) => entry.file_url);
        const donation = this.normalizeProductDonation(base, salePrice.amount || price.amount);
        const isDonation = Boolean(donation);
        const productType = isDonation
            ? 'donating'
            : this.pickLocalizedText(base?.type || 'product');
        const minAmountDonating = donation
            ? Math.max(
                1,
                this.toNumber(
                    base?.min_amount_donating,
                    Math.max(1, this.roundAmount((salePrice.amount || price.amount || 1) * 0.1))
                )
            )
            : undefined;
        const maxAmountDonating = donation
            ? Math.max(
                this.toNumber(base?.max_amount_donating, donation.target_amount || minAmountDonating || 1),
                minAmountDonating || 1
            )
            : undefined;

        return {
            ...base,
            ...images,
            type: productType,
            name,
            slug,
            url,
            category_ids: categories.category_ids,
            categories: normalizedCategories,
            category: firstCategory || undefined,
            price,
            regular_price: regularPrice,
            sale_price: salePrice,
            starting_price: Number.isFinite(startingPriceAmount) && startingPriceAmount > 0 ? startingPriceAmount : undefined,
            base_currency_price: baseCurrencyPrice,
            currency,
            image: images.images?.[0] || (images.main_image ? { url: images.main_image, alt: name } : undefined),
            options: normalizedOptions,
            variants: normalizedVariants,
            is_featured: this.toBoolean(base?.is_featured ?? base?.featured, false),
            donation,
            is_donation: isDonation,
            min_amount_donating: minAmountDonating,
            max_amount_donating: maxAmountDonating,
            weight,
            weight_unit: weightUnit,
            metadata,
            custom_fields: customFields,
            specs,
            attachments,
            ...inventory,
            is_require_shipping: !isDonation && base?.is_require_shipping !== false && productType !== 'digital'
        };
    }

    private normalizeCategoryPayload(data: any, key: string) {
        const base = this.normalizeEntityPayload(data, key);
        const rawParent = base?.parentId ?? base?.parent_id ?? '';
        const parentValue = String(rawParent || '').trim();
        const parent_id = parentValue && parentValue !== 'root' ? parentValue : null;
        const name = this.pickLocalizedText(base?.name || base?.title || key);
        const slug = this.slugify(base?.slug || name || key, 'category');
        const url = this.normalizeEntityUrl(
            base?.url,
            `/categories/${slug || key}`,
            ['/category', '/categories', '/cat', '/cats']
        );
        const image = this.sanitizeImageUrl(base?.image || base?.icon || base?.cover?.url) || this.defaultProductPlaceholder;

        return {
            ...base,
            id: key,
            name,
            title: this.pickLocalizedText(base?.title || name),
            slug,
            url,
            image,
            description: this.pickLocalizedText(base?.description || ''),
            parent_id,
            parentId: parent_id || '',
            order: Number.isFinite(Number(base?.order)) ? Number(base.order) : 0
        };
    }

    private normalizeBrandPayload(data: any, key: string) {
        const base = this.normalizeEntityPayload(data, key);
        const name = this.pickLocalizedText(base?.name || base?.title || key);
        const slug = this.slugify(base?.slug || name, 'brand');
        const logo = this.sanitizeImageUrl(base?.logo || base?.image?.url) || this.defaultProductPlaceholder;
        const banner = this.sanitizeImageUrl(base?.banner || base?.cover?.url || base?.header_image);
        const url = this.normalizeEntityUrl(
            base?.url,
            `/brands/${slug || key}`,
            ['/brand', '/brands']
        );

        return {
            ...base,
            id: key,
            name,
            title: this.pickLocalizedText(base?.title || name),
            slug,
            url,
            description: this.pickLocalizedText(base?.description || ''),
            logo,
            banner: banner || undefined,
            order: Number.isFinite(Number(base?.order)) ? Number(base.order) : 0
        };
    }

    private normalizeOfferCategories(base: any) {
        const sourceEntries: any[] = [];
        if (Array.isArray(base?.categories)) sourceEntries.push(...base.categories);
        if (Array.isArray(base?.category_ids)) {
            sourceEntries.push(...base.category_ids.map((entry: any) => ({ id: entry })));
        }
        if (base?.category_id != null) {
            sourceEntries.push({ id: base.category_id });
        }

        const categoriesById = new Map<string, any>();
        sourceEntries.forEach((entry: any, index: number) => {
            const payload =
                entry && typeof entry === 'object' && !Array.isArray(entry)
                    ? entry
                    : { id: entry };
            const key = String(payload?.id ?? payload?.category_id ?? '').trim() || this.generateEntityId('offer_category');
            const normalized = this.normalizeCategoryPayload(payload, key);
            categoriesById.set(String(normalized.id), {
                id: normalized.id,
                name: normalized.name,
                title: normalized.title,
                slug: normalized.slug,
                url: normalized.url,
                image: normalized.image,
                parent_id: normalized.parent_id,
                sort_order: Number.isFinite(Number(payload?.sort_order)) ? Number(payload.sort_order) : index + 1,
                status: this.pickLocalizedText(payload?.status || 'active')
            });
        });

        return {
            categories: Array.from(categoriesById.values()),
            categoryIds: Array.from(categoriesById.keys())
        };
    }

    private normalizeOfferProducts(base: any) {
        const sourceEntries: any[] = [];
        if (Array.isArray(base?.products)) sourceEntries.push(...base.products);
        if (Array.isArray(base?.product_ids)) {
            sourceEntries.push(...base.product_ids.map((entry: any) => ({ id: entry })));
        }
        if (base?.product_id != null) {
            sourceEntries.push({ id: base.product_id });
        }
        if (base?.product && typeof base.product === 'object') {
            sourceEntries.push(base.product);
        }

        const productsById = new Map<string, any>();
        sourceEntries.forEach((entry: any, index: number) => {
            const payload =
                entry && typeof entry === 'object' && !Array.isArray(entry)
                    ? entry
                    : { id: entry };
            const key = String(payload?.id ?? payload?.product_id ?? '').trim() || this.generateEntityId('offer_product');
            const previous = productsById.get(key) || {};
            const name = this.pickLocalizedText(payload?.name || payload?.title || previous?.name || `Product ${index + 1}`);
            const slug = this.slugify(payload?.slug || previous?.slug || name || key, 'product');
            const url = this.normalizeEntityUrl(
                payload?.url || previous?.url,
                `/products/${slug || key}`,
                ['/product', '/products']
            );
            const imageUrl = this.sanitizeImageUrl(
                payload?.image?.url ||
                payload?.image ||
                payload?.main_image ||
                previous?.image?.url ||
                previous?.main_image
            ) || this.defaultProductPlaceholder;
            const currency = String(
                payload?.price?.currency ||
                payload?.sale_price?.currency ||
                payload?.regular_price?.currency ||
                previous?.price?.currency ||
                'SAR'
            );
            const price = this.normalizePriceValue(payload?.price ?? payload?.sale_price ?? previous?.price, currency);
            const regularPrice = this.normalizePriceValue(payload?.regular_price ?? previous?.regular_price ?? { amount: price.amount }, currency);
            const salePrice = this.normalizePriceValue(payload?.sale_price ?? previous?.sale_price ?? { amount: price.amount }, currency);
            const categoryIds = this.collectProductCategoryIds(payload);
            const normalizedCategoryIds = categoryIds.length > 0
                ? categoryIds
                : this.collectProductCategoryIds(previous);
            const categories = normalizedCategoryIds.map((id: string) => ({ id, name: id }));

            productsById.set(key, {
                ...previous,
                ...payload,
                id: key,
                name,
                title: this.pickLocalizedText(payload?.title || name),
                slug,
                url,
                description: this.pickLocalizedText(payload?.description || previous?.description || ''),
                status: this.pickLocalizedText(payload?.status || previous?.status || 'sale'),
                type: this.pickLocalizedText(payload?.type || previous?.type || 'product'),
                price,
                regular_price: regularPrice,
                sale_price: salePrice,
                category_ids: normalizedCategoryIds,
                categories,
                category: categories[0] || undefined,
                image: {
                    ...(payload?.image && typeof payload.image === 'object' ? payload.image : {}),
                    url: imageUrl,
                    alt: this.pickLocalizedText(payload?.image?.alt || name)
                }
            });
        });

        return {
            products: Array.from(productsById.values()),
            productIds: Array.from(productsById.keys())
        };
    }

    private normalizeOfferPayload(data: any, key: string) {
        const base = this.normalizeEntityPayload(data, key);
        const title = this.pickLocalizedText(base?.title || base?.name || key);
        const slug = this.slugify(base?.slug || title, 'offer');
        const image = this.sanitizeImageUrl(base?.image || base?.cover?.url) || this.defaultProductPlaceholder;
        const discountValue = this.toNumber(base?.discount_value ?? base?.value ?? base?.discount, 0);
        const { categories, categoryIds } = this.normalizeOfferCategories(base);
        const { products, productIds } = this.normalizeOfferProducts(base);
        const url = this.normalizeEntityUrl(
            base?.url,
            `/offers/${slug || key}`,
            ['/offer', '/offers']
        );

        return {
            ...base,
            id: key,
            name: this.pickLocalizedText(base?.name || title),
            title,
            slug,
            description: this.pickLocalizedText(base?.description || ''),
            url,
            image,
            categories,
            category_ids: categoryIds,
            products,
            product_ids: productIds,
            discount_type: this.pickLocalizedText(base?.discount_type || base?.type || 'percentage'),
            discount_value: discountValue,
            starts_at: this.pickLocalizedText(base?.starts_at || base?.start_at || ''),
            ends_at: this.pickLocalizedText(base?.ends_at || base?.end_at || ''),
            is_active: base?.is_active !== false
        };
    }

    private normalizeMenuNode(data: any, fallbackId: string, fallbackOrder: number) {
        const base = data && typeof data === 'object' ? data : {};
        const id = String(base?.id || fallbackId);
        const title = this.pickLocalizedText(base?.title || base?.name || `رابط ${fallbackOrder}`);
        const rawUrl = this.pickLocalizedText(base?.url || base?.href || '#');
        const url = this.toNavigablePath(rawUrl) || rawUrl || '#';
        const order = Number.isFinite(Number(base?.order)) ? Number(base.order) : fallbackOrder;
        const image = this.sanitizeImageUrl(base?.image || base?.icon || '');
        const childrenRaw = Array.isArray(base?.children) ? base.children : [];
        const children = childrenRaw
            .map((child: any, index: number) =>
                this.normalizeMenuNode(child, `${id}-child-${index + 1}`, index + 1)
            )
            .sort((a: any, b: any) => a.order - b.order);

        const products = Array.isArray(base?.products)
            ? base.products.map((entry: any) => String(entry)).filter(Boolean)
            : [];

        return {
            id,
            title,
            url,
            type: this.pickLocalizedText(base?.type || 'link'),
            order,
            image: image || undefined,
            attrs: typeof base?.attrs === 'string' ? base.attrs : '',
            link_attrs: typeof base?.link_attrs === 'string' ? base.link_attrs : '',
            products,
            children
        };
    }

    private async buildDefaultMenu(storeId: string, type: string) {
        const normalizedType = String(type || 'header').trim().toLowerCase();
        const [categories, pages] = await Promise.all([
            this.storeLogic.getDataEntities(storeId, 'category'),
            this.storeLogic.getDataEntities(storeId, 'page')
        ]);

        const topCategories = (categories || [])
            .filter((category: any) => !String(category?.parent_id || category?.parentId || '').trim())
            .slice(0, 6)
            .map((category: any, index: number) =>
                this.normalizeMenuNode(
                    {
                        id: `category-${category?.id || index + 1}`,
                        title: this.pickLocalizedText(category?.name || category?.title || `تصنيف ${index + 1}`),
                        url: this.pickLocalizedText(category?.url || `/categories/${category?.id || index + 1}`),
                        order: index + 1
                    },
                    `category-${index + 1}`,
                    index + 1
                )
            );

        const staticPages = (pages || [])
            .slice(0, 6)
            .map((page: any, index: number) =>
                this.normalizeMenuNode(
                    {
                        id: `page-${page?.id || index + 1}`,
                        title: this.pickLocalizedText(page?.title || page?.name || `صفحة ${index + 1}`),
                        url: this.pickLocalizedText(page?.url || `/${page?.slug || page?.id || `page-${index + 1}`}`),
                        order: index + 1
                    },
                    `page-${index + 1}`,
                    index + 1
                )
            );

        if (normalizedType === 'footer') {
            return [
                this.normalizeMenuNode(
                    {
                        id: 'footer-pages',
                        title: 'صفحات مهمة',
                        url: '/pages',
                        order: 1,
                        children: staticPages
                    },
                    'footer-pages',
                    1
                ),
                this.normalizeMenuNode(
                    {
                        id: 'footer-contact',
                        title: 'تواصل معنا',
                        url: '/contact',
                        order: 2
                    },
                    'footer-contact',
                    2
                )
            ];
        }

        return [
            this.normalizeMenuNode(
                {
                    id: 'header-home',
                    title: 'الرئيسية',
                    url: '/',
                    order: 1
                },
                'header-home',
                1
            ),
            this.normalizeMenuNode(
                {
                    id: 'header-products',
                    title: 'المنتجات',
                    url: '/products',
                    order: 2
                },
                'header-products',
                2
            ),
            this.normalizeMenuNode(
                {
                    id: 'header-categories',
                    title: 'التصنيفات',
                    url: '/categories',
                    order: 3,
                    children: topCategories
                },
                'header-categories',
                3
            ),
            this.normalizeMenuNode(
                {
                    id: 'header-brands',
                    title: 'الماركات',
                    url: '/brands',
                    order: 4
                },
                'header-brands',
                4
            ),
            this.normalizeMenuNode(
                {
                    id: 'header-blog',
                    title: 'المدونة',
                    url: '/blog',
                    order: 5
                },
                'header-blog',
                5
            )
        ];
    }

    private extractMenuItemsPayload(data: any) {
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.items)) return data.items;
        if (Array.isArray(data?.menu)) return data.menu;
        if (Array.isArray(data?.menus)) return data.menus;
        return [];
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

    private toBoolean(value: any, fallback = false) {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'number') return value !== 0;
        if (typeof value === 'string') {
            const normalized = value.trim().toLowerCase();
            if (!normalized) return fallback;
            if (['1', 'true', 'yes', 'on', 'enabled'].includes(normalized)) return true;
            if (['0', 'false', 'no', 'off', 'disabled'].includes(normalized)) return false;
        }
        return fallback;
    }

    private resolveProductAvailableQuantity(product: any) {
        if (!product || typeof product !== 'object') return 0;
        const trackQuantity = product?.track_quantity !== false;
        const isInfinite = Boolean(product?.is_infinite_quantity) || !trackQuantity;
        if (isInfinite) return Number.MAX_SAFE_INTEGER;
        if (typeof product?.available_quantity === 'number' && Number.isFinite(product.available_quantity)) {
            return Math.max(0, Math.floor(product.available_quantity));
        }
        const baseQuantity = this.toNumber(product?.quantity ?? product?.stock, 0);
        const reserved = this.toNumber(product?.reserved_quantity ?? product?.reserved, 0);
        return Math.max(0, Math.floor(baseQuantity - reserved));
    }

    private isProductBackorderState(product: any) {
        if (!product || typeof product !== 'object') return false;
        const trackQuantity = product?.track_quantity !== false;
        const allowBackorder = this.toBoolean(product?.allow_backorder, false);
        if (!trackQuantity || !allowBackorder) return false;
        if (String(product?.status || '').trim().toLowerCase() === 'hidden') return false;
        if (product?.is_available === false) return false;
        return this.resolveProductAvailableQuantity(product) <= 0;
    }

    private isProductLowStockState(product: any) {
        if (!product || typeof product !== 'object') return false;
        const trackQuantity = product?.track_quantity !== false;
        if (!trackQuantity || Boolean(product?.is_infinite_quantity)) return false;
        if (this.isProductBackorderState(product)) return false;
        const threshold = this.normalizeQuantity(product?.low_stock_threshold, 0);
        if (threshold <= 0) return false;
        const availableQuantity = this.resolveProductAvailableQuantity(product);
        return availableQuantity > 0 && availableQuantity <= threshold;
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

    private toNavigablePath(value: any) {
        const raw = this.pickLocalizedText(value).trim();
        if (!raw) return '';
        if (raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) return raw;

        try {
            const parsed = new URL(raw);
            const path = parsed.pathname || '/';
            const search = parsed.search || '';
            const hash = parsed.hash || '';
            return `${path}${search}${hash}`;
        } catch {
            if (/^[a-z]+:\/\//i.test(raw)) return '';
            if (raw.startsWith('/')) return raw;
            return `/${raw.replace(/^\/+/, '')}`;
        }
    }

    private normalizeEntityUrl(candidate: any, fallbackPath: string, genericPaths: string[] = []) {
        const fallback = fallbackPath.startsWith('/') ? fallbackPath : `/${fallbackPath}`;
        const path = this.toNavigablePath(candidate);
        if (!path) return fallback;
        if (path.startsWith('#') || path.startsWith('mailto:') || path.startsWith('tel:')) return path;

        const normalizedPathOnly = path
            .split('?')[0]
            .split('#')[0]
            .replace(/\/+$/g, '') || '/';
        const genericSet = new Set(
            genericPaths.map((entry) => {
                const token = String(entry || '').trim().toLowerCase();
                if (!token) return '';
                return token.startsWith('/') ? token : `/${token}`;
            }).filter(Boolean)
        );

        if (normalizedPathOnly === '/' || genericSet.has(normalizedPathOnly.toLowerCase())) {
            return fallback;
        }

        return path;
    }

    private pickQueryValue(query: Record<string, any> | undefined, keys: string[], fallback = '') {
        if (!query) return fallback;
        for (const key of keys) {
            const raw = query[key];
            if (raw == null) continue;
            if (Array.isArray(raw)) {
                const first = raw.find((entry) => entry != null && String(entry).trim());
                if (first != null) return String(first).trim();
                continue;
            }
            const value = String(raw).trim();
            if (value) return value;
        }
        return fallback;
    }

    private pickQueryInt(query: Record<string, any> | undefined, keys: string[], fallback: number) {
        const raw = this.pickQueryValue(query, keys, String(fallback));
        const parsed = Number(raw);
        if (!Number.isFinite(parsed)) return fallback;
        return Math.max(1, Math.floor(parsed));
    }

    private pickQueryNumber(query: Record<string, any> | undefined, keys: string[]): number | undefined {
        const raw = this.pickQueryValue(query, keys, '');
        if (!raw) return undefined;
        const parsed = Number(raw);
        if (!Number.isFinite(parsed)) return undefined;
        return parsed;
    }

    private async getNormalizedProductsByReference(storeId: string) {
        const products = await this.storeLogic.getDataEntities(storeId, 'product');
        const normalizedProducts = await Promise.all(
            (products || []).map((product: any) =>
                this.normalizeProductPayload(
                    storeId,
                    product,
                    String(product?.id || this.generateEntityId('product'))
                )
            )
        );

        const productsByRef = new Map<string, any>();
        (normalizedProducts || []).forEach((product: any) => {
            const refs = [
                String(product?.id || '').trim(),
                String(product?.slug || '').trim(),
                String(product?.url || '').trim().split('/').filter(Boolean).pop() || ''
            ].filter(Boolean);
            refs.forEach((ref) => productsByRef.set(ref, product));
        });

        return {
            normalizedProducts,
            productsByRef
        };
    }

    private getProductFromReferenceMap(productsByRef: Map<string, any>, ...candidateRefs: any[]) {
        for (const rawRef of candidateRefs) {
            const ref = String(rawRef || '').trim();
            if (!ref) continue;
            const matched = productsByRef.get(ref);
            if (matched) return matched;
        }
        return null;
    }

    private resolveProductCartLimit(product: any) {
        if (!product || typeof product !== 'object') {
            return {
                isAvailable: true,
                maxQuantity: 99,
                isInfiniteQuantity: true,
                allowBackorder: false
            };
        }

        const trackQuantity = product?.track_quantity !== false;
        const allowBackorder = this.toBoolean(product?.allow_backorder, false);
        const isInfiniteQuantity = Boolean(product?.is_infinite_quantity) || !trackQuantity;
        const quantity = this.resolveProductAvailableQuantity(product);
        const explicitMax = this.normalizeQuantity(product?.max_quantity, 0);
        const rawStatus = String(product?.status || '').trim().toLowerCase();
        const inventoryStatus = String(product?.inventory_status || '').trim().toLowerCase();
        const isHidden = rawStatus === 'hidden' || inventoryStatus === 'hidden';
        const isOutOfStock =
            !isHidden &&
            (inventoryStatus === 'out_of_stock' ||
                (Boolean(product?.is_out_of_stock) && !allowBackorder));
        const isAvailable =
            !isHidden &&
            product?.is_available !== false &&
            (!isOutOfStock || allowBackorder) &&
            (isInfiniteQuantity || quantity > 0 || allowBackorder);

        if (!isAvailable) {
            return {
                isAvailable: false,
                maxQuantity: 0,
                isInfiniteQuantity,
                allowBackorder: false
            };
        }

        if (isInfiniteQuantity) {
            return {
                isAvailable: true,
                maxQuantity: explicitMax || 99,
                isInfiniteQuantity: true,
                allowBackorder
            };
        }

        if (allowBackorder && quantity <= 0) {
            return {
                isAvailable: true,
                maxQuantity: explicitMax || 99,
                isInfiniteQuantity: false,
                allowBackorder: true
            };
        }

        const stockBound = Math.max(0, quantity);
        const maxQuantity = explicitMax > 0
            ? Math.min(explicitMax, stockBound || explicitMax)
            : stockBound;

        return {
            isAvailable: stockBound > 0,
            maxQuantity: Math.max(0, maxQuantity),
            isInfiniteQuantity: false,
            allowBackorder
        };
    }

    private buildPaginatedResponse<T>(items: T[], total: number, page: number, perPage: number, status = 200) {
        const safePerPage = Math.max(1, perPage);
        const safePage = Math.max(1, page);
        const totalPages = Math.max(1, Math.ceil(total / safePerPage));
        const response: any = this.wrapResponse(items, status);
        response.pagination = {
            count: items.length,
            total,
            perPage: safePerPage,
            currentPage: safePage,
            totalPages,
            links: {}
        };
        return response;
    }

    private resolveProductPriceAmount(product: any) {
        return this.toNumber(
            product?.sale_price?.amount ??
            product?.price?.amount ??
            product?.regular_price?.amount ??
            product?.price,
            0
        );
    }

    private sortProducts(items: any[], rawSort: string) {
        const sort = String(rawSort || 'ourSuggest').trim().toLowerCase();
        const sorted = [...items];

        if (sort === 'pricefromtoptolow' || sort === 'price_desc' || sort === 'price-desc' || sort === 'price_high_to_low') {
            return sorted.sort((a, b) => this.resolveProductPriceAmount(b) - this.resolveProductPriceAmount(a));
        }

        if (sort === 'pricefromlowtotop' || sort === 'price_asc' || sort === 'price-asc' || sort === 'price_low_to_high') {
            return sorted.sort((a, b) => this.resolveProductPriceAmount(a) - this.resolveProductPriceAmount(b));
        }

        if (sort === 'topsrated' || sort === 'toprated' || sort === 'rating' || sort === 'rating_desc' || sort === 'rating-desc') {
            return sorted.sort((a, b) => {
                const aStars = this.toNumber(a?.rating?.stars, 0);
                const bStars = this.toNumber(b?.rating?.stars, 0);
                if (bStars !== aStars) return bStars - aStars;
                const aCount = this.toNumber(a?.rating?.count, 0);
                const bCount = this.toNumber(b?.rating?.count, 0);
                return bCount - aCount;
            });
        }

        if (sort === 'bestsell' || sort === 'best_sell' || sort === 'best-sell' || sort === 'popular') {
            return sorted.sort(
                (a, b) => this.toNumber(b?.sold_quantity ?? b?.sales_count, 0) - this.toNumber(a?.sold_quantity ?? a?.sales_count, 0)
            );
        }

        if (sort === 'newest' || sort === 'latest' || sort === 'created_desc' || sort === 'created-desc') {
            return sorted.sort((a, b) =>
                new Date(String(b?.created_at || b?.published_at || 0)).getTime() -
                new Date(String(a?.created_at || a?.published_at || 0)).getTime()
            );
        }

        if (sort === 'oldest' || sort === 'created_asc' || sort === 'created-asc') {
            return sorted.sort((a, b) =>
                new Date(String(a?.created_at || a?.published_at || 0)).getTime() -
                new Date(String(b?.created_at || b?.published_at || 0)).getTime()
            );
        }

        if (sort === 'featured' || sort === 'featured_first' || sort === 'featured-first') {
            return sorted.sort((a, b) => {
                const featuredDelta = Number(Boolean(b?.is_featured)) - Number(Boolean(a?.is_featured));
                if (featuredDelta !== 0) return featuredDelta;
                return this.resolveProductPriceAmount(b) - this.resolveProductPriceAmount(a);
            });
        }

        if (sort === 'stockfromtoptolow' || sort === 'stock_desc' || sort === 'stock-desc' || sort === 'stock_high_to_low') {
            return sorted.sort((a, b) => this.resolveProductAvailableQuantity(b) - this.resolveProductAvailableQuantity(a));
        }

        if (sort === 'stockfromlowtotop' || sort === 'stock_asc' || sort === 'stock-asc' || sort === 'stock_low_to_high') {
            return sorted.sort((a, b) => this.resolveProductAvailableQuantity(a) - this.resolveProductAvailableQuantity(b));
        }

        return sorted;
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

    private async getSpecialOffersRaw(storeId: string) {
        const [specialOffers, offers] = await Promise.all([
            this.storeLogic.getDataEntities(storeId, 'specialOffer'),
            this.storeLogic.getDataEntities(storeId, 'offer')
        ]);
        return [...(specialOffers || []), ...(offers || [])];
    }

    private async getReviewsRaw(storeId: string) {
        const [primary, alt] = await Promise.all([
            this.storeLogic.getDataEntities(storeId, 'review'),
            this.storeLogic.getDataEntities(storeId, 'product_review')
        ]);
        return [...(primary || []), ...(alt || [])];
    }

    private async getQuestionsRaw(storeId: string) {
        const [primary, alt] = await Promise.all([
            this.storeLogic.getDataEntities(storeId, 'question'),
            this.storeLogic.getDataEntities(storeId, 'product_question')
        ]);
        return [...(primary || []), ...(alt || [])];
    }

    private normalizeReviewPayload(data: any, key: string) {
        const base = this.normalizeEntityPayload(data, key);
        const productId = String(
            base?.product_id ??
            base?.productId ??
            base?.product?.id ??
            ''
        ).trim();
        const stars = Math.min(5, Math.max(1, Math.round(this.toNumber(base?.stars ?? base?.rating ?? 5, 5))));
        const customerName = this.pickLocalizedText(base?.customer_name || base?.customer?.name || 'عميل المتجر');
        const customerAvatar = this.sanitizeImageUrl(base?.customer_avatar || base?.customer?.avatar || '') || this.defaultProductPlaceholder;
        const content = this.pickLocalizedText(base?.content || base?.comment || base?.text || '');

        return {
            ...base,
            id: key,
            product_id: productId,
            stars,
            content,
            customer_name: customerName,
            customer_avatar: customerAvatar,
            customer: {
                id: String(base?.customer?.id || this.generateEntityId('customer')),
                name: customerName,
                avatar: customerAvatar
            },
            is_published: base?.is_published !== false,
            created_at: this.pickLocalizedText(base?.created_at || new Date().toISOString())
        };
    }

    private normalizeQuestionPayload(data: any, key: string) {
        const base = this.normalizeEntityPayload(data, key);
        const productId = String(
            base?.product_id ??
            base?.productId ??
            base?.product?.id ??
            ''
        ).trim();
        const customerName = this.pickLocalizedText(base?.customer_name || base?.customer?.name || 'زائر');
        const customerAvatar = this.sanitizeImageUrl(base?.customer_avatar || base?.customer?.avatar || '') || this.defaultProductPlaceholder;
        const question = this.pickLocalizedText(base?.question || base?.title || base?.content || base?.text || '');
        const answer = this.pickLocalizedText(base?.answer || base?.reply || '');
        const isAnswered = base?.is_answered != null ? Boolean(base.is_answered) : Boolean(answer);

        return {
            ...base,
            id: key,
            product_id: productId,
            question,
            answer,
            is_answered: isAnswered,
            is_published: base?.is_published !== false,
            customer_name: customerName,
            customer_avatar: customerAvatar,
            customer: {
                id: String(base?.customer?.id || this.generateEntityId('customer')),
                name: customerName,
                avatar: customerAvatar
            },
            created_at: this.pickLocalizedText(base?.created_at || new Date().toISOString()),
            answered_at: isAnswered
                ? this.pickLocalizedText(base?.answered_at || base?.updated_at || new Date().toISOString())
                : ''
        };
    }

    private async resolveFeedbackProductId(storeId: string, rawProductId: any) {
        const directId = String(rawProductId || '').trim();
        if (directId) {
            const existing = await this.storeLogic.getDataEntity(storeId, 'product', directId);
            if (existing) return directId;
        }

        const products = await this.storeLogic.getDataEntities(storeId, 'product');
        const fallback = String(products?.[0]?.id || '').trim();
        return fallback || directId;
    }

    private async refreshProductFeedbackMetrics(storeId: string, productId: string) {
        const normalizedProductId = String(productId || '').trim();
        if (!normalizedProductId) return;

        const currentProduct = await this.storeLogic.getDataEntity(storeId, 'product', normalizedProductId);
        if (!currentProduct) return;

        const [reviewsRaw, questionsRaw] = await Promise.all([
            this.getReviewsRaw(storeId),
            this.getQuestionsRaw(storeId)
        ]);

        const reviews = (reviewsRaw || [])
            .map((entry: any) =>
                this.normalizeReviewPayload(
                    entry,
                    String(entry?.id || this.generateEntityId('review'))
                )
            )
            .filter((entry: any) => entry.product_id === normalizedProductId && entry.is_published !== false);

        const questions = (questionsRaw || [])
            .map((entry: any) =>
                this.normalizeQuestionPayload(
                    entry,
                    String(entry?.id || this.generateEntityId('question'))
                )
            )
            .filter((entry: any) => entry.product_id === normalizedProductId && entry.is_published !== false);

        const comments = reviews.map((review: any) => ({
            id: String(review.id),
            stars: Number(review.stars || 0),
            content: this.pickLocalizedText(review.content || ''),
            created_at: this.pickLocalizedText(review.created_at || new Date().toISOString()),
            customer: {
                name: this.pickLocalizedText(review.customer_name || review.customer?.name || 'عميل المتجر'),
                avatar: this.pickLocalizedText(review.customer_avatar || review.customer?.avatar || this.defaultProductPlaceholder)
            }
        }));

        const ratingCount = comments.length;
        const ratingStars = ratingCount > 0
            ? Number((comments.reduce((sum: number, review: any) => sum + Number(review.stars || 0), 0) / ratingCount).toFixed(2))
            : 0;

        const questionsView = questions.map((question: any) => ({
            id: String(question.id),
            question: this.pickLocalizedText(question.question || ''),
            answer: this.pickLocalizedText(question.answer || ''),
            is_answered: Boolean(question.is_answered),
            created_at: this.pickLocalizedText(question.created_at || new Date().toISOString()),
            customer: {
                name: this.pickLocalizedText(question.customer_name || question.customer?.name || 'زائر'),
                avatar: this.pickLocalizedText(question.customer_avatar || question.customer?.avatar || this.defaultProductPlaceholder)
            }
        }));

        const payload = await this.normalizeProductPayload(
            storeId,
            {
                ...currentProduct,
                comments,
                rating: ratingCount > 0
                    ? {
                        stars: ratingStars,
                        count: ratingCount
                    }
                    : undefined,
                questions: questionsView,
                questions_count: questionsView.length
            },
            normalizedProductId
        );

        await this.storeLogic.upsertDataEntity(storeId, 'product', normalizedProductId, payload);
    }

    private normalizeBlogCategoryPayload(data: any, key: string) {
        const base = this.normalizeEntityPayload(data, key);
        const title = this.pickLocalizedText(base?.title || base?.name || key);
        const slug = this.slugify(base?.slug || title, 'blog-category');
        const url = this.normalizeEntityUrl(
            base?.url,
            `/blog/categories/${slug || key}`,
            ['/blog/category', '/blog/categories', '/category', '/categories']
        );
        return {
            ...base,
            id: key,
            name: this.pickLocalizedText(base?.name || base?.title || slug),
            title,
            slug,
            description: this.pickLocalizedText(base?.description || ''),
            url,
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
        const url = this.normalizeEntityUrl(
            base?.url,
            `/blog/${slug || key}`,
            ['/blog', '/article', '/articles']
        );

        return {
            ...base,
            id: key,
            name: this.pickLocalizedText(base?.name || base?.title || slug),
            title,
            slug,
            summary: this.pickLocalizedText(base?.summary || base?.excerpt || ''),
            description: this.pickLocalizedText(base?.description || base?.content || ''),
            image: this.sanitizeImageUrl(base?.image || base?.cover?.url) || this.defaultProductPlaceholder,
            url,
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
        const raw = String(sourceKey || '').trim().toLowerCase();
        if (!raw) return '';

        const aliasMap: Record<string, string> = {
            product: 'products',
            products: 'products',
            product_list: 'products',
            featured_products: 'products',
            latest_products: 'products',
            best_seller_products: 'products',
            categories: 'categories',
            category: 'categories',
            cats: 'categories',
            brand: 'brands',
            brands: 'brands',
            offers: 'offers',
            offer: 'offers',
            special_offer: 'offers',
            special_offers: 'offers',
            discounts: 'offers',
            page: 'pages',
            pages: 'pages',
            static_pages: 'pages',
            blog_article: 'blog_articles',
            blog_articles: 'blog_articles',
            article: 'blog_articles',
            articles: 'blog_articles',
            post: 'blog_articles',
            posts: 'blog_articles',
            blog_posts: 'blog_articles',
            blog_category: 'blog_categories',
            blog_categories: 'blog_categories',
            article_categories: 'blog_categories',
            post_categories: 'blog_categories',
            review: 'reviews',
            reviews: 'reviews',
            product_reviews: 'reviews',
            question: 'questions',
            questions: 'questions',
            faq: 'questions',
            faqs: 'questions',
            product_questions: 'questions',
            offers_link: 'offers_link',
            brands_link: 'brands_link',
            blog_link: 'blog_link',
            custom: 'custom',
            manual: 'custom',
            external: 'custom',
            url: 'custom',
            link: 'custom'
        };

        return aliasMap[raw] || raw;
    }

    private getSourceDisplayLabel(sourceKey: string) {
        const source = this.normalizeSourceKey(sourceKey);
        const labels: Record<string, string> = {
            products: 'منتج',
            categories: 'تصنيف',
            brands: 'ماركة تجارية',
            offers: 'عرض',
            pages: 'صفحة',
            blog_articles: 'مقالة مدونة',
            blog_categories: 'تصنيف مدونة',
            reviews: 'تقييم',
            questions: 'سؤال',
            offers_link: 'التخفيضات',
            brands_link: 'الماركات التجارية',
            blog_link: 'المدونة',
            custom: 'رابط مخصص'
        };
        return labels[source] || source || 'خيار';
    }

    private inferFieldSource(field: any) {
        const hints = [
            field?.source,
            field?.id,
            field?.name,
            field?.key,
            field?.label,
            field?.title
        ]
            .map((entry: any) => String(entry || '').toLowerCase())
            .join(' ');

        if (!hints.trim()) return '';

        if (/question|faq|سؤال/.test(hints)) return 'questions';
        if (/review|rating|تقييم/.test(hints)) return 'reviews';
        if (/blog.*categor|post.*categor|تصنيف.*مدون/.test(hints)) return 'blog_categories';
        if (/blog|post|article|مقال/.test(hints)) return 'blog_articles';
        if (/brand|مارك/.test(hints)) return 'brands';
        if (/categor|cat|تصنيف/.test(hints)) return 'categories';
        if (/offer|discount|عرض|تخفيض/.test(hints)) return 'offers';
        if (/page|static|صفحة/.test(hints)) return 'pages';
        if (/product|sku|منتج/.test(hints)) return 'products';
        if (/url|link|رابط/.test(hints)) return 'custom';
        return '';
    }

    private buildDefaultVariableSources(field: any, sources: Record<string, any[]>) {
        const inferred = this.normalizeSourceKey(this.inferFieldSource(field));
        const base = inferred && inferred !== 'custom'
            ? [inferred]
            : [
                'products',
                'categories',
                'brands',
                'pages',
                'blog_articles',
                'blog_categories',
                'offers_link',
                'brands_link',
                'blog_link',
                'custom'
            ];

        return Array.from(new Set(base.map((entry) => this.normalizeSourceKey(entry)).filter(Boolean)))
            .filter((entry) => Object.prototype.hasOwnProperty.call(sources, entry))
            .map((entry) => ({
                key: entry,
                value: entry,
                label: this.getSourceDisplayLabel(entry)
            }));
    }

    private getSourceEntityKey(item: any, fallbackPrefix: string) {
        const candidate = item?.id ?? item?.slug ?? item?.key ?? item?.code ?? item?.name;
        const normalized = String(candidate || '').trim();
        return normalized || this.generateEntityId(fallbackPrefix);
    }

    private getSourceEntityUrl(sourceKey: string, item: any) {
        const source = this.normalizeSourceKey(sourceKey);
        const idOrSlug = String(item?.slug || item?.id || '').trim();

        if (source === 'products') return this.normalizeEntityUrl(item?.url, `/products/${idOrSlug || 'item'}`, ['/product', '/products']);
        if (source === 'categories') return this.normalizeEntityUrl(item?.url, `/categories/${idOrSlug || 'item'}`, ['/category', '/categories', '/cat', '/cats']);
        if (source === 'brands') return this.normalizeEntityUrl(item?.url, `/brands/${idOrSlug || 'item'}`, ['/brand', '/brands']);
        if (source === 'offers') return this.normalizeEntityUrl(item?.url, `/offers/${idOrSlug || 'item'}`, ['/offer', '/offers']);
        if (source === 'pages') return this.normalizeEntityUrl(item?.url, `/pages/${idOrSlug || 'item'}`, ['/page', '/pages']);
        if (source === 'blog_articles') return this.normalizeEntityUrl(item?.url, `/blog/${idOrSlug || 'item'}`, ['/blog', '/article', '/articles']);
        if (source === 'blog_categories') return this.normalizeEntityUrl(item?.url, `/blog/categories/${idOrSlug || 'item'}`, ['/blog/category', '/blog/categories', '/category', '/categories']);
        if (source === 'reviews') return this.pickLocalizedText(item?.url || `/products/${item?.product_id || ''}#reviews`);
        if (source === 'questions') return this.pickLocalizedText(item?.url || `/products/${item?.product_id || ''}#questions`);
        if (source === 'offers_link') return '/offers';
        if (source === 'brands_link') return '/brands';
        if (source === 'blog_link') return '/blog';
        return this.toNavigablePath(item?.url) || this.pickLocalizedText(item?.url || '');
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
                    const value = this.normalizeSourceKey(
                        entry?.value ??
                        entry?.key ??
                        entry?.id ??
                        entry?.source
                    );
                    if (!value) return null;
                    return {
                        ...entry,
                        key: String(entry?.key || value),
                        value,
                        label: this.pickLocalizedText(entry?.label || this.getSourceDisplayLabel(value))
                    };
                })
                .filter(Boolean)
            : [];

        const effectiveEntries = entries.length > 0
            ? entries
            : this.buildDefaultVariableSources(normalized, sources);

        const optionsBySource: Record<string, Array<{ value: string; label: string; url: string }>> = {};
        (effectiveEntries as any[]).forEach((entry: any) => {
            const value = this.normalizeSourceKey(entry?.value);
            optionsBySource[value] = this.toVariableListOptions(value, sources[value] || []);
        });

        normalized.variableSources = effectiveEntries;
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

        const inferredSource = this.inferFieldSource(normalized);
        const sourceKey = this.normalizeSourceKey(normalized?.source || inferredSource);
        const sourceItems = sources[sourceKey] || [];
        const options = this.toSelectableOptions(sourceItems);
        const selectedIds = this.extractItemSelectionIds(normalized);
        const labelByValue = new Map(options.map((opt) => [opt.value, opt.label]));

        normalized.source = sourceKey;
        normalized.options = options;
        normalized.selected = selectedIds.map((id) => ({
            value: id,
            label: labelByValue.get(id) || id
        }));

        return normalized;
    }

    private roundAmount(value: number) {
        if (!Number.isFinite(value)) return 0;
        return Number(value.toFixed(2));
    }

    private normalizeCartCouponCode(value: any) {
        return this.pickLocalizedText(value || '').trim();
    }

    private async buildCartState(storeId: string, rawItems: any[], couponCode = '') {
        const { normalizedProducts, productsByRef } = await this.getNormalizedProductsByReference(storeId);

        const defaultCurrency =
            String(normalizedProducts?.[0]?.price?.currency || normalizedProducts?.[0]?.currency || 'SAR');

        const normalizedItems = (rawItems || [])
            .map((entry: any, index: number) => {
                const base = entry && typeof entry === 'object' ? entry : {};
                const rawProductRef = String(
                    base?.product_id ??
                    base?.product?.id ??
                    base?.productId ??
                    base?.id ??
                    ''
                ).trim();
                const product = this.getProductFromReferenceMap(
                    productsByRef,
                    rawProductRef,
                    base?.id,
                    base?.sku
                );
                const productId = String(product?.id || rawProductRef || base?.id || this.generateEntityId('product')).trim();
                const itemId = String(base?.id || productId || this.generateEntityId('cart_item')).trim();
                const itemLimit = this.resolveProductCartLimit(product);
                let quantity = this.normalizeQuantity(base?.quantity, 1) || 1;
                if (product && itemLimit.maxQuantity <= 0) {
                    quantity = 0;
                } else if (itemLimit.maxQuantity > 0 && quantity > itemLimit.maxQuantity) {
                    quantity = itemLimit.maxQuantity;
                }

                const unitPrice = this.toNumber(
                    base?.unit_price ??
                    base?.price ??
                    base?.sale_price?.amount ??
                    base?.sale_price ??
                    product?.sale_price?.amount ??
                    product?.price?.amount ??
                    product?.price,
                    0
                );
                const regularPrice = this.toNumber(
                    base?.product_price ??
                    base?.regular_price?.amount ??
                    base?.regular_price ??
                    product?.regular_price?.amount ??
                    unitPrice,
                    unitPrice
                );
                const originalPrice = this.toNumber(base?.original_price, regularPrice);
                const total = this.roundAmount(unitPrice * quantity);
                const totalSpecialPrice = this.roundAmount(this.toNumber(base?.total_special_price, total) || total);
                const specialPrice = this.toNumber(
                    base?.special_price,
                    Math.max(0, this.roundAmount(regularPrice - unitPrice))
                );
                const hasDiscount = Boolean(
                    base?.has_discount ??
                    base?.offer ??
                    (specialPrice > 0 || unitPrice < regularPrice)
                );

                const productName = this.pickLocalizedText(
                    base?.product_name ||
                    base?.name ||
                    product?.name ||
                    `Product ${index + 1}`
                );
                const fallbackSlug = this.slugify(product?.slug || productName || productId, 'product');
                const url = this.normalizeEntityUrl(
                    base?.url || product?.url,
                    `/products/${fallbackSlug || productId}`,
                    ['/product', '/products']
                );
                const productImage = this.sanitizeImageUrl(
                    base?.product_image ||
                    base?.image?.url ||
                    base?.image ||
                    product?.main_image ||
                    product?.image?.url ||
                    product?.thumbnail
                ) || this.defaultProductPlaceholder;

                const detailedOffers = Array.isArray(base?.detailed_offers) ? base.detailed_offers : [];
                const offer = base?.offer && typeof base.offer === 'object'
                    ? {
                        discount: this.toNumber(base.offer.discount, Math.max(0, regularPrice - unitPrice)),
                        is_free: Boolean(base.offer.is_free),
                        names: this.pickLocalizedText(base.offer.names || '')
                    }
                    : undefined;

                return {
                    ...base,
                    id: itemId,
                    item_id: itemId,
                    product_id: productId,
                    product_name: productName,
                    product_image: productImage,
                    url,
                    quantity,
                    max_quantity: product
                        ? itemLimit.maxQuantity
                        : (this.normalizeQuantity(base?.max_quantity, 99) || 99),
                    is_hidden_quantity: Boolean(base?.is_hidden_quantity),
                    type: this.pickLocalizedText(base?.type || product?.type || 'product'),
                    is_available: product ? itemLimit.isAvailable : base?.is_available !== false,
                    can_add_note: Boolean(base?.can_add_note),
                    can_upload_file: Boolean(base?.can_upload_file),
                    notes: this.pickLocalizedText(base?.notes || ''),
                    offer,
                    detailed_offers: detailedOffers,
                    has_discount: hasDiscount,
                    is_on_sale: Boolean(base?.is_on_sale ?? unitPrice < originalPrice),
                    special_price: specialPrice,
                    unit_price: unitPrice,
                    price: unitPrice,
                    product_price: regularPrice,
                    original_price: originalPrice,
                    total,
                    total_special_price: totalSpecialPrice,
                    options: Array.isArray(base?.options) ? base.options : []
                };
            })
            .filter((entry: any) => entry.id && entry.product_id);

        const itemsCount = normalizedItems.reduce((acc: number, item: any) => acc + this.normalizeQuantity(item.quantity, 0), 0);
        const subTotal = this.roundAmount(normalizedItems.reduce((acc: number, item: any) => acc + this.toNumber(item.total, 0), 0));
        const optionsTotal = 0;
        const normalizedCoupon = this.normalizeCartCouponCode(couponCode);
        const couponDiscount = normalizedCoupon ? this.roundAmount(subTotal * 0.1) : 0;
        const discount = couponDiscount;
        const taxBase = Math.max(0, this.roundAmount(subTotal + optionsTotal - discount));
        const taxAmount = this.roundAmount(taxBase * 0.15);
        const shippingCost = 0;
        const total = this.roundAmount(taxBase + taxAmount + shippingCost);
        const freeShippingMinimum = 500;
        const freeShippingPercent = freeShippingMinimum > 0
            ? Math.min(100, this.roundAmount((taxBase / freeShippingMinimum) * 100))
            : 100;
        const hasFreeShipping = freeShippingPercent >= 100;
        const freeShippingRemaining = Math.max(0, this.roundAmount(freeShippingMinimum - taxBase));

        return {
            id: 'default',
            currency: defaultCurrency,
            items: normalizedItems,
            options: [],
            count: itemsCount,
            totals: {
                items_count: itemsCount,
                subtotal: subTotal
            },
            sub_total: subTotal,
            options_total: optionsTotal,
            discount,
            total_discount: discount,
            coupon: normalizedCoupon || undefined,
            tax_amount: taxAmount,
            real_shipping_cost: shippingCost,
            has_shipping: shippingCost > 0,
            is_require_shipping: normalizedItems.some((item: any) => String(item?.type || 'product') !== 'digital'),
            total,
            gift: {
                enabled: false,
                type: 'physical',
                text: ''
            },
            free_shipping_bar: {
                minimum_amount: freeShippingMinimum,
                has_free_shipping: hasFreeShipping,
                percent: freeShippingPercent,
                remaining: freeShippingRemaining
            }
        };
    }

    private async persistCartState(storeId: string, cart: any) {
        const payload = {
            ...(cart || {}),
            id: 'default',
            updated_at: new Date().toISOString()
        };
        await this.storeLogic.upsertDataEntity(storeId, 'cart', 'default', payload);
        return payload;
    }

    private async getOrCreateCart(storeId: string) {
        const current = await this.storeLogic.getDataEntity(storeId, 'cart', 'default');
        if (current && typeof current === 'object') {
            const rawItems = Array.isArray((current as any).items) ? (current as any).items : [];
            const coupon = this.normalizeCartCouponCode((current as any).coupon);
            const normalized = await this.buildCartState(storeId, rawItems, coupon);
            await this.persistCartState(storeId, normalized);
            return normalized;
        }

        const emptyCart = await this.buildCartState(storeId, [], '');
        await this.persistCartState(storeId, emptyCart);
        return emptyCart;
    }

    private normalizeWishlistProductIds(input: any): string[] {
        const source =
            Array.isArray(input)
                ? input
                : Array.isArray(input?.product_ids)
                    ? input.product_ids
                    : Array.isArray(input?.items)
                        ? input.items
                        : [];

        return Array.from(
            new Set(
                source
                    .map((entry: any) => {
                        if (entry == null) return '';
                        if (typeof entry === 'string' || typeof entry === 'number') return String(entry).trim();
                        if (typeof entry === 'object') {
                            const ref = entry?.product_id ?? entry?.id ?? entry?.value;
                            return String(ref || '').trim();
                        }
                        return '';
                    })
                    .filter(Boolean)
            )
        );
    }

    private async persistWishlistState(storeId: string, wishlist: any) {
        const productIds = this.normalizeWishlistProductIds(wishlist);
        const payload = {
            id: 'default',
            product_ids: productIds,
            items: [...productIds],
            count: productIds.length,
            updated_at: new Date().toISOString()
        };
        await this.storeLogic.upsertDataEntity(storeId, 'wishlist', 'default', payload);
        return payload;
    }

    private async getOrCreateWishlist(storeId: string) {
        const current = await this.storeLogic.getDataEntity(storeId, 'wishlist', 'default');
        if (current && typeof current === 'object') {
            return this.persistWishlistState(storeId, current);
        }
        return this.persistWishlistState(storeId, { product_ids: [] });
    }

    public async getWishlist(storeId: string) {
        const [wishlist, productsContext] = await Promise.all([
            this.getOrCreateWishlist(storeId),
            this.getNormalizedProductsByReference(storeId)
        ]);

        const products = (wishlist.product_ids || [])
            .map((id: string) => productsContext.productsByRef.get(String(id)))
            .filter(Boolean);

        return this.wrapResponse({
            ...wishlist,
            products: this.mapToSchema(products, 'product')
        });
    }

    public async addWishlistItem(storeId: string, data: any) {
        const rawPayload = data && typeof data === 'object' ? data : {};
        const rawRef = String(
            rawPayload?.product_id ??
            rawPayload?.productId ??
            rawPayload?.id ??
            rawPayload?.item_id ??
            ''
        ).trim();
        if (!rawRef) {
            return {
                status: 400,
                success: false,
                error: {
                    message: 'Product id is required'
                }
            } as any;
        }

        const [{ productsByRef }, current] = await Promise.all([
            this.getNormalizedProductsByReference(storeId),
            this.getOrCreateWishlist(storeId)
        ]);
        const product = this.getProductFromReferenceMap(productsByRef, rawRef);
        if (!product) {
            return {
                status: 404,
                success: false,
                error: {
                    message: 'Product not found'
                }
            } as any;
        }

        const canonicalId = String(product?.id || rawRef).trim();
        const currentIds = this.normalizeWishlistProductIds(current);
        const nextIds = currentIds.includes(canonicalId)
            ? currentIds
            : [...currentIds, canonicalId];
        const stored = await this.persistWishlistState(storeId, { product_ids: nextIds });
        return this.wrapResponse(stored, 201);
    }

    public async deleteWishlistItem(storeId: string, itemId: string) {
        const targetId = String(itemId || '').trim();
        if (!targetId) {
            return {
                status: 400,
                success: false,
                error: {
                    message: 'Wishlist item id is required'
                }
            } as any;
        }

        const current = await this.getOrCreateWishlist(storeId);
        const currentIds = this.normalizeWishlistProductIds(current);
        const nextIds = currentIds.filter((id) => id !== targetId);
        const stored = await this.persistWishlistState(storeId, { product_ids: nextIds });
        return this.wrapResponse(stored);
    }

    public async toggleWishlistItem(storeId: string, data: any) {
        const rawPayload = data && typeof data === 'object' ? data : {};
        const rawRef = String(
            rawPayload?.product_id ??
            rawPayload?.productId ??
            rawPayload?.id ??
            rawPayload?.item_id ??
            ''
        ).trim();
        if (!rawRef) {
            return {
                status: 400,
                success: false,
                error: {
                    message: 'Product id is required'
                }
            } as any;
        }

        const [{ productsByRef }, current] = await Promise.all([
            this.getNormalizedProductsByReference(storeId),
            this.getOrCreateWishlist(storeId)
        ]);
        const product = this.getProductFromReferenceMap(productsByRef, rawRef);
        if (!product) {
            return {
                status: 404,
                success: false,
                error: {
                    message: 'Product not found'
                }
            } as any;
        }

        const canonicalId = String(product?.id || rawRef).trim();
        const currentIds = this.normalizeWishlistProductIds(current);
        const isExisting = currentIds.includes(canonicalId);
        const nextIds = isExisting
            ? currentIds.filter((id) => id !== canonicalId)
            : [...currentIds, canonicalId];
        const stored = await this.persistWishlistState(storeId, { product_ids: nextIds });
        return this.wrapResponse({
            ...stored,
            action: isExisting ? 'removed' : 'added',
            product_id: canonicalId
        });
    }

    public async getCart(storeId: string) {
        const cart = await this.getOrCreateCart(storeId);
        return this.wrapResponse({
            ...cart,
            id: 'default'
        });
    }

    public async addCartItem(storeId: string, data: any) {
        const cart = await this.getOrCreateCart(storeId);
        const payload = data && typeof data === 'object' ? data : {};
        const candidateId =
            payload?.id ||
            payload?.item_id ||
            payload?.product_id ||
            payload?.product?.id ||
            this.generateEntityId('cart_item');
        const itemId = String(candidateId);
        const quantityToAdd = this.normalizeQuantity(payload?.quantity, 1) || 1;

        const { productsByRef } = await this.getNormalizedProductsByReference(storeId);
        const product = this.getProductFromReferenceMap(
            productsByRef,
            payload?.product_id,
            payload?.product?.id,
            payload?.id
        );
        const productLimit = this.resolveProductCartLimit(product);
        if (product && !productLimit.isAvailable) {
            return {
                status: 400,
                success: false,
                error: {
                    message: 'Product is out of stock'
                }
            } as any;
        }

        const existingIndex = (cart.items || []).findIndex((item: any) =>
            String(item?.id || '') === itemId || String(item?.product_id || '') === itemId
        );
        let updatedItems = [...(cart.items || [])];

        if (existingIndex >= 0) {
            const existing = updatedItems[existingIndex];
            const nextQuantity = this.normalizeQuantity(existing?.quantity, 0) + quantityToAdd;
            if (product && !productLimit.isInfiniteQuantity && productLimit.maxQuantity > 0 && nextQuantity > productLimit.maxQuantity) {
                return {
                    status: 400,
                    success: false,
                    error: {
                        message: `Maximum available quantity is ${productLimit.maxQuantity}`
                    }
                } as any;
            }
            updatedItems[existingIndex] = {
                ...existing,
                ...payload,
                id: String(existing?.id || itemId),
                product_id: String(existing?.product_id || payload?.product_id || itemId),
                quantity: nextQuantity
            };
        } else {
            if (product && !productLimit.isInfiniteQuantity && productLimit.maxQuantity > 0 && quantityToAdd > productLimit.maxQuantity) {
                return {
                    status: 400,
                    success: false,
                    error: {
                        message: `Maximum available quantity is ${productLimit.maxQuantity}`
                    }
                } as any;
            }
            updatedItems.push({
                ...payload,
                id: itemId,
                product_id: String(payload?.product_id || itemId),
                quantity: quantityToAdd
            });
        }

        const normalized = await this.buildCartState(storeId, updatedItems, this.normalizeCartCouponCode(cart.coupon));
        const stored = await this.persistCartState(storeId, normalized);
        return this.wrapResponse(stored, 201);
    }

    public async updateCartItem(storeId: string, itemId: string, data: any) {
        const cart = await this.getOrCreateCart(storeId);
        const targetId = String(itemId || '').trim();
        const index = (cart.items || []).findIndex((item: any) =>
            String(item?.id || '') === targetId || String(item?.product_id || '') === targetId
        );
        if (index < 0) return null;

        const requestedQuantity = this.normalizeQuantity(data?.quantity, 1);
        const existing = (cart.items || [])[index];
        const { productsByRef } = await this.getNormalizedProductsByReference(storeId);
        const product = this.getProductFromReferenceMap(
            productsByRef,
            existing?.product_id,
            existing?.id,
            targetId
        );
        const productLimit = this.resolveProductCartLimit(product);
        if (requestedQuantity > 0 && product && !productLimit.isAvailable) {
            return {
                status: 400,
                success: false,
                error: {
                    message: 'Product is out of stock'
                }
            } as any;
        }
        if (
            requestedQuantity > 0 &&
            product &&
            !productLimit.isInfiniteQuantity &&
            productLimit.maxQuantity > 0 &&
            requestedQuantity > productLimit.maxQuantity
        ) {
            return {
                status: 400,
                success: false,
                error: {
                    message: `Maximum available quantity is ${productLimit.maxQuantity}`
                }
            } as any;
        }
        let updatedItems = [...(cart.items || [])];

        if (requestedQuantity <= 0) {
            updatedItems = updatedItems.filter((item: any) =>
                String(item?.id || '') !== targetId && String(item?.product_id || '') !== targetId
            );
        } else {
            updatedItems[index] = {
                ...updatedItems[index],
                ...(data || {}),
                id: String(updatedItems[index]?.id || targetId),
                quantity: requestedQuantity
            };
        }

        const normalized = await this.buildCartState(storeId, updatedItems, this.normalizeCartCouponCode(cart.coupon));
        const stored = await this.persistCartState(storeId, normalized);
        return this.wrapResponse(stored);
    }

    public async deleteCartItem(storeId: string, itemId: string) {
        const cart = await this.getOrCreateCart(storeId);
        const targetId = String(itemId || '').trim();
        const index = (cart.items || []).findIndex((item: any) =>
            String(item?.id || '') === targetId || String(item?.product_id || '') === targetId
        );
        if (index < 0) return null;

        const updatedItems = (cart.items || []).filter((item: any) =>
            String(item?.id || '') !== targetId && String(item?.product_id || '') !== targetId
        );
        const normalized = await this.buildCartState(storeId, updatedItems, this.normalizeCartCouponCode(cart.coupon));
        const stored = await this.persistCartState(storeId, normalized);
        return this.wrapResponse(stored);
    }

    public async addCartCoupon(storeId: string, code: string) {
        const cart = await this.getOrCreateCart(storeId);
        const normalizedCoupon = this.normalizeCartCouponCode(code);
        if (!normalizedCoupon) {
            return {
                status: 400,
                success: false,
                error: {
                    message: 'Coupon code is required'
                }
            } as any;
        }
        const normalized = await this.buildCartState(storeId, cart.items || [], normalizedCoupon);
        const stored = await this.persistCartState(storeId, normalized);
        return this.wrapResponse(stored);
    }

    public async deleteCartCoupon(storeId: string) {
        const cart = await this.getOrCreateCart(storeId);
        const normalized = await this.buildCartState(storeId, cart.items || [], '');
        const stored = await this.persistCartState(storeId, normalized);
        return this.wrapResponse(stored);
    }

    private buildCheckoutSummary(cart: any, shippingCostInput: any) {
        const subtotal = this.toNumber(cart?.sub_total, 0);
        const optionsTotal = this.toNumber(cart?.options_total, 0);
        const discount = this.toNumber(cart?.total_discount ?? cart?.discount, 0);
        const taxAmount = this.toNumber(cart?.tax_amount, 0);
        const shippingCost = this.toNumber(shippingCostInput, this.toNumber(cart?.real_shipping_cost, 0));
        const total = this.roundAmount(Math.max(0, subtotal + optionsTotal - discount + taxAmount + shippingCost));
        const currency = String(cart?.currency || 'SAR');
        return {
            subtotal,
            options_total: optionsTotal,
            discount,
            tax_amount: taxAmount,
            shipping_cost: shippingCost,
            total,
            currency
        };
    }

    private getDefaultCheckoutShippingMethods(currency: string) {
        return [
            {
                id: 'standard',
                name: 'شحن قياسي',
                description: 'التوصيل خلال 2-4 أيام عمل',
                eta: '2-4 days',
                cost: 0,
                currency
            },
            {
                id: 'express',
                name: 'شحن سريع',
                description: 'التوصيل خلال 24 ساعة',
                eta: '24h',
                cost: 25,
                currency
            },
            {
                id: 'pickup',
                name: 'استلام من الفرع',
                description: 'استلام ذاتي من نقطة البيع',
                eta: 'same-day',
                cost: 0,
                currency
            }
        ];
    }

    private getDefaultCheckoutPaymentMethods() {
        return [
            {
                id: 'cod',
                name: 'الدفع عند الاستلام',
                type: 'cash'
            },
            {
                id: 'mada',
                name: 'مدى',
                type: 'card'
            },
            {
                id: 'visa-master',
                name: 'بطاقة ائتمانية',
                type: 'card'
            },
            {
                id: 'apple-pay',
                name: 'Apple Pay',
                type: 'wallet'
            }
        ];
    }

    private normalizeCheckoutStep(value: any, fallback = 'address') {
        const steps = ['address', 'shipping', 'payment', 'review'];
        const normalized = String(value || '').trim().toLowerCase();
        if (!normalized) return fallback;
        return steps.includes(normalized) ? normalized : fallback;
    }

    private isCheckoutAddressCompleted(session: any) {
        const customer = session?.customer || {};
        const address = session?.address || {};
        return Boolean(
            String(customer?.name || '').trim() &&
            String(customer?.email || '').trim() &&
            String(customer?.mobile || '').trim() &&
            String(address?.city || '').trim() &&
            String(address?.street || '').trim() &&
            String(address?.country || '').trim()
        );
    }

    private isCheckoutShippingCompleted(session: any) {
        const shipping = session?.shipping || {};
        return Boolean(String(shipping?.method_id || '').trim());
    }

    private isCheckoutPaymentCompleted(session: any) {
        const payment = session?.payment || {};
        return Boolean(String(payment?.method_id || '').trim());
    }

    private normalizeCheckoutSession(cart: any, raw: any) {
        const base = raw && typeof raw === 'object' ? raw : {};
        const checkoutId = String(base.id || 'default');
        const currency = String(cart?.currency || 'SAR');
        const shippingMethods = Array.isArray(base.available_shipping_methods) && base.available_shipping_methods.length > 0
            ? base.available_shipping_methods
            : this.getDefaultCheckoutShippingMethods(currency);
        const paymentMethods = Array.isArray(base.available_payment_methods) && base.available_payment_methods.length > 0
            ? base.available_payment_methods
            : this.getDefaultCheckoutPaymentMethods();

        const customer = {
            name: this.pickLocalizedText(base?.customer?.name || ''),
            email: this.pickLocalizedText(base?.customer?.email || ''),
            mobile: this.pickLocalizedText(base?.customer?.mobile || '')
        };
        const address = {
            country: this.pickLocalizedText(base?.address?.country || 'SA'),
            city: this.pickLocalizedText(base?.address?.city || ''),
            district: this.pickLocalizedText(base?.address?.district || ''),
            street: this.pickLocalizedText(base?.address?.street || ''),
            postal_code: this.pickLocalizedText(base?.address?.postal_code || '')
        };

        const selectedShippingId = String(base?.shipping?.method_id || '').trim();
        const selectedShipping =
            shippingMethods.find((method: any) => String(method?.id || '').trim() === selectedShippingId) ||
            null;
        const shipping = {
            method_id: selectedShipping ? String(selectedShipping.id) : '',
            method_name: selectedShipping ? this.pickLocalizedText(selectedShipping.name) : '',
            cost: this.toNumber(
                base?.shipping?.cost,
                selectedShipping ? this.toNumber(selectedShipping.cost, 0) : this.toNumber(cart?.real_shipping_cost, 0)
            ),
            currency
        };

        const selectedPaymentId = String(base?.payment?.method_id || '').trim();
        const selectedPayment =
            paymentMethods.find((method: any) => String(method?.id || '').trim() === selectedPaymentId) ||
            null;
        const payment = {
            method_id: selectedPayment ? String(selectedPayment.id) : '',
            method_name: selectedPayment ? this.pickLocalizedText(selectedPayment.name) : '',
            type: selectedPayment ? this.pickLocalizedText(selectedPayment.type) : ''
        };

        const draft = {
            id: checkoutId,
            status: String(base.status || 'active') === 'completed' ? 'completed' : 'active',
            step: this.normalizeCheckoutStep(base.step, 'address'),
            customer,
            address,
            shipping,
            payment,
            cart_id: 'default',
            cart_count: this.toNumber(cart?.count, 0),
            available_shipping_methods: shippingMethods,
            available_payment_methods: paymentMethods
        };

        const addressDone = this.isCheckoutAddressCompleted(draft);
        const shippingDone = this.isCheckoutShippingCompleted(draft);
        const paymentDone = this.isCheckoutPaymentCompleted(draft);
        const readyToConfirm = addressDone && shippingDone && paymentDone && this.toNumber(cart?.count, 0) > 0;

        const stepOrder: Record<string, number> = {
            address: 0,
            shipping: 1,
            payment: 2,
            review: 3
        };
        const maxReachableStep = !addressDone
            ? 'address'
            : (!shippingDone ? 'shipping' : (!paymentDone ? 'payment' : 'review'));
        let step = this.normalizeCheckoutStep(draft.step, 'address');
        if ((stepOrder[step] ?? 0) > stepOrder[maxReachableStep]) {
            step = maxReachableStep;
        }

        const summary = this.buildCheckoutSummary(cart, draft.shipping.cost);
        const steps = ['address', 'shipping', 'payment', 'review'].map((id, index) => ({
            id,
            order: index + 1,
            is_current: id === step,
            is_done:
                (id === 'address' && addressDone) ||
                (id === 'shipping' && shippingDone) ||
                (id === 'payment' && paymentDone) ||
                (id === 'review' && readyToConfirm)
        }));

        return {
            ...draft,
            step,
            steps,
            summary,
            is_ready_to_confirm: readyToConfirm,
            can_confirm: readyToConfirm
        };
    }

    private async persistCheckoutSession(storeId: string, checkout: any) {
        const payload = {
            ...(checkout || {}),
            id: 'default',
            updated_at: new Date().toISOString()
        };
        await this.storeLogic.upsertDataEntity(storeId, 'checkout_session', 'default', payload);
        return payload;
    }

    private async getOrCreateCheckoutSession(storeId: string) {
        const [cart, current] = await Promise.all([
            this.getOrCreateCart(storeId),
            this.storeLogic.getDataEntity(storeId, 'checkout_session', 'default')
        ]);
        const normalized = this.normalizeCheckoutSession(cart, current || {});
        await this.persistCheckoutSession(storeId, normalized);
        return normalized;
    }

    public async getCheckoutSession(storeId: string) {
        const checkout = await this.getOrCreateCheckoutSession(storeId);
        return this.wrapResponse(checkout);
    }

    public async startCheckoutSession(storeId: string, data: any = {}) {
        const cart = await this.getOrCreateCart(storeId);
        if (!Array.isArray(cart.items) || cart.items.length === 0) {
            return {
                status: 400,
                success: false,
                error: {
                    message: 'Cart is empty'
                }
            } as any;
        }

        const current = await this.getOrCreateCheckoutSession(storeId);
        const payload = data && typeof data === 'object' ? data : {};
        const patched = {
            ...current,
            customer: {
                ...(current.customer || {}),
                name: this.pickLocalizedText(payload?.customer?.name || payload?.name || payload?.full_name || current?.customer?.name || ''),
                email: this.pickLocalizedText(payload?.customer?.email || payload?.email || current?.customer?.email || ''),
                mobile: this.pickLocalizedText(payload?.customer?.mobile || payload?.mobile || current?.customer?.mobile || '')
            },
            address: {
                ...(current.address || {}),
                country: this.pickLocalizedText(payload?.address?.country || payload?.country || current?.address?.country || 'SA'),
                city: this.pickLocalizedText(payload?.address?.city || payload?.city || current?.address?.city || ''),
                district: this.pickLocalizedText(payload?.address?.district || payload?.district || current?.address?.district || ''),
                street: this.pickLocalizedText(payload?.address?.street || payload?.street || current?.address?.street || ''),
                postal_code: this.pickLocalizedText(payload?.address?.postal_code || payload?.postal_code || current?.address?.postal_code || '')
            },
            status: 'active'
        };

        const normalized = this.normalizeCheckoutSession(cart, patched);
        const stored = await this.persistCheckoutSession(storeId, normalized);
        return this.wrapResponse(stored, 201);
    }

    public async updateCheckoutAddress(storeId: string, data: any) {
        const [cart, current] = await Promise.all([
            this.getOrCreateCart(storeId),
            this.getOrCreateCheckoutSession(storeId)
        ]);
        const payload = data && typeof data === 'object' ? data : {};
        const patched = {
            ...current,
            customer: {
                ...(current.customer || {}),
                name: this.pickLocalizedText(payload?.customer?.name || payload?.name || payload?.full_name || current?.customer?.name || ''),
                email: this.pickLocalizedText(payload?.customer?.email || payload?.email || current?.customer?.email || ''),
                mobile: this.pickLocalizedText(payload?.customer?.mobile || payload?.mobile || current?.customer?.mobile || '')
            },
            address: {
                ...(current.address || {}),
                country: this.pickLocalizedText(payload?.address?.country || payload?.country || current?.address?.country || 'SA'),
                city: this.pickLocalizedText(payload?.address?.city || payload?.city || current?.address?.city || ''),
                district: this.pickLocalizedText(payload?.address?.district || payload?.district || current?.address?.district || ''),
                street: this.pickLocalizedText(payload?.address?.street || payload?.street || current?.address?.street || ''),
                postal_code: this.pickLocalizedText(payload?.address?.postal_code || payload?.postal_code || current?.address?.postal_code || '')
            },
            step: 'shipping',
            status: 'active'
        };

        const normalized = this.normalizeCheckoutSession(cart, patched);
        const stored = await this.persistCheckoutSession(storeId, normalized);
        return this.wrapResponse(stored);
    }

    public async updateCheckoutShipping(storeId: string, data: any) {
        const [cart, current] = await Promise.all([
            this.getOrCreateCart(storeId),
            this.getOrCreateCheckoutSession(storeId)
        ]);
        const payload = data && typeof data === 'object' ? data : {};
        const requestedMethodId = String(
            payload?.method_id ||
            payload?.shipping_method ||
            payload?.shipping?.method_id ||
            payload?.id ||
            ''
        ).trim();

        const selectedMethod = (current.available_shipping_methods || [])
            .find((entry: any) => String(entry?.id || '').trim() === requestedMethodId);

        if (!selectedMethod) {
            return {
                status: 400,
                success: false,
                error: {
                    message: 'Shipping method is invalid'
                }
            } as any;
        }

        const patched = {
            ...current,
            shipping: {
                method_id: String(selectedMethod.id),
                method_name: this.pickLocalizedText(selectedMethod.name || ''),
                cost: this.toNumber(selectedMethod.cost, 0),
                currency: String(selectedMethod.currency || cart.currency || 'SAR')
            },
            step: 'payment',
            status: 'active'
        };

        const normalized = this.normalizeCheckoutSession(cart, patched);
        const stored = await this.persistCheckoutSession(storeId, normalized);
        return this.wrapResponse(stored);
    }

    public async updateCheckoutPayment(storeId: string, data: any) {
        const [cart, current] = await Promise.all([
            this.getOrCreateCart(storeId),
            this.getOrCreateCheckoutSession(storeId)
        ]);
        const payload = data && typeof data === 'object' ? data : {};
        const requestedMethodId = String(
            payload?.method_id ||
            payload?.payment_method ||
            payload?.payment?.method_id ||
            payload?.id ||
            ''
        ).trim();

        const selectedMethod = (current.available_payment_methods || [])
            .find((entry: any) => String(entry?.id || '').trim() === requestedMethodId);

        if (!selectedMethod) {
            return {
                status: 400,
                success: false,
                error: {
                    message: 'Payment method is invalid'
                }
            } as any;
        }

        const patched = {
            ...current,
            payment: {
                method_id: String(selectedMethod.id),
                method_name: this.pickLocalizedText(selectedMethod.name || ''),
                type: this.pickLocalizedText(selectedMethod.type || '')
            },
            step: 'review',
            status: 'active'
        };

        const normalized = this.normalizeCheckoutSession(cart, patched);
        const stored = await this.persistCheckoutSession(storeId, normalized);
        return this.wrapResponse(stored);
    }

    private buildOrderFromCart(cart: any, overrides: any = {}) {
        const orderId = this.generateEntityId('order');
        const referenceId = `VTDR-${Math.floor(100000 + Math.random() * 900000)}`;
        const createdAt = new Date().toISOString();
        const orderUrl = `/customer/orders/${orderId}`;
        const customer = overrides?.customer && typeof overrides.customer === 'object'
            ? overrides.customer
            : {};
        const shipping = overrides?.shipping && typeof overrides.shipping === 'object'
            ? overrides.shipping
            : {};
        const payment = overrides?.payment && typeof overrides.payment === 'object'
            ? overrides.payment
            : {};
        const summary = this.buildCheckoutSummary(cart, shipping?.cost);

        return {
            id: orderId,
            reference_id: referenceId,
            url: orderUrl,
            status: 'new',
            payment_status: 'pending',
            created_at: createdAt,
            instructions: this.pickLocalizedText(overrides?.instructions || ''),
            email_sent: false,
            customer: {
                name: this.pickLocalizedText(customer?.name || 'عميل المتجر'),
                email: this.pickLocalizedText(customer?.email || 'customer@example.com'),
                mobile: this.pickLocalizedText(customer?.mobile || '+966500000000')
            },
            shipping: {
                method_id: this.pickLocalizedText(shipping?.method_id || ''),
                method_name: this.pickLocalizedText(shipping?.method_name || ''),
                cost: summary.shipping_cost
            },
            payment: {
                method_id: this.pickLocalizedText(payment?.method_id || ''),
                method_name: this.pickLocalizedText(payment?.method_name || ''),
                type: this.pickLocalizedText(payment?.type || '')
            },
            address: overrides?.address && typeof overrides.address === 'object'
                ? overrides.address
                : undefined,
            source: this.pickLocalizedText(overrides?.source || 'cart'),
            items: (cart.items || []).map((item: any) => ({
                id: String(item?.id || this.generateEntityId('order_item')),
                product_id: String(item?.product_id || item?.id || ''),
                product_name: this.pickLocalizedText(item?.product_name || item?.name || ''),
                quantity: this.normalizeQuantity(item?.quantity, 1),
                price: this.toNumber(item?.price, 0),
                total: this.toNumber(item?.total, 0),
                url: this.pickLocalizedText(item?.url || ''),
                product_image: this.pickLocalizedText(item?.product_image || this.defaultProductPlaceholder)
            })),
            subtotal: summary.subtotal,
            discount: summary.discount,
            shipping_cost: summary.shipping_cost,
            tax_amount: summary.tax_amount,
            total: summary.total
        };
    }

    public async confirmCheckout(storeId: string, data: any = {}) {
        const [cart, session] = await Promise.all([
            this.getOrCreateCart(storeId),
            this.getOrCreateCheckoutSession(storeId)
        ]);

        if (!Array.isArray(cart.items) || cart.items.length === 0) {
            return {
                status: 400,
                success: false,
                error: {
                    message: 'Cart is empty'
                }
            } as any;
        }

        if (!session.is_ready_to_confirm) {
            return {
                status: 400,
                success: false,
                error: {
                    message: 'Checkout is incomplete',
                    step: session.step
                }
            } as any;
        }

        const payload = data && typeof data === 'object' ? data : {};
        const order = this.buildOrderFromCart(cart, {
            customer: session.customer,
            address: session.address,
            shipping: session.shipping,
            payment: session.payment,
            source: 'checkout',
            instructions: payload?.instructions || ''
        });
        await this.storeLogic.upsertDataEntity(storeId, 'order', order.id, order);

        const emptied = await this.buildCartState(storeId, [], '');
        await this.persistCartState(storeId, emptied);

        const completedSession = {
            ...session,
            status: 'completed',
            step: 'review',
            order_id: order.id,
            completed_at: new Date().toISOString(),
            is_ready_to_confirm: false,
            can_confirm: false
        };
        await this.persistCheckoutSession(storeId, completedSession);

        return this.wrapResponse({
            order,
            redirect_url: `/thank-you?order_id=${order.id}`
        });
    }

    public async submitCart(storeId: string) {
        const cart = await this.getOrCreateCart(storeId);
        if (!Array.isArray(cart.items) || cart.items.length === 0) {
            return {
                status: 400,
                success: false,
                error: {
                    message: 'Cart is empty'
                }
            } as any;
        }

        const order = this.buildOrderFromCart(cart, { source: 'cart' });

        await this.storeLogic.upsertDataEntity(storeId, 'order', order.id, order);

        const emptied = await this.buildCartState(storeId, [], '');
        await this.persistCartState(storeId, emptied);

        return this.wrapResponse({
            order,
            redirect_url: `/thank-you?order_id=${order.id}`
        });
    }

    public async sendOrderInvoice(storeId: string, data: any) {
        const orders = await this.storeLogic.getDataEntities(storeId, 'order');
        const requestedOrderId = String(data?.order_id || data?.id || '').trim();
        const order = requestedOrderId
            ? (orders || []).find((entry: any) => String(entry?.id || '') === requestedOrderId)
            : (orders || []).sort((a: any, b: any) =>
                new Date(String(b?.created_at || 0)).getTime() - new Date(String(a?.created_at || 0)).getTime()
            )[0];

        if (!order) {
            return {
                status: 404,
                success: false,
                error: {
                    message: 'Order not found'
                }
            } as any;
        }

        const email = this.pickLocalizedText(data?.email || order?.customer?.email || '').trim();
        const updatedOrder = {
            ...order,
            email_sent: true,
            customer: {
                ...(order?.customer || {}),
                email: email || this.pickLocalizedText(order?.customer?.email || 'customer@example.com')
            },
            updated_at: new Date().toISOString()
        };

        await this.storeLogic.upsertDataEntity(storeId, 'order', String(updatedOrder.id), updatedOrder);

        return this.wrapResponse({
            message: 'تم إرسال الفاتورة إلى البريد الإلكتروني بنجاح',
            order: updatedOrder
        });
    }

    private resolveOrderStatusMeta(rawStatus: any) {
        const statusKey = String(rawStatus || 'new').trim().toLowerCase();
        const statusMap: Record<string, { name: string; icon: string; color: string }> = {
            new: { name: 'جديد', icon: 'sicon-packed-box', color: '#0ea5e9' },
            pending: { name: 'قيد الانتظار', icon: 'sicon-time', color: '#f59e0b' },
            processing: { name: 'قيد المعالجة', icon: 'sicon-refresh', color: '#0ea5e9' },
            shipped: { name: 'تم الشحن', icon: 'sicon-shipping-fast', color: '#3b82f6' },
            delivered: { name: 'تم التسليم', icon: 'sicon-check-circle', color: '#10b981' },
            completed: { name: 'مكتمل', icon: 'sicon-check-circle', color: '#10b981' },
            cancelled: { name: 'ملغي', icon: 'sicon-cancel', color: '#ef4444' },
            refunded: { name: 'مسترجع', icon: 'sicon-refund', color: '#8b5cf6' }
        };
        return statusMap[statusKey] || statusMap.new;
    }

    private normalizeOrderApiPayload(order: any) {
        const base = order && typeof order === 'object' ? order : {};
        const orderId = String(base?.id || this.generateEntityId('order'));
        const customer = base?.customer && typeof base.customer === 'object' ? base.customer : {};
        const shipping = base?.shipping && typeof base.shipping === 'object' ? base.shipping : {};
        const payment = base?.payment && typeof base.payment === 'object' ? base.payment : {};
        const status = this.resolveOrderStatusMeta(base?.status);
        const currency = String(base?.currency || 'SAR');

        const items = (Array.isArray(base?.items) ? base.items : []).map((entry: any, index: number) => {
            const source = entry && typeof entry === 'object' ? entry : {};
            const productId = String(source?.product_id || source?.id || this.generateEntityId('product'));
            const quantity = this.normalizeQuantity(source?.quantity, 1) || 1;
            const unitPrice = this.toNumber(source?.price?.amount ?? source?.price, 0);
            const total = this.toNumber(source?.total?.amount ?? source?.total, this.roundAmount(unitPrice * quantity));
            const productUrl = this.normalizeEntityUrl(
                source?.url || source?.product?.url,
                `/products/${String(source?.slug || productId)}`,
                ['/product', '/products']
            );

            return {
                id: String(source?.id || this.generateEntityId('order_item')),
                product_id: productId,
                name: this.pickLocalizedText(source?.product_name || source?.name || `منتج ${index + 1}`),
                image: this.sanitizeImageUrl(source?.product_image || source?.image?.url || source?.image) || this.defaultProductPlaceholder,
                price: { amount: unitPrice, currency },
                total: { amount: total, currency },
                quantity,
                note: this.pickLocalizedText(source?.note || ''),
                attachments: Array.isArray(source?.attachments) ? source.attachments : [],
                options: Array.isArray(source?.options) ? source.options : [],
                product: {
                    id: productId,
                    url: productUrl,
                    type: this.pickLocalizedText(source?.product?.type || source?.type || 'product')
                },
                product_reservations: Array.isArray(source?.product_reservations) ? source.product_reservations : [],
                detailed_offers: Array.isArray(source?.detailed_offers) ? source.detailed_offers : []
            };
        });

        const subtotal = this.toNumber(base?.sub_total ?? base?.subtotal, 0);
        const discount = this.toNumber(base?.discount, 0);
        const shippingCost = this.toNumber(base?.shipping_cost, 0);
        const taxAmount = this.toNumber(base?.tax_amount, 0);
        const total = this.toNumber(base?.total, this.roundAmount(subtotal - discount + shippingCost + taxAmount));

        const packageItems = items.map((item: any) => ({
            ...item,
            product: item.product || {
                id: item.product_id,
                url: this.normalizeEntityUrl('', `/products/${item.product_id}`, ['/product', '/products']),
                type: 'product'
            }
        }));

        return {
            ...base,
            id: orderId,
            reference_id: String(base?.reference_id || `VTDR-${orderId.slice(-6)}`),
            url: this.normalizeEntityUrl(base?.url, `/customer/orders/${orderId}`, ['/orders', '/order']),
            created_at: String(base?.created_at || new Date().toISOString()),
            updated_at: String(base?.updated_at || base?.created_at || new Date().toISOString()),
            status,
            payment_status: this.pickLocalizedText(base?.payment_status || 'pending'),
            customer: {
                id: String(customer?.id || 'customer-vtdr'),
                name: this.pickLocalizedText(customer?.name || 'عميل المتجر'),
                email: this.pickLocalizedText(customer?.email || 'customer@example.com'),
                mobile: this.pickLocalizedText(customer?.mobile || '+966500000000')
            },
            shipping: {
                id: this.pickLocalizedText(shipping?.method_id || shipping?.id || 'shipping'),
                name: this.pickLocalizedText(shipping?.method_name || shipping?.name || 'شحن قياسي'),
                number: this.pickLocalizedText(shipping?.number || ''),
                logo: this.sanitizeImageUrl(shipping?.logo) || undefined,
                cost: { amount: shippingCost, currency }
            },
            payment: {
                method_id: this.pickLocalizedText(payment?.method_id || ''),
                method_name: this.pickLocalizedText(payment?.method_name || ''),
                type: this.pickLocalizedText(payment?.type || '')
            },
            subtotal,
            sub_total: subtotal,
            discount,
            shipping_cost: shippingCost,
            tax_amount: taxAmount,
            total,
            tax: {
                amount: taxAmount,
                percent: 15
            },
            items,
            options: Array.isArray(base?.options) ? base.options : [],
            packages: [
                {
                    shipping_company: {
                        name: this.pickLocalizedText(shipping?.method_name || shipping?.name || 'شركة الشحن'),
                        logo: this.sanitizeImageUrl(shipping?.logo) || undefined,
                        number: this.pickLocalizedText(shipping?.number || ''),
                        tracing_link: this.pickLocalizedText(shipping?.tracking_url || '')
                    },
                    branch: null,
                    is_delivered: ['delivered', 'completed'].includes(String(base?.status || '').toLowerCase()),
                    status,
                    items: packageItems
                }
            ],
            links: Array.isArray(base?.links) && base.links.length > 0
                ? base.links
                : [
                    {
                        type: 'print',
                        label: 'طباعة الفاتورة',
                        url: `/customer/orders/${orderId}/invoice`
                    }
                ],
            print_url: () => `/customer/orders/${orderId}/invoice`,
            can_reorder: base?.can_reorder !== false,
            can_cancel: base?.can_cancel !== false,
            can_rate: Boolean(base?.can_rate),
            is_pending_payment: String(base?.payment_status || '').toLowerCase() === 'pending',
            pending_payment_ends_in: this.normalizeQuantity(base?.pending_payment_ends_in, 0) || 0,
            is_rated: Boolean(base?.is_rated),
            rating: base?.rating && typeof base.rating === 'object' ? base.rating : null,
            email_sent: Boolean(base?.email_sent),
            currency
        };
    }

    public async getOrders(storeId: string, query: Record<string, any> = {}) {
        const page = this.pickQueryInt(query, ['page', 'current_page', 'currentPage'], 1);
        const perPage = this.pickQueryInt(query, ['per_page', 'perPage', 'limit'], 20);
        const orders = await this.storeLogic.getDataEntities(storeId, 'order');
        const normalized = (orders || [])
            .map((entry: any) => this.normalizeOrderApiPayload(entry))
            .sort(
                (a: any, b: any) =>
                    new Date(String(b?.created_at || 0)).getTime() - new Date(String(a?.created_at || 0)).getTime()
            );

        const total = normalized.length;
        const start = (page - 1) * perPage;
        const pageItems = normalized.slice(start, start + perPage);
        return this.buildPaginatedResponse(this.mapToSchema(pageItems, 'order'), total, page, perPage);
    }

    public async getOrder(storeId: string, orderId: string) {
        const target = String(orderId || '').trim();
        const orders = await this.storeLogic.getDataEntities(storeId, 'order');
        const found = (orders || []).find((entry: any) => {
            const id = String(entry?.id || '').trim();
            const reference = String(entry?.reference_id || '').trim();
            const urlTail = String(entry?.url || '').split('/').filter(Boolean).pop() || '';
            return id === target || reference === target || urlTail === target;
        });
        if (!found) return null;
        const normalized = this.normalizeOrderApiPayload(found);
        return this.wrapResponse(this.mapToSchema(normalized, 'order'));
    }

    public async getNotifications(storeId: string, query: Record<string, any> = {}) {
        const page = this.pickQueryInt(query, ['page', 'current_page', 'currentPage'], 1);
        const perPage = this.pickQueryInt(query, ['per_page', 'perPage', 'limit'], 20);
        const notifications = await this.storeLogic.getDataEntities(storeId, 'notification');

        let normalized = (notifications || []).map((entry: any, index: number) => ({
            id: String(entry?.id || this.generateEntityId('notification')),
            title: this.pickLocalizedText(entry?.title || 'إشعار جديد'),
            sub_title: this.pickLocalizedText(entry?.sub_title || entry?.subtitle || ''),
            url: this.normalizeEntityUrl(entry?.url, '/customer/notifications'),
            is_new: entry?.is_new !== false,
            date: String(entry?.date || entry?.created_at || new Date().toISOString()),
            order: Number.isFinite(Number(entry?.order)) ? Number(entry.order) : index + 1
        }));

        if (normalized.length === 0) {
            const orders = await this.storeLogic.getDataEntities(storeId, 'order');
            normalized = (orders || [])
                .slice()
                .sort(
                    (a: any, b: any) =>
                        new Date(String(b?.created_at || 0)).getTime() - new Date(String(a?.created_at || 0)).getTime()
                )
                .slice(0, 10)
                .map((order: any, index: number) => {
                    const id = String(order?.id || this.generateEntityId('order'));
                    const reference = String(order?.reference_id || id);
                    return {
                        id: `notification-order-${id}`,
                        title: `تم تحديث الطلب ${reference}`,
                        sub_title: 'يمكنك متابعة حالة الطلب من صفحة الطلبات',
                        url: `/customer/orders/${id}`,
                        is_new: index === 0,
                        date: String(order?.updated_at || order?.created_at || new Date().toISOString()),
                        order: index + 1
                    };
                });
        }

        const total = normalized.length;
        const start = (page - 1) * perPage;
        const pageItems = normalized.slice(start, start + perPage);
        return this.buildPaginatedResponse(this.mapToSchema(pageItems, 'notification'), total, page, perPage);
    }

    public async getProducts(storeId: string, query: Record<string, any> = {}) {
        const products = await this.storeLogic.getDataEntities(storeId, 'product');
        const normalizedProducts = await Promise.all(
            (products || []).map((product: any) =>
                this.normalizeProductPayload(storeId, product, String(product?.id || this.generateEntityId('product')))
            )
        );

        let filtered = [...normalizedProducts];
        const source = this.pickQueryValue(query, ['source', 'source_type', 'sourceType', 'page_slug']).toLowerCase();
        const sourceValue = this.pickQueryValue(query, ['source_value', 'sourceValue', 'value']);
        const categoryParam = this.pickQueryValue(query, ['category_id', 'categoryId', 'category']);
        const brandParam = this.pickQueryValue(query, ['brand_id', 'brandId', 'brand']);
        const search = this.pickQueryValue(query, ['search', 'q', 'keyword']).toLowerCase();
        const sort = this.pickQueryValue(query, ['sort', 'sort_by', 'sortBy', 'order_by', 'orderBy'], 'ourSuggest');
        const status = this.pickQueryValue(query, ['status', 'availability', 'stock']).toLowerCase();
        const stockState = this.pickQueryValue(query, ['stock_state', 'inventory_status']).toLowerCase();
        const effectiveStatus = String(stockState || status).toLowerCase();
        const featured = this.pickQueryValue(query, ['featured', 'is_featured', 'featured_only']).toLowerCase();
        const minPrice = this.pickQueryNumber(query, ['min_price', 'minPrice', 'price_from', 'priceFrom']);
        const maxPrice = this.pickQueryNumber(query, ['max_price', 'maxPrice', 'price_to', 'priceTo']);
        const onSale = this.pickQueryValue(query, ['on_sale', 'is_on_sale', 'sale']).toLowerCase();
        const page = this.pickQueryInt(query, ['page', 'current_page', 'currentPage'], 1);
        const perPage = this.pickQueryInt(query, ['per_page', 'perPage', 'limit'], 20);

        const normalizedSourceValue = String(sourceValue || '').trim().toLowerCase();
        const isProductIndexSource = source.startsWith('product.index');
        const shouldInferCategoryFromSourceValue =
            isProductIndexSource &&
            normalizedSourceValue !== '' &&
            normalizedSourceValue !== 'products' &&
            normalizedSourceValue !== 'product' &&
            normalizedSourceValue !== 'all' &&
            normalizedSourceValue !== 'index';
        const inferredCategoryId = shouldInferCategoryFromSourceValue ? sourceValue : '';
        const effectiveCategoryId = source.includes('category')
            ? (sourceValue || categoryParam)
            : (categoryParam || inferredCategoryId);
        const effectiveBrandId = source.includes('brand') ? (sourceValue || brandParam) : brandParam;

        if (source === 'wishlist' || source === 'favorite' || source === 'favourite') {
            const wishlist = await this.getOrCreateWishlist(storeId);
            const wishlistIds = new Set(
                this.normalizeWishlistProductIds(wishlist).map((id) => String(id))
            );
            filtered = filtered.filter((product: any) => wishlistIds.has(String(product?.id || '').trim()));
        }

        if (source === 'related' || source === 'similar' || source === 'similar_products' || source === 'product.related') {
            const relatedRef = String(sourceValue || '').trim();
            if (!relatedRef) {
                filtered = [];
            } else {
                const normalizedRelatedRef = relatedRef.toLowerCase();
                const targetProduct = filtered.find((product: any) =>
                    this.collectProductReferenceCandidates(product)
                        .some((candidate) => candidate.toLowerCase() === normalizedRelatedRef)
                );

                if (!targetProduct) {
                    filtered = [];
                } else {
                    const targetId = String(targetProduct?.id || '').trim();
                    const targetCategoryIds = new Set(this.collectProductCategoryIds(targetProduct));
                    const targetBrandId = String(targetProduct?.brand?.id || targetProduct?.brand_id || '').trim();

                    const scoredProducts = filtered
                        .filter((product: any) => String(product?.id || '').trim() !== targetId)
                        .map((product: any) => {
                            const categories = this.collectProductCategoryIds(product);
                            const sharedCategoryScore = categories.reduce(
                                (acc: number, categoryId: string) => acc + (targetCategoryIds.has(categoryId) ? 1 : 0),
                                0
                            );
                            const brandId = String(product?.brand?.id || product?.brand_id || '').trim();
                            const sameBrandScore = targetBrandId && brandId === targetBrandId ? 2 : 0;
                            return {
                                product,
                                score: sameBrandScore + sharedCategoryScore
                            };
                        });

                    const relatedProducts = scoredProducts.filter((entry: any) => entry.score > 0);
                    const scopedProducts = relatedProducts.length > 0 ? relatedProducts : scoredProducts;
                    filtered = scopedProducts
                        .sort((a: any, b: any) => {
                            if (b.score !== a.score) return b.score - a.score;
                            const featuredDelta =
                                Number(Boolean(b.product?.is_featured)) - Number(Boolean(a.product?.is_featured));
                            if (featuredDelta !== 0) return featuredDelta;
                            return this.resolveProductPriceAmount(b.product) - this.resolveProductPriceAmount(a.product);
                        })
                        .map((entry: any) => entry.product);
                }
            }
        }

        if (effectiveCategoryId) {
            const target = String(effectiveCategoryId).trim();
            filtered = filtered.filter((product: any) => {
                const categoryIds = Array.isArray(product?.category_ids) ? product.category_ids.map((id: any) => String(id)) : [];
                const categories = Array.isArray(product?.categories)
                    ? product.categories.map((entry: any) => String(entry?.id || entry))
                    : [];
                const directCategory = String(product?.category?.id || product?.category_id || '').trim();
                return categoryIds.includes(target) || categories.includes(target) || directCategory === target;
            });
        }

        if (effectiveBrandId) {
            const target = String(effectiveBrandId).trim();
            filtered = filtered.filter((product: any) => {
                const brandId = String(product?.brand?.id || product?.brand_id || '').trim();
                return brandId === target;
            });
        }

        if (search) {
            filtered = filtered.filter((product: any) => {
                const haystack = [
                    product?.name,
                    product?.description,
                    product?.short_description,
                    product?.sku
                ]
                    .map((entry) => this.pickLocalizedText(entry).toLowerCase())
                    .join(' ');
                return haystack.includes(search);
            });
        }

        if (effectiveStatus) {
            if (effectiveStatus === 'in-stock' || effectiveStatus === 'in_stock' || effectiveStatus === 'available') {
                filtered = filtered.filter((product: any) => {
                    const rawStatus = String(product?.status || '').toLowerCase();
                    const inventoryStatus = String(product?.inventory_status || '').toLowerCase();
                    if (rawStatus === 'hidden' || inventoryStatus === 'hidden') return false;
                    if (this.isProductBackorderState(product)) return false;
                    if (inventoryStatus) return inventoryStatus === 'in_stock' || inventoryStatus === 'low_stock';
                    const outOfStock = product?.is_out_of_stock === true;
                    const quantity = this.resolveProductAvailableQuantity(product);
                    const isInfinite = Boolean(product?.is_infinite_quantity) || product?.track_quantity === false;
                    return !outOfStock && product?.is_available !== false && (isInfinite || quantity > 0);
                });
            } else if (effectiveStatus === 'out-of-stock' || effectiveStatus === 'out_of_stock' || effectiveStatus === 'unavailable') {
                filtered = filtered.filter((product: any) => {
                    const rawStatus = String(product?.status || '').toLowerCase();
                    const inventoryStatus = String(product?.inventory_status || '').toLowerCase();
                    if (rawStatus === 'hidden' || inventoryStatus === 'hidden') return true;
                    if (this.isProductBackorderState(product)) return false;
                    if (inventoryStatus) return inventoryStatus === 'out_of_stock';
                    const outOfStock = product?.is_out_of_stock === true;
                    const quantity = this.resolveProductAvailableQuantity(product);
                    const isInfinite = Boolean(product?.is_infinite_quantity) || product?.track_quantity === false;
                    return outOfStock || product?.is_available === false || (!isInfinite && quantity <= 0);
                });
            } else if (effectiveStatus === 'hidden') {
                filtered = filtered.filter((product: any) => String(product?.status || '').toLowerCase() === 'hidden');
            } else if (effectiveStatus === 'low-stock' || effectiveStatus === 'low_stock') {
                filtered = filtered.filter((product: any) => this.isProductLowStockState(product));
            } else if (effectiveStatus === 'backorder' || effectiveStatus === 'preorder' || effectiveStatus === 'pre_order') {
                filtered = filtered.filter((product: any) => this.isProductBackorderState(product));
            }
        }

        if (featured === 'true' || featured === '1' || featured === 'yes') {
            filtered = filtered.filter((product: any) => Boolean(product?.is_featured));
        }
        if (featured === 'false' || featured === '0' || featured === 'no') {
            filtered = filtered.filter((product: any) => !product?.is_featured);
        }

        if (typeof minPrice === 'number') {
            filtered = filtered.filter((product: any) => this.resolveProductPriceAmount(product) >= minPrice);
        }
        if (typeof maxPrice === 'number') {
            filtered = filtered.filter((product: any) => this.resolveProductPriceAmount(product) <= maxPrice);
        }

        if (onSale === 'true' || onSale === '1' || onSale === 'yes') {
            filtered = filtered.filter((product: any) => Boolean(product?.is_on_sale));
        }
        if (onSale === 'false' || onSale === '0' || onSale === 'no') {
            filtered = filtered.filter((product: any) => !product?.is_on_sale);
        }

        filtered = this.sortProducts(filtered, sort);

        const total = filtered.length;
        const start = (page - 1) * perPage;
        const pageItems = filtered.slice(start, start + perPage);
        const payload = this.mapToSchema(pageItems, 'product');
        return this.buildPaginatedResponse(payload, total, page, perPage);
    }

    public async getProduct(storeId: string, productId: string) {
        const products = await this.storeLogic.getDataEntities(storeId, 'product');
        const targetId = String(productId || '').trim();
        const product = products.find((p: any) => {
            const id = String(p?.id || '').trim();
            const slug = String(p?.slug || '').trim();
            const url = String(p?.url || '').trim().split('/').filter(Boolean).pop() || '';
            return id === targetId || slug === targetId || url === targetId;
        });
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
        const targetId = String(categoryId || '').trim();
        const category = (categories || []).find((entry: any) => {
            const id = String(entry?.id || '').trim();
            const slug = String(entry?.slug || '').trim();
            const urlTail = String(entry?.url || '').trim().split('/').filter(Boolean).pop() || '';
            return id === targetId || slug === targetId || urlTail === targetId;
        });
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

    public async getBrands(storeId: string) {
        const brands = await this.storeLogic.getDataEntities(storeId, 'brand');
        const normalized = (brands || []).map((brand: any) =>
            this.normalizeBrandPayload(brand, String(brand?.id || this.generateEntityId('brand')))
        );
        return this.wrapResponse(this.mapToSchema(normalized, 'brand'));
    }

    public async getBrand(storeId: string, brandId: string) {
        const brands = await this.storeLogic.getDataEntities(storeId, 'brand');
        const targetId = String(brandId || '').trim();
        const brand = (brands || []).find((entry: any) => {
            const id = String(entry?.id || '').trim();
            const slug = String(entry?.slug || '').trim();
            const urlTail = String(entry?.url || '').trim().split('/').filter(Boolean).pop() || '';
            return id === targetId || slug === targetId || urlTail === targetId;
        });
        if (!brand) return null;
        const normalized = this.normalizeBrandPayload(brand, String(brand.id));
        return this.wrapResponse(this.mapToSchema(normalized, 'brand'));
    }

    public async createBrand(storeId: string, data: any) {
        const key = String(data?.id ?? this.generateEntityId('brand'));
        const payload = this.normalizeBrandPayload(data, key);
        await this.storeLogic.upsertDataEntity(storeId, 'brand', key, payload);
        return this.wrapResponse(this.mapToSchema(payload, 'brand'), 201);
    }

    public async updateBrand(storeId: string, brandId: string, data: any) {
        const current = await this.storeLogic.getDataEntity(storeId, 'brand', brandId);
        const payload = this.normalizeBrandPayload({ ...(current || {}), ...(data || {}) }, brandId);
        await this.storeLogic.upsertDataEntity(storeId, 'brand', brandId, payload);
        return this.wrapResponse(this.mapToSchema(payload, 'brand'));
    }

    public async deleteBrand(storeId: string, brandId: string) {
        const id = String(brandId);
        const products = await this.storeLogic.getDataEntities(storeId, 'product');
        let updatedProducts = 0;

        for (const product of products || []) {
            const productId = String(product?.id || this.generateEntityId('product'));
            const currentBrandId = String(product?.brand?.id ?? product?.brand_id ?? '').trim();
            if (currentBrandId !== id) continue;

            const payload = await this.normalizeProductPayload(
                storeId,
                {
                    ...product,
                    brand: undefined,
                    brand_id: ''
                },
                productId
            );
            await this.storeLogic.upsertDataEntity(storeId, 'product', productId, payload);
            updatedProducts++;
        }

        await this.storeLogic.deleteDataEntity(storeId, 'brand', id);
        return {
            status: 200,
            success: true,
            data: {
                id,
                deleted: true,
                updatedProducts
            }
        };
    }

    public async getOffers(storeId: string) {
        const offers = await this.getSpecialOffersRaw(storeId);
        const normalized = (offers || []).map((offer: any) =>
            this.normalizeOfferPayload(offer, String(offer?.id || this.generateEntityId('offer')))
        );
        return this.wrapResponse(normalized);
    }

    public async getOffer(storeId: string, offerId: string) {
        const offers = await this.getSpecialOffersRaw(storeId);
        const offer = (offers || []).find((entry: any) => String(entry?.id || '') === String(offerId));
        if (!offer) return null;
        const normalized = this.normalizeOfferPayload(offer, String(offer.id));
        return this.wrapResponse(normalized);
    }

    public async createOffer(storeId: string, data: any) {
        const key = String(data?.id ?? this.generateEntityId('offer'));
        const payload = this.normalizeOfferPayload(data, key);
        await this.storeLogic.upsertDataEntity(storeId, 'specialOffer', key, payload);
        return this.wrapResponse(payload, 201);
    }

    public async updateOffer(storeId: string, offerId: string, data: any) {
        const currentPrimary = await this.storeLogic.getDataEntity(storeId, 'specialOffer', offerId);
        const currentFallback = currentPrimary || await this.storeLogic.getDataEntity(storeId, 'offer', offerId);
        const payload = this.normalizeOfferPayload({ ...(currentFallback || {}), ...(data || {}) }, offerId);
        await this.storeLogic.upsertDataEntity(storeId, 'specialOffer', offerId, payload);
        return this.wrapResponse(payload);
    }

    public async deleteOffer(storeId: string, offerId: string) {
        const id = String(offerId);
        await this.storeLogic.deleteDataEntity(storeId, 'specialOffer', id);
        await this.storeLogic.deleteDataEntity(storeId, 'offer', id);
        return {
            status: 200,
            success: true,
            data: {
                id,
                deleted: true
            }
        };
    }

    public async getReviews(storeId: string, productId?: string) {
        const normalizedProductId = String(productId || '').trim();
        const reviews = await this.getReviewsRaw(storeId);
        const normalized = (reviews || []).map((entry: any) =>
            this.normalizeReviewPayload(
                entry,
                String(entry?.id || this.generateEntityId('review'))
            )
        );
        const filtered = normalizedProductId
            ? normalized.filter((entry: any) => entry.product_id === normalizedProductId)
            : normalized;
        return this.wrapResponse(filtered);
    }

    public async getReview(storeId: string, reviewId: string) {
        const reviews = await this.getReviewsRaw(storeId);
        const review = (reviews || []).find((entry: any) => String(entry?.id || '') === String(reviewId));
        if (!review) return null;
        const normalized = this.normalizeReviewPayload(review, String(review.id));
        return this.wrapResponse(normalized);
    }

    public async createReview(storeId: string, data: any) {
        const key = String(data?.id ?? this.generateEntityId('review'));
        const payload = this.normalizeReviewPayload(data, key);
        payload.product_id = await this.resolveFeedbackProductId(storeId, payload.product_id);
        await this.storeLogic.upsertDataEntity(storeId, 'review', key, payload);
        await this.refreshProductFeedbackMetrics(storeId, payload.product_id);
        return this.wrapResponse(payload, 201);
    }

    public async updateReview(storeId: string, reviewId: string, data: any) {
        const currentPrimary = await this.storeLogic.getDataEntity(storeId, 'review', reviewId);
        const currentFallback = currentPrimary || await this.storeLogic.getDataEntity(storeId, 'product_review', reviewId);
        if (!currentFallback) return null;

        const previous = this.normalizeReviewPayload(currentFallback, reviewId);
        const payload = this.normalizeReviewPayload({ ...(currentFallback || {}), ...(data || {}) }, reviewId);
        payload.product_id = await this.resolveFeedbackProductId(storeId, payload.product_id || previous.product_id);

        await this.storeLogic.upsertDataEntity(storeId, 'review', reviewId, payload);
        await this.refreshProductFeedbackMetrics(storeId, previous.product_id);
        if (payload.product_id !== previous.product_id) {
            await this.refreshProductFeedbackMetrics(storeId, payload.product_id);
        }

        return this.wrapResponse(payload);
    }

    public async deleteReview(storeId: string, reviewId: string) {
        const currentPrimary = await this.storeLogic.getDataEntity(storeId, 'review', reviewId);
        const currentFallback = currentPrimary || await this.storeLogic.getDataEntity(storeId, 'product_review', reviewId);
        const previous = currentFallback
            ? this.normalizeReviewPayload(currentFallback, reviewId)
            : null;

        await this.storeLogic.deleteDataEntity(storeId, 'review', reviewId);
        await this.storeLogic.deleteDataEntity(storeId, 'product_review', reviewId);

        if (previous?.product_id) {
            await this.refreshProductFeedbackMetrics(storeId, previous.product_id);
        }

        return {
            status: 200,
            success: true,
            data: {
                id: String(reviewId),
                deleted: true
            }
        };
    }

    public async getQuestions(storeId: string, productId?: string) {
        const normalizedProductId = String(productId || '').trim();
        const questions = await this.getQuestionsRaw(storeId);
        const normalized = (questions || []).map((entry: any) =>
            this.normalizeQuestionPayload(
                entry,
                String(entry?.id || this.generateEntityId('question'))
            )
        );
        const filtered = normalizedProductId
            ? normalized.filter((entry: any) => entry.product_id === normalizedProductId)
            : normalized;
        return this.wrapResponse(filtered);
    }

    public async getQuestion(storeId: string, questionId: string) {
        const questions = await this.getQuestionsRaw(storeId);
        const question = (questions || []).find((entry: any) => String(entry?.id || '') === String(questionId));
        if (!question) return null;
        const normalized = this.normalizeQuestionPayload(question, String(question.id));
        return this.wrapResponse(normalized);
    }

    public async createQuestion(storeId: string, data: any) {
        const key = String(data?.id ?? this.generateEntityId('question'));
        const payload = this.normalizeQuestionPayload(data, key);
        payload.product_id = await this.resolveFeedbackProductId(storeId, payload.product_id);
        await this.storeLogic.upsertDataEntity(storeId, 'question', key, payload);
        await this.refreshProductFeedbackMetrics(storeId, payload.product_id);
        return this.wrapResponse(payload, 201);
    }

    public async updateQuestion(storeId: string, questionId: string, data: any) {
        const currentPrimary = await this.storeLogic.getDataEntity(storeId, 'question', questionId);
        const currentFallback = currentPrimary || await this.storeLogic.getDataEntity(storeId, 'product_question', questionId);
        if (!currentFallback) return null;

        const previous = this.normalizeQuestionPayload(currentFallback, questionId);
        const payload = this.normalizeQuestionPayload({ ...(currentFallback || {}), ...(data || {}) }, questionId);
        payload.product_id = await this.resolveFeedbackProductId(storeId, payload.product_id || previous.product_id);

        await this.storeLogic.upsertDataEntity(storeId, 'question', questionId, payload);
        await this.refreshProductFeedbackMetrics(storeId, previous.product_id);
        if (payload.product_id !== previous.product_id) {
            await this.refreshProductFeedbackMetrics(storeId, payload.product_id);
        }

        return this.wrapResponse(payload);
    }

    public async deleteQuestion(storeId: string, questionId: string) {
        const currentPrimary = await this.storeLogic.getDataEntity(storeId, 'question', questionId);
        const currentFallback = currentPrimary || await this.storeLogic.getDataEntity(storeId, 'product_question', questionId);
        const previous = currentFallback
            ? this.normalizeQuestionPayload(currentFallback, questionId)
            : null;

        await this.storeLogic.deleteDataEntity(storeId, 'question', questionId);
        await this.storeLogic.deleteDataEntity(storeId, 'product_question', questionId);

        if (previous?.product_id) {
            await this.refreshProductFeedbackMetrics(storeId, previous.product_id);
        }

        return {
            status: 200,
            success: true,
            data: {
                id: String(questionId),
                deleted: true
            }
        };
    }

    public async getMenus(storeId: string, type: string) {
        const menuType = String(type || 'header').trim().toLowerCase() || 'header';
        const storedMenu = await this.storeLogic.getDataEntity(storeId, 'menu', menuType);
        const storedItems = this.extractMenuItemsPayload(storedMenu);
        const fallbackItems = await this.buildDefaultMenu(storeId, menuType);
        const source = storedItems.length > 0 ? storedItems : fallbackItems;
        const normalized = source
            .map((menu: any, index: number) =>
                this.normalizeMenuNode(menu, `${menuType}-${index + 1}`, index + 1)
            )
            .sort((a: any, b: any) => a.order - b.order);

        return this.wrapResponse(normalized);
    }

    public async updateMenus(storeId: string, type: string, data: any) {
        const menuType = String(type || 'header').trim().toLowerCase() || 'header';
        const source = this.extractMenuItemsPayload(data);
        const normalized = source
            .map((menu: any, index: number) =>
                this.normalizeMenuNode(menu, `${menuType}-${index + 1}`, index + 1)
            )
            .sort((a: any, b: any) => a.order - b.order);

        await this.storeLogic.upsertDataEntity(storeId, 'menu', menuType, {
            type: menuType,
            items: normalized,
            updated_at: new Date().toISOString()
        });

        return this.wrapResponse(normalized);
    }

    private normalizeStaticPagePayload(data: any, key: string) {
        const base = this.normalizeEntityPayload(data, key);
        const title = this.pickLocalizedText(base?.title || base?.name || key);
        const slug = this.slugify(base?.slug || base?.id || title, 'page');
        const url = this.normalizeEntityUrl(
            base?.url,
            `/pages/${slug || key}`,
            ['/page', '/pages']
        );

        return {
            ...base,
            id: key,
            title,
            name: this.pickLocalizedText(base?.name || title),
            slug,
            url,
            content: this.pickLocalizedText(base?.content || base?.description || ''),
            is_published: base?.is_published !== false
        };
    }

    public async getStaticPages(storeId: string) {
        const pages = await this.storeLogic.getDataEntities(storeId, 'page');
        const normalized = (pages || []).map((page: any) =>
            this.normalizeStaticPagePayload(page, String(page?.id || page?.slug || this.generateEntityId('page')))
        );
        return this.wrapResponse(this.mapToSchema(normalized, 'page'));
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
        const targetId = String(categoryId || '').trim();
        const category = (categories || []).find((entry: any) => {
            const id = String(entry?.id || '').trim();
            const slug = String(entry?.slug || '').trim();
            const urlTail = String(entry?.url || '').trim().split('/').filter(Boolean).pop() || '';
            return id === targetId || slug === targetId || urlTail === targetId;
        });
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

    public async getBlogArticles(storeId: string, query: Record<string, any> = {}) {
        const articles = await this.getBlogArticlesRaw(storeId);
        const normalized = await Promise.all(
            (articles || []).map((article: any) =>
                this.normalizeBlogArticlePayload(storeId, article, String(article?.id || this.generateEntityId('blog_article')))
            )
        );

        let filtered = [...normalized];
        const source = this.pickQueryValue(query, ['source', 'source_type', 'sourceType']).toLowerCase();
        const sourceValue = this.pickQueryValue(query, ['source_value', 'sourceValue', 'value']);
        const categoryId = this.pickQueryValue(query, ['category_id', 'categoryId', 'category']) || (source.includes('category') ? sourceValue : '');
        const search = this.pickQueryValue(query, ['search', 'q', 'keyword']).toLowerCase();
        const sort = this.pickQueryValue(query, ['sort', 'sort_by', 'sortBy', 'order_by', 'orderBy'], 'latest').toLowerCase();
        const published = this.pickQueryValue(query, ['published', 'is_published']).toLowerCase();
        const page = this.pickQueryInt(query, ['page', 'current_page', 'currentPage'], 1);
        const perPage = this.pickQueryInt(query, ['per_page', 'perPage', 'limit'], 20);

        if (categoryId) {
            const target = String(categoryId).trim();
            filtered = filtered.filter((article: any) => {
                const direct = String(article?.category_id || article?.categoryId || '').trim();
                const nested = String(article?.category?.id || '').trim();
                const slug = String(article?.category?.slug || '').trim();
                return direct === target || nested === target || slug === target;
            });
        }

        if (published === 'true' || published === '1') {
            filtered = filtered.filter((article: any) => article?.is_published !== false);
        }
        if (published === 'false' || published === '0') {
            filtered = filtered.filter((article: any) => article?.is_published === false);
        }

        if (search) {
            filtered = filtered.filter((article: any) => {
                const haystack = [
                    article?.title,
                    article?.summary,
                    article?.description,
                    article?.slug
                ]
                    .map((entry) => this.pickLocalizedText(entry).toLowerCase())
                    .join(' ');
                return haystack.includes(search);
            });
        }

        if (sort === 'oldest' || sort === 'created_asc' || sort === 'created-asc') {
            filtered = filtered.sort((a, b) =>
                new Date(String(a?.published_at || a?.created_at || 0)).getTime() -
                new Date(String(b?.published_at || b?.created_at || 0)).getTime()
            );
        } else if (sort === 'title' || sort === 'name') {
            filtered = filtered.sort((a, b) =>
                this.pickLocalizedText(a?.title).localeCompare(this.pickLocalizedText(b?.title), 'ar')
            );
        } else {
            filtered = filtered.sort((a, b) =>
                new Date(String(b?.published_at || b?.created_at || 0)).getTime() -
                new Date(String(a?.published_at || a?.created_at || 0)).getTime()
            );
        }

        const total = filtered.length;
        const start = (page - 1) * perPage;
        const pageItems = filtered.slice(start, start + perPage);
        return this.buildPaginatedResponse(pageItems, total, page, perPage);
    }

    public async getBlogArticle(storeId: string, articleId: string) {
        const articles = await this.getBlogArticlesRaw(storeId);
        const targetId = String(articleId || '').trim();
        const article = articles.find((entry: any) => {
            const id = String(entry?.id || '').trim();
            const slug = String(entry?.slug || '').trim();
            const urlTail = String(entry?.url || '').trim().split('/').filter(Boolean).pop() || '';
            return id === targetId || slug === targetId || urlTail === targetId;
        });
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
        const payload = this.normalizeStaticPagePayload(data, key);
        await this.storeLogic.upsertDataEntity(storeId, 'page', key, payload);
        return this.wrapResponse(this.mapToSchema(payload, 'page'), 201);
    }

    public async updateStaticPage(storeId: string, pageId: string, data: any) {
        const current = await this.storeLogic.getDataEntity(storeId, 'page', pageId);
        const payload = this.normalizeStaticPagePayload({ ...(current || {}), ...(data || {}) }, pageId);
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
                settings = await this.themeRuntimeAdapter.getThemeSettings(themeId);
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
                const [themeComponents, productsRaw, categoriesRaw, brandsRaw, offersRaw, pagesRaw, blogArticlesRaw, blogArticlesAltRaw, blogCategoriesRaw, blogCategoriesAltRaw, reviewsRaw, questionsRaw] = await Promise.all([
                    this.themeRuntimeAdapter.getThemeComponents(store.themeId),
                    this.storeLogic.getDataEntities(storeId, 'product'),
                    this.storeLogic.getDataEntities(storeId, 'category'),
                    this.storeLogic.getDataEntities(storeId, 'brand'),
                    this.getSpecialOffersRaw(storeId),
                    this.storeLogic.getDataEntities(storeId, 'page'),
                    this.storeLogic.getDataEntities(storeId, 'blog_article'),
                    this.storeLogic.getDataEntities(storeId, 'blog_articles'),
                    this.storeLogic.getDataEntities(storeId, 'blog_category'),
                    this.storeLogic.getDataEntities(storeId, 'blog_categories'),
                    this.getReviewsRaw(storeId),
                    this.getQuestionsRaw(storeId)
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
                    ...this.normalizeBrandPayload(
                        brand,
                        String(brand?.id || this.generateEntityId('brand'))
                    )
                }));
                const offers = (offersRaw || []).map((offer: any) =>
                    this.normalizeOfferPayload(
                        offer,
                        String(offer?.id || this.generateEntityId('offer'))
                    )
                );
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

                const reviews = (reviewsRaw || []).map((review: any) =>
                    this.normalizeReviewPayload(
                        review,
                        String(review?.id || this.generateEntityId('review'))
                    )
                );

                const questions = (questionsRaw || []).map((question: any) =>
                    this.normalizeQuestionPayload(
                        question,
                        String(question?.id || this.generateEntityId('question'))
                    )
                );

                const sources = {
                    products,
                    categories,
                    brands,
                    offers,
                    pages,
                    blog_articles: blogArticles,
                    blog_categories: blogCategories,
                    reviews,
                    questions,
                    offers_link: [{ id: 'offers_link', name: 'التخفيضات', url: '/offers' }],
                    brands_link: [{ id: 'brands_link', name: 'الماركات التجارية', url: '/brands' }],
                    blog_link: [{ id: 'blog_link', name: 'المدونة', url: '/blog' }],
                    custom: []
                };

                components = (themeComponents || []).map((component: any) => ({
                    ...(component || {}),
                    fields: (component?.fields || []).map((field: any) =>
                        this.normalizeThemeComponentField(field, sources)
                    )
                }));
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
