// Extracted from runtime.routes to keep API routing thin and engine-owned preview behavior centralized.
import type { RuntimeContext } from "@vtdr/contracts";

type EntityRecord = Record<string, unknown>;

export interface ResolvedPreviewTarget {
  pageId: string;
  routePath: string;
  entityRef?: string;
  collectionRef?: string;
}

export interface PreviewThemeBinding {
  themeId: string;
  themeVersionId: string;
  themeVersion: string;
}

const DEFAULT_IMAGE = "/images/placeholder.png";

const asString = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
};

const normalizePathToken = (value: unknown): string => {
  const raw = Array.isArray(value)
    ? value.map((entry) => asString(entry)).join("/")
    : asString(value);
  return value
    ? raw
        .trim()
        .replace(/\\/g, "/")
        .replace(/^\/+|\/+$/g, "")
    : "";
};

const getPathSegments = (value: string): string[] => {
  const normalized = normalizePathToken(value);
  if (!normalized) return [];
  return normalized
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean);
};

const LOCALE_SEGMENTS = new Set(["ar", "en", "ar-sa", "en-us"]);

const stripLocalePrefix = (segments: string[]): string[] => {
  if (!segments.length) return segments;
  const first = String(segments[0] || "")
    .trim()
    .toLowerCase();
  if (LOCALE_SEGMENTS.has(first)) {
    return segments.slice(1);
  }
  return segments;
};

const asArray = (value: unknown): EntityRecord[] => {
  return Array.isArray(value) ? (value as EntityRecord[]) : [];
};

const readMoneyAmount = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (value && typeof value === "object") {
    const amount = Number((value as EntityRecord).amount);
    return Number.isFinite(amount) ? amount : 0;
  }
  return 0;
};

const getUrlTail = (value: unknown): string => {
  const raw = normalizePathToken(asString(value));
  if (!raw) return "";
  const parts = raw.split("/").filter(Boolean);
  return parts[parts.length - 1] || "";
};

const isPlaceholderImageUrl = (value: string): boolean => {
  const url = String(value || "")
    .trim()
    .toLowerCase();
  if (!url) return false;
  return (
    url.includes("via.placeholder.com") ||
    url.includes("placeholder.com/") ||
    url.includes("/placeholder/") ||
    url.endsWith("/placeholder")
  );
};

const sanitizePublicImageUrl = (value: unknown): string => {
  const raw = asString(value).trim();
  if (!raw) return DEFAULT_IMAGE;
  if (/^data:image\//i.test(raw) || /^blob:/i.test(raw)) return raw;
  if (/^https?:\/\//i.test(raw) || raw.startsWith("//")) {
    return isPlaceholderImageUrl(raw) ? DEFAULT_IMAGE : raw;
  }
  if (raw.startsWith("/")) return raw;
  return DEFAULT_IMAGE;
};

const slugifyToken = (value: unknown): string => {
  const raw = asString(value).trim().toLowerCase();
  if (!raw) return "";
  return raw
    .replace(/[^a-z0-9\u0600-\u06ff]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
};

const toNavigablePath = (value: unknown): string => {
  const raw = asString(value).trim();
  if (!raw) return "";
  if (
    raw.startsWith("#") ||
    raw.startsWith("mailto:") ||
    raw.startsWith("tel:")
  )
    return raw;

  try {
    const parsed = new URL(raw);
    return `${parsed.pathname || "/"}${parsed.search || ""}${parsed.hash || ""}`;
  } catch {
    if (/^[a-z]+:\/\//i.test(raw)) return "";
    if (raw.startsWith("/")) return raw;
    return `/${raw.replace(/^\/+/, "")}`;
  }
};

const normalizeEntityUrl = (
  candidate: unknown,
  fallbackPath: string,
  genericPaths: string[] = [],
): string => {
  const fallback = fallbackPath.startsWith("/")
    ? fallbackPath
    : `/${fallbackPath}`;
  const path = toNavigablePath(candidate);
  if (!path) return fallback;
  if (
    path.startsWith("#") ||
    path.startsWith("mailto:") ||
    path.startsWith("tel:")
  )
    return path;

  const pathOnly = path.split("?")[0].split("#")[0].replace(/\/+$/g, "") || "/";

  const genericSet = new Set(
    genericPaths
      .map((entry) =>
        String(entry || "")
          .trim()
          .toLowerCase(),
      )
      .map((entry) => (entry.startsWith("/") ? entry : `/${entry}`)),
  );

  if (pathOnly === "/" || genericSet.has(pathOnly.toLowerCase())) {
    return fallback;
  }

  return path;
};

const resolveEntityByRef = (
  items: EntityRecord[],
  rawRef?: string,
): EntityRecord | null => {
  if (!items.length) return null;

  const ref = normalizePathToken(rawRef || "").toLowerCase();
  if (!ref) return items[0];

  return (
    items.find((item) => {
      const directIds = [
        asString(item.id),
        asString(item.key),
        asString(item.entityKey),
        asString(item.slug),
        asString(item.value),
        getUrlTail(item.url),
      ]
        .map((token) => normalizePathToken(token).toLowerCase())
        .filter(Boolean);
      return directIds.includes(ref);
    }) || null
  );
};

const groupBrandsForTemplate = (
  brands: EntityRecord[],
): Record<string, EntityRecord[]> => {
  const grouped: Record<string, EntityRecord[]> = {};
  for (const brand of brands) {
    const name = asString(brand.name || brand.title || brand.id || "#");
    const letter = (name.trim().charAt(0) || "#").toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(brand);
  }
  return grouped;
};

const toUniqueStrings = (values: unknown[]): string[] => {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const value of values || []) {
    const token = asString(value).trim();
    if (!token || seen.has(token)) continue;
    seen.add(token);
    out.push(token);
  }
  return out;
};

const normalizeStoreForRuntime = (store: EntityRecord): EntityRecord => {
  const locale = asString(store.locale) || "ar-SA";
  const currency = asString(store.currency) || "SAR";
  const contacts =
    store.contacts && typeof store.contacts === "object"
      ? (store.contacts as EntityRecord)
      : {};
  const social =
    store.social && typeof store.social === "object"
      ? (store.social as EntityRecord)
      : {};
  const settings =
    store.settings && typeof store.settings === "object"
      ? (store.settings as EntityRecord)
      : {};
  const cartSettings =
    settings.cart && typeof settings.cart === "object"
      ? (settings.cart as EntityRecord)
      : {};

  return {
    ...store,
    id: asString(store.id) || "store-vtdr",
    name: asString(store.name) || "متجر تجريبي",
    locale,
    language: locale.split("-")[0] || "ar",
    is_rtl: locale.startsWith("ar"),
    currency,
    currencies:
      Array.isArray(store.currencies) && store.currencies.length > 0
        ? store.currencies
        : [
            {
              code: currency,
              symbol: currency === "SAR" ? "ر.س" : currency,
              is_default: true,
              exchange_rate: 1,
            },
          ],
    languages:
      Array.isArray(store.languages) && store.languages.length > 0
        ? store.languages
        : [
            {
              code: locale.split("-")[0] || "ar",
              is_default: true,
              status: "active",
            },
          ],
    logo: sanitizePublicImageUrl(
      store.logo ||
        store.avatar ||
        (store.branding as EntityRecord | undefined)?.logo,
    ),
    icon: sanitizePublicImageUrl(
      store.icon ||
        store.avatar ||
        (store.branding as EntityRecord | undefined)?.logo,
    ),
    contacts: {
      mobile: asString(contacts.mobile) || "+966500000000",
      email: asString(contacts.email) || "support@salla.sa",
      whatsapp:
        asString(contacts.whatsapp || contacts.mobile) || "+966500000000",
    },
    social: {
      twitter: asString(social.twitter) || "https://twitter.com/salla",
      instagram: asString(social.instagram) || "https://instagram.com/salla",
    },
    settings: {
      ...settings,
      cart: {
        ...cartSettings,
        apply_coupon_enabled: cartSettings.apply_coupon_enabled !== false,
      },
    },
  };
};

const normalizeRuntimeUser = (
  store: EntityRecord,
  rawUser: unknown,
): EntityRecord => {
  const locale = asString(store.locale) || "ar-SA";
  const languageCode = locale.split("-")[0] || "ar";
  const languageDir = locale.startsWith("ar") ? "rtl" : "ltr";
  const currencyCode = asString(store.currency) || "SAR";
  const existing =
    rawUser && typeof rawUser === "object" ? (rawUser as EntityRecord) : {};
  const rawName = asString(existing.name) || "ضيف المحاكي";
  const nameParts = rawName.split(/\s+/).filter(Boolean);
  const firstName = asString(existing.first_name) || nameParts[0] || "ضيف";
  const lastName =
    asString(existing.last_name) ||
    (nameParts.length > 1 ? nameParts.slice(1).join(" ") : "");
  const inferredAuth =
    existing.type === "user" || existing.is_authenticated === true;
  const userType = asString(existing.type) || (inferredAuth ? "user" : "guest");
  const isAuthenticated =
    typeof existing.is_authenticated === "boolean"
      ? existing.is_authenticated
      : userType === "user";

  return {
    id: asString(existing.id) || "vtdr_guest_1",
    type: userType,
    is_authenticated: isAuthenticated,
    is_notifiable: Boolean(existing.is_notifiable ?? isAuthenticated),
    name: rawName,
    first_name: firstName,
    last_name: lastName,
    email: asString(existing.email) || "customer@example.com",
    mobile: asString(existing.mobile) || "+966500000000",
    avatar: sanitizePublicImageUrl(existing.avatar || DEFAULT_IMAGE),
    language: {
      code:
        asString(
          (existing.language as EntityRecord | undefined)?.code ||
            existing.language_code,
        ) || languageCode,
      dir:
        asString((existing.language as EntityRecord | undefined)?.dir) ||
        languageDir,
    },
    language_code: asString(existing.language_code) || languageCode,
    currency: {
      code:
        asString((existing.currency as EntityRecord | undefined)?.code) ||
        currencyCode,
      symbol:
        asString((existing.currency as EntityRecord | undefined)?.symbol) ||
        (currencyCode === "SAR" ? "ر.س" : currencyCode),
    },
    can_access_wallet: Boolean(existing.can_access_wallet),
    points: Number(existing.points || existing.loyalty_points || 0),
    loyalty_points: Number(existing.loyalty_points || existing.points || 0),
  };
};

const normalizeCustomerAliasFromUser = (user: EntityRecord): EntityRecord => {
  return {
    id: asString(user.id) || "vtdr_customer_1",
    first_name: asString(user.first_name) || "عميل",
    last_name: asString(user.last_name),
    name: asString(user.name) || "عميل المتجر",
    email: asString(user.email) || "customer@example.com",
    mobile: asString(user.mobile) || "+966500000000",
    avatar: sanitizePublicImageUrl(user.avatar || DEFAULT_IMAGE),
    is_profile_completed: true,
  };
};

const PREVIEW_TRANSLATION_DEFAULTS: Record<string, string> = {
  "pages.categories.sorting": "الفرز",
  "pages.blog_categories.categories": "التصنيفات",
  "pages.blog_categories.no_articles": "لا توجد مقالات متاحة حالياً",
  "pages.products.donation_target_date": "تاريخ انتهاء الحملة",
};

export const resolvePreviewTarget = (
  rawPage: unknown,
  rawWildcardPath: string,
): ResolvedPreviewTarget => {
  const wildcardPath = normalizePathToken(rawWildcardPath);
  const pageFromQuery = normalizePathToken(asString(rawPage));

  if (wildcardPath) {
    const originalSegments = getPathSegments(wildcardPath);
    const segments = stripLocalePrefix(originalSegments);
    if (!segments.length) {
      return { pageId: "index", routePath: "/" };
    }
    const normalizedPath = segments.join("/");
    const first = (segments[0] || "").toLowerCase();
    const second = (segments[1] || "").toLowerCase();
    const last = segments[segments.length - 1] || "";

    if (first === "products" || first === "product") {
      if (segments.length >= 2)
        return {
          pageId: "product/single",
          routePath: `/${normalizedPath}`,
          entityRef: last,
        };
      return { pageId: "product/index", routePath: `/${normalizedPath}` };
    }

    if (first === "categories" || first === "category") {
      if (segments.length >= 2)
        return {
          pageId: "product/index",
          routePath: `/${normalizedPath}`,
          entityRef: last,
        };
      return { pageId: "product/index", routePath: `/${normalizedPath}` };
    }

    if (first === "brands" || first === "brand") {
      if (segments.length >= 2)
        return {
          pageId: "brands/single",
          routePath: `/${normalizedPath}`,
          entityRef: last,
        };
      return { pageId: "brands/index", routePath: `/${normalizedPath}` };
    }

    if (first === "blog") {
      if (segments.length === 1)
        return { pageId: "blog/index", routePath: "/blog" };
      if (
        (second === "category" || second === "categories") &&
        segments.length >= 3
      ) {
        return {
          pageId: "blog/index",
          routePath: `/${normalizedPath}`,
          collectionRef: last,
        };
      }
      return {
        pageId: "blog/single",
        routePath: `/${normalizedPath}`,
        entityRef: last,
      };
    }

    if (first === "pages" || first === "page") {
      return {
        pageId: "page-single",
        routePath: `/${normalizedPath}`,
        entityRef: last,
      };
    }

    if (first === "customer") {
      const secondToken = (segments[1] || "").toLowerCase();
      const tail = segments.slice(1).join("/");
      if (!secondToken || secondToken === "profile") {
        return { pageId: "customer/profile", routePath: `/${normalizedPath}` };
      }
      if (secondToken === "orders") {
        const thirdToken = (segments[2] || "").toLowerCase();
        if (thirdToken === "index") {
          return {
            pageId: "customer/orders/index",
            routePath: `/${normalizedPath}`,
          };
        }
        if (thirdToken === "single" && segments.length >= 4) {
          return {
            pageId: "customer/orders/single",
            routePath: `/${normalizedPath}`,
            entityRef: segments[segments.length - 1],
          };
        }
        if (segments.length >= 3) {
          return {
            pageId: "customer/orders/single",
            routePath: `/${normalizedPath}`,
            entityRef: segments[segments.length - 1],
          };
        }
        return {
          pageId: "customer/orders/index",
          routePath: `/${normalizedPath}`,
        };
      }
      if (
        secondToken === "wishlist" ||
        secondToken === "notifications" ||
        secondToken === "wallet"
      ) {
        return {
          pageId: `customer/${secondToken}`,
          routePath: `/${normalizedPath}`,
        };
      }
      return {
        pageId: tail ? `customer/${tail}` : "customer/profile",
        routePath: `/${normalizedPath}`,
      };
    }

    if (first === "checkout") {
      return { pageId: "checkout", routePath: "/checkout" };
    }

    if (
      first === "cart" ||
      first === "loyalty" ||
      first === "testimonials" ||
      first === "thank-you" ||
      first === "landing-page" ||
      first === "debug"
    ) {
      return { pageId: first, routePath: `/${normalizedPath}` };
    }

    if (first === "home" || first === "index") {
      return { pageId: "index", routePath: "/" };
    }

    if (segments.length === 1) {
      return {
        pageId: "page-single",
        routePath: `/${normalizedPath}`,
        entityRef: last,
      };
    }

    return { pageId: normalizedPath, routePath: `/${normalizedPath}` };
  }

  const querySegments = stripLocalePrefix(getPathSegments(pageFromQuery));
  const queryToken = (querySegments.join("/") || pageFromQuery).toLowerCase();
  if (!queryToken || queryToken === "home" || queryToken === "index")
    return { pageId: "index", routePath: "/" };
  if (queryToken === "products" || queryToken === "product")
    return { pageId: "product/index", routePath: "/products" };
  if (queryToken === "categories" || queryToken === "category")
    return { pageId: "product/index", routePath: "/categories" };
  if (queryToken === "brands" || queryToken === "brand")
    return { pageId: "brands/index", routePath: "/brands" };
  if (queryToken === "blog")
    return { pageId: "blog/index", routePath: "/blog" };
  if (queryToken === "checkout")
    return { pageId: "checkout", routePath: "/checkout" };
  if (queryToken === "customer" || queryToken === "customer/profile")
    return { pageId: "customer/profile", routePath: "/customer/profile" };
  if (queryToken === "customer/orders")
    return { pageId: "customer/orders/index", routePath: "/customer/orders" };
  if (queryToken === "customer/wishlist")
    return { pageId: "customer/wishlist", routePath: "/customer/wishlist" };
  if (queryToken === "customer/notifications")
    return {
      pageId: "customer/notifications",
      routePath: "/customer/notifications",
    };
  if (queryToken === "customer/wallet")
    return { pageId: "customer/wallet", routePath: "/customer/wallet" };
  if (
    queryToken === "pages" ||
    queryToken === "page" ||
    queryToken === "page-single"
  )
    return { pageId: "page-single", routePath: "/pages" };
  if (queryToken && !queryToken.includes("/")) {
    return {
      pageId: "page-single",
      routePath: `/${queryToken}`,
      entityRef: queryToken,
    };
  }
  return {
    pageId: pageFromQuery,
    routePath: pageFromQuery ? `/${pageFromQuery}` : "/",
  };
};

const readQueryValue = (
  query: Record<string, unknown>,
  keys: string[],
  fallback = "",
): string => {
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(query, key)) continue;
    const raw = query[key];
    const candidate = Array.isArray(raw) ? asString(raw[0]) : asString(raw);
    const token = candidate.trim();
    if (token) return token;
  }
  return fallback;
};

