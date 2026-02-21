import {
  IDataEntityRepository,
  ICollectionRepository,
  IDataBindingRepository,
  Product,
  Collection,
  DataBinding,
} from "@vtdr/contracts";

export class ContentManager {
  constructor(
    private dataEntityRepo: IDataEntityRepository,
    private collectionRepo: ICollectionRepository,
    private dataBindingRepo: IDataBindingRepository,
  ) {}

  // --- Products ---
  public async createProduct(storeId: string, product: any) {
    return this.dataEntityRepo.create(storeId, "product", product);
  }

  public async getProduct(
    storeId: string,
    productId: string,
  ): Promise<any | null> {
    return this.dataEntityRepo.getById(storeId, "product", productId);
  }

  // --- Collections ---
  public async createCollection(storeId: string, collection: any) {
    const dbCollection = await this.collectionRepo.create(storeId, {
      title: collection.title,
      source: collection.source,
      rules: collection.rules,
    });

    if (collection.source === "manual" && collection.items.length > 0) {
      await this.collectionRepo.addItems(
        dbCollection.id,
        collection.items.map((productId: string, index: number) => ({
          entityId: productId,
          sortOrder: index,
        })),
      );
    }

    return dbCollection;
  }

  // --- Binding ---
  public async bindData(storeId: string, binding: any) {
    return this.dataBindingRepo.create(storeId, {
      componentPath: binding.componentPath,
      bindingKey: binding.bindingKey,
      sourceType: binding.sourceType,
      sourceId: binding.sourceId,
    });
  }

  // --- Discovery ---
  public async listEntities(storeId: string, type: string) {
    return this.dataEntityRepo.getByStoreAndType(storeId, type);
  }
}
