import { StoreLogic } from "../core/store-logic.js";
import { Salla } from "@vtdr/contracts";
import {
  getSeedProfileDefinition,
  type SeedProfileId,
} from "./seed-profiles.js";

export interface SeedStoreOptions {
  profile?: SeedProfileId | string;
}

export interface EnsureCoreDataResult {
  success: true;
  profile: string;
  added: {
    store: number;
    brands: number;
    categories: number;
    products: number;
    pages: number;
    menus: number;
    blogCategories: number;
    blogArticles: number;
    loyalty: number;
    landing: number;
    wishlist: number;
    orders: number;
    checkoutSessions: number;
  };
}

export class SeederService {
  private static readonly DEFAULT_LOCAL_IMAGE = "/images/placeholder.png";

  constructor(private simulationLogic: StoreLogic) {}

  private randomString(length: number = 10): string {
    return Math.random()
      .toString(36)
      .substring(2, 2 + length);
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

  private readMoneyAmount(value: any): number {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    if (value && typeof value === "object") {
      const parsed = Number(value.amount);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  }

  private pickSeedValue(
    values: string[],
    index: number,
    fallback: string,
  ): string {
    if (!Array.isArray(values) || values.length === 0) return fallback;
    const value = String(values[index % values.length] || "").trim();
    return value || fallback;
  }

  private normalizeProductCount(productCount: number): number {
    const numeric = Number(productCount);
    if (!Number.isFinite(numeric)) return 20;
    return Math.max(1, Math.min(250, Math.floor(numeric)));
  }

  private slugify(value: string): string {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06ff]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-+/g, "-");
  }

  private normalizeId(value: unknown): string {
    return String(value || "").trim();
  }

  private uniqueIds(values: unknown[]): string[] {
    const out: string[] = [];
    const seen = new Set<string>();
    for (const entry of values || []) {
      const token = this.normalizeId(entry);
      if (!token || seen.has(token)) continue;
      seen.add(token);
      out.push(token);
    }
    return out;
  }

  private collectProductCategoryIds(product: any): string[] {
    const fromCategoryIds = Array.isArray(product?.category_ids)
      ? product.category_ids
      : [];
    const fromCategories = Array.isArray(product?.categories)
      ? product.categories.map((entry: any) => entry?.id || entry)
      : [];
    const directCategory = product?.category?.id || product?.category_id || "";
    return this.uniqueIds([
      ...fromCategoryIds,
      ...fromCategories,
      directCategory,
    ]);
  }

  public async seedStoreData(
    storeId: string,
    productCount: number = 20,
    tx?: any,
    options?: SeedStoreOptions,
  ) {
    const profile = getSeedProfileDefinition(options?.profile);
    const normalizedProductCount = this.normalizeProductCount(productCount);

    // Clear existing data
    await this.simulationLogic.clearDataEntities(storeId, tx);

    // Seed Store Settings (Pseudo-Entity for runtime)
    const storeSettings = this.generateStoreSettings(profile);
    await (this.simulationLogic as any).createDataEntity(
      storeId,
      "store",
      storeSettings,
      tx,
    );

    // Seed Brands
    const brands = [];
    for (let i = 0; i < Math.max(5, profile.brandNames.length); i++) {
      const brand = this.generateBrand(i, profile);
      await (this.simulationLogic as any).createDataEntity(
        storeId,
        "brand",
        brand,
        tx,
      );
      brands.push(brand);
    }

    // Seed Categories
    const categories: any[] = [];
    for (let i = 0; i < Math.max(5, profile.categoryNames.length); i++) {
      const category = this.generateCategory(i, profile);
      await (this.simulationLogic as any).createDataEntity(
        storeId,
        "category",
        category,
        tx,
      );
      categories.push(category);
    }

    // Seed Products
    const seededProducts: any[] = [];
    for (let i = 0; i < normalizedProductCount; i++) {
      const product = this.generateProduct(i, brands, categories, profile);
      await (this.simulationLogic as any).createDataEntity(
        storeId,
        "product",
        product,
        tx,
      );
      seededProducts.push(product);
    }

    // Seed Static Pages
    const pages = [
      {
        id: "about-us",
        title: "عن المتجر",
        slug: "about-us",
        content:
          "نحن متجر متميز يقدم أفضل المنتجات والخدمات لعملائنا الكرام. نسعى دائماً للتميز وتوفير تجربة تسوق فريدة.",
      },
      {
        id: "privacy-policy",
        title: "سياسة الخصوصية",
        slug: "privacy-policy",
        content:
          "نحن نهتم بخصوصية بياناتك. نلتزم بحماية المعلومات الشخصية التي تشاركها معنا وفقاً لأعلى معايير الأمان.",
      },
      {
        id: "terms-of-use",
        title: "شروط الاستخدام",
        slug: "terms-of-use",
        content:
          "باستخدامك لموقعنا، فإنك توافق على الالتزام بالشروط والأحكام التالية التي تنظم علاقتنا معك فيما يخص هذا المتجر.",
      },
    ];

    for (const page of pages) {
      await this.simulationLogic.createDataEntity(storeId, "page", page, tx);
    }

    // Seed Menus (header/footer)
    await this.simulationLogic.upsertDataEntity(
      storeId,
      "menu",
      "header",
      this.generateHeaderMenu(categories),
      tx,
    );
    await this.simulationLogic.upsertDataEntity(
      storeId,
      "menu",
      "footer",
      this.generateFooterMenu(pages),
      tx,
    );

    // Seed Blog Categories
    const blogCategories = Array.from({
      length: Math.max(4, profile.blogCategoryNames.length),
    }).map((_, index) => this.generateBlogCategory(index + 1, profile));
    for (const category of blogCategories) {
      await this.simulationLogic.createDataEntity(
        storeId,
        "blog_category",
        category,
        tx,
      );
    }

    // Seed Blog Articles
    const blogArticles = Array.from({
      length: Math.max(8, profile.blogArticleTitles.length),
    }).map((_, index) =>
      this.generateBlogArticle(
        index + 1,
        this.randomElement(blogCategories),
        profile,
      ),
    );
    for (const article of blogArticles) {
      await this.simulationLogic.createDataEntity(
        storeId,
        "blog_article",
        article,
        tx,
      );
    }

    // Seed Special Offers
    const offers = Array.from({
      length: Math.max(4, profile.offerTitles.length),
    }).map((_, index) =>
      this.generateSpecialOffer(index + 1, profile, seededProducts, categories),
    );
    for (const offer of offers) {
      await this.simulationLogic.createDataEntity(
        storeId,
        "specialOffer",
        offer,
        tx,
      );
    }

    // Seed Reviews (derived from product comments for rating consistency)
    const reviews: any[] = [];
    for (const product of seededProducts) {
      const comments = Array.isArray(product?.comments) ? product.comments : [];
      for (const comment of comments) {
        const review = this.generateReviewFromComment(product, comment);
        reviews.push(review);
        await this.simulationLogic.createDataEntity(
          storeId,
          "review",
          review,
          tx,
        );
      }
    }

    // Seed Questions
    const questions: any[] = [];
    for (const product of seededProducts.slice(
      0,
      Math.min(seededProducts.length, 12),
    )) {
      const totalQuestions = this.randomNumber(1, 3);
      for (let i = 0; i < totalQuestions; i++) {
        const question = this.generateQuestionForProduct(product, i + 1);
        questions.push(question);
        await this.simulationLogic.createDataEntity(
          storeId,
          "question",
          question,
          tx,
        );
      }
    }

    const loyalty = this.generateLoyaltyEntity(seededProducts, profile);
    await this.simulationLogic.upsertDataEntity(
      storeId,
      "loyalty",
      "default",
      loyalty,
      tx,
    );

    const landing = this.generateLandingEntity(seededProducts, profile);
    await this.simulationLogic.upsertDataEntity(
      storeId,
      "landing",
      "default",
      landing,
      tx,
    );

    const wishlist = this.generateWishlistState(seededProducts);
    await this.simulationLogic.upsertDataEntity(
      storeId,
      "wishlist",
      "default",
      wishlist,
      tx,
    );

    const seededOrders = this.generateOrderSeeds(seededProducts, profile, 2);
    for (const order of seededOrders) {
      await this.simulationLogic.createDataEntity(storeId, "order", order, tx);
    }

    const checkoutSession = this.generateCheckoutSessionState();
    await this.simulationLogic.upsertDataEntity(
      storeId,
      "checkout_session",
      "default",
      checkoutSession,
      tx,
    );

    return {
      success: true,
      stats: {
        profile: profile.id,
        store: 1,
        brands: brands.length,
        categories: categories.length,
        products: normalizedProductCount,
        pages: pages.length,
        menus: 2,
        blogCategories: blogCategories.length,
        blogArticles: blogArticles.length,
        offers: offers.length,
        reviews: reviews.length,
        questions: questions.length,
        loyalty: 1,
        landing: 1,
        wishlist: 1,
        orders: seededOrders.length,
        checkoutSessions: 1,
      },
    };
  }