const toMatchToken = (value: unknown): string => {
  return normalizePathToken(asString(value)).toLowerCase();
};

const isGenericProductSourceValue = (value: string): boolean => {
  const token = toMatchToken(value);
  return (
    token === "" ||
    token === "products" ||
    token === "product" ||
    token === "all" ||
    token === "index"
  );
};

interface ProductListingSourceResolution {
  source: string;
  sourceValue: string;
  categoryRef: string;
  brandRef: string;
  searchQuery: string;
  sortKey: string;
}

const resolveProductListingSource = (
  target: ResolvedPreviewTarget,
  query: Record<string, unknown>,
): ProductListingSourceResolution => {
  const routeSegments = getPathSegments(target.routePath || "");
  const first = (routeSegments[0] || "").toLowerCase();
  const routeCategoryRef =
    (first === "categories" || first === "category") &&
    routeSegments.length >= 2
      ? routeSegments[routeSegments.length - 1] || ""
      : "";

  let source = readQueryValue(query, [
    "source",
    "source_type",
    "sourceType",
    "page_slug",
  ]).trim();
  let sourceValue = readQueryValue(query, [
    "source_value",
    "sourceValue",
    "value",
  ]).trim();
  let categoryRef =
    readQueryValue(query, ["category_id", "categoryId", "category"]).trim() ||
    routeCategoryRef ||
    asString(target.entityRef).trim();
  let brandRef = readQueryValue(query, ["brand_id", "brandId", "brand"]).trim();

  const normalizedSource = toMatchToken(source);
  if (!categoryRef && normalizedSource.includes("category") && sourceValue) {
    categoryRef = sourceValue;
  }
  if (!brandRef && normalizedSource.includes("brand") && sourceValue) {
    brandRef = sourceValue;
  }
  if (
    !categoryRef &&
    normalizedSource.startsWith("product.index") &&
    sourceValue &&
    !isGenericProductSourceValue(sourceValue)
  ) {
    categoryRef = sourceValue;
  }

  if (!sourceValue) {
    sourceValue = categoryRef || brandRef || "";
  }

  if (!source) {
    if (categoryRef) source = "product.index.category";
    else if (brandRef) source = "product.index.brand";
    else source = "product.index";
  }

  return {
    source,
    sourceValue,
    categoryRef,
    brandRef,
    searchQuery: readQueryValue(query, ["search", "q", "keyword"]).trim(),
    sortKey:
      readQueryValue(
        query,
        ["sort", "sort_by", "sortBy", "order_by", "orderBy"],
        "ourSuggest",
      ).trim() || "ourSuggest",
  };
};

const collectProductBrandRefsForPreview = (product: EntityRecord): string[] => {
  return toUniqueStrings([
    asString(product.brand_id),
    asString((product.brand as EntityRecord | undefined)?.id),
    asString((product.brand as EntityRecord | undefined)?.slug),
    getUrlTail((product.brand as EntityRecord | undefined)?.url),
  ]);
};

const collectProductCategoryRefsForPreview = (
  product: EntityRecord,
): string[] => {
  return toUniqueStrings([
    ...collectProductCategoryIdsForPreview(product),
    ...asArray(product.categories).map((entry) => asString(entry.slug)),
    ...asArray(product.categories).map((entry) => getUrlTail(entry.url)),
    asString((product.category as EntityRecord | undefined)?.slug),
    getUrlTail((product.category as EntityRecord | undefined)?.url),
  ]);
};

const sortProductsForListing = (
  products: EntityRecord[],
  sortKey: string,
): EntityRecord[] => {
  const items = [...products];
  const token = asString(sortKey)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  const readPrice = (entry: EntityRecord) =>
    readMoneyAmount(entry.sale_price || entry.price);
  const readSold = (entry: EntityRecord) =>
    Number(entry.sold_quantity || entry.sales_count || 0);
  const readRating = (entry: EntityRecord) =>
    Number(
      (entry.rating && typeof entry.rating === "object"
        ? (entry.rating as EntityRecord).stars
        : entry.rating) || 0,
    );
  const readFeatured = (entry: EntityRecord) =>
    Number(Boolean(entry.is_featured));

  if (token === "bestsell" || token === "mostsales") {
    return items.sort((a, b) => readSold(b) - readSold(a));
  }
  if (token === "toprated" || token === "rating") {
    return items.sort((a, b) => readRating(b) - readRating(a));
  }
  if (token === "pricefromtoptolow" || token === "pricedesc") {
    return items.sort((a, b) => readPrice(b) - readPrice(a));
  }
  if (token === "pricefromlowtotop" || token === "priceasc") {
    return items.sort((a, b) => readPrice(a) - readPrice(b));
  }

  return items.sort((a, b) => {
    const featuredDelta = readFeatured(b) - readFeatured(a);
    if (featuredDelta !== 0) return featuredDelta;
    const soldDelta = readSold(b) - readSold(a);
    if (soldDelta !== 0) return soldDelta;
    return readPrice(a) - readPrice(b);
  });
};

