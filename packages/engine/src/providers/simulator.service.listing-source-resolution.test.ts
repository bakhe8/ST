import { describe, expect, it, vi } from "vitest";
import { SimulatorService } from "./simulator.service.js";

function createService(entitiesByType: Record<string, any[]>) {
  const storeLogic = {
    getDataEntities: vi
      .fn()
      .mockImplementation(
        async (_storeId: string, type: string) => entitiesByType[type] || [],
      ),
    getStore: vi.fn().mockResolvedValue(null),
  } as any;

  const schemaService = {
    getModelSchema: vi.fn().mockReturnValue(null),
  } as any;

  const themeRuntimeAdapter = {
    resolvePlaceholderImage: vi.fn().mockReturnValue("/images/placeholder.png"),
  } as any;

  return new SimulatorService(storeLogic, schemaService, themeRuntimeAdapter);
}

describe("SimulatorService listing source resolution parity", () => {
  it("resolves product listing category source by slug and url tail", async () => {
    const service = createService({
      category: [
        {
          id: "cat-1",
          name: "Tips Category",
          slug: "tips-category",
          url: "/categories/tips-category",
        },
        {
          id: "cat-2",
          name: "Other Category",
          slug: "other-category",
          url: "/categories/other-category",
        },
      ],
      product: [
        {
          id: "p-1",
          name: "Tips Product",
          slug: "tips-product",
          category_ids: ["cat-1"],
          price: { amount: 100, currency: "SAR" },
        },
        {
          id: "p-2",
          name: "Other Product",
          slug: "other-product",
          category_ids: ["cat-2"],
          price: { amount: 120, currency: "SAR" },
        },
      ],
    });

    const bySlug: any = await service.getProducts("store-1", {
      source: "product.index.category",
      source_value: "tips-category",
    });
    expect(bySlug.success).toBe(true);
    expect(bySlug.data.map((entry: any) => entry.id)).toEqual(["p-1"]);

    const byUrlTail: any = await service.getProducts("store-1", {
      source: "product.index.category",
      source_value: "/categories/tips-category",
    });
    expect(byUrlTail.success).toBe(true);
    expect(byUrlTail.data.map((entry: any) => entry.id)).toEqual(["p-1"]);
  });

  it("resolves product listing brand source by slug and url tail", async () => {
    const service = createService({
      category: [],
      product: [
        {
          id: "p-1",
          name: "Acme Product",
          slug: "acme-product",
          brand_id: "brand-1",
          brand: { id: "brand-1", slug: "acme", url: "/brands/acme" },
          price: { amount: 100, currency: "SAR" },
        },
        {
          id: "p-2",
          name: "Beta Product",
          slug: "beta-product",
          brand_id: "brand-2",
          brand: { id: "brand-2", slug: "beta", url: "/brands/beta" },
          price: { amount: 120, currency: "SAR" },
        },
      ],
    });

    const bySlug: any = await service.getProducts("store-1", {
      source: "product.index.brand",
      source_value: "acme",
    });
    expect(bySlug.success).toBe(true);
    expect(bySlug.data.map((entry: any) => entry.id)).toEqual(["p-1"]);

    const byUrlTail: any = await service.getProducts("store-1", {
      source: "product.index.brand",
      source_value: "/brands/acme",
    });
    expect(byUrlTail.success).toBe(true);
    expect(byUrlTail.data.map((entry: any) => entry.id)).toEqual(["p-1"]);
  });

  it("resolves blog listing category source by slug and url tail", async () => {
    const service = createService({
      blog_category: [
        {
          id: "bc-1",
          name: "Tips",
          slug: "tips",
          url: "/blog/categories/tips",
        },
        {
          id: "bc-2",
          name: "News",
          slug: "news",
          url: "/blog/categories/news",
        },
      ],
      blog_article: [
        {
          id: "ba-1",
          title: "Tips Article",
          slug: "tips-article",
          category_id: "bc-1",
        },
        {
          id: "ba-2",
          title: "News Article",
          slug: "news-article",
          category_id: "bc-2",
        },
      ],
    });

    const bySlug: any = await service.getBlogArticles("store-1", {
      source: "blog.category",
      source_value: "tips",
    });
    expect(bySlug.success).toBe(true);
    expect(bySlug.data.map((entry: any) => entry.id)).toEqual(["ba-1"]);

    const byUrlTail: any = await service.getBlogArticles("store-1", {
      source: "blog.category",
      source_value: "/blog/categories/tips",
    });
    expect(byUrlTail.success).toBe(true);
    expect(byUrlTail.data.map((entry: any) => entry.id)).toEqual(["ba-1"]);
  });
});
