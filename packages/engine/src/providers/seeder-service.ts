import { StoreLogic } from '../core/store-logic.js';
import { Salla } from '@vtdr/contracts';

export class SeederService {
    private static readonly DEFAULT_LOCAL_IMAGE = '/themes/theme-raed-master/public/images/placeholder.png';

    constructor(private simulationLogic: StoreLogic) { }

    private randomString(length: number = 10): string {
        return Math.random().toString(36).substring(2, 2 + length);
    }

    private randomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private randomElement<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    private randomBoolean(): boolean {
        return Math.random() > 0.5;
    }

    private slugify(value: string): string {
        return String(value || '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\u0600-\u06ff]+/gi, '-')
            .replace(/^-+|-+$/g, '')
            .replace(/-+/g, '-');
    }

    public async seedStoreData(storeId: string, productCount: number = 20, tx?: any) {
        // Clear existing data
        await this.simulationLogic.clearDataEntities(storeId, tx);

        // Seed Store Settings (Pseudo-Entity for runtime)
        const storeSettings = this.generateStoreSettings();
        await (this.simulationLogic as any).createDataEntity(storeId, 'store', storeSettings, tx);

        // Seed Brands
        const brands = [];
        for (let i = 0; i < 5; i++) {
            const brand = this.generateBrand();
            await (this.simulationLogic as any).createDataEntity(storeId, 'brand', brand, tx);
            brands.push(brand);
        }

        // Seed Categories
        const categories = [];
        for (let i = 0; i < 5; i++) {
            const category = this.generateCategory();
            await (this.simulationLogic as any).createDataEntity(storeId, 'category', category, tx);
            categories.push(category);
        }

        // Seed Products
        const seededProducts: any[] = [];
        for (let i = 0; i < productCount; i++) {
            const product = this.generateProduct(brands, categories);
            await (this.simulationLogic as any).createDataEntity(storeId, 'product', product, tx);
            seededProducts.push(product);
        }

        // Seed Static Pages
        const pages = [
            { id: 'about-us', title: 'عن المتجر', slug: 'about-us', content: 'نحن متجر متميز يقدم أفضل المنتجات والخدمات لعملائنا الكرام. نسعى دائماً للتميز وتوفير تجربة تسوق فريدة.' },
            { id: 'privacy-policy', title: 'سياسة الخصوصية', slug: 'privacy-policy', content: 'نحن نهتم بخصوصية بياناتك. نلتزم بحماية المعلومات الشخصية التي تشاركها معنا وفقاً لأعلى معايير الأمان.' },
            { id: 'terms-of-use', title: 'شروط الاستخدام', slug: 'terms-of-use', content: 'باستخدامك لموقعنا، فإنك توافق على الالتزام بالشروط والأحكام التالية التي تنظم علاقتنا معك فيما يخص هذا المتجر.' }
        ];

        for (const page of pages) {
            await this.simulationLogic.createDataEntity(storeId, 'page', page, tx);
        }

        // Seed Menus (header/footer)
        await this.simulationLogic.upsertDataEntity(
            storeId,
            'menu',
            'header',
            this.generateHeaderMenu(categories),
            tx
        );
        await this.simulationLogic.upsertDataEntity(
            storeId,
            'menu',
            'footer',
            this.generateFooterMenu(pages),
            tx
        );

        // Seed Blog Categories
        const blogCategories = Array.from({ length: 4 }).map((_, index) => this.generateBlogCategory(index + 1));
        for (const category of blogCategories) {
            await this.simulationLogic.createDataEntity(storeId, 'blog_category', category, tx);
        }

        // Seed Blog Articles
        const blogArticles = Array.from({ length: 8 }).map((_, index) =>
            this.generateBlogArticle(index + 1, this.randomElement(blogCategories))
        );
        for (const article of blogArticles) {
            await this.simulationLogic.createDataEntity(storeId, 'blog_article', article, tx);
        }

        // Seed Special Offers
        const offers = Array.from({ length: 4 }).map((_, index) => this.generateSpecialOffer(index + 1));
        for (const offer of offers) {
            await this.simulationLogic.createDataEntity(storeId, 'specialOffer', offer, tx);
        }

        // Seed Reviews (derived from product comments for rating consistency)
        const reviews: any[] = [];
        for (const product of seededProducts) {
            const comments = Array.isArray(product?.comments) ? product.comments : [];
            for (const comment of comments) {
                const review = this.generateReviewFromComment(product, comment);
                reviews.push(review);
                await this.simulationLogic.createDataEntity(storeId, 'review', review, tx);
            }
        }

        // Seed Questions
        const questions: any[] = [];
        for (const product of seededProducts.slice(0, Math.min(seededProducts.length, 12))) {
            const totalQuestions = this.randomNumber(1, 3);
            for (let i = 0; i < totalQuestions; i++) {
                const question = this.generateQuestionForProduct(product, i + 1);
                questions.push(question);
                await this.simulationLogic.createDataEntity(storeId, 'question', question, tx);
            }
        }

        return {
            success: true,
            stats: {
                store: 1,
                brands: 5,
                categories: 5,
                products: productCount,
                pages: pages.length,
                menus: 2,
                blogCategories: blogCategories.length,
                blogArticles: blogArticles.length,
                offers: offers.length,
                reviews: reviews.length,
                questions: questions.length
            }
        };
    }

    private generateStoreSettings(): Partial<Salla.components['schemas']['Store']> {
        return {
            id: 'store-1', // Fixed ID for context
            name: 'متجر التجربة',
            description: 'متجر تجريبي تم إنشاؤه بواسطة المحاكي',
            currency: 'SAR',
            contacts: {
                mobile: '+966500000000',
                email: 'admin@demo.sa',
                whatsapp: '+966500000000'
            },
            social: {
                twitter: `https://twitter.com/demo`,
                instagram: `https://instagram.com/demo`
            }
        };
    }

    private generateBrand(): Salla.components['schemas']['Brand'] {
        return {
            id: this.randomString(),
            name: 'Brand ' + this.randomString(5),
            url: 'https://demo.sa/brand',
            description: 'Brand description',
            logo: SeederService.DEFAULT_LOCAL_IMAGE
        };
    }

    private generateCategory(): Salla.components['schemas']['Category'] {
        return {
            id: this.randomString(),
            name: 'Category ' + this.randomString(5),
            url: 'https://demo.sa/cat',
            image: SeederService.DEFAULT_LOCAL_IMAGE,
            description: 'Category description',
            parent_id: null
        };
    }

    private generateProduct(brands: any[], categories: any[]): Salla.components['schemas']['Product'] {
        const hasOptions = this.randomBoolean();
        const price = this.randomNumber(50, 1000);

        return {
            id: this.randomString(),
            name: 'Product ' + this.randomString(5),
            type: 'product',
            price: { amount: price, currency: 'SAR' },
            regular_price: { amount: price * 1.2, currency: 'SAR' },
            sale_price: { amount: price, currency: 'SAR' }, // Currently on sale
            description: 'Product description ' + this.randomString(20),
            short_description: 'Short description',
            url: 'https://demo.sa/product',
            is_available: true,
            is_on_sale: true,
            rating: {
                stars: this.randomNumber(1, 5),
                count: this.randomNumber(0, 100)
            },
            images: [
                { id: this.randomString(), url: SeederService.DEFAULT_LOCAL_IMAGE, alt: 'Main', is_default: true },
                { id: this.randomString(), url: SeederService.DEFAULT_LOCAL_IMAGE, alt: 'Side', is_default: false },
                { id: this.randomString(), url: SeederService.DEFAULT_LOCAL_IMAGE, alt: 'Back', is_default: false }
            ],
            brand: this.randomElement(brands),
            categories: [this.randomElement(categories)],
            options: hasOptions ? [
                {
                    id: this.randomString(),
                    name: 'المقاس',
                    type: 'select',
                    values: [
                        { id: this.randomString(), name: 'S', price: 0 },
                        { id: this.randomString(), name: 'M', price: 10 },
                        { id: this.randomString(), name: 'L', price: 20 }
                    ]
                },
                {
                    id: this.randomString(),
                    name: 'اللون',
                    type: 'radio',
                    values: [
                        { id: this.randomString(), name: 'أحمر', price: 0, color: '#ff0000' },
                        { id: this.randomString(), name: 'أزرق', price: 0, color: '#0000ff' }
                    ]
                }
            ] : [],
            comments: Array.from({ length: this.randomNumber(1, 5) }).map(() => ({
                id: this.randomString(),
                stars: this.randomNumber(1, 5),
                content: 'Review content ' + this.randomString(10),
                created_at: new Date().toISOString(),
                customer: {
                    name: 'Customer ' + this.randomString(5),
                    avatar: SeederService.DEFAULT_LOCAL_IMAGE
                }
            }))
        };
    }

    private generateBlogCategory(index: number) {
        const title = `تصنيف المدونة ${index}`;
        const slug = this.slugify(`blog-category-${index}-${this.randomString(4)}`);
        return {
            id: `blog_cat_${this.randomString(8)}`,
            name: title,
            title,
            slug,
            description: `وصف ${title}`,
            url: `/blog/categories/${slug}`
        };
    }

    private generateBlogArticle(index: number, category: any) {
        const title = `مقالة تجريبية ${index}`;
        const slug = this.slugify(`blog-article-${index}-${this.randomString(4)}`);
        return {
            id: `blog_article_${this.randomString(10)}`,
            name: title,
            title,
            slug,
            summary: `ملخص ${title}`,
            description: `هذا محتوى تجريبي للمقالة رقم ${index} لاستخدامها في معاينة الثيم.`,
            image: SeederService.DEFAULT_LOCAL_IMAGE,
            url: `/blog/${slug}`,
            category_id: String(category?.id || ''),
            category: category?.id
                ? {
                    id: String(category.id),
                    name: String(category.name || category.title || '')
                }
                : undefined,
            published_at: new Date(Date.now() - index * 86400000).toISOString(),
            is_published: true
        };
    }

    private generateSpecialOffer(index: number) {
        const title = `عرض خاص ${index}`;
        const slug = this.slugify(`special-offer-${index}-${this.randomString(4)}`);
        return {
            id: `offer_${this.randomString(10)}`,
            name: title,
            title,
            slug,
            description: `تفاصيل ${title}`,
            discount_type: index % 2 === 0 ? 'fixed' : 'percentage',
            discount_value: index % 2 === 0 ? this.randomNumber(10, 40) : this.randomNumber(5, 30),
            starts_at: new Date(Date.now() - index * 86400000).toISOString(),
            ends_at: new Date(Date.now() + (7 + index) * 86400000).toISOString(),
            image: SeederService.DEFAULT_LOCAL_IMAGE,
            url: `/offers/${slug}`,
            is_active: true
        };
    }

    private generateHeaderMenu(categories: any[]) {
        const categoryChildren = (categories || [])
            .slice(0, 6)
            .map((category: any, index: number) => ({
                id: `header-category-${String(category?.id || index + 1)}`,
                title: String(category?.name || `تصنيف ${index + 1}`),
                url: String(category?.url || `/categories/${String(category?.id || index + 1)}`),
                type: 'link',
                order: index + 1,
                children: [],
                products: []
            }));

        return {
            id: 'header',
            type: 'header',
            items: [
                { id: 'header-home', title: 'الرئيسية', url: '/', type: 'link', order: 1, children: [], products: [] },
                { id: 'header-products', title: 'المنتجات', url: '/products', type: 'link', order: 2, children: [], products: [] },
                { id: 'header-categories', title: 'التصنيفات', url: '/categories', type: 'link', order: 3, children: categoryChildren, products: [] },
                { id: 'header-brands', title: 'الماركات', url: '/brands', type: 'link', order: 4, children: [], products: [] },
                { id: 'header-blog', title: 'المدونة', url: '/blog', type: 'link', order: 5, children: [], products: [] }
            ]
        };
    }

    private generateFooterMenu(pages: any[]) {
        const pageChildren = (pages || [])
            .slice(0, 6)
            .map((page: any, index: number) => ({
                id: `footer-page-${String(page?.id || index + 1)}`,
                title: String(page?.title || `صفحة ${index + 1}`),
                url: `/${String(page?.slug || page?.id || `page-${index + 1}`)}`,
                type: 'link',
                order: index + 1,
                children: [],
                products: []
            }));

        return {
            id: 'footer',
            type: 'footer',
            items: [
                { id: 'footer-pages', title: 'صفحات مهمة', url: '/pages', type: 'link', order: 1, children: pageChildren, products: [] },
                { id: 'footer-contact', title: 'تواصل معنا', url: '/contact', type: 'link', order: 2, children: [], products: [] }
            ]
        };
    }

    private generateReviewFromComment(product: any, comment: any) {
        const productId = String(product?.id || '');
        return {
            id: `review_${this.randomString(10)}`,
            product_id: productId,
            stars: Math.min(5, Math.max(1, Number(comment?.stars || this.randomNumber(3, 5)))),
            content: String(comment?.content || `تجربة ممتازة للمنتج ${product?.name || ''}`),
            customer_name: String(comment?.customer?.name || `عميل ${this.randomString(4)}`),
            customer_avatar: String(comment?.customer?.avatar || SeederService.DEFAULT_LOCAL_IMAGE),
            is_published: true,
            created_at: String(comment?.created_at || new Date().toISOString())
        };
    }

    private generateQuestionForProduct(product: any, index: number) {
        const productId = String(product?.id || '');
        const answered = this.randomBoolean();
        const questionText = `هل يتوفر ${product?.name || 'هذا المنتج'} بمقاسات مختلفة؟`;
        return {
            id: `question_${this.randomString(10)}`,
            product_id: productId,
            question: questionText,
            answer: answered ? 'نعم، المنتج متوفر بعدة خيارات داخل صفحة المنتج.' : '',
            is_answered: answered,
            customer_name: `زائر ${this.randomString(4)}`,
            customer_avatar: SeederService.DEFAULT_LOCAL_IMAGE,
            is_published: true,
            created_at: new Date(Date.now() - index * 3600000).toISOString(),
            answered_at: answered ? new Date().toISOString() : ''
        };
    }
}
