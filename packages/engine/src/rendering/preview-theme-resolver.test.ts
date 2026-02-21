import { describe, expect, it } from "vitest";
import { PreviewThemeResolver } from "./preview-theme-resolver.js";

const createRegistry = () => {
  const themes: Record<string, any> = {
    "theme-a": {
      id: "theme-a",
      versions: [
        { id: "tv-a-1", version: "1.0.0" },
        { id: "tv-a-2", version: "2.0.0" },
      ],
    },
    "theme-b": {
      id: "theme-b",
      versions: [{ id: "tv-b-1", version: "1.0.0" }],
    },
  };

  return {
    getTheme: async (themeId: string) => themes[themeId] || null,
  };
};

describe("PreviewThemeResolver", () => {
  it("resolves from store assignment when request params are omitted", async () => {
    const resolver = new PreviewThemeResolver(createRegistry() as any);
    const result = await resolver.resolve({
      store: {
        themeId: "theme-a",
        themeVersionId: "tv-a-2",
      },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.themeId).toBe("theme-a");
      expect(result.themeVersionId).toBe("tv-a-2");
      expect(result.themeVersion).toBe("2.0.0");
      expect(result.source).toBe("store");
    }
  });

  it("returns 404 when requested theme version does not exist", async () => {
    const resolver = new PreviewThemeResolver(createRegistry() as any);
    const result = await resolver.resolve({
      store: { themeId: "theme-a", themeVersionId: "tv-a-1" },
      requestedThemeId: "theme-a",
      requestedVersion: "9.9.9",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(404);
    }
  });

  it("resolves requested theme/version independently from store assignment", async () => {
    const resolver = new PreviewThemeResolver(createRegistry() as any);
    const result = await resolver.resolve({
      store: { themeId: "theme-a", themeVersionId: "tv-a-1" },
      requestedThemeId: "theme-b",
      requestedVersion: "1.0.0",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.themeId).toBe("theme-b");
      expect(result.themeVersionId).toBe("tv-b-1");
      expect(result.source).toBe("request");
    }
  });
});