  /**
   * Backfills only missing core entities without clearing existing store data.
   * Used by preview runtime to self-heal legacy/incomplete stores.
   */
  public async ensureMinimumCoreData(
    storeId: string,
    tx?: any,
    options?: SeedStoreOptions,
  ): Promise<EnsureCoreDataResult> {
    const profile = getSeedProfileDefinition(options?.profile);
    const added = {
      store: 0,
      brands: 0,
      categories: 0,
      products: 0,
      pages: 0,
      menus: 0,
      blogCategories: 0,
      blogArticles: 0,
      loyalty: 0,
      landing: 0,
      wishlist: 0,
      orders: 0,
      checkoutSessions: 0,
    };

    const [
      storeEntitiesRaw,
      brandEntitiesRaw,
      categoryEntitiesRaw,
      productEntitiesRaw,
      pageEntitiesRaw,
      menuEntitiesRaw,
      blogCategoryEntitiesRaw,
      blogArticleEntitiesRaw,
      loyaltyEntitiesRaw,
      landingEntitiesRaw,
      wishlistEntityRaw,
      orderEntitiesRaw,
      checkoutSessionRaw,
    ] = await Promise.all([
      this.simulationLogic.getDataEntities(storeId, "store", tx),
      this.simulationLogic.getDataEntities(storeId, "brand", tx),
      this.simulationLogic.getDataEntities(storeId, "category", tx),
      this.simulationLogic.getDataEntities(storeId, "product", tx),
      this.simulationLogic.getDataEntities(storeId, "page", tx),
      this.simulationLogic.getDataEntities(storeId, "menu", tx),
      this.simulationLogic.getDataEntities(storeId, "blog_category", tx),
      this.simulationLogic.getDataEntities(storeId, "blog_article", tx),
      this.simulationLogic.getDataEntities(storeId, "loyalty", tx),
      this.simulationLogic.getDataEntities(storeId, "landing", tx),
      this.simulationLogic.getDataEntity(storeId, "wishlist", "default", tx),
      this.simulationLogic.getDataEntities(storeId, "order", tx),
      this.simulationLogic.getDataEntity(
        storeId,
        "checkout_session",
        "default",
        tx,
      ),
    ]);

    const storeEntities = Array.isArray(storeEntitiesRaw)
      ? storeEntitiesRaw
      : [];
    const brands = Array.isArray(brandEntitiesRaw) ? [...brandEntitiesRaw] : [];
    const categories = Array.isArray(categoryEntitiesRaw)
      ? [...categoryEntitiesRaw]
      : [];
    const products = Array.isArray(productEntitiesRaw)
      ? [...productEntitiesRaw]
      : [];
    const pages = Array.isArray(pageEntitiesRaw) ? pageEntitiesRaw : [];
    const menus = Array.isArray(menuEntitiesRaw) ? menuEntitiesRaw : [];
    const blogCategories = Array.isArray(blogCategoryEntitiesRaw)
      ? [...blogCategoryEntitiesRaw]
      : [];
    const blogArticles = Array.isArray(blogArticleEntitiesRaw)
      ? [...blogArticleEntitiesRaw]
      : [];
    const loyaltyEntities = Array.isArray(loyaltyEntitiesRaw)
      ? loyaltyEntitiesRaw
      : [];
    const landingEntities = Array.isArray(landingEntitiesRaw)
      ? landingEntitiesRaw
      : [];
    const orders = Array.isArray(orderEntitiesRaw) ? [...orderEntitiesRaw] : [];

    if (storeEntities.length === 0) {
      await this.simulationLogic.createDataEntity(
        storeId,
        "store",
        this.generateStoreSettings(profile),
        tx,
      );
      added.store += 1;
    }

    if (brands.length === 0) {
      for (let i = 0; i < Math.max(5, profile.brandNames.length); i++) {
        const brand = this.generateBrand(i, profile);
        await this.simulationLogic.createDataEntity(
          storeId,
          "brand",
          brand,
          tx,
        );
        brands.push(brand);
        added.brands += 1;
      }
    }

    if (categories.length === 0) {
      for (let i = 0; i < Math.max(5, profile.categoryNames.length); i++) {
        const category = this.generateCategory(i, profile);
        await this.simulationLogic.createDataEntity(
          storeId,
          "category",
          category,
          tx,
        );
        categories.push(category);
        added.categories += 1;
      }
    }

    if (products.length === 0) {
      const brandPool =
        brands.length > 0 ? brands : [this.generateBrand(0, profile)];
      const categoryPool =
        categories.length > 0
          ? categories
          : [this.generateCategory(0, profile)];
      if (brands.length === 0) {
        await this.simulationLogic.createDataEntity(
          storeId,
          "brand",
          brandPool[0],
          tx,
        );
        brands.push(brandPool[0]);
        added.brands += 1;
      }
      if (categories.length === 0) {
        await this.simulationLogic.createDataEntity(
          storeId,
          "category",
          categoryPool[0],
          tx,
        );
        categories.push(categoryPool[0]);
        added.categories += 1;
      }

      for (let i = 0; i < 20; i++) {
        const product = this.generateProduct(
          i,
          brandPool,
          categoryPool,
          profile,
        );
        await this.simulationLogic.createDataEntity(
          storeId,
          "product",
          product,
          tx,
        );
        products.push(product);
        added.products += 1;
      }
    }

    const defaultPages = [
      {
        id: "about-us",
        title: "عن المتجر",
        slug: "about-us",
        content:
          "نحن متجر متميز يقدم أفضل المنتجات والخدمات لعملائنا الكرام. نسعى دائماً للتميز وتوفير تجربة تسوق فريدة.",
      },
      {
        id: "privacy-policy",
        title: "سياسة الخصوصية",
        slug: "privacy-policy",
        content:
          "نحن نهتم بخصوصية بياناتك. نلتزم بحماية المعلومات الشخصية التي تشاركها معنا وفقاً لأعلى معايير الأمان.",
      },
      {
        id: "terms-of-use",
        title: "شروط الاستخدام",
        slug: "terms-of-use",
        content:
          "باستخدامك لموقعنا، فإنك توافق على الالتزام بالشروط والأحكام التالية التي تنظم علاقتنا معك فيما يخص هذا المتجر.",
      },
    ];
    if (pages.length === 0) {
      for (const page of defaultPages) {
        await this.simulationLogic.createDataEntity(storeId, "page", page, tx);
        added.pages += 1;
      }
    }

    const headerExists = menus.some(
      (menu: any) =>
        String(menu?.id || menu?.type || "").toLowerCase() === "header",
    );
    if (!headerExists) {
      await this.simulationLogic.upsertDataEntity(
        storeId,
        "menu",
        "header",
        this.generateHeaderMenu(categories),
        tx,
      );
      added.menus += 1;
    }

    const footerExists = menus.some(
      (menu: any) =>
        String(menu?.id || menu?.type || "").toLowerCase() === "footer",
    );
    if (!footerExists) {
      const pagesForFooter = pages.length > 0 ? pages : defaultPages;
      await this.simulationLogic.upsertDataEntity(
        storeId,
        "menu",
        "footer",
        this.generateFooterMenu(pagesForFooter),
        tx,
      );
      added.menus += 1;
    }

    if (blogCategories.length === 0) {
      const generatedBlogCategories = Array.from({
        length: Math.max(4, profile.blogCategoryNames.length),
      }).map((_, index) => this.generateBlogCategory(index + 1, profile));
      for (const category of generatedBlogCategories) {
        await this.simulationLogic.createDataEntity(
          storeId,
          "blog_category",
          category,
          tx,
        );
        blogCategories.push(category);
        added.blogCategories += 1;
      }
    }

    if (blogArticles.length === 0) {
      if (blogCategories.length === 0) {
        const fallbackCategory = this.generateBlogCategory(1, profile);
        await this.simulationLogic.createDataEntity(
          storeId,
          "blog_category",
          fallbackCategory,
          tx,
        );
        blogCategories.push(fallbackCategory);
        added.blogCategories += 1;
      }

      const pool =
        blogCategories.length > 0
          ? blogCategories
          : [this.generateBlogCategory(1, profile)];
      const totalArticles = Math.max(8, profile.blogArticleTitles.length);
      for (let i = 0; i < totalArticles; i++) {
        // Cycle across categories to avoid empty category pages in preview.
        const category = pool[i % pool.length];
        const article = this.generateBlogArticle(i + 1, category, profile);
        await this.simulationLogic.createDataEntity(
          storeId,
          "blog_article",
          article,
          tx,
        );
        blogArticles.push(article);
        added.blogArticles += 1;
      }
    }

    // Hardening pass: keep existing stores coherent so theme pages do not render empty by broken relations.
    const categoryById = new Map(
      categories
        .map(
          (category: any) =>
            [this.normalizeId(category?.id), category] as const,
        )
        .filter(([id]) => Boolean(id)),
    );
    const brandById = new Map(
      brands
        .map((brand: any) => [this.normalizeId(brand?.id), brand] as const)
        .filter(([id]) => Boolean(id)),
    );
    const fallbackCategory = categories[0] || null;
    const fallbackBrand = brands[0] || null;

    for (const product of products) {
      const productId = this.normalizeId(product?.id);
      if (!productId) continue;

      let changed = false;
      const nextProduct: Record<string, any> = { ...(product || {}) };
      const validCategoryIds = this.collectProductCategoryIds(
        nextProduct,
      ).filter((id) => categoryById.has(id));

      if (validCategoryIds.length === 0 && fallbackCategory) {
        validCategoryIds.push(this.normalizeId(fallbackCategory.id));
        changed = true;
      }

      if (validCategoryIds.length > 0) {
        const nextCategoryObjects = validCategoryIds
          .map((id) => categoryById.get(id))
          .filter(Boolean);
        const primaryCategory = nextCategoryObjects[0];
        const currentPrimaryCategoryId = this.normalizeId(
          nextProduct?.category?.id || nextProduct?.category_id,
        );

        nextProduct.category_ids = validCategoryIds;
        nextProduct.categories = nextCategoryObjects;
        nextProduct.category_id = validCategoryIds[0];
        nextProduct.category = primaryCategory;

        if (currentPrimaryCategoryId !== validCategoryIds[0]) {
          changed = true;
        }
      }

      const currentBrandId = this.normalizeId(
        nextProduct?.brand?.id || nextProduct?.brand_id,
      );
      if (
        (!currentBrandId || !brandById.has(currentBrandId)) &&
        fallbackBrand
      ) {
        nextProduct.brand = fallbackBrand;
        nextProduct.brand_id = this.normalizeId(fallbackBrand.id);
        changed = true;
      }

      const productSlug =
        this.slugify(String(nextProduct.slug || productId)) || productId;
      if (!String(nextProduct.url || "").startsWith("/products/")) {
        nextProduct.url = `/products/${productSlug}`;
        changed = true;
      }

      if (changed) {
        await this.simulationLogic.upsertDataEntity(
          storeId,
          "product",
          productId,
          nextProduct,
          tx,
        );
      }
    }

    const blogCategoryById = new Map(
      blogCategories
        .map(
          (category: any) =>
            [this.normalizeId(category?.id), category] as const,
        )
        .filter(([id]) => Boolean(id)),
    );
    const blogCategoryPool =
      blogCategories.length > 0
        ? blogCategories
        : [this.generateBlogCategory(1, profile)];
    const blogArticleCountByCategory = new Map<string, number>();

    for (let index = 0; index < blogArticles.length; index += 1) {
      const article = blogArticles[index];
      const articleId = this.normalizeId(article?.id);
      if (!articleId) continue;

      const fallbackArticleCategory =
        blogCategoryPool[index % blogCategoryPool.length];
      const fallbackArticleCategoryId = this.normalizeId(
        fallbackArticleCategory?.id,
      );
      const rawArticleCategoryId = this.normalizeId(
        article?.category_id || article?.category?.id || article?.category,
      );
      const effectiveCategoryId =
        rawArticleCategoryId && blogCategoryById.has(rawArticleCategoryId)
          ? rawArticleCategoryId
          : fallbackArticleCategoryId;

      const categoryEntity =
        blogCategoryById.get(effectiveCategoryId) || fallbackArticleCategory;
      let changed = false;
      const nextArticle: Record<string, any> = { ...(article || {}) };

      if (effectiveCategoryId && rawArticleCategoryId !== effectiveCategoryId) {
        nextArticle.category_id = effectiveCategoryId;
        changed = true;
      }

      const currentCategoryObjectId = this.normalizeId(
        nextArticle?.category?.id || nextArticle?.category,
      );
      if (
        !currentCategoryObjectId ||
        currentCategoryObjectId !== effectiveCategoryId
      ) {
        nextArticle.category = {
          id: effectiveCategoryId,
          name: String(categoryEntity?.name || categoryEntity?.title || ""),
        };
        changed = true;
      }

      const articleSlug =
        this.slugify(String(nextArticle.slug || articleId)) || articleId;
      if (!String(nextArticle.url || "").startsWith("/blog/")) {
        nextArticle.url = `/blog/${articleSlug}`;
        changed = true;
      }

      if (changed) {
        await this.simulationLogic.upsertDataEntity(
          storeId,
          "blog_article",
          articleId,
          nextArticle,
          tx,
        );
      }

      if (effectiveCategoryId) {
        blogArticleCountByCategory.set(
          effectiveCategoryId,
          Number(blogArticleCountByCategory.get(effectiveCategoryId) || 0) + 1,
        );
      }
    }

    for (let index = 0; index < blogCategories.length; index += 1) {
      const category = blogCategories[index];
      const categoryId = this.normalizeId(category?.id);
      if (!categoryId) continue;

      if (Number(blogArticleCountByCategory.get(categoryId) || 0) > 0) {
        continue;
      }

      const article = this.generateBlogArticle(
        Math.max(1, blogArticles.length + index + 1),
        category,
        profile,
      );
      await this.simulationLogic.createDataEntity(
        storeId,
        "blog_article",
        article,
        tx,
      );
      blogArticleCountByCategory.set(categoryId, 1);
      added.blogArticles += 1;
    }

    if (loyaltyEntities.length === 0) {
      const loyalty = this.generateLoyaltyEntity(products, profile);
      await this.simulationLogic.upsertDataEntity(
        storeId,
        "loyalty",
        "default",
        loyalty,
        tx,
      );
      added.loyalty += 1;
    }

    if (landingEntities.length === 0) {
      const landing = this.generateLandingEntity(products, profile);
      await this.simulationLogic.upsertDataEntity(
        storeId,
        "landing",
        "default",
        landing,
        tx,
      );
      added.landing += 1;
    }

    if (!wishlistEntityRaw || typeof wishlistEntityRaw !== "object") {
      const wishlist = this.generateWishlistState(products);
      await this.simulationLogic.upsertDataEntity(
        storeId,
        "wishlist",
        "default",
        wishlist,
        tx,
      );
      added.wishlist += 1;
    }

    if (orders.length === 0) {
      const seededOrders = this.generateOrderSeeds(products, profile, 2);
      for (const order of seededOrders) {
        await this.simulationLogic.createDataEntity(
          storeId,
          "order",
          order,
          tx,
        );
        added.orders += 1;
      }
    }

    if (!checkoutSessionRaw || typeof checkoutSessionRaw !== "object") {
      const checkoutSession = this.generateCheckoutSessionState();
      await this.simulationLogic.upsertDataEntity(
        storeId,
        "checkout_session",
        "default",
        checkoutSession,
        tx,
      );
      added.checkoutSessions += 1;
    }

    return {
      success: true,
      profile: profile.id,
      added,
    };
  }

