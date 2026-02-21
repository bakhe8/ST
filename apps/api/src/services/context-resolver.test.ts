import { describe, expect, it, vi } from "vitest";
import { ContextResolver } from "./context-resolver.js";

const createRequest = (overrides: Partial<any> = {}) =>
  ({
    headers: {},
    query: {},
    params: {},
    path: "",
    ...overrides,
  }) as any;

describe("ContextResolver", () => {
  it("prefers canonical x-vtdr-store-id header over legacy context-store-id", async () => {
    const resolver = new ContextResolver({ getStore: vi.fn() } as any);
    const request = createRequest({
      headers: {
        "x-vtdr-store-id": "store-canonical",
        "context-store-id": "store-legacy",
      },
    });

    const storeId = await resolver.resolveStoreId(request as any);
    expect(storeId).toBe("store-canonical");
  });

  it("uses legacy context-store-id as internal fallback when canonical header is missing", async () => {
    const resolver = new ContextResolver({ getStore: vi.fn() } as any);
    const request = createRequest({
      headers: {
        "context-store-id": "store-legacy-only",
      },
    });

    const storeId = await resolver.resolveStoreId(request as any);
    expect(storeId).toBe("store-legacy-only");
  });

  it("resolves context from query store_id when headers are absent", async () => {
    const resolver = new ContextResolver({ getStore: vi.fn() } as any);
    const request = createRequest({
      query: {
        store_id: "store-query",
      },
    });

    const storeId = await resolver.resolveStoreId(request as any);
    expect(storeId).toBe("store-query");
  });

  it("resolves context from preview path and referer fallback", async () => {
    const resolver = new ContextResolver({ getStore: vi.fn() } as any);

    const fromPath = await resolver.resolveStoreId(
      createRequest({
        path: "/preview/store-path/theme-a/1.0.0/products",
      }) as any,
    );
    expect(fromPath).toBe("store-path");

    const fromReferer = await resolver.resolveStoreId(
      createRequest({
        path: "/api/v1/products",
        headers: {
          referer:
            "http://localhost:3000/preview/store-referer/theme-a/1.0.0/products?viewport=desktop",
        },
      }) as any,
    );
    expect(fromReferer).toBe("store-referer");
  });
});