const filterProductsForListing = (
  products: EntityRecord[],
  resolution: ProductListingSourceResolution,
): EntityRecord[] => {
  let filtered = [...products];
  const categoryToken = toMatchToken(resolution.categoryRef);
  const brandToken = toMatchToken(resolution.brandRef);
  const searchToken = resolution.searchQuery.toLowerCase();

  if (categoryToken) {
    filtered = filtered.filter((product) => {
      const refs = collectProductCategoryRefsForPreview(product).map((entry) =>
        toMatchToken(entry),
      );
      return refs.includes(categoryToken);
    });
  }

  if (brandToken) {
    filtered = filtered.filter((product) => {
      const refs = collectProductBrandRefsForPreview(product).map((entry) =>
        toMatchToken(entry),
      );
      return refs.includes(brandToken);
    });
  }

  if (searchToken) {
    filtered = filtered.filter((product) => {
      const haystack = [
        asString(product.name),
        asString(product.description),
        asString(product.short_description),
        asString(product.sku),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(searchToken);
    });
  }

  return sortProductsForListing(filtered, resolution.sortKey);
};

interface BlogListingSourceResolution {
  source: string;
  sourceValue: string;
  categoryRef: string;
  searchQuery: string;
  sortKey: string;
  publishedState: string;
}

const resolveBlogListingSource = (
  target: ResolvedPreviewTarget,
  query: Record<string, unknown>,
): BlogListingSourceResolution => {
  const routeSegments = getPathSegments(target.routePath || "");
  const first = (routeSegments[0] || "").toLowerCase();
  const second = (routeSegments[1] || "").toLowerCase();
  const routeCategoryRef =
    first === "blog" &&
    (second === "category" || second === "categories") &&
    routeSegments.length >= 3
      ? routeSegments[routeSegments.length - 1] || ""
      : "";

  let source = readQueryValue(query, [
    "source",
    "source_type",
    "sourceType",
    "page_slug",
  ]).trim();
  let sourceValue = readQueryValue(query, [
    "source_value",
    "sourceValue",
    "value",
  ]).trim();
  let categoryRef =
    readQueryValue(query, ["category_id", "categoryId", "category"]).trim() ||
    asString(target.collectionRef).trim() ||
    routeCategoryRef;

  if (
    !categoryRef &&
    toMatchToken(source).includes("category") &&
    sourceValue
  ) {
    categoryRef = sourceValue;
  }
  if (!sourceValue && categoryRef) {
    sourceValue = categoryRef;
  }
  if (!source) {
    source = categoryRef ? "blog.category" : "blog.index";
  }

  return {
    source,
    sourceValue,
    categoryRef,
    searchQuery: readQueryValue(query, ["search", "q", "keyword"]).trim(),
    sortKey:
      readQueryValue(
        query,
        ["sort", "sort_by", "sortBy", "order_by", "orderBy"],
        "latest",
      ).trim() || "latest",
    publishedState: readQueryValue(query, ["published", "is_published"])
      .trim()
      .toLowerCase(),
  };
};

const filterBlogArticlesForListing = (
  articles: EntityRecord[],
  resolution: BlogListingSourceResolution,
  selectedCategory: EntityRecord | null,
): EntityRecord[] => {
  let filtered = [...articles];
  const searchToken = resolution.searchQuery.toLowerCase();
  const categoryTokens = new Set(
    toUniqueStrings([
      resolution.categoryRef,
      asString((selectedCategory || {}).id),
      asString((selectedCategory || {}).slug),
      getUrlTail((selectedCategory || {}).url),
    ])
      .map((entry) => toMatchToken(entry))
      .filter(Boolean),
  );

  if (categoryTokens.size > 0) {
    filtered = filtered.filter((article) => {
      const rawCategory =
        article.category && typeof article.category === "object"
          ? (article.category as EntityRecord)
          : {};
      const refs = toUniqueStrings([
        asString(article.category_id || article.category),
        asString(rawCategory.id),
        asString(rawCategory.slug),
        getUrlTail(rawCategory.url),
      ])
        .map((entry) => toMatchToken(entry))
        .filter(Boolean);
      return refs.some((entry) => categoryTokens.has(entry));
    });
  }

  if (
    resolution.publishedState === "true" ||
    resolution.publishedState === "1"
  ) {
    filtered = filtered.filter((article) => article.is_published !== false);
  } else if (
    resolution.publishedState === "false" ||
    resolution.publishedState === "0"
  ) {
    filtered = filtered.filter((article) => article.is_published === false);
  }

  if (searchToken) {
    filtered = filtered.filter((article) => {
      const haystack = [
        asString(article.title),
        asString(article.summary),
        asString(article.body),
        asString(article.slug),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(searchToken);
    });
  }

  const sortToken = asString(resolution.sortKey)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  if (sortToken === "oldest" || sortToken === "createdasc") {
    filtered = filtered.sort(
      (a, b) =>
        new Date(asString(a.published_at || a.created_at || 0)).getTime() -
        new Date(asString(b.published_at || b.created_at || 0)).getTime(),
    );
  } else if (sortToken === "title" || sortToken === "name") {
    filtered = filtered.sort((a, b) =>
      asString(a.title).localeCompare(asString(b.title), "ar"),
    );
  } else {
    filtered = filtered.sort(
      (a, b) =>
        new Date(asString(b.published_at || b.created_at || 0)).getTime() -
        new Date(asString(a.published_at || a.created_at || 0)).getTime(),
    );
  }

  return filtered;
};

const normalizeProductOptionDetailsForTemplate = (
  option: EntityRecord,
  currency: string,
): EntityRecord[] => {
  const source =
    asArray(option.details).length > 0
      ? asArray(option.details)
      : asArray(option.values);
  const optionId = asString(option.id) || "option";

  return source.map((entry, index) => {
    const detailId = asString(entry.id) || `${optionId}-detail-${index + 1}`;
    const name =
      asString(entry.name || entry.label || entry.title) ||
      `Value ${index + 1}`;
    const additionalPrice = readMoneyAmount(
      entry.additional_price ?? entry.price ?? entry.amount,
    );
    const optionValue = asString(
      entry.option_value ?? entry.value ?? entry.image ?? entry.color,
    );
    const rawImage = asString(entry.image || "");
    const image = rawImage ? sanitizePublicImageUrl(rawImage) : undefined;
    const color = asString(entry.color || "");
    const fullName =
      asString(entry.full_name) ||
      (additionalPrice > 0
        ? `${name} (+${additionalPrice} ${currency})`
        : name);

    return {
      ...entry,
      id: detailId,
      name,
      full_name: fullName,
      additional_price: additionalPrice,
      price: additionalPrice,
      option_value: optionValue || undefined,
      image,
      color: color || undefined,
      is_default: Boolean(entry.is_default),
      is_selected: Boolean(entry.is_selected),
      is_out: Boolean(entry.is_out || entry.out_of_stock),
    };
  });
};

const normalizeProductOptionsForTemplate = (
  options: EntityRecord[],
  currency: string,
): EntityRecord[] => {
  return options.map((option, index) => {
    const optionId = asString(option.id) || `option-${index + 1}`;
    const details = normalizeProductOptionDetailsForTemplate(option, currency);
    const values = details.map((entry) => ({
      ...entry,
      id: asString(entry.id),
      name: asString(entry.name),
      price: readMoneyAmount(entry.additional_price ?? entry.price),
      is_default: Boolean(entry.is_default),
    }));

    return {
      ...option,
      id: optionId,
      name: asString(option.name || option.title) || `Option ${index + 1}`,
      type: asString(option.type) || "select",
      description: asString(option.description),
      sort: Number(option.sort || 0) || 0,
      display_type: asString(
        option.display_type || option.displayType || option.type || "select",
      ),
      required: Boolean(option.required),
      associated_with_order_time: Boolean(option.associated_with_order_time),
      not_same_day_order: Boolean(option.not_same_day_order),
      availability_range: Boolean(option.availability_range),
      from_date_time: asString(option.from_date_time),
      to_date_time: asString(option.to_date_time),
      visibility_condition_type: asString(
        option.visibility_condition_type || option.condition_type,
      ),
      visibility_condition_option: asString(
        option.visibility_condition_option ||
          option.condition_option ||
          option.condition_attributes,
      ),
      visibility_condition_value: asString(
        option.visibility_condition_value || option.condition_value,
      ),
      placeholder: asString(option.placeholder),
      visibility_condition:
        option.visibility_condition &&
        typeof option.visibility_condition === "object"
          ? option.visibility_condition
          : undefined,
      condition_attributes: asString(option.condition_attributes),
      advance:
        option.advance && typeof option.advance === "object"
          ? option.advance
          : {},
      element: asString(option.element),
      details,
      values,
    };
  });
};

const normalizeProductDonationForTemplate = (
  product: EntityRecord,
  fallbackAmount: number,
): EntityRecord | undefined => {
  const donationSource =
    product.donation &&
    typeof product.donation === "object" &&
    !Array.isArray(product.donation)
      ? (product.donation as EntityRecord)
      : {};

  const hasDonationSignal =
    Object.keys(donationSource).length > 0 ||
    product.target_amount != null ||
    product.collected_amount != null ||
    product.min_amount_donating != null ||
    product.max_amount_donating != null;
  const isDonation =
    typeof product.is_donation === "boolean"
      ? product.is_donation
      : asString(product.type).toLowerCase() === "donating" ||
        hasDonationSignal;
  if (!isDonation && !hasDonationSignal) {
    return undefined;
  }

  const targetAmount = Math.max(
    0,
    readMoneyAmount(
      donationSource.target_amount ??
        product.target_amount ??
        product.max_amount_donating ??
        fallbackAmount,
    ),
  );
  const collectedAmount = Math.max(
    0,
    readMoneyAmount(
      donationSource.collected_amount ??
        product.collected_amount ??
        product.min_amount_donating,
    ),
  );
  const computedPercent =
    targetAmount > 0
      ? Math.min(100, (collectedAmount / targetAmount) * 100)
      : 0;
  const targetPercent = Math.max(
    0,
    Math.min(
      100,
      readMoneyAmount(donationSource.target_percent ?? computedPercent),
    ),
  );
  const targetEndDate = asString(
    donationSource.target_end_date ??
      donationSource.end_date ??
      donationSource.ends_at ??
      product.target_end_date,
  );
  const parsedEndDate = targetEndDate ? new Date(targetEndDate).getTime() : NaN;
  const isExpired =
    Number.isFinite(parsedEndDate) && parsedEndDate < Date.now();
  const reachedTarget = targetAmount > 0 && collectedAmount >= targetAmount;
  const targetMessage = asString(
    donationSource.target_message ??
      product.target_message ??
      (reachedTarget ? "تم الوصول إلى الهدف" : isExpired ? "انتهت الحملة" : ""),
  );
  const canDonate =
    donationSource.can_donate != null
      ? Boolean(donationSource.can_donate)
      : !(reachedTarget || isExpired);

  return {
    target_message: targetMessage || undefined,
    collected_amount: collectedAmount,
    target_amount: targetAmount,
    target_percent: targetPercent,
    target_end_date: targetEndDate || undefined,
    can_donate: canDonate,
  };
};

const collectProductCategoryIdsForPreview = (
  product: EntityRecord,
): string[] => {
  return toUniqueStrings([
    ...(Array.isArray(product.category_ids) ? product.category_ids : []),
    ...asArray(product.categories).map((entry) => asString(entry.id)),
    asString(
      (product.category as EntityRecord | undefined)?.id ||
        product.category_id ||
        product.categoryId,
    ),
  ]);
};

const collectOfferProductIdsForPreview = (offer: EntityRecord): string[] => {
  return toUniqueStrings([
    ...(Array.isArray(offer.product_ids) ? offer.product_ids : []),
    ...asArray(offer.products).map((entry) => asString(entry.id)),
  ]);
};

const collectOfferCategoryIdsForPreview = (offer: EntityRecord): string[] => {
  return toUniqueStrings([
    ...(Array.isArray(offer.category_ids) ? offer.category_ids : []),
    ...asArray(offer.categories).map((entry) => asString(entry.id)),
  ]);
};

const normalizeOfferForTemplate = (
  offer: EntityRecord,
  defaultCurrency: string,
): EntityRecord => {
  const offerId = asString(offer.id) || "offer-1";
  const offerTitle = asString(offer.title || offer.name) || "عرض";
  const offerSlug =
    slugifyToken(offer.slug || offerTitle || offerId) || offerId;

  const normalizedCategories = asArray(offer.categories).map((entry) =>
    normalizeCategoryForTemplate(entry),
  );
  const categoryIds = toUniqueStrings([
    ...(Array.isArray(offer.category_ids) ? offer.category_ids : []),
    ...normalizedCategories.map((entry) => asString(entry.id)),
  ]);

  const productsSource = asArray(offer.products);
  const normalizedProducts = productsSource.map((entry) =>
    normalizeProductForTemplate(entry, defaultCurrency),
  );
  const productIds = toUniqueStrings([
    ...(Array.isArray(offer.product_ids) ? offer.product_ids : []),
    ...normalizedProducts.map((entry) => asString(entry.id)),
  ]);

  return {
    ...offer,
    id: offerId,
    name: asString(offer.name) || offerTitle,
    title: offerTitle,
    slug: asString(offer.slug) || offerSlug,
    description: asString(offer.description),
    url: normalizeEntityUrl(offer.url, `/offers/${offerSlug}`, [
      "/offer",
      "/offers",
    ]),
    image: sanitizePublicImageUrl(
      offer.image || (offer.cover as EntityRecord | undefined)?.url,
    ),
    categories:
      normalizedCategories.length > 0
        ? normalizedCategories
        : categoryIds.map((id) =>
            normalizeCategoryForTemplate({
              id,
              name: id,
              slug: id,
              url: `/categories/${id}`,
            }),
          ),
    category_ids: categoryIds,
    products:
      normalizedProducts.length > 0
        ? normalizedProducts
        : productIds.map((id) =>
            normalizeProductForTemplate(
              { id, name: id, slug: id, url: `/products/${id}` },
              defaultCurrency,
            ),
          ),
    product_ids: productIds,
    discount_type: asString(offer.discount_type || offer.type || "percentage"),
    discount_value: readMoneyAmount(
      offer.discount_value ?? offer.discount ?? offer.value,
    ),
    starts_at: asString(offer.starts_at || offer.start_at),
    ends_at: asString(offer.ends_at || offer.end_at),
    is_active: offer.is_active !== false,
  };
};

const resolveRelatedProductsForPreview = (
  targetProduct: EntityRecord,
  products: EntityRecord[],
  limit = 12,
): EntityRecord[] => {
  const productId = asString(targetProduct.id).trim();
  const targetCategoryIds = new Set(
    collectProductCategoryIdsForPreview(targetProduct),
  );
  const targetBrandId = asString(
    (targetProduct.brand as EntityRecord | undefined)?.id ||
      targetProduct.brand_id,
  ).trim();

  const scored = products
    .filter((entry) => asString(entry.id).trim() !== productId)
    .map((entry) => {
      const categoryIds = collectProductCategoryIdsForPreview(entry);
      const sharedCategoryScore = categoryIds.reduce(
        (sum, categoryId) => sum + (targetCategoryIds.has(categoryId) ? 1 : 0),
        0,
      );
      const brandId = asString(
        (entry.brand as EntityRecord | undefined)?.id || entry.brand_id,
      ).trim();
      const sameBrandScore = targetBrandId && brandId === targetBrandId ? 2 : 0;
      return {
        product: entry,
        score: sharedCategoryScore + sameBrandScore,
      };
    });

  const scoped = scored.some((entry) => entry.score > 0)
    ? scored.filter((entry) => entry.score > 0)
    : scored;

  return scoped
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const featuredDelta =
        Number(Boolean((b.product as EntityRecord).is_featured)) -
        Number(Boolean((a.product as EntityRecord).is_featured));
      if (featuredDelta !== 0) return featuredDelta;
      return (
        readMoneyAmount(
          (a.product as EntityRecord).sale_price ||
            (a.product as EntityRecord).price,
        ) -
        readMoneyAmount(
          (b.product as EntityRecord).sale_price ||
            (b.product as EntityRecord).price,
        )
      );
    })
    .map((entry) => entry.product)
    .slice(0, Math.max(0, limit));
};

