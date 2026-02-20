import { PrismaClient } from './generated-client/index.js';
import { IStoreRepository, IDataEntityRepository, IThemeRepository, ICollectionRepository, IDataBindingRepository } from '@vtdr/contracts';

export class PrismaStoreRepository implements IStoreRepository {
    constructor(private prisma: PrismaClient) { }

    public async create(data: { title: string; defaultLocale?: string; defaultCurrency?: string; brandingJson?: string; themeSettingsJson?: string; themeId: string; themeVersionId: string; parentStoreId?: string; isMaster?: boolean }, tx?: any) {
        const client = tx || this.prisma;
        return client.store.create({
            data: {
                title: data.title,
                defaultLocale: data.defaultLocale || 'ar-SA',
                defaultCurrency: data.defaultCurrency || 'SAR',
                brandingJson: data.brandingJson || '{}',
                themeSettingsJson: data.themeSettingsJson || '{}',
                themeId: data.themeId,
                themeVersionId: data.themeVersionId,
                settingsJson: '{}',
                parentStoreId: data.parentStoreId,
                isMaster: data.isMaster || false
            }
        });
    }

    // FIX P0-1: include componentStates + pageCompositions so CompositionEngine.resolveComponents works correctly
    public async getById(id: string, tx?: any) {
        const client = tx || this.prisma;
        return client.store.findUnique({
            where: { id },
            include: {
                themeVersion: true,
                componentStates: true,
                pageCompositions: true
            }
        });
    }

    public async listAll(tx?: any) {
        const client = tx || this.prisma;
        return client.store.findMany({
            include: {
                themeVersion: true,
                componentStates: true,
                pageCompositions: true
            }
        });
    }

    public async update(id: string, data: any, tx?: any) {
        const client = tx || this.prisma;
        return client.store.update({
            where: { id },
            data
        });
    }

    public async delete(id: string, tx?: any) {
        const client = tx || this.prisma;
        return client.store.delete({
            where: { id }
        });
    }

    public async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
        return this.prisma.$transaction(fn);
    }
}

// PrismaScenarioRepository removed

export class PrismaDataEntityRepository implements IDataEntityRepository {
    constructor(private prisma: PrismaClient) { }

    public async create(storeId: string, type: string, payload: any, tx?: any) {
        const client = tx || this.prisma;
        return client.dataEntity.create({
            data: {
                storeId,
                entityType: type as any,
                entityKey: payload.id !== undefined ? String(payload.id) : undefined,
                payloadJson: JSON.stringify(payload)
            }
        });
    }

    public async getById(storeId: string, type: string, key: string, tx?: any) {
        const client = tx || this.prisma;
        const entity = await client.dataEntity.findUnique({
            where: {
                storeId_entityType_entityKey: {
                    storeId,
                    entityType: type,
                    entityKey: key
                }
            }
        });
        return entity ? JSON.parse(entity.payloadJson) : null;
    }

    public async upsertByEntityKey(storeId: string, type: string, key: string, payload: any, tx?: any) {
        const client = tx || this.prisma;
        return client.dataEntity.upsert({
            where: {
                storeId_entityType_entityKey: {
                    storeId,
                    entityType: type,
                    entityKey: key
                }
            },
            update: {
                payloadJson: JSON.stringify(payload)
            },
            create: {
                storeId,
                entityType: type as any,
                entityKey: key,
                payloadJson: JSON.stringify(payload)
            }
        });
    }

    public async deleteByEntityKey(storeId: string, type: string, key: string, tx?: any) {
        const client = tx || this.prisma;
        await client.dataEntity.deleteMany({
            where: {
                storeId,
                entityType: type as any,
                entityKey: key
            }
        });
    }

    public async getByStoreAndType(storeId: string, type: string, tx?: any) {
        const client = tx || this.prisma;
        const entities = await client.dataEntity.findMany({
            where: {
                storeId,
                entityType: type as any
            }
        });

        return entities.map((e: any) => {
            try {
                return JSON.parse(e.payloadJson);
            } catch (err: any) {
                return {};
            }
        });
    }

    public async listAllByStore(storeId: string, tx?: any) {
        const client = tx || this.prisma;
        return client.dataEntity.findMany({
            where: { storeId }
        });
    }

    public async clearByStore(storeId: string, tx?: any) {
        const client = tx || this.prisma;
        await client.dataEntity.deleteMany({
            where: { storeId }
        });
    }

}

export class PrismaThemeRepository implements IThemeRepository {
    constructor(private prisma: PrismaClient) { }

    public async upsert(metadata: any) {
        return this.prisma.theme.upsert({
            where: { id: metadata.id },
            update: {
                nameAr: metadata.name,
                descriptionAr: metadata.description
            },
            create: {
                id: metadata.id,
                nameAr: metadata.name,
                descriptionAr: metadata.description
            }
        });
    }

    public async getById(id: string) {
        return this.prisma.theme.findUnique({
            where: { id },
            include: { versions: true }
        });
    }

    public async listAll() {
        return this.prisma.theme.findMany({
            include: { versions: true }
        });
    }

    public async addVersion(themeId: string, version: string, fsPath: string, schema: any) {
        return this.prisma.themeVersion.create({
            data: {
                themeId,
                version: version,
                fsPath: fsPath,
                contractJson: JSON.stringify(schema),
                capabilitiesJson: JSON.stringify(schema.settings)
            }
        });
    }

    public async findVersion(themeId: string, version: string) {
        return this.prisma.themeVersion.findFirst({
            where: { themeId, version }
        });
    }

    public async linkToStore(storeId: string, themeId: string, versionId: string) {
        await this.prisma.store.update({
            where: { id: storeId },
            data: { themeId, themeVersionId: versionId }
        });
    }
}

export class PrismaCollectionRepository implements ICollectionRepository {
    constructor(private prisma: PrismaClient) { }

    public async create(storeId: string, data: any) {
        return this.prisma.collection.create({
            data: {
                storeId,
                name: data.title,
                source: data.source,
                rulesJson: data.rules ? JSON.stringify(data.rules) : null
            }
        });
    }

    public async addItems(collectionId: string, items: { entityId: string; sortOrder: number }[]) {
        await this.prisma.collectionItem.createMany({
            data: items.map(item => ({
                collectionId,
                entityId: item.entityId,
                sortOrder: item.sortOrder
            }))
        });
    }
}

export class PrismaDataBindingRepository implements IDataBindingRepository {
    constructor(private prisma: PrismaClient) { }

    public async create(storeId: string, data: any) {
        return this.prisma.dataBinding.create({
            data: {
                storeId,
                componentPath: data.componentPath,
                bindingKey: data.bindingKey,
                sourceType: data.sourceType,
                sourceRef: data.sourceId
            }
        });
    }
}
