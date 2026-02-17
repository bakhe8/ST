import {
    PrismaClient,
    PrismaStoreRepository,
    PrismaDataEntityRepository,
    PrismaThemeRepository
} from '@vtdr/data';

const prisma = new PrismaClient();
const storeRepo = new PrismaStoreRepository(prisma);
const dataEntityRepo = new PrismaDataEntityRepository(prisma);
const themeRepo = new PrismaThemeRepository(prisma);

async function main() {
    console.log('🌱 Starting Store-First seed...');

    // 1) Theme + Version
    const theme = await themeRepo.upsert({
        id: 'theme-raed-master',
        name: 'Raed Theme',
        description: 'Default Salla Theme'
    });

    let version = await themeRepo.findVersion(theme.id, '1.0.0');
    if (!version) {
        version = await themeRepo.addVersion(
            theme.id,
            '1.0.0',
            './packages/themes/theme-raed-master',
            { settings: [] }
        );
    }
    console.log(`✅ Theme ready: ${theme.id} (v1.0.0)`);

    // 2) Store (Store-First)
    const store = await storeRepo.create({
        title: 'Mock Salla Store',
        defaultLocale: 'ar-SA',
        defaultCurrency: 'SAR',
        themeId: theme.id,
        themeVersionId: version.id,
        brandingJson: JSON.stringify({
            colors: { primary: '#21636d', secondary: '#10b981' }
        }),
        themeSettingsJson: JSON.stringify({
            header_is_sticky: true,
            sticky_add_to_cart: true
        })
    });
    console.log(`✅ Store created: ${store.id}`);

    // 3) Seed products
    const products = [
        { id: '101', name: 'Mock Product A', price: { amount: 100, currency: 'SAR' }, sku: 'SKU-101' },
        { id: '102', name: 'Mock Product B', price: { amount: 200, currency: 'SAR' }, sku: 'SKU-102' }
    ];

    for (const p of products) {
        await dataEntityRepo.upsertByEntityKey(store.id, 'product', String(p.id), p);
    }
    console.log(`✅ Seeded ${products.length} products.`);

    // 4) Seed categories
    const categories = [
        { id: '1', name: 'Mock Category 1', parentId: '', order: 1 },
        { id: '2', name: 'Mock Category 2', parentId: '', order: 2 }
    ];

    for (const c of categories) {
        await dataEntityRepo.upsertByEntityKey(store.id, 'category', String(c.id), c);
    }
    console.log(`✅ Seeded ${categories.length} categories.`);

    console.log('🌱 Store-First seed finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
