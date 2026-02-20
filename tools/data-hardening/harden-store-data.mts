import { PrismaClient } from '@vtdr/data';

const DEFAULT_PRODUCT_PLACEHOLDER = '/images/placeholder.png';

type Args = {
    write: boolean;
    storeId?: string;
};

type HardenSummary = {
    scannedStores: number;
    scannedCategories: number;
    scannedBrands: number;
    scannedProducts: number;
    updatedCategories: number;
    updatedBrands: number;
    updatedProducts: number;
    parseErrors: number;
    replacedExternalPlaceholders: number;
    removedDanglingCategoryRefs: number;
    normalizedEntityKeys: number;
};

function parseArgs(argv: string[]): Args {
    const args: Args = { write: false };
    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];
        if (token === '--write') {
            args.write = true;
            continue;
        }
        if (token === '--store-id') {
            args.storeId = argv[i + 1];
            i++;
            continue;
        }
    }
    return args;
}

function toNumber(value: any, fallback = 0): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeQuantity(value: any, fallback = 0): number {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.max(0, Math.floor(parsed));
}

function normalizePriceValue(value: any, fallbackCurrency = 'SAR') {
    if (value && typeof value === 'object') {
        const amount = toNumber(value.amount, toNumber(value.value, 0));
        const currency = String(value.currency || fallbackCurrency);
        return { amount, currency };
    }
    if (typeof value === 'number' || typeof value === 'string') {
        return { amount: toNumber(value, 0), currency: fallbackCurrency };
    }
    return { amount: 0, currency: fallbackCurrency };
}

function sanitizeImageUrl(url: any, summary: HardenSummary): string {
    if (typeof url !== 'string') return '';
    const normalized = url.trim();
    if (!normalized) return '';

    if (/^(https?:)?\/\/via\.placeholder\.com/i.test(normalized)) {
        summary.replacedExternalPlaceholders += 1;
        return DEFAULT_PRODUCT_PLACEHOLDER;
    }

    return normalized;
}

function sanitizeLegacyPlaceholdersDeep(value: any, summary: HardenSummary): any {
    if (typeof value === 'string') {
        if (/^(https?:)?\/\/via\.placeholder\.com/i.test(value.trim())) {
            summary.replacedExternalPlaceholders += 1;
            return DEFAULT_PRODUCT_PLACEHOLDER;
        }
        return value;
    }

    if (Array.isArray(value)) {
        return value.map((entry) => sanitizeLegacyPlaceholdersDeep(entry, summary));
    }

    if (value && typeof value === 'object') {
        const normalized: Record<string, any> = {};
        for (const [key, entry] of Object.entries(value)) {
            normalized[key] = sanitizeLegacyPlaceholdersDeep(entry, summary);
        }
        return normalized;
    }

    return value;
}

function extractCategoryIds(raw: any): string[] {
    const fromIds = Array.isArray(raw?.category_ids) ? raw.category_ids : [];
    if (fromIds.length > 0) {
        return Array.from(
            new Set(
                fromIds
                    .map((id: any) => String(id || '').trim())
                    .filter(Boolean)
            )
        );
    }

    const refs = Array.isArray(raw?.categories) ? raw.categories : [];
    return Array.from(
        new Set(
            refs
                .map((ref: any) => {
                    if (typeof ref === 'string' || typeof ref === 'number') return String(ref);
                    if (ref && typeof ref === 'object' && ref.id != null) return String(ref.id);
                    return '';
                })
                .map((id: string) => id.trim())
                .filter(Boolean)
        )
    );
}