const resolveOfferForProduct = (
  product: EntityRecord,
  offers: EntityRecord[],
  requestedOfferRef: string,
): EntityRecord | null => {
  const requestedRef = normalizePathToken(
    requestedOfferRef || "",
  ).toLowerCase();
  if (requestedRef) {
    return resolveEntityByRef(offers, requestedRef);
  }

  const productId = asString(product.id).trim();
  const productCategoryIds = new Set(
    collectProductCategoryIdsForPreview(product),
  );

  const scoredOffers = offers.map((offer) => {
    const offerProductIds = new Set(collectOfferProductIdsForPreview(offer));
    const offerCategoryIds = new Set(collectOfferCategoryIdsForPreview(offer));
    const productScore = productId && offerProductIds.has(productId) ? 10 : 0;
    const categoryScore = [...productCategoryIds].reduce(
      (sum, categoryId) => sum + (offerCategoryIds.has(categoryId) ? 1 : 0),
      0,
    );
    const score = productScore + categoryScore;
    return {
      offer,
      score,
      isActive: offer.is_active !== false,
    };
  });

  const scoped = scoredOffers
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return Number(b.isActive) - Number(a.isActive);
    });

  return scoped[0]?.offer || null;
};

const normalizeProductForTemplate = (
  product: EntityRecord,
  defaultCurrency: string,
): EntityRecord => {
  const images = asArray(product.images).map((image, index) => ({
    ...image,
    id: asString(image.id) || `img-${index + 1}`,
    url: sanitizePublicImageUrl(image.url),
    alt: asString(image.alt) || asString(product.name) || "image",
  }));

  const normalizedImages =
    images.length > 0
      ? images
      : [
          {
            id: "img-1",
            url: DEFAULT_IMAGE,
            alt: asString(product.name) || "image",
          },
        ];
  const price = readMoneyAmount(product.price);
  const regularPrice =
    readMoneyAmount(product.regular_price || product.regularPrice) || price;
  const salePrice =
    readMoneyAmount(product.sale_price || product.salePrice) || price;
  const variants = asArray(product.variants);
  const currency = asString(product.currency) || defaultCurrency;
  const normalizedOptions = normalizeProductOptionsForTemplate(
    asArray(product.options),
    currency,
  );
  const donation = normalizeProductDonationForTemplate(
    product,
    salePrice || price || 1,
  );
  const isDonation =
    typeof product.is_donation === "boolean"
      ? product.is_donation
      : asString(product.type).toLowerCase() === "donating" ||
        Boolean(donation);
  const productType = isDonation
    ? "donating"
    : asString(product.type) || "product";
  const hasExplicitQuantity =
    product.quantity !== undefined &&
    product.quantity !== null &&
    String(product.quantity).trim() !== "";
  const hasExplicitStock =
    product.stock !== undefined &&
    product.stock !== null &&
    String(product.stock).trim() !== "";
  const variantQuantity = variants.reduce((sum, variant) => {
    if (variant.is_available === false) return sum;
    const qty = Number(variant.quantity ?? variant.stock ?? 0);
    return sum + (Number.isFinite(qty) ? Math.max(0, Math.floor(qty)) : 0);
  }, 0);
  const isInfiniteQuantity =
    Boolean(product.is_infinite_quantity) ||
    (!hasExplicitQuantity && !hasExplicitStock && variants.length === 0);
  const quantity = isInfiniteQuantity
    ? null
    : Math.max(
        0,
        Math.floor(
          Number(
            hasExplicitQuantity
              ? product.quantity
              : hasExplicitStock
                ? product.stock
                : variantQuantity,
          ) || 0,
        ),
      );
  const quantityNumber = typeof quantity === "number" ? quantity : 0;
  const explicitMaxQuantity = Number(product.max_quantity);
  const maxQuantity = isInfiniteQuantity
    ? Number.isFinite(explicitMaxQuantity) && explicitMaxQuantity > 0
      ? Math.floor(explicitMaxQuantity)
      : 99
    : Math.max(
        1,
        Math.min(
          Number.isFinite(explicitMaxQuantity) && explicitMaxQuantity > 0
            ? Math.floor(explicitMaxQuantity)
            : quantityNumber || 1,
          quantityNumber ||
            (Number.isFinite(explicitMaxQuantity)
              ? Math.floor(explicitMaxQuantity)
              : 1) ||
            1,
        ),
      );
  const explicitAvailability =
    typeof product.is_available === "boolean"
      ? product.is_available
      : undefined;
  const rawStatus = asString(product.status).toLowerCase();
  let computedAvailability =
    explicitAvailability ?? (isInfiniteQuantity || quantityNumber > 0);
  let isOutOfStock =
    Boolean(product.is_out_of_stock) ||
    !computedAvailability ||
    (!isInfiniteQuantity && quantityNumber <= 0);
  let status = isOutOfStock
    ? rawStatus === "out-and-notify" || Boolean(product.notify_availability)
      ? "out-and-notify"
      : "out"
    : "sale";
  if (rawStatus === "hidden") {
    status = "hidden";
    computedAvailability = false;
    isOutOfStock = true;
  }
  const soldQuantity = Math.max(
    0,
    Math.floor(Number(product.sold_quantity || product.sales_count || 0) || 0),
  );
  const isHiddenQuantity = Boolean(product.is_hidden_quantity);
  const notifyAvailability =
    isOutOfStock && status === "out-and-notify"
      ? product.notify_availability &&
        typeof product.notify_availability === "object"
        ? product.notify_availability
        : status === "out-and-notify"
          ? {
              channels: ["sms", "email"],
              subscribed: false,
              subscribed_options: [],
              options: true,
            }
          : undefined
      : undefined;
  const productId = asString(product.id) || "product-1";
  const productSlug = slugifyToken(product.slug || product.name) || productId;
  const url = normalizeEntityUrl(product.url, `/products/${productSlug}`, [
    "/product",
    "/products",
  ]);
  const rawBrand =
    product.brand && typeof product.brand === "object"
      ? (product.brand as EntityRecord)
      : {};
  const brandId = asString(rawBrand.id || product.brand_id || product.brandId);
  const brandSlug =
    slugifyToken(rawBrand.slug || rawBrand.name || brandId) || brandId;
  const normalizedBrand = brandId
    ? {
        ...rawBrand,
        id: brandId,
        name: asString(rawBrand.name || rawBrand.title) || "ماركة",
        logo: sanitizePublicImageUrl(
          rawBrand.logo || (rawBrand.image as EntityRecord | undefined)?.url,
        ),
        url: normalizeEntityUrl(rawBrand.url, `/brands/${brandSlug}`, [
          "/brand",
          "/brands",
        ]),
      }
    : undefined;
  const normalizedCategories = asArray(product.categories)
    .map((entry) => {
      const record =
        entry && typeof entry === "object"
          ? (entry as EntityRecord)
          : { id: entry };
      const categoryId = asString(
        record.id || record.category_id || record.value,
      );
      const categoryName = asString(record.name || record.title) || "تصنيف";
      const categorySlug =
        slugifyToken(record.slug || categoryName || categoryId) || categoryId;
      if (!categoryId) return null;
      return {
        ...record,
        id: categoryId,
        name: categoryName,
        title: asString(record.title) || categoryName,
        slug: categorySlug,
        url: normalizeEntityUrl(record.url, `/categories/${categorySlug}`, [
          "/category",
          "/categories",
        ]),
        image: sanitizePublicImageUrl(record.image || record.icon),
      };
    })
    .filter(Boolean) as EntityRecord[];
  const categoryIds = toUniqueStrings([
    ...(Array.isArray(product.category_ids) ? product.category_ids : []),
    ...normalizedCategories.map((entry) => asString(entry.id)),
    asString(
      (product.category as EntityRecord | undefined)?.id ||
        product.category_id ||
        product.categoryId,
    ),
  ]);
  const primaryCategory =
    normalizedCategories[0] ||
    (categoryIds.length > 0
      ? ({
          id: categoryIds[0],
          name:
            asString((product.category as EntityRecord | undefined)?.name) ||
            "تصنيف",
          title:
            asString((product.category as EntityRecord | undefined)?.title) ||
            asString((product.category as EntityRecord | undefined)?.name) ||
            "تصنيف",
          slug:
            slugifyToken(
              (product.category as EntityRecord | undefined)?.slug ||
                categoryIds[0],
            ) || categoryIds[0],
          url: normalizeEntityUrl(
            (product.category as EntityRecord | undefined)?.url,
            `/categories/${slugifyToken((product.category as EntityRecord | undefined)?.slug || categoryIds[0]) || categoryIds[0]}`,
            ["/category", "/categories"],
          ),
          image: sanitizePublicImageUrl(
            (product.category as EntityRecord | undefined)?.image,
          ),
        } as EntityRecord)
      : undefined);

  return {
    ...product,
    id: productId,
    slug: asString(product.slug) || productSlug,
    name: asString(product.name) || "منتج افتراضي",
    description: asString(product.description) || "وصف المنتج غير متوفر بعد.",
    url,
    type: productType,
    images: normalizedImages,
    image: normalizedImages[0],
    options: normalizedOptions,
    tags: asArray(product.tags),
    rating:
      product.rating && typeof product.rating === "object"
        ? product.rating
        : { stars: 0, count: 0 },
    comments: asArray(product.comments),
    questions: asArray(product.questions),
    questions_count: Number(
      product.questions_count || asArray(product.questions).length || 0,
    ),
    quantity,
    stock: quantity,
    sold_quantity: soldQuantity,
    max_quantity: maxQuantity,
    is_hidden_quantity: isHiddenQuantity,
    is_infinite_quantity: isInfiniteQuantity,
    is_available: computedAvailability,
    is_out_of_stock: isOutOfStock,
    status,
    notify_availability: notifyAvailability,
    can_show_remained_quantity:
      typeof product.can_show_remained_quantity === "boolean"
        ? product.can_show_remained_quantity
        : !isHiddenQuantity && !isInfiniteQuantity && quantityNumber > 0,
    can_show_sold:
      typeof product.can_show_sold === "boolean"
        ? product.can_show_sold
        : soldQuantity > 0,
    has_options:
      typeof product.has_options === "boolean"
        ? product.has_options
        : variants.length > 0 || normalizedOptions.length > 0,
    is_on_sale:
      typeof product.is_on_sale === "boolean"
        ? product.is_on_sale
        : salePrice < regularPrice,
    price,
    regular_price: regularPrice,
    sale_price: salePrice,
    base_currency_price: Number(
      product.base_currency_price || salePrice || price,
    ),
    add_to_cart_label:
      asString(product.add_to_cart_label) ||
      (isOutOfStock ? "نفد المخزون" : "أضف للسلة"),
    currency,
    main_image: sanitizePublicImageUrl(
      product.main_image || normalizedImages[0]?.url,
    ),
    thumbnail: sanitizePublicImageUrl(
      product.thumbnail || normalizedImages[0]?.url,
    ),
    brand: normalizedBrand,
    brand_id: asString(
      product.brand_id || (normalizedBrand as EntityRecord | undefined)?.id,
    ),
    categories:
      normalizedCategories.length > 0
        ? normalizedCategories
        : primaryCategory
          ? [primaryCategory]
          : [],
    category_ids: categoryIds,
    category: primaryCategory,
    category_id: asString(
      product.category_id || (primaryCategory as EntityRecord | undefined)?.id,
    ),
    has_read_more:
      typeof product.has_read_more === "boolean"
        ? product.has_read_more
        : false,
    can_add_note:
      typeof product.can_add_note === "boolean" ? product.can_add_note : true,
    can_upload_file:
      typeof product.can_upload_file === "boolean"
        ? product.can_upload_file
        : false,
    has_custom_form:
      typeof product.has_custom_form === "boolean"
        ? product.has_custom_form
        : Boolean(product.has_custome_form),
    has_custome_form:
      typeof product.has_custome_form === "boolean"
        ? product.has_custome_form
        : Boolean(product.has_custom_form),
    is_donation: isDonation,
    donation: donation,
    min_amount_donating: Number(product.min_amount_donating || 0) || undefined,
    max_amount_donating:
      Number(
        product.max_amount_donating ||
          (donation as EntityRecord | undefined)?.target_amount ||
          0,
      ) || undefined,
    is_require_shipping:
      typeof product.is_require_shipping === "boolean"
        ? product.is_require_shipping
        : !isDonation && productType !== "digital",
  };
};