  private generateStoreSettings(
    profile: ReturnType<typeof getSeedProfileDefinition>,
  ): Partial<Salla.components["schemas"]["Store"]> {
    return {
      id: "store-1", // Fixed ID for context
      name: profile.storeName,
      description: profile.storeDescription,
      currency: "SAR",
      contacts: {
        mobile: "+966500000000",
        email: "admin@demo.sa",
        whatsapp: "+966500000000",
      },
      social: {
        twitter: `https://twitter.com/demo`,
        instagram: `https://instagram.com/demo`,
      },
    };
  }

  private generateBrand(
    index: number,
    profile: ReturnType<typeof getSeedProfileDefinition>,
  ): Salla.components["schemas"]["Brand"] {
    const name = this.pickSeedValue(
      profile.brandNames,
      index,
      `Brand ${this.randomString(5)}`,
    );
    const id = `brand_${profile.id}_${index + 1}_${this.randomString(4)}`;
    return {
      id,
      name,
      url: `/brands/${id}`,
      description: `${name} - ${profile.storeName}`,
      logo: SeederService.DEFAULT_LOCAL_IMAGE,
    };
  }

  private generateCategory(
    index: number,
    profile: ReturnType<typeof getSeedProfileDefinition>,
  ): Salla.components["schemas"]["Category"] {
    const name = this.pickSeedValue(
      profile.categoryNames,
      index,
      `Category ${this.randomString(5)}`,
    );
    const id = `cat_${profile.id}_${index + 1}_${this.randomString(4)}`;
    return {
      id,
      name,
      url: `/categories/${id}`,
      image: SeederService.DEFAULT_LOCAL_IMAGE,
      description: `${name} ضمن ${profile.storeName}`,
      parent_id: null,
    };
  }