function normalizeProductImages(raw: any, productId: string, summary: HardenSummary) {
    const source = Array.isArray(raw?.images) ? raw.images : [];
    const normalized = source
        .map((image: any, index: number) => {
            if (typeof image === 'string') {
                const url = sanitizeImageUrl(image, summary);
                if (!url) return null;
                return {
                    id: `${productId}-img-${index + 1}`,
                    url,
                    alt: `Image ${index + 1}`,
                    is_default: index === 0
                };
            }

            const url = sanitizeImageUrl(image?.url, summary);
            if (!url) return null;
            return {
                id: String(image?.id || `${productId}-img-${index + 1}`),
                url,
                alt: String(image?.alt || `Image ${index + 1}`),
                is_default: Boolean(image?.is_default ?? index === 0)
            };
        })
        .filter(Boolean) as Array<{ id: string; url: string; alt: string; is_default: boolean }>;

    if (normalized.length > 0) {
        const main = normalized.find((img) => img.is_default) || normalized[0];
        return {
            images: normalized,
            main_image: main.url,
            thumbnail: normalized[0].url
        };
    }

    const candidate = sanitizeImageUrl(raw?.main_image || raw?.image?.url || raw?.thumbnail, summary);
    if (candidate) {
        return {
            images: [
                {
                    id: `${productId}-img-1`,
                    url: candidate,
                    alt: 'Main',
                    is_default: true
                }
            ],
            main_image: candidate,
            thumbnail: candidate
        };
    }

    return {
        images: [
            {
                id: `${productId}-img-1`,
                url: DEFAULT_PRODUCT_PLACEHOLDER,
                alt: 'Main',
                is_default: true
            }
        ],
        main_image: DEFAULT_PRODUCT_PLACEHOLDER,
        thumbnail: DEFAULT_PRODUCT_PLACEHOLDER
    };
}

function normalizeProductOptions(raw: any, productId: string) {
    const source = Array.isArray(raw?.options) ? raw.options : [];
    return source.map((option: any, optionIndex: number) => ({
        id: String(option?.id || `${productId}-opt-${optionIndex + 1}`),
        name: String(option?.name || option?.title || 'Option'),
        type: String(option?.type || 'select'),
        values: Array.isArray(option?.values)
            ? option.values.map((value: any, valueIndex: number) => ({
                id: String(value?.id || `${productId}-opt-${optionIndex + 1}-val-${valueIndex + 1}`),
                name: String(value?.name || value?.label || 'Value'),
                price: toNumber(value?.price, 0),
                is_default: Boolean(value?.is_default),
                color: value?.color ? String(value.color) : undefined
            }))
            : []
    }));
}

function normalizeProductVariants(raw: any, productId: string, fallbackCurrency: string) {
    const source = Array.isArray(raw?.variants) ? raw.variants : [];
    return source.map((variant: any, index: number) => ({
        id: String(variant?.id || `${productId}-variant-${index + 1}`),
        sku: variant?.sku ? String(variant.sku) : undefined,
        quantity: normalizeQuantity(variant?.quantity ?? variant?.stock ?? 0, 0),
        is_available: variant?.is_available !== false,
        price: normalizePriceValue(variant?.price ?? raw?.price, fallbackCurrency),
        options: Array.isArray(variant?.options) ? variant.options : []
    }));
}

function ensureProductSpecs(raw: any) {
    const specs = Array.isArray(raw?.specs) ? raw.specs.filter(Boolean) : [];
    if (specs.length > 0) return specs;
    return [
        { key: 'الخامة', value: 'قطن' },
        { key: 'بلد المنشأ', value: 'السعودية' }
    ];
}

