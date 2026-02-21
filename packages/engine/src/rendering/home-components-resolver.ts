import type { RuntimeContext } from "@vtdr/contracts";

type PreviewViewport = "desktop" | "mobile";

type ResolvedHomeComponent = {
  path: string;
  name: string;
  data: Record<string, any>;
};

export class HomeComponentsResolver {
  private extractYoutubeVideoId(value: any): string {
    const raw = String(value || "").trim();
    if (!raw) return "";

    const directId = raw.match(/^[a-zA-Z0-9_-]{11}$/);
    if (directId) return directId[0];

    try {
      const url = new URL(raw);
      const host = url.hostname.toLowerCase();
      if (host === "youtu.be") {
        const token = url.pathname.split("/").filter(Boolean)[0] || "";
        if (/^[a-zA-Z0-9_-]{11}$/.test(token)) return token;
      }
      if (host.includes("youtube.com")) {
        const queryId = url.searchParams.get("v") || "";
        if (/^[a-zA-Z0-9_-]{11}$/.test(queryId)) return queryId;
        const parts = url.pathname.split("/").filter(Boolean);
        const embedIndex = parts.findIndex(
          (entry) => entry === "embed" || entry === "shorts",
        );
        if (
          embedIndex >= 0 &&
          parts[embedIndex + 1] &&
          /^[a-zA-Z0-9_-]{11}$/.test(parts[embedIndex + 1])
        ) {
          return parts[embedIndex + 1];
        }
      }
    } catch {
      // Non URL values fall back to regex extraction.
    }

    const fallback = raw.match(/([a-zA-Z0-9_-]{11})/);
    return fallback ? fallback[1] : "";
  }

  private toImageUrl(value: any): string {
    if (typeof value === "string") return value.trim();
    if (value && typeof value === "object") {
      const candidate = String(
        value.url ?? value.src ?? value.image ?? value.path ?? "",
      ).trim();
      return candidate;
    }
    return "";
  }

  private normalizeParallaxComponentData(data: Record<string, any>) {
    const imageUrl = this.toImageUrl(data.image);
    data.image = {
      ...(data.image && typeof data.image === "object" ? data.image : {}),
      url: imageUrl,
    };
    data.url = this.normalizeLinkUrl(data.url || data.link || "#");
    data.link_text = String(
      data.link_text || data.button_text || data.cta_text || "",
    ).trim();
  }

  private normalizeEnhancedSliderData(data: Record<string, any>) {
    const sourceSlides = Array.isArray(data.slides)
      ? data.slides
      : Array.isArray(data.items)
        ? data.items
        : [];

    const slides = sourceSlides
      .map((slide: any) => {
        if (!slide || typeof slide !== "object") return null;
        const normalizedImage = this.toImageUrl(slide.image);
        return {
          ...slide,
          image: normalizedImage,
          title: String(slide.title || "").trim(),
          description: String(slide.description || "").trim(),
        };
      })
      .filter((slide: any) => Boolean(slide?.image));

    data.slides = slides;
  }

  private normalizeYoutubeComponentData(data: Record<string, any>) {
    const candidate =
      data.youtube_id || data.youtube_url || data.video_url || data.url || "";
    const videoId = this.extractYoutubeVideoId(candidate);
    if (videoId) {
      data.youtube_id = videoId;
    }
  }

  private toInt(value: any, fallback: number): number {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.max(0, Math.floor(parsed));
  }

  private getContextProducts(context: RuntimeContext): any[] {
    return Array.isArray((context as any)?.products)
      ? [...(context as any).products]
      : [];
  }

  private resolveProductReferences(
    context: RuntimeContext,
    rawValue: any,
  ): any[] {
    const products = this.getContextProducts(context);
    if (!products.length) return [];

    const byRef = new Map<string, any>();
    products.forEach((product: any) => {
      const refs = [
        String(product?.id || "").trim(),
        String(product?.slug || "").trim(),
        String(product?.url || "")
          .split("/")
          .filter(Boolean)
          .pop() || "",
      ]
        .filter(Boolean)
        .map((entry) => entry.toLowerCase());
      refs.forEach((entry) => byRef.set(entry, product));
    });

    const ids = this.extractSelectionIds(rawValue);
    if (!ids.length) {
      if (Array.isArray(rawValue)) {
        const asObjects = rawValue.filter(
          (entry: any) => entry && typeof entry === "object" && entry.id,
        );
        if (asObjects.length > 0) return asObjects;
      }
      return [];
    }

    return ids
      .map((id) => byRef.get(String(id).trim().toLowerCase()))
      .filter(Boolean);
  }

