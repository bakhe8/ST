import { describe, expect, it } from "vitest";
import type { RuntimeContext } from "@vtdr/contracts";
import {
  hydratePreviewEntities,
  renderPreviewWithFallback,
} from "./preview-runtime-service.js";

const baseContext = (): RuntimeContext => ({
  storeId: "store-1",
  theme: {
    id: "theme-a",
    name: "Theme A",
    version: "1.0.0",
    author: "VTDR",
  },
  hooks: {},
  store: {
    id: "store-1",
    name: "Store 1",
    locale: "ar-SA",
    currency: "SAR",
    branding: {},
    settings: {},
    themeId: "theme-a",
    themeVersionId: "tv-1",
  },
  page: {
    id: "index",
    components: [],
  },
  settings: {},
  translations: {},
});

describe("hydratePreviewEntities", () => {
  it("hydrates cart, orders, and checkout entities into preview context", async () => {
    const context = baseContext();
    const storeLogic = {
      getDataEntity: async (_storeId: string, type: string) => {
        if (type === "cart") return { id: "cart-default", items: [] };
        if (type === "checkout_session")
          return { id: "checkout-default", step: "address" };
        return null;
      },
      getDataEntities: async () => [{ id: "order-1" }, { id: "order-2" }],
    } as any;

    await hydratePreviewEntities({
      storeId: "store-1",
      context,
      storeLogic,
    });

    expect((context as any).cart).toMatchObject({ id: "cart-default" });
    expect((context as any).checkout).toMatchObject({ id: "checkout-default" });
    expect((context as any).orders).toHaveLength(2);
  });
});

describe("renderPreviewWithFallback", () => {
  it("retries with index template when home render fails with home.twig error", async () => {
    const context = baseContext();
    context.page.id = "home";
    let call = 0;
    const renderer = {
      renderPage: async () => {
        call += 1;
        return call === 1
          ? "Render Error home.twig missing"
          : "<html>ok-index</html>";
      },
    } as any;

    const html = await renderPreviewWithFallback({
      renderer,
      context,
      themeId: "theme-a",
      target: { pageId: "home", routePath: "/" },
    });

    expect(html).toContain("ok-index");
    expect(context.page.id).toBe("index");
    expect((context.page as any).template_id).toBe("index");
  });

  it("falls back to page-single for unsupported render targets", async () => {
    const context = baseContext();
    context.page.id = "brands/index";
    let call = 0;
    const renderer = {
      renderPage: async () => {
        call += 1;
        return call === 1
          ? "Renderer Error: missing brands/index.twig"
          : "<html>page-single</html>";
      },
    } as any;

    const html = await renderPreviewWithFallback({
      renderer,
      context,
      themeId: "theme-a",
      target: { pageId: "brands/index", routePath: "/brands" },
    });

    expect(html).toContain("page-single");
    expect((context.page as any).template_id).toBe("page-single");
    expect((context.page as any).url).toBe("/brands");
    expect(String((context.page as any).content || "")).toContain("/brands");
  });
});