const normalizeCategoryForTemplate = (category: EntityRecord): EntityRecord => {
  const categoryId = asString(category.id) || "category-1";
  const categoryName = asString(category.name || category.title) || "تصنيف";
  const slug = slugifyToken(category.slug || categoryName) || categoryId;
  return {
    ...category,
    id: categoryId,
    name: categoryName,
    slug,
    description: asString(category.description) || "",
    image: sanitizePublicImageUrl(category.image || category.icon),
    url: normalizeEntityUrl(category.url, `/categories/${slug}`, [
      "/category",
      "/categories",
      "/cat",
      "/cats",
    ]),
  };
};

const normalizeBrandForTemplate = (brand: EntityRecord): EntityRecord => {
  const brandId = asString(brand.id) || "brand-1";
  const brandName = asString(brand.name || brand.title) || "ماركة";
  const slug = slugifyToken(brand.slug || brandName) || brandId;

  return {
    ...brand,
    id: brandId,
    name: brandName,
    slug,
    description: asString(brand.description) || "",
    logo: sanitizePublicImageUrl(
      brand.logo || (brand.image as EntityRecord | undefined)?.url,
    ),
    banner: asString(brand.banner || brand.cover),
    url: normalizeEntityUrl(brand.url, `/brands/${slug}`, [
      "/brand",
      "/brands",
    ]),
  };
};

const normalizeBlogCategoryForTemplate = (
  category: EntityRecord,
): EntityRecord => {
  const categoryId = asString(category.id) || "blog-category-1";
  const name = asString(category.name || category.title) || "تصنيف المدونة";
  const slug = slugifyToken(category.slug || name) || categoryId;

  return {
    ...category,
    id: categoryId,
    name,
    title: asString(category.title) || name,
    slug,
    url: normalizeEntityUrl(category.url, `/blog/categories/${slug}`, [
      "/blog/category",
      "/blog/categories",
      "/category",
      "/categories",
    ]),
  };
};

const normalizeArticleForTemplate = (article: EntityRecord): EntityRecord => {
  const imageUrl = sanitizePublicImageUrl(
    (article.image as EntityRecord | undefined)?.url || article.image,
  );
  const imageAlt =
    asString(
      (article.image as EntityRecord | undefined)?.alt || article.title,
    ) || "article image";
  const articleId =
    asString(article.id) || asString(article.key) || "blog-article";
  const articleSlug = slugifyToken(article.slug || article.title) || articleId;
  const url = normalizeEntityUrl(article.url, `/blog/${articleSlug}`, [
    "/blog",
    "/article",
    "/articles",
  ]);

  return {
    ...article,
    id: articleId,
    key: asString(article.key) || articleId,
    title: asString(article.title) || "مقالة",
    summary: asString(article.summary) || "",
    body:
      asString(article.body || article.content) ||
      "<p>محتوى المقالة غير متوفر.</p>",
    url,
    slug: asString(article.slug) || articleSlug,
    image: { url: imageUrl, alt: imageAlt },
    has_image: Boolean(imageUrl),
    author:
      article.author && typeof article.author === "object"
        ? article.author
        : { name: "VTDR", url: "#" },
    created_at: asString(article.created_at) || new Date().toISOString(),
    tags: asArray(article.tags),
    likes_count: Number(article.likes_count || 0),
    comments_count: Number(article.comments_count || 0),
  };
};

const normalizeStaticPageForTemplate = (page: EntityRecord): EntityRecord => {
  const pageId = asString(page.id) || "page-1";
  const title = asString(page.title || page.name) || "صفحة";
  const slug = slugifyToken(page.slug || pageId || title) || pageId;
  return {
    ...page,
    id: pageId,
    title,
    slug,
    content:
      asString(page.content || page.description) ||
      "<p>هذه صفحة افتراضية من بيئة المعاينة.</p>",
    url: normalizeEntityUrl(page.url, `/pages/${slug}`, ["/page", "/pages"]),
  };
};

const makeMoney = (amount: number, currency: string) => {
  const normalized = Number.isFinite(amount) ? amount : 0;
  return {
    amount: normalized,
    currency,
    getMoney: () => ({ amount: normalized, currency }),
    toString: () => String(normalized),
    valueOf: () => normalized,
  };
};

const normalizeCartItemForTemplate = (
  item: EntityRecord,
  currency: string,
): EntityRecord => {
  const unitPrice = readMoneyAmount(
    item.price || item.unit_price || item.sale_price,
  );
  const productPrice =
    readMoneyAmount(item.product_price || item.regular_price) || unitPrice;
  const originalPrice = readMoneyAmount(item.original_price) || productPrice;
  const quantity = Math.max(1, Number(item.quantity || 1));
  const total = readMoneyAmount(item.total) || unitPrice * quantity;
  const totalSpecial = readMoneyAmount(item.total_special_price) || total;
  const id = asString(item.id) || asString(item.product_id) || "cart-item";
  const productId = asString(item.product_id) || id;
  const productName = asString(item.product_name || item.name) || "منتج";
  const productSlug =
    slugifyToken(item.slug || productName || productId) || productId;
  const url = normalizeEntityUrl(item.url, `/products/${productSlug}`, [
    "/product",
    "/products",
  ]);
  const productImage = sanitizePublicImageUrl(
    item.product_image ||
      (item.image as EntityRecord | undefined)?.url ||
      item.image,
  );

  return {
    ...item,
    id,
    product_id: productId,
    product_name: productName,
    product_image: productImage,
    url,
    quantity,
    max_quantity: Math.max(1, Number(item.max_quantity || 99)),
    type: asString(item.type) || "product",
    is_hidden_quantity: Boolean(item.is_hidden_quantity),
    is_available: item.is_available !== false,
    detailed_offers: Array.isArray(item.detailed_offers)
      ? item.detailed_offers
      : [],
    offer:
      item.offer && typeof item.offer === "object" ? item.offer : undefined,
    has_discount: Boolean(item.has_discount ?? unitPrice < productPrice),
    is_on_sale: Boolean(item.is_on_sale ?? unitPrice < originalPrice),
    special_price: readMoneyAmount(
      item.special_price || Math.max(0, productPrice - unitPrice),
    ),
    price: makeMoney(unitPrice, currency),
    unit_price: unitPrice,
    product_price: makeMoney(productPrice, currency),
    original_price: makeMoney(originalPrice, currency),
    total: makeMoney(total, currency),
    total_special_price: makeMoney(totalSpecial, currency),
  };
};

const normalizeCartForTemplate = (
  cart: EntityRecord,
  currency: string,
): EntityRecord => {
  const items = asArray(cart.items).map((entry) =>
    normalizeCartItemForTemplate(entry, currency),
  );
  const count = items.reduce(
    (sum, entry) => sum + Number(entry.quantity || 0),
    0,
  );
  const subTotal = readMoneyAmount(
    cart.sub_total || (cart.totals as EntityRecord | undefined)?.subtotal,
  );
  const optionsTotal = readMoneyAmount(cart.options_total);
  const discount = readMoneyAmount(cart.total_discount || cart.discount);
  const taxAmount = readMoneyAmount(cart.tax_amount);
  const shippingCost = readMoneyAmount(cart.real_shipping_cost);
  const total =
    readMoneyAmount(cart.total) ||
    Math.max(0, subTotal + optionsTotal - discount + taxAmount + shippingCost);
  const freeShippingBar =
    cart.free_shipping_bar && typeof cart.free_shipping_bar === "object"
      ? cart.free_shipping_bar
      : {
          minimum_amount: 500,
          has_free_shipping: false,
          percent: 0,
          remaining: 500,
        };

  return {
    ...cart,
    id: asString(cart.id) || "default",
    currency,
    items,
    options: Array.isArray(cart.options) ? cart.options : [],
    count,
    totals: {
      items_count: count,
      subtotal: subTotal,
    },
    sub_total: subTotal,
    options_total: optionsTotal,
    total_discount: discount,
    discount,
    coupon: asString(cart.coupon),
    tax_amount: taxAmount,
    real_shipping_cost: shippingCost,
    has_shipping: Boolean(cart.has_shipping ?? shippingCost > 0),
    is_require_shipping: Boolean(cart.is_require_shipping ?? items.length > 0),
    total,
    gift:
      cart.gift && typeof cart.gift === "object"
        ? cart.gift
        : { enabled: false, type: "physical", text: "" },
    free_shipping_bar: {
      minimum_amount: Number(
        (freeShippingBar as EntityRecord).minimum_amount || 500,
      ),
      has_free_shipping: Boolean(
        (freeShippingBar as EntityRecord).has_free_shipping,
      ),
      percent: Number((freeShippingBar as EntityRecord).percent || 0),
      remaining: Number((freeShippingBar as EntityRecord).remaining || 0),
    },
  };
};

const normalizeOrderForTemplate = (
  order: EntityRecord,
  currency: string,
): EntityRecord => {
  const orderId = asString(order.id) || "order-vtdr";
  const referenceId =
    asString(order.reference_id) || `VTDR-${orderId.slice(-6)}`;
  const customer =
    order.customer && typeof order.customer === "object"
      ? (order.customer as EntityRecord)
      : {};

  return {
    ...order,
    id: orderId,
    reference_id: referenceId,
    url: normalizeEntityUrl(order.url, `/customer/orders/${orderId}`, [
      "/order",
      "/orders",
    ]),
    instructions: asString(order.instructions),
    email_sent: Boolean(order.email_sent),
    customer: {
      id: asString(customer.id) || "customer-vtdr",
      name: asString(customer.name) || "عميل المتجر",
      email: asString(customer.email) || "customer@example.com",
      mobile: asString(customer.mobile) || "+966500000000",
    },
    subtotal: readMoneyAmount(order.subtotal),
    discount: readMoneyAmount(order.discount),
    shipping_cost: readMoneyAmount(order.shipping_cost),
    tax_amount: readMoneyAmount(order.tax_amount),
    total: readMoneyAmount(order.total),
    currency,
  };
};