  private generateProduct(
    index: number,
    brands: any[],
    categories: any[],
    profile: ReturnType<typeof getSeedProfileDefinition>,
  ): Record<string, any> {
    const hasOptions = this.randomBoolean();
    const price = this.randomNumber(profile.minPrice, profile.maxPrice);
    const id = `prd_${profile.id}_${index + 1}_${this.randomString(4)}`;
    const descriptor = this.pickSeedValue(
      profile.productDescriptors,
      index,
      "مميز",
    );
    const noun = this.pickSeedValue(profile.productNouns, index, "منتج");
    const productName = `${noun} ${descriptor}`;
    const isDonationProduct = (index + 1) % 9 === 0;
    const isInfiniteQuantity = isDonationProduct
      ? true
      : this.randomNumber(1, 10) === 1;
    const quantity = isDonationProduct
      ? null
      : isInfiniteQuantity
        ? null
        : this.randomNumber(0, 40);
    const isHiddenQuantity = this.randomNumber(1, 6) === 1;
    const explicitAvailability = isInfiniteQuantity
      ? true
      : (quantity || 0) > 0;
    const isAvailable = isDonationProduct
      ? true
      : explicitAvailability
        ? this.randomNumber(1, 8) !== 1
        : false;
    const isOutOfStock = isDonationProduct
      ? false
      : !isAvailable || (!isInfiniteQuantity && (quantity || 0) <= 0);
    const status = isDonationProduct
      ? "sale"
      : isOutOfStock
        ? this.randomBoolean()
          ? "out-and-notify"
          : "out"
        : "sale";
    const maxQuantity = isInfiniteQuantity
      ? 99
      : Math.max(1, Math.min(quantity || 1, this.randomNumber(1, 10)));
    const soldQuantity = this.randomNumber(0, 300);
    const donationTargetAmount = isDonationProduct
      ? this.randomNumber(3000, 30000)
      : 0;
    const donationCollectedAmount = isDonationProduct
      ? this.randomNumber(0, donationTargetAmount)
      : 0;
    const donationTargetPercent =
      isDonationProduct && donationTargetAmount > 0
        ? Math.round((donationCollectedAmount / donationTargetAmount) * 100)
        : 0;
    const donationEndDate = isDonationProduct
      ? new Date(Date.now() + this.randomNumber(7, 45) * 86400000).toISOString()
      : "";
    const minAmountDonating = isDonationProduct
      ? Math.max(5, this.randomNumber(5, Math.max(5, Math.floor(price / 2))))
      : undefined;
    const maxAmountDonating = isDonationProduct
      ? Math.max(minAmountDonating || 5, donationTargetAmount)
      : undefined;

    return {
      id,
      name: productName,
      type: isDonationProduct ? "donating" : "product",
      price: { amount: price, currency: "SAR" },
      regular_price: { amount: price * 1.2, currency: "SAR" },
      sale_price: { amount: price, currency: "SAR" }, // Currently on sale
      description: `وصف ${productName} ضمن فئة ${this.pickSeedValue(profile.categoryNames, index, "المنتجات")}`,
      short_description: `${productName} - ${profile.storeName}`,
      url: `/products/${id}`,
      is_require_shipping: !isDonationProduct,
      quantity,
      stock: quantity as any,
      max_quantity: maxQuantity,
      sold_quantity: soldQuantity,
      is_hidden_quantity: isHiddenQuantity,
      is_infinite_quantity: isInfiniteQuantity,
      is_available: isAvailable,
      is_out_of_stock: isOutOfStock,
      status,
      is_on_sale: true,
      is_donation: isDonationProduct,
      donation: isDonationProduct
        ? {
            collected_amount: donationCollectedAmount,
            target_amount: donationTargetAmount,
            target_percent: donationTargetPercent,
            target_end_date: donationEndDate,
            can_donate: true,
          }
        : undefined,
      min_amount_donating: minAmountDonating,
      max_amount_donating: maxAmountDonating,
      add_to_cart_label: isOutOfStock ? "نفد المخزون" : "أضف للسلة",
      can_show_remained_quantity:
        !isHiddenQuantity && !isInfiniteQuantity && (quantity || 0) > 0,
      can_show_sold: soldQuantity > 0,
      notify_availability:
        status === "out-and-notify"
          ? {
              channels: ["sms", "email"],
              subscribed: false,
              subscribed_options: [],
              options: true,
            }
          : undefined,
      rating: {
        stars: this.randomNumber(1, 5),
        count: this.randomNumber(0, 100),
      },
      images: [
        {
          id: this.randomString(),
          url: SeederService.DEFAULT_LOCAL_IMAGE,
          alt: "Main",
          is_default: true,
        },
        {
          id: this.randomString(),
          url: SeederService.DEFAULT_LOCAL_IMAGE,
          alt: "Side",
          is_default: false,
        },
        {
          id: this.randomString(),
          url: SeederService.DEFAULT_LOCAL_IMAGE,
          alt: "Back",
          is_default: false,
        },
      ],
      brand: this.randomElement(brands),
      categories: [this.randomElement(categories)],
      options: hasOptions
        ? [
            {
              id: this.randomString(),
              name: "المقاس",
              type: "select",
              values: [
                { id: this.randomString(), name: "S", price: 0 },
                { id: this.randomString(), name: "M", price: 10 },
                { id: this.randomString(), name: "L", price: 20 },
              ],
            },
            {
              id: this.randomString(),
              name: "اللون",
              type: "radio",
              values: [
                {
                  id: this.randomString(),
                  name: "أحمر",
                  price: 0,
                  color: "#ff0000",
                },
                {
                  id: this.randomString(),
                  name: "أزرق",
                  price: 0,
                  color: "#0000ff",
                },
              ],
            },
          ]
        : [],
      comments: Array.from({ length: this.randomNumber(1, 5) }).map(() => ({
        id: this.randomString(),
        stars: this.randomNumber(1, 5),
        content: "Review content " + this.randomString(10),
        created_at: new Date().toISOString(),
        customer: {
          name: "Customer " + this.randomString(5),
          avatar: SeederService.DEFAULT_LOCAL_IMAGE,
        },
      })),
      specs: [
        { key: "الخامة", value: this.randomElement(profile.materialValues) },
        { key: "بلد المنشأ", value: this.randomElement(profile.originValues) },
      ],
      custom_fields: [
        { key: "الضمان", value: this.randomElement(profile.warrantyValues) },
        {
          key: "رقم الموديل",
          value: `${this.randomElement(profile.modelPrefixes)}-${this.randomString(6).toUpperCase()}`,
        },
      ],
    };
  }

