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
        for (let i = 0; i < productCount; i++) {
            const product = this.generateProduct(brands, categories);
            await (this.simulationLogic as any).createDataEntity(storeId, 'product', product, tx);
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

        return {
            success: true,
            stats: {
                store: 1,
                brands: 5,
                categories: 5,
                products: productCount,
                pages: pages.length
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
}