const splitCustomerName = (
  value: unknown,
): { firstName: string; lastName: string } => {
  const fullName = asString(value).trim();
  if (!fullName) return { firstName: "عميل", lastName: "VTDR" };
  const parts = fullName.split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
};

const normalizeUserForCustomerPages = (
  store: EntityRecord,
  order: EntityRecord | null,
): EntityRecord => {
  const fallbackCustomer =
    order && typeof order.customer === "object"
      ? (order.customer as EntityRecord)
      : {};
  const { firstName, lastName } = splitCustomerName(fallbackCustomer.name);
  const locale = asString(store.locale) || "ar-SA";
  const languageCode = locale.split("-")[0] || "ar";
  const languageDir = locale.startsWith("ar") ? "rtl" : "ltr";
  const currencyCode = asString(store.currency) || "SAR";

  return {
    id: asString(fallbackCustomer.id) || "vtdr_customer_1",
    type: "user",
    is_authenticated: true,
    is_notifiable: true,
    name: asString(fallbackCustomer.name) || `${firstName} ${lastName}`.trim(),
    first_name: firstName || "عميل",
    last_name: lastName || "",
    email: asString(fallbackCustomer.email) || "customer@example.com",
    mobile: asString(fallbackCustomer.mobile) || "+966500000000",
    birthday: "1990-01-01",
    gender: "male",
    avatar: DEFAULT_IMAGE,
    language: {
      code: languageCode,
      dir: languageDir,
    },
    language_code: languageCode,
    currency: {
      code: currencyCode,
      symbol: currencyCode === "SAR" ? "ر.س" : currencyCode,
    },
    can_access_wallet: true,
    points: 120,
    loyalty_points: 120,
  };
};

const normalizeOrderForCustomerTemplate = (
  order: EntityRecord,
  currency: string,
): EntityRecord => {
  const base = normalizeOrderForTemplate(order, currency);
  const statusName =
    asString(
      (order.status as EntityRecord | undefined)?.name || order.status,
    ) || "جديد";
  const statusColor =
    asString((order.status as EntityRecord | undefined)?.color) || "#0ea5e9";
  const statusIcon =
    asString((order.status as EntityRecord | undefined)?.icon) ||
    "sicon-packed-box";
  const shippingRaw =
    order.shipping && typeof order.shipping === "object"
      ? (order.shipping as EntityRecord)
      : {};
  const orderId = asString(base.id) || "order-vtdr";
  const orderItems = asArray(order.items).map((item, index) => {
    const product =
      item.product && typeof item.product === "object"
        ? (item.product as EntityRecord)
        : {};
    return {
      ...item,
      id: asString(item.id) || `order-item-${index + 1}`,
      name: asString(item.name || item.product_name) || `منتج ${index + 1}`,
      image: sanitizePublicImageUrl(item.image || item.product_image),
      quantity: Number(item.quantity || 1),
      price: {
        amount: readMoneyAmount(item.price),
        currency,
      },
      total: {
        amount: readMoneyAmount(item.total),
        currency,
      },
      product: {
        id: asString(product.id || item.product_id) || `product-${index + 1}`,
        url:
          asString(product.url || item.url) ||
          `/products/${asString(item.product_id || item.id || index + 1)}`,
        type: asString(product.type) || "product",
      },
      options: Array.isArray(item.options) ? item.options : [],
      attachments: Array.isArray(item.attachments) ? item.attachments : [],
      product_reservations: Array.isArray(item.product_reservations)
        ? item.product_reservations
        : [],
      detailed_offers: Array.isArray(item.detailed_offers)
        ? item.detailed_offers
        : [],
    } as EntityRecord;
  });

  return {
    ...base,
    sub_total: readMoneyAmount(order.sub_total || order.subtotal),
    status: {
      name: statusName,
      icon: statusIcon,
      color: statusColor,
    },
    tax: {
      amount: readMoneyAmount(order.tax_amount),
      percent: 15,
    },
    shipping: {
      id: asString(shippingRaw.id || shippingRaw.method_id) || "shipping",
      name:
        asString(shippingRaw.name || shippingRaw.method_name) || "شحن قياسي",
      number: asString(shippingRaw.number),
      logo: asString(shippingRaw.logo) || undefined,
      cost: {
        amount: readMoneyAmount(order.shipping_cost || shippingRaw.cost),
        currency,
      },
    },
    items: orderItems,
    options: Array.isArray(order.options) ? order.options : [],
    packages: [
      {
        shipping_company: {
          name:
            asString(shippingRaw.name || shippingRaw.method_name) ||
            "شركة الشحن",
          logo: asString(shippingRaw.logo) || undefined,
          number: asString(shippingRaw.number),
          tracing_link: asString(
            shippingRaw.tracing_link || shippingRaw.tracking_url,
          ),
        },
        branch: null,
        is_delivered: ["delivered", "completed"].includes(
          asString(order.status).toLowerCase(),
        ),
        status: {
          name: statusName,
          icon: statusIcon,
          color: statusColor,
        },
        items: orderItems,
      },
    ],
    links:
      Array.isArray(order.links) && order.links.length > 0
        ? order.links
        : [
            {
              url: `/customer/orders/${orderId}/invoice`,
              label: "طباعة الفاتورة",
              type: "print",
            },
          ],
    print_url: () => `/customer/orders/${orderId}/invoice`,
    can_reorder: order.can_reorder !== false,
    can_cancel: order.can_cancel !== false,
    can_rate: Boolean(order.can_rate),
    is_pending_payment:
      asString(order.payment_status).toLowerCase() === "pending",
    pending_payment_ends_in: Number(order.pending_payment_ends_in || 0),
    is_rated: Boolean(order.is_rated),
    rating:
      order.rating && typeof order.rating === "object" ? order.rating : null,
  };
};

const normalizeCheckoutForTemplate = (
  checkout: EntityRecord,
  cart: EntityRecord,
  currency: string,
  forcedStep: string,
): EntityRecord => {
  const rawShippingMethods = asArray(checkout.available_shipping_methods)
    .map((entry) => ({
      id: asString(entry.id),
      name: asString(entry.name || "طريقة شحن"),
      description: asString(entry.description),
      cost: readMoneyAmount(entry.cost),
      currency: asString(entry.currency) || currency,
    }))
    .filter((entry) => entry.id);
  const shippingMethods =
    rawShippingMethods.length > 0
      ? rawShippingMethods
      : [
          {
            id: "standard",
            name: "شحن قياسي",
            description: "التوصيل خلال 2-4 أيام عمل",
            cost: 0,
            currency,
          },
          {
            id: "express",
            name: "شحن سريع",
            description: "التوصيل خلال 24 ساعة",
            cost: 25,
            currency,
          },
          {
            id: "pickup",
            name: "استلام من الفرع",
            description: "استلام ذاتي من نقطة البيع",
            cost: 0,
            currency,
          },
        ];

  const rawPaymentMethods = asArray(checkout.available_payment_methods)
    .map((entry) => ({
      id: asString(entry.id),
      name: asString(entry.name || "وسيلة دفع"),
      type: asString(entry.type || "generic"),
    }))
    .filter((entry) => entry.id);
  const paymentMethods =
    rawPaymentMethods.length > 0
      ? rawPaymentMethods
      : [
          { id: "cod", name: "الدفع عند الاستلام", type: "cash" },
          { id: "mada", name: "مدى", type: "card" },
          { id: "visa-master", name: "بطاقة ائتمانية", type: "card" },
          { id: "apple-pay", name: "Apple Pay", type: "wallet" },
        ];

  const customerRaw =
    checkout.customer && typeof checkout.customer === "object"
      ? (checkout.customer as EntityRecord)
      : {};
  const customer = {
    name: asString(customerRaw.name),
    email: asString(customerRaw.email),
    mobile: asString(customerRaw.mobile),
  };
  const addressRaw =
    checkout.address && typeof checkout.address === "object"
      ? (checkout.address as EntityRecord)
      : {};
  const address = {
    country: asString(addressRaw.country) || "SA",
    city: asString(addressRaw.city),
    district: asString(addressRaw.district),
    street: asString(addressRaw.street),
    postal_code: asString(addressRaw.postal_code),
  };

  const shippingRaw =
    checkout.shipping && typeof checkout.shipping === "object"
      ? (checkout.shipping as EntityRecord)
      : {};
  const selectedShipping =
    shippingMethods.find(
      (entry) => entry.id === asString(shippingRaw.method_id),
    ) || null;
  const shippingCost = readMoneyAmount(
    shippingRaw.cost ?? (selectedShipping ? selectedShipping.cost : 0),
  );
  const shipping = {
    method_id: selectedShipping
      ? selectedShipping.id
      : asString(shippingRaw.method_id),
    method_name: selectedShipping
      ? selectedShipping.name
      : asString(shippingRaw.method_name),
    cost: shippingCost,
    currency,
  };

  const paymentRaw =
    checkout.payment && typeof checkout.payment === "object"
      ? (checkout.payment as EntityRecord)
      : {};
  const selectedPayment =
    paymentMethods.find(
      (entry) => entry.id === asString(paymentRaw.method_id),
    ) || null;
  const payment = {
    method_id: selectedPayment
      ? selectedPayment.id
      : asString(paymentRaw.method_id),
    method_name: selectedPayment
      ? selectedPayment.name
      : asString(paymentRaw.method_name),
    type: selectedPayment ? selectedPayment.type : asString(paymentRaw.type),
  };

  const summaryRaw =
    checkout.summary && typeof checkout.summary === "object"
      ? (checkout.summary as EntityRecord)
      : {};
  const summary = {
    subtotal: readMoneyAmount(summaryRaw.subtotal || cart.sub_total),
    options_total: readMoneyAmount(
      summaryRaw.options_total || cart.options_total,
    ),
    discount: readMoneyAmount(summaryRaw.discount || cart.total_discount),
    tax_amount: readMoneyAmount(summaryRaw.tax_amount || cart.tax_amount),
    shipping_cost: shippingCost,
    total: readMoneyAmount(
      summaryRaw.total ||
        readMoneyAmount(cart.sub_total) +
          readMoneyAmount(cart.options_total) -
          readMoneyAmount(cart.total_discount) +
          readMoneyAmount(cart.tax_amount) +
          shippingCost,
    ),
    currency,
  };

  const addressDone = Boolean(
    customer.name &&
    customer.email &&
    customer.mobile &&
    address.city &&
    address.street &&
    address.country,
  );
  const shippingDone = Boolean(shipping.method_id);
  const paymentDone = Boolean(payment.method_id);

  const validSteps = ["address", "shipping", "payment", "review"];
  const requestedStep = validSteps.includes(forcedStep)
    ? forcedStep
    : asString(checkout.step || "address");
  const maxReachableStep = !addressDone
    ? "address"
    : !shippingDone
      ? "shipping"
      : !paymentDone
        ? "payment"
        : "review";
  const stepOrder: Record<string, number> = {
    address: 0,
    shipping: 1,
    payment: 2,
    review: 3,
  };
  let step = validSteps.includes(requestedStep) ? requestedStep : "address";
  if ((stepOrder[step] ?? 0) > (stepOrder[maxReachableStep] ?? 0)) {
    step = maxReachableStep;
  }

  const steps = validSteps.map((id, index) => ({
    id,
    order: index + 1,
    is_current: id === step,
    is_done:
      (id === "address" && addressDone) ||
      (id === "shipping" && shippingDone) ||
      (id === "payment" && paymentDone) ||
      (id === "review" &&
        addressDone &&
        shippingDone &&
        paymentDone &&
        Number(cart.count || 0) > 0),
  }));

  const canConfirm =
    addressDone && shippingDone && paymentDone && Number(cart.count || 0) > 0;

  return {
    ...checkout,
    id: asString(checkout.id) || "default",
    status: asString(checkout.status) || "active",
    step,
    steps,
    customer,
    address,
    shipping,
    payment,
    available_shipping_methods: shippingMethods,
    available_payment_methods: paymentMethods,
    summary,
    can_confirm: canConfirm,
    is_ready_to_confirm: canConfirm,
  };
};