  private generateBlogCategory(
    index: number,
    profile: ReturnType<typeof getSeedProfileDefinition>,
  ) {
    const title = this.pickSeedValue(
      profile.blogCategoryNames,
      index - 1,
      `تصنيف المدونة ${index}`,
    );
    const slug = this.slugify(`blog-category-${index}-${this.randomString(4)}`);
    return {
      id: `blog_cat_${this.randomString(8)}`,
      name: title,
      title,
      slug,
      description: `وصف ${title}`,
      url: `/blog/categories/${slug}`,
    };
  }

  private generateBlogArticle(
    index: number,
    category: any,
    profile: ReturnType<typeof getSeedProfileDefinition>,
  ) {
    const title = this.pickSeedValue(
      profile.blogArticleTitles,
      index - 1,
      `مقالة تجريبية ${index}`,
    );
    const slug = this.slugify(`blog-article-${index}-${this.randomString(4)}`);
    return {
      id: `blog_article_${this.randomString(10)}`,
      name: title,
      title,
      slug,
      summary: `ملخص ${title}`,
      description: `هذا محتوى تجريبي للمقالة رقم ${index} ضمن ${profile.storeName}.`,
      image: SeederService.DEFAULT_LOCAL_IMAGE,
      url: `/blog/${slug}`,
      category_id: String(category?.id || ""),
      category: category?.id
        ? {
            id: String(category.id),
            name: String(category.name || category.title || ""),
          }
        : undefined,
      published_at: new Date(Date.now() - index * 86400000).toISOString(),
      is_published: true,
    };
  }

