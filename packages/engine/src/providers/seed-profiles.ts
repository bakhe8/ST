export type SeedProfileId = 'general' | 'fashion' | 'electronics';

export interface SeedProfileDefinition {
    id: SeedProfileId;
    storeName: string;
    storeDescription: string;
    brandNames: string[];
    categoryNames: string[];
    productDescriptors: string[];
    productNouns: string[];
    blogCategoryNames: string[];
    blogArticleTitles: string[];
    offerTitles: string[];
    materialValues: string[];
    originValues: string[];
    warrantyValues: string[];
    modelPrefixes: string[];
    minPrice: number;
    maxPrice: number;
}

export const DEFAULT_SEED_PROFILE: SeedProfileId = 'general';

const SEED_PROFILES: Record<SeedProfileId, SeedProfileDefinition> = {
    general: {
        id: 'general',
        storeName: 'متجر التجربة',
        storeDescription: 'متجر تجريبي عام ببيانات متوازنة لمحاكاة أغلب حالات العرض.',
        brandNames: ['رؤية', 'هنا', 'واحة', 'نور', 'خطوة'],
        categoryNames: ['عروض اليوم', 'الأكثر مبيعاً', 'منتجات المنزل', 'مستلزمات شخصية', 'هدايا'],
        productDescriptors: ['عملي', 'فاخر', 'مميز', 'جديد', 'اقتصادي'],
        productNouns: ['منتج', 'قطعة', 'مجموعة', 'خيار', 'تصميم'],
        blogCategoryNames: ['أخبار المتجر', 'نصائح الشراء', 'تجارب العملاء', 'أفكار موسمية'],
        blogArticleTitles: ['كيف تختار المنتج المناسب؟', 'دليل سريع للاستفادة من العروض', 'نصائح للعناية بمنتجاتك', 'أفضل اختيارات هذا الشهر'],
        offerTitles: ['عرض البدايات', 'خصم نهاية الأسبوع', 'صفقة الموسم', 'عرض العملاء الجدد'],
        materialValues: ['قطن', 'ستانلس ستيل', 'بلاستيك عالي الجودة', 'جلد صناعي'],
        originValues: ['السعودية', 'الإمارات', 'تركيا', 'الصين'],
        warrantyValues: ['6 أشهر', 'سنة', 'سنتان'],
        modelPrefixes: ['GEN', 'HOME', 'SALE'],
        minPrice: 45,
        maxPrice: 1400
    },
    fashion: {
        id: 'fashion',
        storeName: 'متجر الأناقة',
        storeDescription: 'بيانات موجهة لثيمات الأزياء والملابس والإكسسوارات.',
        brandNames: ['أناقة', 'لمسة', 'موضة', 'ستيل', 'رواق'],
        categoryNames: ['فساتين', 'عبايات', 'قمصان', 'أحذية', 'إكسسوارات'],
        productDescriptors: ['كلاسيكي', 'عصري', 'راقي', 'يومي', 'عملي'],
        productNouns: ['فستان', 'عباية', 'قميص', 'حذاء', 'حقيبة'],
        blogCategoryNames: ['موضة', 'تنسيقات', 'العناية بالأقمشة', 'صيحات الموسم'],
        blogArticleTitles: ['ألوان الموسم الحالية', 'كيفية تنسيق الإطلالات اليومية', 'دليل المقاسات السريع', 'اختيار القطع الأساسية لخزانتك'],
        offerTitles: ['خصم الأزياء', 'عرض الإطلالة الكاملة', 'تخفيضات الأحذية', 'صفقة الإكسسوارات'],
        materialValues: ['قطن', 'كتان', 'حرير', 'جينز'],
        originValues: ['إيطاليا', 'تركيا', 'السعودية', 'الإمارات'],
        warrantyValues: ['استبدال 7 أيام', 'استبدال 14 يوم', 'بدون ضمان'],
        modelPrefixes: ['FAS', 'LOOK', 'STYLE'],
        minPrice: 79,
        maxPrice: 2200
    },
    electronics: {
        id: 'electronics',
        storeName: 'متجر التقنية',
        storeDescription: 'بيانات موجهة لثيمات الإلكترونيات والأجهزة الذكية.',
        brandNames: ['تيك برو', 'نوفا', 'ديجيتال', 'سبارك', 'لينك'],
        categoryNames: ['الإلكترونيات', 'هواتف ذكية', 'حواسيب', 'ملحقات', 'أجهزة منزلية ذكية'],
        productDescriptors: ['متطور', 'سريع', 'ذكي', 'اقتصادي', 'احترافي'],
        productNouns: ['جهاز', 'هاتف', 'حاسوب', 'سماعة', 'ملحق'],
        blogCategoryNames: ['مراجعات تقنية', 'دروس الاستخدام', 'مقارنات', 'تحديثات'],
        blogArticleTitles: ['كيف تختار هاتفك القادم؟', 'مقارنة بين الفئات السعرية', 'أفضل ملحقات الإنتاجية', 'نصائح لحماية أجهزتك'],
        offerTitles: ['عرض الإلكترونيات', 'خصم الملحقات', 'صفقة الأجهزة الذكية', 'تخفيضات نهاية الشهر'],
        materialValues: ['ألمنيوم', 'بلاستيك مقوى', 'زجاج مقاوم', 'معدن'],
        originValues: ['اليابان', 'كوريا', 'الصين', 'ألمانيا'],
        warrantyValues: ['سنة', 'سنتان', '3 سنوات'],
        modelPrefixes: ['ELX', 'TECH', 'SMART'],
        minPrice: 180,
        maxPrice: 6400
    }
};

export function normalizeSeedProfile(value: unknown): SeedProfileId {
    const raw = String(value || '').trim().toLowerCase();
    if (raw === 'fashion' || raw === 'electronics' || raw === 'general') {
        return raw;
    }
    return DEFAULT_SEED_PROFILE;
}

export function getSeedProfileDefinition(value: unknown): SeedProfileDefinition {
    const profileId = normalizeSeedProfile(value);
    return SEED_PROFILES[profileId];
}
