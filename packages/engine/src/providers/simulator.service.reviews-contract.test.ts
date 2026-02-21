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

describe("SimulatorService reviews contract behavior", () => {
  it("applies reviews query filters with official-like pagination envelope", async () => {
    const service = createService({
      review: [
        {
          id: "r1",
          type: "product",
          product_id: "prd-1",
          rating: 5,
          content: "Great quality and fast shipping",
          customer: {
            id: "customer-1",
            name: "Ahmed",
            email: "ahmed@example.com",
          },
          is_published: true,
          created_at: "2026-02-20T10:00:00.000Z",
        },
        {
          id: "r2",
          type: "product",
          product_id: "prd-1",
          rating: 3,
          content: "Average quality",
          customer: {
            id: "customer-1",
            name: "Ahmed",
            email: "ahmed@example.com",
          },
          is_published: false,
          created_at: "2026-02-19T10:00:00.000Z",
        },
        {
          id: "r3",
          type: "blog",
          blog_id: "blog-1",
          rating: 4,
          content: "Helpful article",
          reply: "Thanks for your feedback",
          customer: {
            id: "customer-2",
            name: "Sara",
            email: "sara@example.com",
          },
          is_published: true,
          created_at: "2026-02-18T10:00:00.000Z",
        },
      ],
      product_review: [],
    });

    const filteredResponse: any = await service.getReviews("store-1", {
      type: "product",
      products: "prd-1",
      publish: "true",
      stars: "5",
      keyword: "great",
      page: "1",
      per_page: "1",
    });

    expect(filteredResponse.success).toBe(true);
    expect(Array.isArray(filteredResponse.data)).toBe(true);
    expect(filteredResponse.data.map((entry: any) => entry.id)).toEqual(["r1"]);
    expect(filteredResponse.pagination.total).toBe(1);
    expect(filteredResponse.pagination.count).toBe(1);
    expect(filteredResponse.pagination.perPage).toBe(1);
    expect(filteredResponse.pagination.currentPage).toBe(1);

    const blogResponse: any = await service.getReviews("store-1", {
      blogs: "blog-1",
      customers: "customer-2",
      reply: "true",
    });

    expect(blogResponse.success).toBe(true);
    expect(blogResponse.data).toHaveLength(1);
    expect(blogResponse.data[0].id).toBe("r3");
    expect(blogResponse.data[0].has_reply).toBe(true);
  });

  it("supports product scoped reviews and keeps ask rating at zero", async () => {
    const service = createService({
      review: [
        {
          id: "r1",
          product_id: "prd-1",
          rating: 5,
          content: "Great quality",
          is_published: true,
          created_at: "2026-02-20T10:00:00.000Z",
        },
      ],
      product_review: [
        {
          id: "r4",
          type: "ask",
          product_id: "prd-2",
          rating: 0,
          content: "هل المنتج متوفر؟",
          is_published: true,
          created_at: "2026-02-17T10:00:00.000Z",
        },
      ],
    });

    const scopedResponse: any = await service.getReviews("store-1", {
      product_id: "prd-1",
    });
    expect(scopedResponse.success).toBe(true);
    expect(scopedResponse.data).toHaveLength(1);
    expect(scopedResponse.data[0].id).toBe("r1");

    const askResponse: any = await service.getReviews("store-1", {
      type: "ask",
      stars: "0",
    });
    expect(askResponse.success).toBe(true);
    expect(askResponse.data).toHaveLength(1);
    expect(askResponse.data[0].id).toBe("r4");
    expect(askResponse.data[0].rating).toBe(0);
    expect(askResponse.data[0].stars).toBe(0);
  });
});
