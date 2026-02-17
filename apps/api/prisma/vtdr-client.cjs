// vtdr-client.js: Prisma Client مخصص لقاعدة vtdr.db
const { PrismaClient } = require('@prisma/client');
module.exports = new PrismaClient({ datasources: { db: { url: 'file:C:/Users/Bakheet/Documents/Projects/ST/packages/data/prisma/vtdr.db' } } });