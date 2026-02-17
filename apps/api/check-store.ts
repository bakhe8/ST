import { PrismaClient } from '@vtdr/data';
const prisma = new PrismaClient();

async function main() {
    const store = await prisma.store.findUnique({
        where: { id: '1328d364-6058-4da9-8a93-7b9e5afeef27' }
    });
    console.log(JSON.stringify(store, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