  private collectProductCategoryIds(product: any): string[] {
    const ids = [
      ...(Array.isArray(product?.category_ids) ? product.category_ids : []),
      ...(Array.isArray(product?.categories)
        ? product.categories.map((entry: any) => entry?.id ?? entry)
        : []),
      product?.category_id,
      product?.category?.id,
    ]
      .map((entry) => String(entry || "").trim())
      .filter(Boolean);
    return Array.from(new Set(ids));
  }

  private collectProductBrandId(product: any): string {
    return String(product?.brand?.id || product?.brand_id || "").trim();
  }

  private resolveFeaturedSectionProducts(
    context: RuntimeContext,
    section: any,
    limit: number,
  ): any[] {
    const productsPool = this.getContextProducts(context);
    if (!productsPool.length) return [];

    const sectionType = String(
      section?.type || section?.products?.source || section?.source || "",
    )
      .trim()
      .toLowerCase();
    const selectedRefs = [
      ...this.extractSelectionIds(section?.products?.source_value),
      ...this.extractSelectionIds(section?.source_value),
      ...this.extractSelectionIds(section?.product_ids),
      ...this.extractSelectionIds(section?.products),
    ];
    const categoryRefs = [
      ...this.extractSelectionIds(section?.category_id),
      ...this.extractSelectionIds(section?.categories),
      ...(sectionType.includes("category") ? selectedRefs : []),
    ];
    const brandRefs = [
      ...this.extractSelectionIds(section?.brand_id),
      ...this.extractSelectionIds(section?.brands),
      ...(sectionType.includes("brand") ? selectedRefs : []),
    ];

    let resolved: any[] = [];
    if (selectedRefs.length > 0) {
      resolved = this.resolveProductReferences(context, selectedRefs);
    }

    if (
      resolved.length === 0 &&
      (sectionType.includes("category") || categoryRefs.length > 0)
    ) {
      const categorySet = new Set(
        categoryRefs.map((entry) => String(entry).trim()),
      );
      resolved = productsPool.filter((product: any) =>
        this.collectProductCategoryIds(product).some((id) =>
          categorySet.has(id),
        ),
      );
    }

    if (
      resolved.length === 0 &&
      (sectionType.includes("brand") || brandRefs.length > 0)
    ) {
      const brandSet = new Set(brandRefs.map((entry) => String(entry).trim()));
      resolved = productsPool.filter((product: any) =>
        brandSet.has(this.collectProductBrandId(product)),
      );
    }

    if (
      resolved.length === 0 &&
      (sectionType.includes("most") || sectionType.includes("sale"))
    ) {
      resolved = [...productsPool].sort(
        (a: any, b: any) =>
          Number(b?.sold_quantity || 0) - Number(a?.sold_quantity || 0),
      );
    }

    if (
      resolved.length === 0 &&
      (sectionType.includes("latest") || sectionType.includes("new"))
    ) {
      resolved = [...productsPool].sort((a: any, b: any) => {
        const aTs = new Date(
          String(a?.created_at || a?.updated_at || 0),
        ).getTime();
        const bTs = new Date(
          String(b?.created_at || b?.updated_at || 0),
        ).getTime();
        return bTs - aTs;
      });
    }

    if (resolved.length === 0) {
      resolved = productsPool;
    }

    return resolved.slice(0, Math.max(1, limit));
  }