const normalizeLoyaltyForTemplate = (
  loyaltyRaw: EntityRecord,
  products: EntityRecord[],
): EntityRecord => {
  const mappedProducts = products.slice(0, 6).map((product, index) => ({
    id: Number(product.id || index + 1),
    name: asString(product.name) || `منتج ${index + 1}`,
    description: asString(
      product.short_description || product.description || "",
    ),
    image: sanitizePublicImageUrl(
      product.main_image || product.thumbnail || product.image || DEFAULT_IMAGE,
    ),
    url:
      asString(product.url) || `/products/${asString(product.id || index + 1)}`,
    cost_points: 150 + index * 25,
  }));

  const defaultPoints = [
    {
      name: "مشاركة رابط المتجر",
      description: "شارك رابط المتجر واكسب نقاطًا إضافية",
      type: "share",
      url: "/",
      points: 20,
      icon: "sicon-share",
      color: "#0ea5e9",
    },
    {
      name: "إكمال الملف الشخصي",
      description: "أكمل بيانات ملفك الشخصي لتحصل على نقاط ترحيبية",
      type: "profile",
      url: "/customer/profile",
      points: 50,
      icon: "sicon-user-circle",
      color: "#10b981",
    },
    {
      name: "كل طلب مكتمل",
      description: "كل عملية شراء مكتملة تمنحك نقاط ولاء",
      type: "order",
      url: "/products",
      points: 15,
      icon: "sicon-packed-box",
      color: "#f59e0b",
    },
  ];

  const points = asArray(loyaltyRaw.points);
  const prizes = asArray(loyaltyRaw.prizes);
  const firstPrizeGroup =
    prizes[0] && typeof prizes[0] === "object"
      ? (prizes[0] as EntityRecord)
      : null;
  const firstPrizeItem = firstPrizeGroup
    ? (asArray(firstPrizeGroup.items)[0] as EntityRecord | undefined)
    : undefined;

  return {
    ...loyaltyRaw,
    id: asString(loyaltyRaw.id) || "loyalty-default",
    name: asString(loyaltyRaw.name) || "برنامج الولاء",
    description:
      asString(loyaltyRaw.description) ||
      "اجمع النقاط مع كل تفاعل واستبدلها بمزايا داخل المتجر.",
    image: sanitizePublicImageUrl(loyaltyRaw.image || DEFAULT_IMAGE),
    promotion_title:
      asString(loyaltyRaw.promotion_title) || "استبدل نقاطك بمكافآت فورية",
    promotion_description:
      asString(loyaltyRaw.promotion_description) ||
      "كلما زادت نقاطك زادت خيارات الاستبدال المتاحة لك.",
    points: points.length > 0 ? points : defaultPoints,
    prizes:
      prizes.length > 0
        ? prizes
        : [
            {
              title: "منتجات مجانية",
              type: "free_product",
              items: mappedProducts,
            },
            {
              title: "قسائم خصم",
              type: "coupon_discount",
              items: [
                {
                  id: 9001,
                  name: "قسيمة خصم 10%",
                  description: "خصم مباشر على سلة الشراء",
                  image: DEFAULT_IMAGE,
                  url: "/cart",
                  cost_points: 100,
                },
              ],
            },
          ],
    prize: firstPrizeItem
      ? firstPrizeItem
      : {
          title: mappedProducts[0]?.name || "قسيمة خصم",
          points: Number(mappedProducts[0]?.cost_points || 100),
        },
  };
};

const normalizeLandingForTemplate = (
  landingRaw: EntityRecord,
  products: EntityRecord[],
): EntityRecord => {
  const mappedProducts = products.slice(0, 8).map((product, index) => ({
    id: asString(product.id) || `landing-product-${index + 1}`,
    name: asString(product.name) || `منتج ${index + 1}`,
    url:
      asString(product.url) || `/products/${asString(product.id || index + 1)}`,
    image: sanitizePublicImageUrl(
      product.main_image || product.thumbnail || product.image || DEFAULT_IMAGE,
    ),
  }));

  return {
    ...landingRaw,
    id: asString(landingRaw.id) || "landing-default",
    title: asString(landingRaw.title) || "عروض المتجر المميزة",
    content:
      asString(landingRaw.content) ||
      "تجربة تسوق مركزة تعرض أبرز المنتجات والعروض في صفحة واحدة.",
    products: mappedProducts,
    offer_ends_at:
      asString(landingRaw.offer_ends_at) ||
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    testimonials_type: asString(landingRaw.testimonials_type || ""),
    show_quantity:
      typeof landingRaw.show_quantity === "boolean"
        ? landingRaw.show_quantity
        : false,
    is_slider:
      typeof landingRaw.is_slider === "boolean" ? landingRaw.is_slider : true,
    is_expired: Boolean(landingRaw.is_expired),
    show_store_features:
      typeof landingRaw.show_store_features === "boolean"
        ? landingRaw.show_store_features
        : true,
  };
};