  private generateSpecialOffer(
    index: number,
    profile: ReturnType<typeof getSeedProfileDefinition>,
    products: any[],
    categories: any[],
  ) {
    const title = this.pickSeedValue(
      profile.offerTitles,
      index - 1,
      `عرض خاص ${index}`,
    );
    const slug = this.slugify(`special-offer-${index}-${this.randomString(4)}`);
    const productPool = Array.isArray(products) ? products : [];
    const categoryPool = Array.isArray(categories) ? categories : [];

    const selectedProducts: any[] = [];
    if (productPool.length > 0) {
      const count = Math.min(
        6,
        Math.max(2, Math.min(productPool.length, 3 + (index % 3))),
      );
      const start = (index - 1) % productPool.length;
      for (let offset = 0; offset < count; offset++) {
        selectedProducts.push(
          productPool[(start + offset) % productPool.length],
        );
      }
    }

    const selectedCategories: any[] = [];
    if (categoryPool.length > 0) {
      const count = Math.min(
        4,
        Math.max(1, Math.min(categoryPool.length, 2 + (index % 2))),
      );
      const start = (index - 1) % categoryPool.length;
      for (let offset = 0; offset < count; offset++) {
        selectedCategories.push(
          categoryPool[(start + offset) % categoryPool.length],
        );
      }
    }

    const mappedProducts = selectedProducts.map((product: any) => ({
      id: String(product?.id || ""),
      name: String(product?.name || product?.title || ""),
      description: String(product?.description || ""),
      url: String(product?.url || `/products/${String(product?.id || "")}`),
      type: String(product?.type || "product"),
      status: String(product?.status || "sale"),
      image: product?.image?.url
        ? { ...product.image }
        : {
            url: String(
              product?.main_image ||
                product?.thumbnail ||
                SeederService.DEFAULT_LOCAL_IMAGE,
            ),
            alt: String(product?.name || ""),
          },
      price: product?.price || { amount: 0, currency: "SAR" },
      sale_price: product?.sale_price ||
        product?.price || { amount: 0, currency: "SAR" },
      regular_price: product?.regular_price ||
        product?.price || { amount: 0, currency: "SAR" },
      category_ids: Array.isArray(product?.category_ids)
        ? product.category_ids.map((entry: any) => String(entry))
        : Array.isArray(product?.categories)
          ? product.categories.map((entry: any) => String(entry?.id || entry))
          : [],
    }));

    const mappedCategories = selectedCategories.map((category: any) => ({
      id: String(category?.id || ""),
      name: String(category?.name || category?.title || ""),
      image: String(category?.image || SeederService.DEFAULT_LOCAL_IMAGE),
      url: String(category?.url || `/categories/${String(category?.id || "")}`),
      parent_id: category?.parent_id ?? null,
      status: String(category?.status || "active"),
      sort_order: Number.isFinite(Number(category?.order))
        ? Number(category.order)
        : 0,
    }));

    return {
      id: `offer_${this.randomString(10)}`,
      name: title,
      title,
      slug,
      description: `تفاصيل ${title}`,
      products: mappedProducts,
      product_ids: mappedProducts
        .map((product: any) => String(product.id))
        .filter(Boolean),
      categories: mappedCategories,
      category_ids: mappedCategories
        .map((category: any) => String(category.id))
        .filter(Boolean),
      discount_type: index % 2 === 0 ? "fixed" : "percentage",
      discount_value:
        index % 2 === 0 ? this.randomNumber(10, 40) : this.randomNumber(5, 30),
      starts_at: new Date(Date.now() - index * 86400000).toISOString(),
      ends_at: new Date(Date.now() + (7 + index) * 86400000).toISOString(),
      image: SeederService.DEFAULT_LOCAL_IMAGE,
      url: `/offers/${slug}`,
      is_active: true,
    };
  }

