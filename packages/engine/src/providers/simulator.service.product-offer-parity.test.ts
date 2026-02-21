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

  return {
    service: new SimulatorService(
      storeLogic,
      schemaService,
      themeRuntimeAdapter,
    ),
    storeLogic,
  };
}

describe("SimulatorService product/offer parity behavior", () => {
  it("filters related products using source=related and source_value product reference", async () => {
    const { service } = createService({
      category: [
        { id: "cat-a", name: "Category A", url: "/categories/cat-a" },
        { id: "cat-b", name: "Category B", url: "/categories/cat-b" },
      ],
      product: [
        {
          id: "p1",
          name: "Product One",
          slug: "p1",
          url: "/products/p1",
          price: { amount: 120, currency: "SAR" },
          regular_price: { amount: 150, currency: "SAR" },
          sale_price: { amount: 120, currency: "SAR" },
          category_ids: ["cat-a"],
          brand: { id: "brand-a", name: "Brand A" },
        },
        {
          id: "p2",
          name: "Product Two",
          slug: "p2",
          url: "/products/p2",
          price: { amount: 140, currency: "SAR" },
          regular_price: { amount: 170, currency: "SAR" },
          sale_price: { amount: 140, currency: "SAR" },
          category_ids: ["cat-a"],
          brand: { id: "brand-a", name: "Brand A" },
          is_featured: true,
        },
        {
          id: "p3",
          name: "Product Three",
          slug: "p3",
          url: "/products/p3",
          price: { amount: 90, currency: "SAR" },
          regular_price: { amount: 110, currency: "SAR" },
          sale_price: { amount: 90, currency: "SAR" },
          category_ids: ["cat-b"],
          brand: { id: "brand-b", name: "Brand B" },
        },
      ],
    });

    const response: any = await service.getProducts("store-1", {
      source: "related",
      source_value: "p1",
    });

    expect(response.success).toBe(true);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.map((entry: any) => entry.id)).toEqual(["p2"]);
  });

  it("normalizes donation contract for donating products", async () => {
    const { service } = createService({
      category: [],
      product: [
        {
          id: "don-1",
          name: "Donation Product",
          type: "donating",
          is_donation: true,
          price: { amount: 100, currency: "SAR" },
          regular_price: { amount: 100, currency: "SAR" },
          sale_price: { amount: 100, currency: "SAR" },
          donation: {
            collected_amount: 250,
            target_amount: 1000,
            target_end_date: "2099-01-01T00:00:00.000Z",
          },
        },
      ],
    });

    const response: any = await service.getProduct("store-1", "don-1");
    expect(response.success).toBe(true);
    expect(response.data.id).toBe("don-1");
    expect(response.data.is_donation).toBe(true);
    expect(response.data.type).toBe("donating");
    expect(response.data.is_require_shipping).toBe(false);
    expect(response.data.donation).toBeTruthy();
    expect(response.data.donation.collected_amount).toBe(250);
    expect(response.data.donation.target_amount).toBe(1000);
    expect(response.data.donation.target_percent).toBe(25);
    expect(response.data.donation.can_donate).toBe(true);
  });

  it("normalizes product options with values and details aliases", async () => {
    const { service } = createService({
      category: [],
      product: [
        {
          id: "opt-1",
          name: "Option Product",
          price: { amount: 100, currency: "SAR" },
          regular_price: { amount: 110, currency: "SAR" },
          sale_price: { amount: 100, currency: "SAR" },
          options: [
            {
              id: "size",
              name: "Size",
              type: "select",
              display_type: "text",
              associated_with_order_time: true,
              not_same_day_order: true,
              availability_range: true,
              from_date_time: "09:00",
              to_date_time: "21:00",
              visibility_condition_type: "all",
              visibility_condition_option: "color",
              visibility_condition_value: "red",
              advance: {
                placeholder: "Select size",
                min_length: 1,
                max_length: 10,
              },
              values: [
                { id: "s", name: "S", price: 0 },
                { id: "m", name: "M", price: 10 },
              ],
            },
          ],
        },
      ],
    });

    const response: any = await service.getProduct("store-1", "opt-1");
    expect(response.success).toBe(true);
    expect(Array.isArray(response.data.options)).toBe(true);
    expect(response.data.options.length).toBe(1);
    expect(Array.isArray(response.data.options[0].values)).toBe(true);
    expect(Array.isArray(response.data.options[0].details)).toBe(true);
    expect(response.data.options[0].values).toHaveLength(2);
    expect(response.data.options[0].details).toHaveLength(2);
    expect(response.data.options[0].display_type).toBe("text");
    expect(response.data.options[0].associated_with_order_time).toBe(true);
    expect(response.data.options[0].not_same_day_order).toBe(true);
    expect(response.data.options[0].availability_range).toBe(true);
    expect(response.data.options[0].visibility_condition_type).toBe("all");
    expect(response.data.options[0].visibility_condition_option).toBe("color");
    expect(response.data.options[0].visibility_condition_value).toBe("red");
    expect(response.data.options[0].advance?.placeholder).toBe("Select size");
  });

  it("normalizes offer payload with categories/products linkage", async () => {
    const { service } = createService({
      specialOffer: [
        {
          id: "offer-1",
          name: "Offer One",
          title: "Offer One",
          product_ids: ["p2"],
          category_ids: ["cat-a"],
          products: [
            {
              id: "p2",
              name: "Product Two",
              url: "/products/p2",
              status: "sale",
              price: { amount: 140, currency: "SAR" },
              category_ids: ["cat-a"],
            },
          ],
          categories: [
            {
              id: "cat-a",
              name: "Category A",
              url: "/categories/cat-a",
            },
          ],
        },
      ],
      offer: [],
    });

    const response: any = await service.getOffers("store-1");
    expect(response.success).toBe(true);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBe(1);

    const offer = response.data[0];
    expect(Array.isArray(offer.products)).toBe(true);
    expect(Array.isArray(offer.categories)).toBe(true);
    expect(offer.product_ids).toContain("p2");
    expect(offer.category_ids).toContain("cat-a");
    expect(offer.products[0].id).toBe("p2");
    expect(offer.categories[0].id).toBe("cat-a");
  });
});