function ensureProductCustomFields(raw: any) {
    const customFields = Array.isArray(raw?.custom_fields) ? raw.custom_fields.filter(Boolean) : [];
    if (customFields.length > 0) return customFields;
    return [
        { key: 'الضمان', value: 'سنة' }
    ];
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const prisma = new PrismaClient();

    const summary: HardenSummary = {
        scannedStores: 0,
        scannedCategories: 0,
        scannedBrands: 0,
        scannedProducts: 0,
        updatedCategories: 0,
        updatedBrands: 0,
        updatedProducts: 0,
        parseErrors: 0,
        replacedExternalPlaceholders: 0,
        removedDanglingCategoryRefs: 0,
        normalizedEntityKeys: 0
    };

    try {
        const stores = await prisma.store.findMany({
            where: args.storeId ? { id: args.storeId } : undefined,
            select: { id: true, title: true }
        });

        summary.scannedStores = stores.length;
        console.log(`[HARDEN] Stores in scope: ${stores.length}`);

        for (const store of stores) {
            const rows = await prisma.dataEntity.findMany({
                where: {
                    storeId: store.id,
                    entityType: { in: ['category', 'brand', 'product'] }
                },
                orderBy: { createdAt: 'asc' }
            });

            const categoryRows = rows.filter((row) => row.entityType === 'category');
            const brandRows = rows.filter((row) => row.entityType === 'brand');
            const productRows = rows.filter((row) => row.entityType === 'product');
            summary.scannedCategories += categoryRows.length;
            summary.scannedBrands += brandRows.length;
            summary.scannedProducts += productRows.length;

            const parsedCategories: Array<{ row: (typeof categoryRows)[number]; payload: any; key: string }> = [];
            const categoryIdSet = new Set<string>();

            for (const row of categoryRows) {
                try {
                    const payload = JSON.parse(row.payloadJson);
                    const key = String(payload?.id || row.entityKey || row.id);
                    parsedCategories.push({ row, payload, key });
                    categoryIdSet.add(key);
                } catch {
                    summary.parseErrors += 1;
                }
            }

            const categoryLookup = new Map<string, any>();
            for (const parsed of parsedCategories) {
                const baseRaw = parsed.payload && typeof parsed.payload === 'object' ? parsed.payload : {};
                const base = sanitizeLegacyPlaceholdersDeep(baseRaw, summary);
                const parentRaw = String(base?.parentId ?? base?.parent_id ?? '').trim();
                let normalizedParent: string | null = parentRaw && parentRaw !== 'root' ? parentRaw : null;

                if (normalizedParent && (!categoryIdSet.has(normalizedParent) || normalizedParent === parsed.key)) {
                    normalizedParent = null;
                }

                const normalizedCategory = {
                    ...base,
                    id: parsed.key,
                    parent_id: normalizedParent,
                    parentId: normalizedParent || '',
                    order: Number.isFinite(Number(base?.order)) ? Number(base.order) : 0
                };

                categoryLookup.set(parsed.key, normalizedCategory);
                const nextPayloadJson = JSON.stringify(normalizedCategory);
                const needsEntityKeyUpdate = parsed.row.entityKey !== parsed.key;
                if (parsed.row.payloadJson !== nextPayloadJson || needsEntityKeyUpdate) {
                    if (needsEntityKeyUpdate) {
                        summary.normalizedEntityKeys += 1;
                    }
                    summary.updatedCategories += 1;
                    if (args.write) {
                        await prisma.dataEntity.update({
                            where: { id: parsed.row.id },
                            data: {
                                entityKey: parsed.key,
                                payloadJson: nextPayloadJson
                            }
                        });
                    }
                }
            }

            for (const row of brandRows) {
                let payload: any;
                try {
                    payload = JSON.parse(row.payloadJson);
                } catch {
                    summary.parseErrors += 1;
                    continue;
                }

                const base = payload && typeof payload === 'object' ? payload : {};
                const sanitizedBase = sanitizeLegacyPlaceholdersDeep(base, summary);
                const key = String(base?.id || row.entityKey || row.id);
                const logoCandidate = sanitizeImageUrl(
                    sanitizedBase?.logo || sanitizedBase?.image?.url || '',
                    summary
                ) || DEFAULT_PRODUCT_PLACEHOLDER;

                const normalizedBrand = {
                    ...sanitizedBase,
                    id: key,
                    logo: logoCandidate,
                    image: {
                        ...(sanitizedBase?.image && typeof sanitizedBase.image === 'object' ? sanitizedBase.image : {}),
                        url: logoCandidate
                    }
                };

                const nextPayloadJson = JSON.stringify(normalizedBrand);
                const needsEntityKeyUpdate = row.entityKey !== key;
                if (row.payloadJson !== nextPayloadJson || needsEntityKeyUpdate) {
                    if (needsEntityKeyUpdate) {
                        summary.normalizedEntityKeys += 1;
                    }
                    summary.updatedBrands += 1;
                    if (args.write) {
                        await prisma.dataEntity.update({
                            where: { id: row.id },
                            data: {
                                entityKey: key,
                                payloadJson: nextPayloadJson
                            }
                        });
                    }
                }
            }

            for (const row of productRows) {
                let payload: any;
                try {
                    payload = JSON.parse(row.payloadJson);
                } catch {
                    summary.parseErrors += 1;
                    continue;
                }

                const base = payload && typeof payload === 'object' ? payload : {};
                const sanitizedBase = sanitizeLegacyPlaceholdersDeep(base, summary);
                const key = String(base?.id || row.entityKey || row.id);
                const categoryIds = extractCategoryIds(sanitizedBase);
                const validCategoryIds = categoryIds.filter((id) => categoryLookup.has(id));
                summary.removedDanglingCategoryRefs += Math.max(0, categoryIds.length - validCategoryIds.length);

                const categories = validCategoryIds.map((id) => {
                    const existing = categoryLookup.get(id);
                    if (existing) {
                        return { id: existing.id, name: existing.name ?? id };
                    }
                    return { id, name: id };
                });

                const imagePack = normalizeProductImages(sanitizedBase, key, summary);
                const currency = String(
                    sanitizedBase?.price?.currency ||
                    sanitizedBase?.sale_price?.currency ||
                    sanitizedBase?.regular_price?.currency ||
                    'SAR'
                );
                const normalizedPrice = normalizePriceValue(sanitizedBase?.price, currency);
                const normalizedRegularPrice = normalizePriceValue(sanitizedBase?.regular_price || normalizedPrice, currency);
                const normalizedSalePrice = normalizePriceValue(sanitizedBase?.sale_price || normalizedPrice, currency);

                const normalizedProduct = {
                    ...sanitizedBase,
                    id: key,
                    ...imagePack,
                    image: {
                        ...(sanitizedBase?.image && typeof sanitizedBase.image === 'object' ? sanitizedBase.image : {}),
                        url: imagePack.main_image
                    },
                    category_ids: validCategoryIds,
                    categories,
                    price: normalizedPrice,
                    regular_price: normalizedRegularPrice,
                    sale_price: normalizedSalePrice,
                    options: normalizeProductOptions(sanitizedBase, key),
                    variants: normalizeProductVariants(sanitizedBase, key, currency),
                    specs: ensureProductSpecs(sanitizedBase),
                    custom_fields: ensureProductCustomFields(sanitizedBase)
                };

                const nextPayloadJson = JSON.stringify(normalizedProduct);
                const needsEntityKeyUpdate = row.entityKey !== key;
                if (row.payloadJson !== nextPayloadJson || needsEntityKeyUpdate) {
                    if (needsEntityKeyUpdate) {
                        summary.normalizedEntityKeys += 1;
                    }
                    summary.updatedProducts += 1;
                    if (args.write) {
                        await prisma.dataEntity.update({
                            where: { id: row.id },
                            data: {
                                entityKey: key,
                                payloadJson: nextPayloadJson
                            }
                        });
                    }
                }
            }

            console.log(
                `[HARDEN] ${store.title} (${store.id}): categories=${categoryRows.length}, brands=${brandRows.length}, products=${productRows.length}`
            );
        }

        console.log('[HARDEN] Summary');
        console.log(JSON.stringify(summary, null, 2));

        if (!args.write) {
            console.log('[HARDEN] Dry run only. Re-run with --write to persist changes.');
        }
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((error) => {
    console.error('[HARDEN] Failed:', error);
    process.exit(1);
});