  private generateHeaderMenu(categories: any[]) {
    const categoryChildren = (categories || [])
      .slice(0, 6)
      .map((category: any, index: number) => ({
        id: `header-category-${String(category?.id || index + 1)}`,
        title: String(category?.name || `تصنيف ${index + 1}`),
        url: String(
          category?.url || `/categories/${String(category?.id || index + 1)}`,
        ),
        type: "link",
        order: index + 1,
        children: [],
        products: [],
      }));

    return {
      id: "header",
      type: "header",
      items: [
        {
          id: "header-home",
          title: "الرئيسية",
          url: "/",
          type: "link",
          order: 1,
          children: [],
          products: [],
        },
        {
          id: "header-products",
          title: "المنتجات",
          url: "/products",
          type: "link",
          order: 2,
          children: [],
          products: [],
        },
        {
          id: "header-categories",
          title: "التصنيفات",
          url: "/categories",
          type: "link",
          order: 3,
          children: categoryChildren,
          products: [],
        },
        {
          id: "header-brands",
          title: "الماركات",
          url: "/brands",
          type: "link",
          order: 4,
          children: [],
          products: [],
        },
        {
          id: "header-blog",
          title: "المدونة",
          url: "/blog",
          type: "link",
          order: 5,
          children: [],
          products: [],
        },
      ],
    };
  }

  private generateFooterMenu(pages: any[]) {
    const pageChildren = (pages || [])
      .slice(0, 6)
      .map((page: any, index: number) => ({
        id: `footer-page-${String(page?.id || index + 1)}`,
        title: String(page?.title || `صفحة ${index + 1}`),
        url: `/${String(page?.slug || page?.id || `page-${index + 1}`)}`,
        type: "link",
        order: index + 1,
        children: [],
        products: [],
      }));

    return {
      id: "footer",
      type: "footer",
      items: [
        {
          id: "footer-pages",
          title: "صفحات مهمة",
          url: "/pages",
          type: "link",
          order: 1,
          children: pageChildren,
          products: [],
        },
        {
          id: "footer-contact",
          title: "تواصل معنا",
          url: "/contact",
          type: "link",
          order: 2,
          children: [],
          products: [],
        },
      ],
    };
  }

  private generateReviewFromComment(product: any, comment: any) {
    const productId = String(product?.id || "");
    return {
      id: `review_${this.randomString(10)}`,
      product_id: productId,
      stars: Math.min(
        5,
        Math.max(1, Number(comment?.stars || this.randomNumber(3, 5))),
      ),
      content: String(
        comment?.content || `تجربة ممتازة للمنتج ${product?.name || ""}`,
      ),
      customer_name: String(
        comment?.customer?.name || `عميل ${this.randomString(4)}`,
      ),
      customer_avatar: String(
        comment?.customer?.avatar || SeederService.DEFAULT_LOCAL_IMAGE,
      ),
      is_published: true,
      created_at: String(comment?.created_at || new Date().toISOString()),
    };
  }

  private generateQuestionForProduct(product: any, index: number) {
    const productId = String(product?.id || "");
    const answered = this.randomBoolean();
    const questionText = `هل يتوفر ${product?.name || "هذا المنتج"} بمقاسات مختلفة؟`;
    return {
      id: `question_${this.randomString(10)}`,
      product_id: productId,
      question: questionText,
      answer: answered ? "نعم، المنتج متوفر بعدة خيارات داخل صفحة المنتج." : "",
      is_answered: answered,
      customer_name: `زائر ${this.randomString(4)}`,
      customer_avatar: SeederService.DEFAULT_LOCAL_IMAGE,
      is_published: true,
      created_at: new Date(Date.now() - index * 3600000).toISOString(),
      answered_at: answered ? new Date().toISOString() : "",
    };
  }

  private generateWishlistState(products: any[]) {
    const productIds = (products || [])
      .slice(0, 4)
      .map((product: any) => String(product?.id || "").trim())
      .filter(Boolean);

    return {
      id: "default",
      product_ids: productIds,
      items: [...productIds],
      count: productIds.length,
      updated_at: new Date().toISOString(),
    };
  }

