import { Store } from './runtime.js';

export interface IStoreRepository {
    create(data: { title: string; defaultLocale?: string; defaultCurrency?: string; brandingJson?: string; themeSettingsJson?: string; themeId: string; themeVersionId: string; parentStoreId?: string; isMaster?: boolean }, tx?: any): Promise<any>;
    getById(id: string, tx?: any): Promise<any>;
    listAll(tx?: any): Promise<any[]>;
    update(id: string, data: any, tx?: any): Promise<any>;
    delete(id: string, tx?: any): Promise<any>;
    transaction<T>(fn: (tx: any) => Promise<T>): Promise<T>;
}

// IScenarioRepository removed in favor of direct Store management

export interface IDataEntityRepository {
    create(storeId: string, type: string, payload: any, tx?: any): Promise<any>;
    getById(storeId: string, type: string, key: string, tx?: any): Promise<any>;
    upsertByEntityKey(storeId: string, type: string, key: string, payload: any, tx?: any): Promise<any>;
    deleteByEntityKey(storeId: string, type: string, key: string, tx?: any): Promise<void>;
    getByStoreAndType(storeId: string, type: string, tx?: any): Promise<any[]>;
    listAllByStore(storeId: string, tx?: any): Promise<any[]>;
    clearByStore(storeId: string, tx?: any): Promise<void>;
}

export interface IThemeRepository {
    upsert(metadata: any): Promise<any>;
    getById(id: string): Promise<any>;
    listAll(): Promise<any[]>;
    addVersion(themeId: string, version: string, fsPath: string, schema: any): Promise<any>;
    findVersion(themeId: string, version: string): Promise<any>;
    linkToStore(storeId: string, themeId: string, versionId: string): Promise<void>;
}

export interface ICollectionRepository {
    create(storeId: string, data: any): Promise<any>;
    addItems(collectionId: string, items: { entityId: string; sortOrder: number }[]): Promise<void>;
}

export interface IDataBindingRepository {
    create(storeId: string, data: any): Promise<any>;
}
