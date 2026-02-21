import { beforeAll, afterAll, describe, expect, it } from "vitest";
import * as fsPromises from "fs/promises";
import * as os from "os";
import * as path from "path";
import type { RuntimeContext } from "@vtdr/contracts";
import { RendererService } from "./renderer-service.js";
import { LocalFileSystem } from "../infra/local-file-system.js";

const buildContext = (): RuntimeContext => ({
  storeId: "store-1",
  theme: {
    id: "theme-sample",
    name: "Theme Sample",
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
    themeId: "theme-sample",
    themeVersionId: "tv-1",
  },
  page: {
    id: "index",
    components: [],
  },
  settings: {},
  translations: {},
});

describe("RendererService cdn filter", () => {
  let workspaceDir = "";
  const themeFolder = "theme-sample";

  beforeAll(async () => {
    workspaceDir = await fsPromises.mkdtemp(
      path.join(os.tmpdir(), "vtdr-renderer-cdn-"),
    );
    const pageDir = path.join(
      workspaceDir,
      themeFolder,
      "src",
      "views",
      "pages",
    );
    await fsPromises.mkdir(pageDir, { recursive: true });
    await fsPromises.writeFile(
      path.join(pageDir, "index.twig"),
      [
        '<link rel="stylesheet" href="{{ \'fonts/sallaicons.css\'|cdn }}">',
        '<link rel="stylesheet" href="{{ \'images/theme.css\'|cdn }}">',
        "<img src=\"{{ '/images/root.png'|cdn }}\">",
        "<img src=\"{{ 'https://cdn.example.com/asset.css'|cdn }}\">",
      ].join("\n"),
      "utf8",
    );
  });

  afterAll(async () => {
    if (workspaceDir) {
      await fsPromises.rm(workspaceDir, { recursive: true, force: true });
    }
  });

  it("normalizes relative cdn paths for preview runtime and keeps absolute urls untouched", async () => {
    const renderer = new RendererService(
      workspaceDir,
      new LocalFileSystem(),
      {} as any,
      {
        getThemeSchema: async () => null,
      } as any,
    );

    const html = await renderer.renderPage(buildContext(), themeFolder);
    expect(html).toContain('href="/fonts/sallaicons.css"');
    expect(html).toContain(
      `href="/themes/${themeFolder}/public/images/theme.css"`,
    );
    expect(html).toContain('src="/images/root.png"');
    expect(html).toContain('src="https://cdn.example.com/asset.css"');
  });
});
