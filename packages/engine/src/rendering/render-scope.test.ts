import { describe, expect, it } from "vitest";
import { buildRenderScope } from "./render-scope.js";

describe("buildRenderScope", () => {
  it("produces a stable cache id for identical inputs", () => {
    const first = buildRenderScope({
      storeId: "store-a",
      themeId: "theme-raed-master",
      themeVersion: "1.0.0",
      themeFolder: "theme-raed-master",
      templateId: "index",
      templatePath: "/tmp/vtdr-runtime-views/theme/pages/index.twig",
      viewsPath: "/tmp/vtdr-runtime-views/theme",
      viewport: "desktop",
    });
    const second = buildRenderScope({
      storeId: "store-a",
      themeId: "theme-raed-master",
      themeVersion: "1.0.0",
      themeFolder: "theme-raed-master",
      templateId: "index",
      templatePath: "/tmp/vtdr-runtime-views/theme/pages/index.twig",
      viewsPath: "/tmp/vtdr-runtime-views/theme",
      viewport: "desktop",
    });

    expect(first.hash).toBe(second.hash);
    expect(first.templateCacheId).toBe(second.templateCacheId);
  });

  it("changes cache id when store scope changes", () => {
    const first = buildRenderScope({
      storeId: "store-a",
      themeId: "theme-raed-master",
      themeVersion: "1.0.0",
      templateId: "index",
      templatePath: "/tmp/theme/pages/index.twig",
      viewsPath: "/tmp/theme",
      viewport: "desktop",
    });
    const second = buildRenderScope({
      storeId: "store-b",
      themeId: "theme-raed-master",
      themeVersion: "1.0.0",
      templateId: "index",
      templatePath: "/tmp/theme/pages/index.twig",
      viewsPath: "/tmp/theme",
      viewport: "desktop",
    });

    expect(first.hash).not.toBe(second.hash);
  });

  it("changes cache id when theme/version/viewport change", () => {
    const base = buildRenderScope({
      storeId: "store-a",
      themeId: "theme-a",
      themeVersion: "1.0.0",
      templateId: "products",
      templatePath: "/tmp/theme/pages/product/index.twig",
      viewsPath: "/tmp/theme",
      viewport: "desktop",
    });
    const themeChanged = buildRenderScope({
      storeId: "store-a",
      themeId: "theme-b",
      themeVersion: "1.0.0",
      templateId: "products",
      templatePath: "/tmp/theme/pages/product/index.twig",
      viewsPath: "/tmp/theme",
      viewport: "desktop",
    });
    const versionChanged = buildRenderScope({
      storeId: "store-a",
      themeId: "theme-a",
      themeVersion: "2.0.0",
      templateId: "products",
      templatePath: "/tmp/theme/pages/product/index.twig",
      viewsPath: "/tmp/theme",
      viewport: "desktop",
    });
    const viewportChanged = buildRenderScope({
      storeId: "store-a",
      themeId: "theme-a",
      themeVersion: "1.0.0",
      templateId: "products",
      templatePath: "/tmp/theme/pages/product/index.twig",
      viewsPath: "/tmp/theme",
      viewport: "mobile",
    });

    expect(base.hash).not.toBe(themeChanged.hash);
    expect(base.hash).not.toBe(versionChanged.hash);
    expect(base.hash).not.toBe(viewportChanged.hash);
  });
});
