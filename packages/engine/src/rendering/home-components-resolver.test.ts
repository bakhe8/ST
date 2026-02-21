import { describe, it, expect } from "vitest";
import { HomeComponentsResolver } from "./home-components-resolver.js";
import type { RuntimeContext } from "@vtdr/contracts";

const createContext = (
  overrides?: Partial<RuntimeContext>,
): RuntimeContext => ({
  storeId: "store-1",
  theme: {
    id: "theme-a",
    name: "Theme A",
    version: "1.0.0",
  },
  store: {
    id: "store-1",
    name: "Store",
    locale: "ar-SA",
    currency: "SAR",
    branding: {},
    settings: {},
    themeId: "theme-a",
    themeVersionId: "ver-1",
  },
  page: {
    id: "index",
    components: [],
  },
  settings: {},
  translations: {},
  products: [
    { id: "p1", url: "/products/p1", name: "P1" } as any,
    { id: "p2", url: "/products/p2", name: "P2" } as any,
  ],
  categories: [],
  brands: [],
  pages: [],
  blog_articles: [],
  blog_categories: [],
  ...(overrides || {}),
});

describe("HomeComponentsResolver", () => {
  it("builds home components from theme schema and resolves product dropdown source", () => {
    const resolver = new HomeComponentsResolver();
    const context = createContext();
    const schema = {
      components: [
        {
          key: "home-slider",
          path: "home.slider",
          fields: [
            {
              id: "products",
              type: "items",
              format: "dropdown-list",
              source: "products",
            },
          ],
        },
      ],
    };

    const resolved = resolver.resolve(context, schema);
    expect(resolved.length).toBe(1);
    expect(resolved[0].path).toBe("home.slider");
    expect(Array.isArray(resolved[0].data.products)).toBe(true);
    expect(resolved[0].data.products.length).toBe(2);
    expect(resolved[0].data.product_ids_mock_str).toContain("p1");
  });

  it("respects page compositions visibility and component selection", () => {
    const resolver = new HomeComponentsResolver();
    const context = createContext({
      settings: {
        page_compositions: {
          home: [
            {
              componentId: "hidden-component",
              visibility: { enabled: false, viewport: "all" },
            },
            {
              componentId: "visible-component",
              visibility: { enabled: true, viewport: "desktop" },
            },
          ],
        },
      },
    });

    const schema = {
      components: [
        {
          key: "hidden-component",
          path: "home.hidden",
          fields: [],
        },
        {
          key: "visible-component",
          path: "home.visible",
          fields: [],
        },
      ],
    };

    const resolved = resolver.resolve(context, schema);
    expect(resolved.length).toBe(1);
    expect(resolved[0].path).toBe("home.visible");
  });

  it("resolves saved compositions for non-home pages via template id mapping", () => {
    const resolver = new HomeComponentsResolver();
    const context = createContext({
      page: {
        id: "product/single",
        components: [],
        template_id: "product/single",
      } as any,
      settings: {
        page_compositions: {
          "product-single": [
            {
              componentId: "product-offer",
              visibility: { enabled: true, viewport: "desktop" },
              props: { title: "Offer Block" },
            },
          ],
        },
      } as any,
    });

    const schema = {
      components: [
        {
          key: "product-offer",
          path: "product.single.offer",
          fields: [{ id: "title", type: "string", value: "Default" }],
        },
        {
          key: "home-slider",
          path: "home.slider",
          fields: [],
        },
      ],
    };

    const resolved = resolver.resolve(context, schema, "product/single");
    expect(resolved.length).toBe(1);
    expect(resolved[0].path).toBe("product.single.offer");
    expect(resolved[0].data.title).toBe("Offer Block");
  });

  it("filters product list defaults without leaking product.single components", () => {
    const resolver = new HomeComponentsResolver();
    const context = createContext({
      page: {
        id: "product/index",
        components: [],
        template_id: "product/index",
      } as any,
    });
    const schema = {
      components: [
        {
          key: "product-grid",
          path: "product.grid",
          fields: [],
        },
        {
          key: "product-single-offer",
          path: "product.single.offer",
          fields: [],
        },
      ],
    };

    const resolved = resolver.resolve(context, schema, "product/index");
    expect(resolved.length).toBe(1);
    expect(resolved[0].path).toBe("product.grid");
  });

  it("normalizes youtube component by extracting youtube_id from URL-like values", () => {
    const resolver = new HomeComponentsResolver();
    const context = createContext();
    const schema = {
      components: [
        {
          key: "home-youtube",
          path: "home.youtube",
          fields: [
            {
              id: "youtube_url",
              type: "string",
              value: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
          ],
        },
      ],
    };

    const resolved = resolver.resolve(context, schema);
    expect(resolved.length).toBe(1);
    expect(resolved[0].path).toBe("home.youtube");
    expect(resolved[0].data.youtube_id).toBe("dQw4w9WgXcQ");
  });

  it("normalizes parallax background image to object url contract", () => {
    const resolver = new HomeComponentsResolver();
    const context = createContext();
    const schema = {
      components: [
        {
          key: "home-parallax",
          path: "home.parallax-background",
          fields: [
            {
              id: "image",
              type: "string",
              format: "image",
              value: "https://cdn.salla.dev/img/parallax.jpg",
            },
            { id: "url", type: "string", value: "products/p1" },
            { id: "link_text", type: "string", value: "تسوق الآن" },
          ],
        },
      ],
    };

    const resolved = resolver.resolve(context, schema);
    expect(resolved.length).toBe(1);
    expect(resolved[0].path).toBe("home.parallax-background");
    expect(resolved[0].data.image).toEqual(
      expect.objectContaining({
        url: "https://cdn.salla.dev/img/parallax.jpg",
      }),
    );
    expect(resolved[0].data.url).toBe("/products/p1");
    expect(resolved[0].data.link_text).toBe("تسوق الآن");
  });

  it("normalizes enhanced slider slides image values and keeps text fields", () => {
    const resolver = new HomeComponentsResolver();
    const context = createContext();
    const schema = {
      components: [
        {
          key: "home-enhanced-slider",
          path: "home.enhanced-slider",
          fields: [
            {
              id: "slides",
              type: "collection",
              value: [
                {
                  "slides.image": {
                    url: "https://cdn.salla.dev/img/slide-1.jpg",
                  },
                  "slides.title": "Slide 1",
                  "slides.description": "Desc 1",
                },
                {
                  "slides.image": "https://cdn.salla.dev/img/slide-2.jpg",
                  "slides.title": "Slide 2",
                  "slides.description": "Desc 2",
                },
              ],
            },
          ],
        },
      ],
    };

    const resolved = resolver.resolve(context, schema);
    expect(resolved.length).toBe(1);
    expect(resolved[0].path).toBe("home.enhanced-slider");
    expect(Array.isArray(resolved[0].data.slides)).toBe(true);
    expect(resolved[0].data.slides).toHaveLength(2);
    expect(resolved[0].data.slides[0].image).toBe(
      "https://cdn.salla.dev/img/slide-1.jpg",
    );
    expect(resolved[0].data.slides[1].image).toBe(
      "https://cdn.salla.dev/img/slide-2.jpg",
    );
    expect(resolved[0].data.slides[0].title).toBe("Slide 1");
  });

  it("normalizes featured products style1 sections and main_product contract", () => {
    const resolver = new HomeComponentsResolver();
    const context = createContext({
      products: [
        { id: "p1", url: "/products/p1", name: "P1" } as any,
        { id: "p2", url: "/products/p2", name: "P2" } as any,
      ],
    });
    const schema = {
      components: [
        {
          key: "featured-products-style1",
          path: "home.featured-products-style1",
          fields: [
            {
              id: "items",
              type: "collection",
              value: [
                {
                  "items.id": "sec-a",
                  "items.title": "القسم أ",
                  "items.type": "chosen_products",
                  "items.products": ["p1", "p2"],
                  "items.limit": 2,
                },
              ],
            },
            {
              id: "main_product",
              type: "items",
              format: "dropdown-list",
              source: "products",
              value: ["p2"],
            },
          ],
        },
      ],
    };

    const resolved = resolver.resolve(context, schema);
    expect(resolved).toHaveLength(1);
    expect(resolved[0].data.items[0].id).toBe("sec-a");
    expect(Array.isArray(resolved[0].data.items[0].products)).toBe(true);
    expect(resolved[0].data.items[0].products.map((p: any) => p.id)).toEqual([
      "p1",
      "p2",
    ]);
    expect(resolved[0].data.main_product.product.id).toBe("p2");
  });

  it("normalizes featured products style2 products source object", () => {
    const resolver = new HomeComponentsResolver();
    const context = createContext({
      products: [
        {
          id: "p1",
          url: "/products/p1",
          name: "P1",
          category_ids: ["cat-a"],
        } as any,
        {
          id: "p2",
          url: "/products/p2",
          name: "P2",
          category_ids: ["cat-b"],
        } as any,
      ],
    });
    const schema = {
      components: [
        {
          key: "featured-products-style2",
          path: "home.featured-products-style2",
          fields: [
            {
              id: "items",
              type: "collection",
              value: [
                {
                  "items.id": "sec-c",
                  "items.title": "قسم التصنيفات",
                  "items.type": "category",
                  "items.category_id": "cat-a",
                  "items.limit": 3,
                },
              ],
            },
          ],
        },
      ],
    };

    const resolved = resolver.resolve(context, schema);
    expect(resolved).toHaveLength(1);
    expect(resolved[0].data.items[0].products).toEqual(
      expect.objectContaining({
        source: "categories",
        source_value: ["cat-a"],
        limit: 3,
      }),
    );
  });

  it("normalizes featured products style3 and backfills featured_product", () => {
    const resolver = new HomeComponentsResolver();
    const context = createContext({
      products: [
        { id: "p1", url: "/products/p1", name: "P1", sold_quantity: 8 } as any,
        { id: "p2", url: "/products/p2", name: "P2", sold_quantity: 13 } as any,
      ],
    });
    const schema = {
      components: [
        {
          key: "featured-products-style3",
          path: "home.featured-products-style3",
          fields: [
            {
              id: "items",
              type: "collection",
              value: [
                {
                  "items.id": "sec-sales",
                  "items.title": "الأكثر مبيعاً",
                  "items.type": "most_sales",
                  "items.limit": 2,
                },
              ],
            },
          ],
        },
      ],
    };

    const resolved = resolver.resolve(context, schema);
    expect(resolved).toHaveLength(1);
    expect(resolved[0].data.items[0].products).toHaveLength(2);
    expect(resolved[0].data.items[0].featured_product).toBeTruthy();
    expect(resolved[0].data.items[0].featured_product.id).toBe("p2");
  });

  it("normalizes enhanced square banners links and images", () => {
    const resolver = new HomeComponentsResolver();
    const context = createContext();
    const schema = {
      components: [
        {
          key: "enhanced-square-banners",
          path: "home.enhanced-square-banners",
          fields: [
            {
              id: "banners",
              type: "collection",
              value: [
                {
                  "banners.image": "https://cdn.salla.dev/img/banner-1.jpg",
                  "banners.url": "categories/cat-a",
                  "banners.title": "عنوان",
                  "banners.description": "وصف",
                },
              ],
            },
          ],
        },
      ],
    };

    const resolved = resolver.resolve(context, schema);
    expect(resolved).toHaveLength(1);
    expect(resolved[0].data.banners).toHaveLength(1);
    expect(resolved[0].data.banners[0].image).toBe(
      "https://cdn.salla.dev/img/banner-1.jpg",
    );
    expect(resolved[0].data.banners[0].url).toBe("/categories/cat-a");
  });

  it("normalizes slider products with header background/products/display_all_url", () => {
    const resolver = new HomeComponentsResolver();
    const context = createContext({
      products: [
        { id: "p1", url: "/products/p1", name: "P1" } as any,
        { id: "p2", url: "/products/p2", name: "P2" } as any,
      ],
    });
    const schema = {
      components: [
        {
          key: "slider-products-with-header",
          path: "home.slider-products-with-header",
          fields: [
            {
              id: "background",
              type: "string",
              format: "image",
              value: { url: "https://cdn.salla.dev/img/bg.jpg" },
            },
            { id: "title", type: "string", value: "العنوان" },
            { id: "description", type: "string", value: "الوصف" },
            {
              id: "products",
              type: "items",
              format: "dropdown-list",
              source: "products",
              value: ["p1"],
            },
            {
              id: "display_all_url",
              type: "string",
              format: "variable-list",
              value: "products",
            },
          ],
        },
      ],
    };

    const resolved = resolver.resolve(context, schema);
    expect(resolved).toHaveLength(1);
    expect(resolved[0].data.background).toBe(
      "https://cdn.salla.dev/img/bg.jpg",
    );
    expect(Array.isArray(resolved[0].data.products)).toBe(true);
    expect(resolved[0].data.products[0].id).toBe("p1");
    expect(resolved[0].data.display_all_url).toBe("/products");
  });
});