  private normalizeFeaturedProductsComponentData(
    context: RuntimeContext,
    data: Record<string, any>,
    variant: "style1" | "style2" | "style3",
  ) {
    const rawSections = Array.isArray(data.items)
      ? data.items
      : Array.isArray(data.sections)
        ? data.sections
        : [];

    const normalizedSections = rawSections.map(
      (section: any, index: number) => {
        const limit =
          this.toInt(section?.limit ?? section?.products?.limit ?? 8, 8) || 8;
        const title = String(
          section?.title || section?.name || `Section ${index + 1}`,
        ).trim();
        const id = String(
          section?.id ||
            this.slugifyTokenForComponent(title) ||
            `section-${index + 1}`,
        );
        const sectionProducts = this.resolveFeaturedSectionProducts(
          context,
          section,
          limit,
        );
        const featuredProduct =
          this.resolveProductReferences(
            context,
            section?.featured_product || section?.special_product,
          )?.[0] ||
          sectionProducts[0] ||
          null;

        if (variant === "style2") {
          const type = String(
            section?.type || section?.products?.source || section?.source || "",
          ).toLowerCase();
          const sourceValue = [
            ...this.extractSelectionIds(section?.products?.source_value),
            ...this.extractSelectionIds(section?.source_value),
            ...this.extractSelectionIds(section?.category_id),
            ...this.extractSelectionIds(section?.brand_id),
            ...this.extractSelectionIds(section?.product_ids),
          ];

          let source = "latest_products";
          if (type.includes("category")) source = "categories";
          else if (type.includes("brand")) source = "brands";
          else if (type.includes("most")) source = "most_sales";
          else if (type.includes("chosen") || type.includes("selected"))
            source = "selected";
          else if (sourceValue.length > 0) source = "selected";

          return {
            ...section,
            id,
            title,
            limit,
            featured_product: featuredProduct || undefined,
            products: {
              source,
              source_value: sourceValue,
              limit,
            },
          };
        }

        return {
          ...section,
          id,
          title,
          limit,
          featured_product: featuredProduct || undefined,
          products: sectionProducts,
        };
      },
    );

    data.items = normalizedSections;

    if (variant === "style1") {
      const explicitMainRaw = data.main_product;
      const explicitMain =
        explicitMainRaw &&
        typeof explicitMainRaw === "object" &&
        !Array.isArray(explicitMainRaw)
          ? explicitMainRaw
          : {};
      const explicitMainCandidate = Array.isArray(explicitMainRaw)
        ? explicitMainRaw[0]
        : explicitMain.product || explicitMain.id || explicitMain.value;
      const explicitMainProduct =
        this.resolveProductReferences(context, explicitMainCandidate)?.[0] ||
        (explicitMainCandidate &&
        typeof explicitMainCandidate === "object" &&
        (explicitMainCandidate as any).id
          ? explicitMainCandidate
          : null);
      const fallbackProduct =
        normalizedSections[0]?.featured_product ||
        (Array.isArray(normalizedSections[0]?.products)
          ? normalizedSections[0].products[0]
          : undefined);
      const mainProduct = explicitMainProduct || fallbackProduct;
      data.main_product = mainProduct
        ? {
            ...explicitMain,
            id: String(explicitMain.id || mainProduct.id || ""),
            title: String(
              explicitMain.title ||
                explicitMain.value ||
                mainProduct.name ||
                "",
            ),
            value: String(explicitMain.value || mainProduct.name || ""),
            product: mainProduct,
          }
        : null;
    }
  }

  private normalizeEnhancedSquareBannersData(data: Record<string, any>) {
    const source = Array.isArray(data.banners)
      ? data.banners
      : Array.isArray(data.items)
        ? data.items
        : [];

    data.banners = source
      .map((entry: any) => {
        if (!entry || typeof entry !== "object") return null;
        const image = this.toImageUrl(
          entry.image || entry.banner || entry.photo,
        );
        if (!image) return null;
        return {
          ...entry,
          image,
          url: this.normalizeLinkUrl(entry.url || "#"),
          title: String(entry.title || "").trim(),
          description: String(entry.description || "").trim(),
        };
      })
      .filter(Boolean);
  }

  private normalizeSliderProductsWithHeaderData(
    context: RuntimeContext,
    data: Record<string, any>,
  ) {
    data.background = this.toImageUrl(
      data.background || data.background_image || data.image,
    );
    data.title = String(data.title || "").trim();
    data.description = String(data.description || "").trim();
    data.display_all_url = this.resolveVariableListValue(
      context,
      data.display_all_url || data.display_all_link || "#",
    );
    const selectedProducts = this.resolveProductReferences(
      context,
      data.products || data.product_ids || [],
    );
    if (selectedProducts.length > 0) {
      data.products = this.ensureProductMockList(selectedProducts);
    } else {
      data.products = this.ensureProductMockList(
        this.getContextProducts(context).slice(0, 8),
      );
    }
  }