export const applyPreviewContext = (
  context: Record<string, unknown>,
  target: ResolvedPreviewTarget,
  query: Record<string, unknown>,
) => {
  const page =
    context.page && typeof context.page === "object"
      ? (context.page as EntityRecord)
      : {};
  const defaultCurrency =
    asString((context.store as EntityRecord | undefined)?.currency) || "SAR";
  const products = asArray(context.products).map((entry) =>
    normalizeProductForTemplate(entry, defaultCurrency),
  );
  const categories = asArray(context.categories).map((entry) =>
    normalizeCategoryForTemplate(entry),
  );
  const brands = asArray(context.brands).map((entry) =>
    normalizeBrandForTemplate(entry),
  );
  const offersById = new Map<string, EntityRecord>();
  for (const source of [
    asArray(context.offers),
    asArray(context.specialOffers),
    asArray((context as EntityRecord).special_offers),
  ]) {
    for (const entry of source) {
      const normalized = normalizeOfferForTemplate(entry, defaultCurrency);
      const key =
        asString(normalized.id || normalized.slug) ||
        `offer-${offersById.size + 1}`;
      offersById.set(key, normalized);
    }
  }
  const offers = Array.from(offersById.values());
  const blogArticles = asArray(context.blog_articles).map((entry) =>
    normalizeArticleForTemplate(entry),
  );
  const blogCategories = asArray(context.blog_categories).map((entry) =>
    normalizeBlogCategoryForTemplate(entry),
  );
  const pages = asArray(context.pages).map((entry) =>
    normalizeStaticPageForTemplate(entry),
  );

  context.products = products;
  context.categories = categories;
  context.brands = brands;
  context.offers = offers;
  context.specialOffers = offers;
  (context as EntityRecord).special_offers = offers;
  context.blog_articles = blogArticles;
  context.blog_categories = blogCategories;
  context.pages = pages;

  const storeEntity = normalizeStoreForRuntime(
    context.store && typeof context.store === "object"
      ? (context.store as EntityRecord)
      : {},
  );
  const normalizedOrders = asArray(context.orders).map((entry) =>
    normalizeOrderForCustomerTemplate(entry, defaultCurrency),
  );
  const rawCart =
    context.cart && typeof context.cart === "object"
      ? (context.cart as EntityRecord)
      : {};
  const normalizedCart = normalizeCartForTemplate(rawCart, defaultCurrency);
  const rawCheckout =
    context.checkout && typeof context.checkout === "object"
      ? (context.checkout as EntityRecord)
      : {};
  const requestedStepGlobal = asString(
    query.step || query.checkout_step,
  ).toLowerCase();
  const normalizedCheckout = normalizeCheckoutForTemplate(
    rawCheckout,
    normalizedCart,
    defaultCurrency,
    requestedStepGlobal,
  );
  const normalizedUser = normalizeRuntimeUser(storeEntity, context.user);
  const customerAlias = normalizeCustomerAliasFromUser(normalizedUser);
  const loyaltyRaw =
    context.loyalty && typeof context.loyalty === "object"
      ? (context.loyalty as EntityRecord)
      : {};
  const landingRaw =
    context.landing && typeof context.landing === "object"
      ? (context.landing as EntityRecord)
      : {};
  const normalizedLoyalty = normalizeLoyaltyForTemplate(loyaltyRaw, products);
  const normalizedLanding = normalizeLandingForTemplate(landingRaw, products);

  context.store = storeEntity;
  context.orders = normalizedOrders;
  context.cart = normalizedCart;
  context.checkout = normalizedCheckout;
  context.gift = normalizedCart.gift;
  context.user = normalizedUser;
  context.customer = customerAlias;
  context.loyalty = normalizedLoyalty;
  context.landing = normalizedLanding;
  context.notifications = Array.isArray(context.notifications)
    ? context.notifications
    : [];
  context.translations = {
    ...PREVIEW_TRANSLATION_DEFAULTS,
    ...(context.translations && typeof context.translations === "object"
      ? (context.translations as EntityRecord)
      : {}),
  };
  (context as any).blog = {
    articles: blogArticles,
    categories: blogCategories,
  };

  if (target.pageId === "checkout") {
    const rawCart =
      context.cart && typeof context.cart === "object"
        ? (context.cart as EntityRecord)
        : {};
    const rawCheckout =
      context.checkout && typeof context.checkout === "object"
        ? (context.checkout as EntityRecord)
        : {};
    const normalizedCart = normalizeCartForTemplate(rawCart, defaultCurrency);
    const requestedStep = asString(
      query.step || query.checkout_step,
    ).toLowerCase();
    const normalizedCheckout = normalizeCheckoutForTemplate(
      rawCheckout,
      normalizedCart,
      defaultCurrency,
      requestedStep,
    );

    context.cart = normalizedCart;
    context.checkout = normalizedCheckout;
    context.gift = normalizedCart.gift;
    context.page = {
      ...page,
      id: "checkout",
      template_id: "checkout",
      title: "إتمام الطلب",
      slug: "checkout",
      url: "/checkout",
    };
    return;
  }

  if (target.pageId === "cart") {
    const rawCart =
      context.cart && typeof context.cart === "object"
        ? (context.cart as EntityRecord)
        : {};
    const normalizedCart = normalizeCartForTemplate(rawCart, defaultCurrency);
    context.cart = normalizedCart;
    context.gift = normalizedCart.gift;
    context.page = {
      ...page,
      id: "cart",
      template_id: "cart",
      title: "السلة",
      slug: "cart",
      url: "/cart",
    };
    return;
  }

  if (target.pageId === "thank-you") {
    const orders = asArray(context.orders);
    const requestedOrderRef = asString(query.order_id || query.orderId);
    const selectedOrder = resolveEntityByRef(orders, requestedOrderRef) ||
      orders[orders.length - 1] || {
        id: "order-vtdr",
        reference_id: "VTDR-000001",
        url: "/customer/orders/order-vtdr",
        email_sent: false,
        customer: { email: "customer@example.com", name: "عميل المتجر" },
        total: 0,
      };
    const order = normalizeOrderForTemplate(selectedOrder, defaultCurrency);
    context.order = order;
    context.messages = Array.isArray(context.messages) ? context.messages : [];
    context.thank_you_title =
      asString((context as any).thank_you_title) || "شكرًا لتسوقك معنا";
    context.page = {
      ...page,
      id: asString(order.id) || "thank-you",
      template_id: "thank-you",
      title: asString((context as any).thank_you_title) || "شكرا لك",
      slug: "thank-you",
      url: "/thank-you",
    };
    return;
  }

  if (target.pageId === "loyalty") {
    const user = normalizeUserForCustomerPages(
      storeEntity,
      normalizedOrders[0] || null,
    );
    context.user = user;
    context.customer = normalizeCustomerAliasFromUser(user);
    context.page = {
      ...page,
      id: "loyalty",
      template_id: "loyalty",
      title:
        asString((context.loyalty as EntityRecord | undefined)?.name) ||
        "برنامج الولاء",
      slug: "loyalty",
      url: "/loyalty",
    };
    return;
  }

  if (target.pageId === "landing-page") {
    context.page = {
      ...page,
      id:
        asString((context.landing as EntityRecord | undefined)?.id) ||
        "landing-page",
      template_id: "landing-page",
      title:
        asString((context.landing as EntityRecord | undefined)?.title) ||
        "الصفحة المقصودة",
      slug: "landing-page",
      url: "/landing-page",
    };
    return;
  }

  if (target.pageId.startsWith("customer/")) {
    const ordersRaw = asArray(context.orders);
    const normalizedOrders = ordersRaw.map((entry) =>
      normalizeOrderForCustomerTemplate(entry, defaultCurrency),
    );
    const requestedOrderRef = asString(
      query.order_id || query.orderId || target.entityRef,
    );
    const selectedOrder =
      resolveEntityByRef(normalizedOrders, requestedOrderRef) ||
      normalizedOrders[0] ||
      null;
    const storeEntityForUser =
      context.store && typeof context.store === "object"
        ? (context.store as EntityRecord)
        : {};
    const user = normalizeUserForCustomerPages(
      storeEntityForUser,
      selectedOrder,
    );

    const notifications = asArray(context.notifications);
    const normalizedNotifications = (
      notifications.length > 0
        ? notifications
        : normalizedOrders.slice(0, 10).map((order, index) => ({
            id: `notification-order-${asString(order.id) || index + 1}`,
            title: `تم تحديث الطلب ${asString(order.reference_id) || asString(order.id)}`,
            sub_title: "يمكنك متابعة حالة الطلب من صفحة الطلبات",
            url:
              asString(order.url) || `/customer/orders/${asString(order.id)}`,
            is_new: index === 0,
            date: asString(order.updated_at || order.created_at),
          }))
    ) as EntityRecord[];
    (
      normalizedNotifications as EntityRecord[] & { next_page: string | null }
    ).next_page = null;

    context.user = user;
    context.customer = normalizeCustomerAliasFromUser(user);
    context.orders = normalizedOrders as unknown as EntityRecord[];
    context.notifications =
      normalizedNotifications as unknown as EntityRecord[];
    context.custom_fields = Array.isArray(context.custom_fields)
      ? context.custom_fields
      : [];

    if (target.pageId === "customer/orders/single") {
      const order =
        selectedOrder || normalizeOrderForCustomerTemplate({}, defaultCurrency);
      context.order = order;
      context.page = {
        ...page,
        id: asString(order.id) || "customer-order",
        template_id: "customer/orders/single",
        title: `طلب ${asString(order.reference_id || order.id) || ""}`.trim(),
        slug: "customer.orders.single",
        url: asString(order.url) || "/customer/orders",
      };
      return;
    }

    if (target.pageId === "customer/orders/index") {
      context.page = {
        ...page,
        id: "customer-orders",
        template_id: "customer/orders/index",
        title: "طلباتي",
        slug: "customer.orders",
        url: "/customer/orders",
      };
      return;
    }

    if (target.pageId === "customer/wishlist") {
      context.page = {
        ...page,
        id: "customer-wishlist",
        template_id: "customer/wishlist",
        title: "المفضلة",
        slug: "customer.wishlist",
        url: "/customer/wishlist",
      };
      return;
    }

    if (target.pageId === "customer/notifications") {
      context.page = {
        ...page,
        id: "customer-notifications",
        template_id: "customer/notifications",
        title: "الإشعارات",
        slug: "customer.notifications",
        url: "/customer/notifications",
      };
      return;
    }

    if (target.pageId === "customer/wallet") {
      context.page = {
        ...page,
        id: "customer-wallet",
        template_id: "customer/wallet",
        title: "المحفظة",
        slug: "customer.wallet",
        url: "/customer/wallet",
      };
      return;
    }

    context.page = {
      ...page,
      id: "customer-profile",
      template_id: "customer/profile",
      title: "الملف الشخصي",
      slug: "customer.profile",
      url: "/customer/profile",
    };
    return;
  }

  if (target.pageId === "product/single") {
    const selected = resolveEntityByRef(products, target.entityRef) || {};
    const product = normalizeProductForTemplate(selected, defaultCurrency);
    const selectedOfferRef = asString(
      query.offer_id ||
        query.offerId ||
        query.offer ||
        query.special_offer ||
        query.special_offer_id,
    );
    const offer = resolveOfferForProduct(product, offers, selectedOfferRef);
    const similarProducts = resolveRelatedProductsForPreview(
      product,
      products,
      12,
    );

    context.product = product;
    context.offer = offer;
    (context as EntityRecord).special_offer = offer;
    context.related = similarProducts;
    (context as EntityRecord).similar_products = similarProducts;
    context.page = {
      ...page,
      id: asString(product.id) || target.entityRef || "product",
      template_id: "product/single",
      title: asString(product.name) || "المنتج",
      slug: "product.single",
      url:
        asString(product.url) ||
        `/products/${asString(product.id) || target.entityRef || ""}`,
    };
    return;
  }

  if (target.pageId === "product/index") {
    const sourceResolution = resolveProductListingSource(target, query);
    const selectedCategory = sourceResolution.categoryRef
      ? resolveEntityByRef(categories, sourceResolution.categoryRef)
      : null;
    const selectedBrand = sourceResolution.brandRef
      ? resolveEntityByRef(brands, sourceResolution.brandRef)
      : null;
    const effectiveResolution: ProductListingSourceResolution = {
      ...sourceResolution,
      categoryRef:
        asString((selectedCategory || {}).id) || sourceResolution.categoryRef,
      brandRef: asString((selectedBrand || {}).id) || sourceResolution.brandRef,
      sourceValue:
        sourceResolution.sourceValue ||
        asString((selectedCategory || {}).id) ||
        asString((selectedBrand || {}).id),
    };
    const selectedSort = sourceResolution.sortKey || "ourSuggest";
    const sortOptions = [
      { id: "ourSuggest", name: "المقترح" },
      { id: "bestSell", name: "الأكثر مبيعًا" },
      { id: "topRated", name: "الأعلى تقييمًا" },
      { id: "priceFromTopToLow", name: "السعر من الأعلى للأقل" },
      { id: "priceFromLowToTop", name: "السعر من الأقل للأعلى" },
    ].map((entry) => ({
      ...entry,
      is_selected: entry.id === selectedSort,
    }));
    const scopedProducts = filterProductsForListing(
      products,
      effectiveResolution,
    );
    const productList = [...scopedProducts] as EntityRecord[] & {
      next_page: string | null;
    };
    productList.next_page = null;
    const pageTitle = selectedCategory
      ? asString(selectedCategory.name || selectedCategory.title) || "المنتجات"
      : selectedBrand
        ? asString(selectedBrand.name || selectedBrand.title) || "المنتجات"
        : "المنتجات";
    const pageId =
      asString((selectedCategory || {}).id) ||
      asString((selectedBrand || {}).id) ||
      sourceResolution.sourceValue ||
      "products";
    const pageUrl = selectedCategory
      ? asString(selectedCategory.url) ||
        `/categories/${asString(selectedCategory.slug || selectedCategory.id)}`
      : selectedBrand
        ? asString(selectedBrand.url) ||
          `/brands/${asString(selectedBrand.slug || selectedBrand.id)}`
        : "/products";

    context.products = productList;
    context.category = selectedCategory;
    context.brand = selectedBrand;
    context.filters = true;
    context.search_query = sourceResolution.searchQuery || undefined;
    context.sort_options = sortOptions;

    context.page = {
      ...page,
      id: pageId,
      template_id: "product/index",
      title: pageTitle,
      slug: sourceResolution.source || "product.index",
      url: pageUrl,
    };
    return;
  }

  if (target.pageId === "brands/index") {
    context.brands = groupBrandsForTemplate(brands);
    context.page = {
      ...page,
      id: "brands",
      template_id: "brands/index",
      title: "الماركات",
      slug: "brands.index",
      url: "/brands",
    };
    return;
  }

  if (target.pageId === "brands/single") {
    const brand = resolveEntityByRef(brands, target.entityRef) || {};

    context.brand = {
      ...brand,
      id: asString(brand.id) || "brand-1",
      name: asString(brand.name) || "ماركة",
      url:
        asString(brand.url) ||
        `/brands/${asString(brand.id) || target.entityRef || ""}`,
      logo: asString(brand.logo) || DEFAULT_IMAGE,
      banner: asString(brand.banner),
      description: asString(brand.description) || "",
    };
    context.page = {
      ...page,
      id: asString(brand.id) || target.entityRef || "brand",
      template_id: "brands/single",
      title: asString(brand.name) || "الماركة",
      slug: "brand.single",
      url:
        asString(brand.url) ||
        `/brands/${asString(brand.id) || target.entityRef || ""}`,
    };
    return;
  }

  if (target.pageId === "blog/index") {
    const sourceResolution = resolveBlogListingSource(target, query);
    const selectedCategory = sourceResolution.categoryRef
      ? resolveEntityByRef(blogCategories, sourceResolution.categoryRef)
      : null;

    const categories = blogCategories.map((category) => {
      const categoryId = asString(category.id);
      const selectedId = asString((selectedCategory || {}).id);
      return {
        ...category,
        id: categoryId,
        name: asString(category.name || category.title) || "تصنيف",
        url:
          asString(category.url) ||
          `/blog/categories/${asString(category.slug || categoryId)}`,
        is_current: Boolean(selectedId && categoryId === selectedId),
      };
    });

    const filtered = filterBlogArticlesForListing(
      blogArticles,
      sourceResolution,
      selectedCategory,
    );

    const articleList = [...filtered] as EntityRecord[] & {
      next_page: string | null;
    };
    articleList.next_page = null;

    context.categories = categories;
    context.slides = filtered.slice(0, 4);
    context.articles = articleList;
    (context as any).blog = {
      ...(context as any).blog,
      categories,
      articles: articleList,
    };
    context.page = {
      ...page,
      id:
        asString((selectedCategory || {}).id) ||
        sourceResolution.sourceValue ||
        "blog",
      template_id: "blog/index",
      title: asString((selectedCategory || {}).name) || "المدونة",
      slug:
        sourceResolution.source ||
        (selectedCategory ? "blog.category" : "blog.index"),
      url: asString((selectedCategory || {}).url) || "/blog",
    };
    return;
  }

  if (target.pageId === "blog/single") {
    const article =
      resolveEntityByRef(blogArticles, target.entityRef) ||
      normalizeArticleForTemplate({});
    const articleId = asString(article.id);
    const related = blogArticles
      .filter((entry) => asString(entry.id) !== articleId)
      .slice(0, 4);

    context.article = article;
    context.related = related;
    context.page = {
      ...page,
      id: articleId || target.entityRef || "blog-article",
      template_id: "blog/single",
      title: asString(article.title) || "مقالة",
      slug: "blog.single",
      url:
        asString(article.url) || `/blog/${articleId || target.entityRef || ""}`,
    };
    return;
  }

  if (target.pageId === "page-single") {
    const selected = resolveEntityByRef(pages, target.entityRef) || {};

    context.page = {
      ...page,
      id: asString(selected.id) || target.entityRef || "page-single",
      template_id: "page-single",
      title: asString(selected.title) || "صفحة",
      slug: asString(selected.slug) || "page-single",
      url:
        asString(selected.url) ||
        `/pages/${asString(selected.slug || selected.id || target.entityRef || "page")}`,
      content:
        asString(selected.content) ||
        "<p>هذه صفحة افتراضية من بيئة المعاينة.</p>",
    };
  }
};

export const bindPreviewContext = (input: {
  context: RuntimeContext;
  target: ResolvedPreviewTarget;
  query: Record<string, unknown>;
  viewport: "desktop" | "mobile";
  theme: PreviewThemeBinding;
}) => {
  const { context, target, query, viewport, theme } = input;
  context.store.themeId = theme.themeId;
  context.store.themeVersionId = theme.themeVersionId;
  context.theme.id = theme.themeId;
  context.theme.version = theme.themeVersion;

  applyPreviewContext(
    context as unknown as Record<string, unknown>,
    target,
    query,
  );
  (context.page as Record<string, unknown>).template_id =
    asString((context.page as Record<string, unknown>).template_id) ||
    target.pageId;

  (context as any).__preview = {
    viewport,
  };
  context.settings = {
    ...(context.settings || {}),
    __preview_viewport: viewport,
  };
};