  private generateOrderSeeds(
    products: any[],
    profile: ReturnType<typeof getSeedProfileDefinition>,
    count: number = 2,
  ): Record<string, any>[] {
    const productPool = Array.isArray(products) ? products.filter(Boolean) : [];
    const total = Math.max(1, Math.floor(Number(count) || 1));

    return Array.from({ length: total }).map((_, index) => {
      const selectedProducts: any[] = [];
      if (productPool.length > 0) {
        const start = (index * 2) % productPool.length;
        const itemsPerOrder = Math.min(2, Math.max(1, productPool.length));
        for (let offset = 0; offset < itemsPerOrder; offset++) {
          selectedProducts.push(
            productPool[(start + offset) % productPool.length],
          );
        }
      }

      const items = selectedProducts.map((product: any, itemIndex: number) => {
        const quantity = this.randomNumber(1, 3);
        const price = this.readMoneyAmount(
          product?.sale_price ?? product?.price,
        );
        const totalPrice = Number((price * quantity).toFixed(2));
        const productId = String(
          product?.id || `product-${index + 1}-${itemIndex + 1}`,
        );
        return {
          id: `order_item_${this.randomString(8)}`,
          product_id: productId,
          product_name: String(product?.name || `منتج ${itemIndex + 1}`),
          quantity,
          price,
          total: totalPrice,
          url: String(product?.url || `/products/${productId}`),
          product_image: String(
            product?.main_image ||
              product?.thumbnail ||
              SeederService.DEFAULT_LOCAL_IMAGE,
          ),
        };
      });

      const subtotal = Number(
        items
          .reduce((sum: number, item: any) => sum + Number(item.total || 0), 0)
          .toFixed(2),
      );
      const discount = index === 0 ? Number((subtotal * 0.05).toFixed(2)) : 0;
      const shippingCost = subtotal > 0 ? 15 : 0;
      const taxAmount = Number(
        (Math.max(0, subtotal - discount) * 0.15).toFixed(2),
      );
      const totalAmount = Number(
        (subtotal - discount + shippingCost + taxAmount).toFixed(2),
      );
      const createdAt = new Date(Date.now() - index * 86400000).toISOString();
      const orderId = `order_${this.randomString(10)}`;
      const referenceId = `VTDR-${String(this.randomNumber(100000, 999999))}`;
      const statuses = ["new", "processing", "shipped"];
      const status = statuses[index % statuses.length];

      return {
        id: orderId,
        reference_id: referenceId,
        order_number: referenceId,
        status,
        payment_status: status === "new" ? "pending" : "paid",
        currency: "SAR",
        created_at: createdAt,
        updated_at: createdAt,
        url: `/customer/orders/${orderId}`,
        source: "seed",
        customer: {
          id: "customer-vtdr",
          name: `عميل ${profile.storeName}`,
          email: "customer@example.com",
          mobile: "+966500000000",
        },
        shipping: {
          method_id: "shipping-standard",
          method_name: "شحن قياسي",
          cost: shippingCost,
        },
        payment: {
          method_id: "payment-cod",
          method_name: "الدفع عند الاستلام",
          type: "cod",
        },
        items,
        subtotal,
        sub_total: subtotal,
        discount,
        shipping_cost: shippingCost,
        tax_amount: taxAmount,
        total: totalAmount,
        email_sent: false,
      };
    });
  }

  private generateCheckoutSessionState() {
    return {
      id: "default",
      status: "active",
      step: "address",
      cart_id: "default",
      cart_count: 0,
      customer: {
        name: "عميل المتجر",
        email: "customer@example.com",
        mobile: "+966500000000",
      },
      address: {
        country: "السعودية",
        city: "",
        district: "",
        street: "",
        postal_code: "",
      },
      shipping: {
        method_id: "",
        method_name: "",
        cost: 0,
        currency: "SAR",
      },
      payment: {
        method_id: "",
        method_name: "",
        type: "",
      },
      available_shipping_methods: [
        {
          id: "shipping-standard",
          name: "شحن قياسي",
          cost: 15,
          currency: "SAR",
          estimated_days: "2-4",
        },
      ],
      available_payment_methods: [
        {
          id: "payment-cod",
          name: "الدفع عند الاستلام",
          type: "cod",
        },
      ],
      summary: {
        subtotal: 0,
        options_total: 0,
        discount: 0,
        tax_amount: 0,
        shipping_cost: 0,
        total: 0,
        currency: "SAR",
      },
      can_confirm: false,
      is_ready_to_confirm: false,
    };
  }

  private generateLoyaltyEntity(
    products: any[],
    profile: ReturnType<typeof getSeedProfileDefinition>,
  ) {
    const prizeProducts = (products || [])
      .slice(0, 6)
      .map((product: any, index: number) => ({
        id: Number(index + 1),
        name: String(product?.name || `منتج ${index + 1}`),
        description: String(
          product?.short_description || product?.description || "",
        ),
        image: String(
          product?.main_image ||
            product?.thumbnail ||
            SeederService.DEFAULT_LOCAL_IMAGE,
        ),
        url: String(
          product?.url || `/products/${String(product?.id || index + 1)}`,
        ),
        cost_points: 120 + index * 20,
      }));

    return {
      id: "default",
      name: `برنامج ولاء ${profile.storeName}`,
      description: "اجمع النقاط مع كل عملية شراء واستبدلها بمزايا داخل المتجر.",
      image: SeederService.DEFAULT_LOCAL_IMAGE,
      promotion_title: "استبدل نقاطك بمكافآت فورية",
      promotion_description:
        "كلما زادت نقاطك زادت خيارات الاستبدال المتاحة لك.",
      points: [
        {
          name: "شراء منتج",
          description: "اكسب نقاطًا مقابل كل طلب مكتمل",
          type: "order",
          url: "/products",
          points: 15,
          icon: "sicon-packed-box",
          color: "#0ea5e9",
        },
        {
          name: "مراجعة منتج",
          description: "أضف تقييمًا واكسب نقاط إضافية",
          type: "review",
          url: "/products",
          points: 10,
          icon: "sicon-star",
          color: "#f59e0b",
        },
      ],
      prizes: [
        {
          title: "منتجات مجانية",
          type: "free_product",
          items: prizeProducts,
        },
        {
          title: "قسائم خصم",
          type: "coupon_discount",
          items: [
            {
              id: 9001,
              name: "قسيمة خصم 10%",
              description: "خصم مباشر على سلة الشراء",
              image: SeederService.DEFAULT_LOCAL_IMAGE,
              url: "/cart",
              cost_points: 100,
            },
          ],
        },
      ],
    };
  }

  private generateLandingEntity(
    products: any[],
    profile: ReturnType<typeof getSeedProfileDefinition>,
  ) {
    const landingProducts = (products || [])
      .slice(0, 8)
      .map((product: any, index: number) => ({
        id: String(product?.id || `landing-product-${index + 1}`),
        name: String(product?.name || `منتج ${index + 1}`),
        url: String(
          product?.url || `/products/${String(product?.id || index + 1)}`,
        ),
        image: String(
          product?.main_image ||
            product?.thumbnail ||
            SeederService.DEFAULT_LOCAL_IMAGE,
        ),
      }));

    return {
      id: "default",
      title: `عروض ${profile.storeName}`,
      content: "صفحة هبوط مخصصة تعرض أهم المنتجات والعروض الحالية.",
      products: landingProducts,
      offer_ends_at: new Date(Date.now() + 7 * 86400000).toISOString(),
      testimonials_type: "simple",
      show_quantity: false,
      is_slider: true,
      is_expired: false,
      show_store_features: true,
    };
  }
}