  private slugifyTokenForComponent(value: string): string {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06ff]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-+/g, "-");
  }

  private applyComponentContractNormalization(
    context: RuntimeContext,
    componentPath: string,
    data: Record<string, any>,
  ) {
    const path = String(componentPath || "").toLowerCase();
    if (!path) return;

    if (path.includes("home.youtube")) {
      this.normalizeYoutubeComponentData(data);
    }

    if (path.includes("home.parallax-background")) {
      this.normalizeParallaxComponentData(data);
    }

    if (path.includes("home.enhanced-slider")) {
      this.normalizeEnhancedSliderData(data);
    }

    if (path.includes("featured-products-style1")) {
      this.normalizeFeaturedProductsComponentData(context, data, "style1");
    }

    if (path.includes("featured-products-style2")) {
      this.normalizeFeaturedProductsComponentData(context, data, "style2");
    }

    if (path.includes("featured-products-style3")) {
      this.normalizeFeaturedProductsComponentData(context, data, "style3");
    }

    if (path.includes("home.enhanced-square-banners")) {
      this.normalizeEnhancedSquareBannersData(data);
    }

    if (path.includes("home.slider-products-with-header")) {
      this.normalizeSliderProductsWithHeaderData(context, data);
    }
  }

  private normalizePageToken(value: any): string {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\\/g, "/");
  }

  private pushUnique(target: string[], value: string) {
    const normalized = String(value || "").trim();
    if (!normalized) return;
    if (!target.includes(normalized)) target.push(normalized);
  }

  private resolveCompositionPageKeys(templatePageIdRaw: any): string[] {
    const templatePageId = this.normalizePageToken(templatePageIdRaw);
    const keys: string[] = [];

    switch (templatePageId) {
      case "":
      case "index":
      case "home":
        this.pushUnique(keys, "home");
        break;
      case "product/single":
      case "product-single":
        this.pushUnique(keys, "product-single");
        break;
      case "product/index":
      case "products":
      case "product":
        this.pushUnique(keys, "product-list");
        this.pushUnique(keys, "category");
        break;
      case "category/index":
      case "categories":
      case "category":
        this.pushUnique(keys, "category");
        this.pushUnique(keys, "product-list");
        break;
      case "cart":
      case "checkout":
        this.pushUnique(keys, "cart");
        break;
      case "customer/profile":
      case "profile":
        this.pushUnique(keys, "profile");
        break;
      case "customer/orders/index":
      case "orders":
      case "orders-list":
        this.pushUnique(keys, "orders-list");
        break;
      case "customer/orders/single":
      case "order-details":
        this.pushUnique(keys, "order-details");
        this.pushUnique(keys, "orders-list");
        break;
      case "customer/wishlist":
      case "wishlist":
        this.pushUnique(keys, "wishlist");
        break;
      case "customer/notifications":
      case "notifications":
        this.pushUnique(keys, "notifications");
        break;
      case "blog/index":
      case "blog":
      case "blog-list":
        this.pushUnique(keys, "blog-list");
        break;
      case "blog/single":
      case "blog-single":
        this.pushUnique(keys, "blog-single");
        break;
      case "brands/index":
      case "brands":
      case "brands-list":
        this.pushUnique(keys, "brands-list");
        break;
      case "brands/single":
      case "brand-single":
        this.pushUnique(keys, "brand-single");
        break;
      case "thank-you":
        this.pushUnique(keys, "thank-you");
        break;
      case "landing-page":
        this.pushUnique(keys, "landing-page");
        break;
      case "page-single":
        this.pushUnique(keys, "page-single");
        break;
      default: {
        if (!templatePageId.includes("/"))
          this.pushUnique(keys, templatePageId);
        break;
      }
    }

    if (keys.length === 0) this.pushUnique(keys, "home");
    return keys;
  }

  private getPathRuleForPageKey(pageKeyRaw: string): {
    include: string[];
    exclude: string[];
  } {
    const pageKey = this.normalizePageToken(pageKeyRaw);
    switch (pageKey) {
      case "home":
        return { include: ["home"], exclude: [] };
      case "product-single":
        return { include: ["product.single"], exclude: [] };
      case "product-list":
        return { include: ["product"], exclude: ["product.single"] };
      case "category":
        return { include: ["category"], exclude: [] };
      case "cart":
        return { include: ["cart"], exclude: [] };
      case "profile":
        return { include: ["customer.profile"], exclude: [] };
      case "orders-list":
        return {
          include: ["customer.orders"],
          exclude: ["customer.orders.single"],
        };
      case "order-details":
        return { include: ["customer.orders.single"], exclude: [] };
      case "wishlist":
        return { include: ["customer.wishlist"], exclude: [] };
      case "notifications":
        return { include: ["customer.notifications"], exclude: [] };
      case "blog-list":
        return { include: ["blog"], exclude: ["blog.single"] };
      case "blog-single":
        return { include: ["blog.single"], exclude: [] };
      case "brands-list":
        return { include: ["brands"], exclude: ["brands.single"] };
      case "brand-single":
        return { include: ["brands.single"], exclude: [] };
      case "thank-you":
        return { include: ["thank-you"], exclude: [] };
      case "landing-page":
        return { include: ["landing-page"], exclude: [] };
      case "page-single":
        return { include: ["page-single"], exclude: [] };
      default:
        return { include: [pageKey], exclude: [] };
    }
  }

  private pathStartsWithPrefix(pathRaw: string, prefixRaw: string): boolean {
    const path = this.normalizePageToken(pathRaw);
    const prefix = this.normalizePageToken(prefixRaw);
    if (!path || !prefix) return false;
    return path === prefix || path.startsWith(`${prefix}.`);
  }

  private resolveComponentsForPageKeys(
    allComponents: any[],
    pageKeys: string[],
  ): any[] {
    if (!Array.isArray(allComponents) || allComponents.length === 0) return [];

    const selected = new Map<string, any>();
    pageKeys.forEach((pageKey) => {
      const rule = this.getPathRuleForPageKey(pageKey);
      allComponents.forEach((component: any) => {
        const componentPath = String(component?.path || "");
        if (!componentPath) return;

        const includeMatch = rule.include.some((prefix) =>
          this.pathStartsWithPrefix(componentPath, prefix),
        );
        if (!includeMatch) return;

        const excluded = rule.exclude.some((prefix) =>
          this.pathStartsWithPrefix(componentPath, prefix),
        );
        if (excluded) return;

        const mapKey = String(component?.key || componentPath);
        if (!selected.has(mapKey)) selected.set(mapKey, component);
      });
    });

    return Array.from(selected.values());
  }

  private resolveSavedCompositions(
    context: RuntimeContext,
    pageKeys: string[],
  ): any[] | null {
    const collection = (context as any)?.settings?.page_compositions;
    if (!collection || typeof collection !== "object") return null;

    for (const pageKey of pageKeys) {
      if (!Object.prototype.hasOwnProperty.call(collection, pageKey)) continue;
      const value = (collection as Record<string, any>)[pageKey];
      if (Array.isArray(value)) return value;
    }
    return null;
  }

  private pickLocalizedText(value: any, preferredLocale: "ar" | "en"): string {
    if (value == null) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object" && !Array.isArray(value)) {
      if (
        typeof value[preferredLocale] === "string" &&
        value[preferredLocale].trim()
      ) {
        return value[preferredLocale];
      }
      if (typeof value.ar === "string" && value.ar.trim()) return value.ar;
      if (typeof value.en === "string" && value.en.trim()) return value.en;
      const firstString = Object.values(value).find(
        (entry: any) => typeof entry === "string" && entry.trim(),
      );
      if (typeof firstString === "string") return firstString;
    }
    return String(value);
  }

  private flattenCollectionItems(value: any): any[] {
    if (!Array.isArray(value)) return [];
    return value.map((item: any) => {
      if (!item || typeof item !== "object") return item;
      const normalized: Record<string, any> = {};
      for (const key in item) {
        const cleanKey = key.includes(".") ? key.split(".").pop() : key;
        normalized[cleanKey!] = item[key];
      }
      return normalized;
    });
  }

  private ensureProductMockList(items: any[]): any[] {
    const normalized = Array.isArray(items) ? [...items] : [];
    (normalized as any).product_ids_mock_str = normalized
      .map((item: any) => item?.id)
      .filter(Boolean)
      .join(",");
    return normalized;
  }

  private extractSelectionIds(rawValue: any): string[] {
    const source = Array.isArray(rawValue) ? rawValue : [rawValue];
    return Array.from(
      new Set(
        source
          .map((entry: any) => {
            if (typeof entry === "string" || typeof entry === "number")
              return String(entry);
            if (entry && typeof entry === "object") {
              if (entry.id != null) return String(entry.id);
              if (entry.value != null) return String(entry.value);
            }
            return "";
          })
          .map((id) => id.trim())
          .filter(Boolean),
      ),
    );
  }

  private normalizeLinkUrl(value: any): string {
    const raw = String(value || "").trim();
    if (!raw) return "#";
    if (/^(https?:|mailto:|tel:|#)/i.test(raw)) return raw;
    if (raw.startsWith("/")) return raw;
    if (raw.startsWith("//")) return raw;
    return `/${raw.replace(/^\/+/, "")}`;
  }

  private getSourcePool(context: RuntimeContext, sourceKey: string): any[] {
    const source = String(sourceKey || "").toLowerCase();
    if (source === "products") return (context as any).products || [];
    if (source === "categories") return (context as any).categories || [];
    if (source === "brands") return (context as any).brands || [];
    if (source === "pages") return (context as any).pages || [];
    if (source === "blog_articles") return (context as any).blog_articles || [];
    if (source === "blog_categories")
      return (context as any).blog_categories || [];
    return [];
  }

  private resolveSourceEntityUrl(
    context: RuntimeContext,
    sourceKey: string,
    rawId: any,
  ): string {
    const source = String(sourceKey || "").toLowerCase();
    const id = String(rawId || "").trim();
    if (!id) return "";

    const staticMap: Record<string, string> = {
      offers_link: "/offers",
      brands_link: "/brands",
      blog_link: "/blog",
    };
    if (staticMap[source]) return staticMap[source];

    const pool = this.getSourcePool(context, source);
    const entry = pool.find(
      (item: any) => String(item?.id || item?.slug || "") === id,
    );

    if (source === "products") return entry?.url || `/products/${id}`;
    if (source === "categories") return entry?.url || `/categories/${id}`;
    if (source === "brands") return entry?.url || `/brands/${id}`;
    if (source === "pages") return entry?.url || `/pages/${id}`;
    if (source === "blog_articles") return entry?.url || `/blog/${id}`;
    if (source === "blog_categories")
      return entry?.url || `/blog/categories/${id}`;
    return entry?.url || "";
  }

  private resolveVariableListValue(
    context: RuntimeContext,
    rawValue: any,
    fallbackSource = "",
    fallbackValue = "",
  ): string {
    const sourceHint = String(fallbackSource || "")
      .trim()
      .toLowerCase();
    const valueHint = String(fallbackValue || "").trim();

    const staticSourceMap: Record<string, string> = {
      offers_link: "/offers",
      brands_link: "/brands",
      blog_link: "/blog",
    };

    if (typeof rawValue === "string") {
      if (sourceHint === "custom") return this.normalizeLinkUrl(rawValue);
      if (staticSourceMap[sourceHint]) return staticSourceMap[sourceHint];
      if (sourceHint && valueHint) {
        const fromSource = this.resolveSourceEntityUrl(
          context,
          sourceHint,
          valueHint,
        );
        if (fromSource) return this.normalizeLinkUrl(fromSource);
      }
      return this.normalizeLinkUrl(rawValue);
    }
    if (Array.isArray(rawValue)) {
      const first = rawValue.find((entry) => entry != null);
      return this.resolveVariableListValue(
        context,
        first,
        sourceHint,
        valueHint,
      );
    }
    if (rawValue && typeof rawValue === "object") {
      const source = String(
        rawValue.type ?? rawValue.source ?? rawValue.__type ?? sourceHint ?? "",
      )
        .trim()
        .toLowerCase();
      const typedValue = String(
        rawValue.value ??
          rawValue.id ??
          rawValue.key ??
          rawValue.__value ??
          valueHint ??
          "",
      ).trim();

      const candidate = rawValue.url ?? rawValue.path ?? rawValue.link ?? "";
      if (typeof candidate === "string" && candidate.trim()) {
        return this.normalizeLinkUrl(candidate);
      }
      if (source === "custom") {
        return this.normalizeLinkUrl(typedValue);
      }
      if (staticSourceMap[source]) {
        return staticSourceMap[source];
      }
      if (source && typedValue) {
        const resolved = this.resolveSourceEntityUrl(
          context,
          source,
          typedValue,
        );
        if (resolved) return this.normalizeLinkUrl(resolved);
      }
      if (typedValue) {
        return this.normalizeLinkUrl(typedValue);
      }
      if (sourceHint && valueHint) {
        const resolved = this.resolveSourceEntityUrl(
          context,
          sourceHint,
          valueHint,
        );
        if (resolved) return this.normalizeLinkUrl(resolved);
      }
      if (staticSourceMap[sourceHint]) {
        return staticSourceMap[sourceHint];
      }
    }
    if (sourceHint === "custom" && valueHint) {
      return this.normalizeLinkUrl(valueHint);
    }
    if (staticSourceMap[sourceHint]) {
      return staticSourceMap[sourceHint];
    }
    if (sourceHint && valueHint) {
      const resolved = this.resolveSourceEntityUrl(
        context,
        sourceHint,
        valueHint,
      );
      if (resolved) return this.normalizeLinkUrl(resolved);
    }
    return "#";
  }

  private resolveItemsBySource(
    context: RuntimeContext,
    sourceKey: string,
    rawValue: any,
    explicitOverride: boolean,
  ): any[] {
    const source = String(sourceKey || "").toLowerCase();
    const pool =
      source === "products"
        ? (context as any).products || []
        : source === "categories"
          ? (context as any).categories || []
          : source === "brands"
            ? (context as any).brands || []
            : [];

    if (!Array.isArray(pool) || pool.length === 0) {
      return source === "products" ? this.ensureProductMockList([]) : [];
    }

    const ids = this.extractSelectionIds(rawValue);
    const byId = new Map(
      pool
        .filter((item: any) => item?.id != null)
        .map((item: any) => [String(item.id), item]),
    );

    let resolved: any[] = [];
    if (ids.length > 0) {
      resolved = ids.map((id) => byId.get(id)).filter(Boolean);
    } else if (!explicitOverride) {
      const fallbackCount = source === "products" ? 12 : 8;
      resolved = pool.slice(0, fallbackCount);
    }

    return source === "products"
      ? this.ensureProductMockList(resolved)
      : resolved;
  }

  private resolvePreviewViewport(raw: any): PreviewViewport {
    const normalized = String(raw || "desktop").toLowerCase();
    return normalized === "mobile" ? "mobile" : "desktop";
  }

  private shouldRenderCompositionEntry(
    entry: any,
    previewViewport: PreviewViewport,
  ): boolean {
    if (!entry || typeof entry !== "object") return false;

    const visibility =
      entry.visibility && typeof entry.visibility === "object"
        ? entry.visibility
        : {};
    const enabled =
      typeof visibility.enabled === "boolean"
        ? visibility.enabled
        : typeof entry.enabled === "boolean"
          ? entry.enabled
          : true;
    if (!enabled) return false;

    const viewportRule = String(
      visibility.viewport ?? entry.viewport ?? "all",
    ).toLowerCase();
    if (!viewportRule || viewportRule === "all") return true;
    if (viewportRule === "mobile") return previewViewport === "mobile";
    if (viewportRule === "desktop") return previewViewport === "desktop";
    return true;
  }

  private mapHomeComponent(
    context: RuntimeContext,
    preferredLocale: "ar" | "en",
    component: any,
    position: number,
    overrideProps?: Record<string, any>,
  ): ResolvedHomeComponent {
    const data: Record<string, any> = {};
    component.fields?.forEach((f: any) => {
      if (!f.id) return;
      let val = f.value;
      if (f.type === "collection" && Array.isArray(val)) {
        val = this.flattenCollectionItems(val);
      } else if (
        val &&
        typeof val === "object" &&
        !Array.isArray(val) &&
        f.type !== "items" &&
        f.type !== "boolean"
      ) {
        val = this.pickLocalizedText(val, preferredLocale);
      }
      data[f.id] = val;
    });

    const mergedData: Record<string, any> = {
      ...data,
      ...(overrideProps && typeof overrideProps === "object"
        ? overrideProps
        : {}),
    };

    component.fields?.forEach((f: any) => {
      if (!f?.id) return;

      if (f.type === "collection") {
        const flattenedCollection = this.flattenCollectionItems(
          mergedData[f.id],
        );
        if (!Array.isArray(flattenedCollection)) {
          mergedData[f.id] = [];
          return;
        }

        const variableSubFields = (f.fields || []).filter(
          (subField: any) =>
            subField?.type === "items" &&
            String(subField?.format || "") === "variable-list",
        );

        if (variableSubFields.length === 0) {
          mergedData[f.id] = flattenedCollection;
          return;
        }

        mergedData[f.id] = flattenedCollection.map((item: any) => {
          if (!item || typeof item !== "object") return item;
          const nextItem = { ...item };

          variableSubFields.forEach((subField: any) => {
            const subId = String(subField?.id || "");
            if (!subId) return;
            const tail = subId.includes(".")
              ? subId.split(".").pop() || subId
              : subId;

            const rawFieldValue = nextItem[tail] ?? nextItem[subId];
            const typedSource =
              nextItem[`${tail}__type`] ?? nextItem[`${subId}__type`] ?? "";
            const typedValue =
              nextItem[`${tail}__value`] ?? nextItem[`${subId}__value`] ?? "";

            nextItem[tail] = this.resolveVariableListValue(
              context,
              rawFieldValue,
              typedSource,
              typedValue,
            );
          });

          return nextItem;
        });
        return;
      }

      if (String(f.format || "") === "variable-list") {
        mergedData[f.id] = this.resolveVariableListValue(
          context,
          mergedData[f.id],
        );
        return;
      }

      if (f.type === "items" && String(f.format || "") === "dropdown-list") {
        const explicitOverride = Boolean(
          overrideProps &&
          Object.prototype.hasOwnProperty.call(overrideProps, f.id),
        );
        mergedData[f.id] = this.resolveItemsBySource(
          context,
          f.source,
          mergedData[f.id],
          explicitOverride,
        );
        return;
      }

      if (
        mergedData[f.id] &&
        typeof mergedData[f.id] === "object" &&
        !Array.isArray(mergedData[f.id]) &&
        f.type !== "boolean"
      ) {
        mergedData[f.id] = this.pickLocalizedText(
          mergedData[f.id],
          preferredLocale,
        );
      }
    });

    const fallbackProducts =
      component.path.includes("product") ||
      component.path.includes("slider") ||
      component.path.includes("banner")
        ? (context as any).products || []
        : [];
    const componentProducts = Array.isArray(mergedData.products)
      ? this.ensureProductMockList(mergedData.products)
      : this.ensureProductMockList(fallbackProducts);
    this.applyComponentContractNormalization(
      context,
      String(component?.path || ""),
      mergedData,
    );

    return {
      path: component.path,
      name: component.path,
      data: {
        ...component,
        ...mergedData,
        position,
        products: componentProducts,
        product_ids_mock: componentProducts.map((p: any) => p.id),
        product_ids_mock_str: (componentProducts as any).product_ids_mock_str,
      },
    };
  }

  public resolve(
    context: RuntimeContext,
    themeSchema: any,
    templatePageIdRaw?: string,
  ): ResolvedHomeComponent[] {
    const twilight = themeSchema || {};
    if (!Array.isArray(twilight.components)) return [];

    const preferredLocale: "ar" | "en" = context.store?.locale?.startsWith("ar")
      ? "ar"
      : "en";
    const templatePageId =
      templatePageIdRaw ??
      (context.page as any)?.template_id ??
      context.page?.id ??
      "index";
    const pageKeys = this.resolveCompositionPageKeys(templatePageId);
    const pageComponents = this.resolveComponentsForPageKeys(
      twilight.components,
      pageKeys,
    );

    const savedCompositions = this.resolveSavedCompositions(context, pageKeys);
    const previewViewport = this.resolvePreviewViewport(
      (context as any)?.__preview?.viewport ??
        (context as any)?.settings?.__preview_viewport,
    );

    if (Array.isArray(savedCompositions)) {
      const byKey = new Map<string, any>();
      const byPath = new Map<string, any>();
      const componentSource =
        pageComponents.length > 0 ? pageComponents : twilight.components;
      componentSource.forEach((component: any) => {
        byKey.set(String(component.key), component);
        byPath.set(String(component.path), component);
      });

      return savedCompositions
        .filter((entry: any) =>
          this.shouldRenderCompositionEntry(entry, previewViewport),
        )
        .map((entry: any, index: number) => {
          const componentId = String(entry?.componentId || entry?.id || "");
          if (!componentId) return null;
          const component = byKey.get(componentId) || byPath.get(componentId);
          if (!component) return null;
          const props =
            entry?.props && typeof entry.props === "object" ? entry.props : {};
          return this.mapHomeComponent(
            context,
            preferredLocale,
            component,
            index,
            props,
          );
        })
        .filter(Boolean) as ResolvedHomeComponent[];
    }

    return pageComponents.map((component: any, index: number) =>
      this.mapHomeComponent(context, preferredLocale, component, index),
    );
  }
}
