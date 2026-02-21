import { createRequire } from "module";
import { RuntimeContext } from "@vtdr/contracts";
import * as path from "path";
import * as os from "os";
import { createHash } from "crypto";
import * as fsPromises from "fs/promises";
import { AsyncLocalStorage } from "async_hooks";
import { SchemaService } from "../core/schema-service.js";
import { IFileSystem } from "../infra/file-system.interface.js";
import type { IThemeRuntimeAdapter } from "../infra/theme-runtime-adapter.interface.js";
import { buildPreviewNavigationShimScript } from "./preview-navigation-shim.js";
import { HomeComponentsResolver } from "./home-components-resolver.js";
import { buildRenderScope } from "./render-scope.js";

const require = createRequire(import.meta.url);
const Twig = require("twig");

export class RendererService {
  private isInitialized = false;
  private normalizedViewsCache = new Map<
    string,
    { signature: string; viewsPath: string }
  >();
  private homeComponentsResolver = new HomeComponentsResolver();
  private storage = new AsyncLocalStorage<{
    translations: Record<string, string>;
    themeFolder: string;
    viewsPath: string;
    context?: RuntimeContext;
    renderContext?: any;
  }>();

  constructor(
    private themesBaseDir: string,
    private fs: IFileSystem,
    private schemaService: SchemaService,
    private themeRuntimeAdapter: IThemeRuntimeAdapter,
  ) {
    this.initializeTwigOnce();
  }

  private async getThemeSchema(themeFolder: string): Promise<any | null> {
    const normalizedThemeFolder = String(themeFolder || "").trim();
    if (!normalizedThemeFolder) return null;

    try {
      const schema = await this.themeRuntimeAdapter.getThemeSchema(
        normalizedThemeFolder,
      );
      return schema || null;
    } catch (error) {
      console.error(
        "[Renderer] Failed to load theme schema via adapter:",
        error,
      );
      return null;
    }
  }

  private initializeTwigOnce() {
    if (this.isInitialized) return;

    const twigCacheEnabled = process.env.VTDR_TWIG_CACHE === "1";
    (Twig as any).cache(twigCacheEnabled);

    // --- SCHEMATIC FILTERS ---
    Twig.extendFilter("number", (val: any) => {
      if (val === undefined || val === null) return "";
      // Basic Arabic number conversion for demo (not full map)
      return String(val);
    });

    const getCurrencySymbol = (code: string) => {
      const symbols: Record<string, string> = {
        SAR: "ر.س",
        USD: "$",
        EUR: "€",
        GBP: "£",
      };
      return symbols[code] || code;
    };

    const resolveMoneyAmount = (value: any): number => {
      if (typeof value === "number" && Number.isFinite(value)) return value;
      if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
      }
      if (value && typeof value === "object") {
        if (typeof value.getMoney === "function") {
          const money = value.getMoney();
          const amount = Number(money?.amount);
          if (Number.isFinite(amount)) return amount;
        }
        const amount = Number(value.amount ?? value.value);
        if (Number.isFinite(amount)) return amount;
      }
      return 0;
    };

    const humanizeTranslationKey = (rawKey: string): string => {
      const key = String(rawKey || "").trim();
      if (!key) return "";
      const leaf = key.split(".").pop() || key;
      return leaf.replace(/[_-]+/g, " ").trim() || key;
    };

    const resolveTranslation = (
      translations: Record<string, string>,
      rawKey: any,
    ): string => {
      const key = String(rawKey || "").trim();
      if (!key) return "";
      const exact = translations[key];
      if (typeof exact === "string" && exact.trim()) return exact;
      return humanizeTranslationKey(key);
    };

    Twig.extendFilter("currency", (val: any) => {
      const store = this.storage.getStore();
      const currencyCode = store?.context?.store?.currency || "SAR";
      const symbol = getCurrencySymbol(currencyCode);
      const amount = resolveMoneyAmount(val);
      return currencyCode === "SAR"
        ? `${amount} ${symbol}`
        : `${symbol}${amount}`;
    });

    Twig.extendFilter("money", (val: any) => {
      const store = this.storage.getStore();
      const currencyCode = store?.context?.store?.currency || "SAR";
      const symbol = getCurrencySymbol(currencyCode);
      const amount = resolveMoneyAmount(val);
      return currencyCode === "SAR"
        ? `${amount} ${symbol}`
        : `${symbol}${amount}`;
    });

    Twig.extendFilter("snake_case", (val: string) => {
      return val?.replace(/\s+/g, "_").toLowerCase() || "";
    });

    Twig.extendFilter("camel_case", (val: string) => {
      return (
        val
          ?.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
          })
          .replace(/\s+/g, "") || ""
      );
    });

    Twig.extendFilter("kabab_case", (val: string) => {
      return val?.replace(/\s+/g, "-").toLowerCase() || "";
    });

    Twig.extendFilter("time_ago", (val: any) => {
      if (!val) return "";
      const date = val instanceof Date ? val : new Date(String(val));
      if (isNaN(date.getTime())) return String(val);
      const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
      if (diffSeconds < 60) return "منذ لحظات";
      const diffMinutes = Math.floor(diffSeconds / 60);
      if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `منذ ${diffHours} ساعة`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 30) return `منذ ${diffDays} يوم`;
      const diffMonths = Math.floor(diffDays / 30);
      if (diffMonths < 12) return `منذ ${diffMonths} شهر`;
      const diffYears = Math.floor(diffMonths / 12);
      return `منذ ${diffYears} سنة`;
    });

    Twig.extendFilter("map", (arr: any[], callback: any) => {
      if (!Array.isArray(arr)) return [];
      if (typeof callback === "function") {
        return arr.map(callback);
      }
      return arr;
    });

    Twig.extendFilter("asset", (value: any) => {
      const store = this.storage.getStore();
      const themeFolder = store?.themeFolder || "current";
      return `/themes/${themeFolder}/public/${value}`;
    });
    Twig.extendFilter("cdn", (value: any) => {
      const store = this.storage.getStore();
      const themeFolder = store?.themeFolder || "";
      return this.resolveCdnUrl(value, themeFolder);
    });
    Twig.extendFilter("is_placeholder", (value: any) => {
      const url = String(value || "")
        .trim()
        .toLowerCase();
      if (!url) return true;
      return (
        url.includes("/placeholder") ||
        url.includes("placeholder.com") ||
        url.includes("no-image") ||
        url.includes("default")
      );
    });
    Twig.extendFilter("trans", (value: any) => {
      const store = this.storage.getStore();
      const translations = (store?.translations || {}) as Record<
        string,
        string
      >;
      return resolveTranslation(translations, value);
    });

    (Twig as any).extendFunction("salla_url", (path: string) => `/${path}`);
    (Twig as any).extendFunction("trans", (value: any) => {
      const store = this.storage.getStore();
      const translations = (store?.translations || {}) as Record<
        string,
        string
      >;
      return resolveTranslation(translations, value);
    });
    (Twig as any).extendFunction("is_page", (name: string) => {
      const store = this.storage.getStore();
      return store?.context?.page?.id === name;
    });
    (Twig as any).extendFunction("link", (val: string) => {
      const store = this.storage.getStore();
      const baseUrl = (store?.context?.store as any)?.url || "";
      const p = String(val || "").replace(/^\/+/, "");
      return baseUrl ? `${baseUrl}/${p}` : `/${p}`;
    });

    (Twig as any).extendFunction("pluralize", (key: string, count: number) => {
      const store = this.storage.getStore();
      const translations = (store?.translations || {}) as Record<
        string,
        string
      >;
      const lang = store?.context?.store?.locale?.split("-")[0] || "ar";

      // Basic Arabic pluralization logic (Zero, One, Two, 3-10, 11-99, 100+)
      if (lang === "ar") {
        if (count === 0)
          return resolveTranslation(
            translations,
            translations[`${key}.zero`] ? `${key}.zero` : key,
          );
        if (count === 1)
          return resolveTranslation(
            translations,
            translations[`${key}.one`] ? `${key}.one` : key,
          );
        if (count === 2)
          return resolveTranslation(
            translations,
            translations[`${key}.two`] ? `${key}.two` : key,
          );
        if (count >= 3 && count <= 10)
          return resolveTranslation(
            translations,
            translations[`${key}.few`] ? `${key}.few` : key,
          );
        return resolveTranslation(
          translations,
          translations[`${key}.many`] ? `${key}.many` : key,
        );
      }

      const base = resolveTranslation(translations, key);
      return `${count} ${base}`;
    });

    (Twig as any).extendFunction("is_link", (pattern: string) => {
      const store = this.storage.getStore();
      const pageId = store?.context?.page?.id || "";
      return pageId.includes(pattern);
    });

    // old() returns previously submitted form value — in simulator context always returns empty string
    (Twig as any).extendFunction("old", (_key: string) => "");

    const renderComponent = (val: any) => {
      const store = this.storage.getStore();
      const viewsPath = store?.viewsPath;

      if (!viewsPath) {
        console.error("[Renderer] Component Error: No views path available");
        return "<!-- Error: No views path available -->";
      }

      const renderFile = (filePath: string, data: any = {}) => {
        const parts = filePath.split(".");
        const fullPath = path.join(viewsPath, "components", ...parts) + ".twig";
        try {
          if (this.fs.existsSync(fullPath)) {
            let content = this.fs.readFileSync(fullPath, "utf8");

            // Preprocess component content for map filter and internal components
            // Replace custom component tag with our unique one to avoid collisions
            content = content.replace(
              /\{%\s*component\s+/g,
              "{% salla_component ",
            );

            // Improved regex to handle both 'something.products' and just 'products'
            if (content.includes("|map(")) {
              content = content.replace(
                /(\b[a-zA-Z0-9._]*products)\|\s*map\(.*?\)[\s|]*join\(.*?\)/g,
                (match, p1) => p1 + ".product_ids_mock_str",
              );
            }

            const template = (Twig as any).twig({
              data: content,
              path: fullPath,
              async: false,
            });
            const out = template.render({
              ...(this.storage.getStore()?.renderContext || {}),
              component: data,
              ...data,
            });
            return out;
          } else {
            console.warn(`[Renderer] Component file NOT found: ${fullPath}`);
            return `<!-- Component Not Found: ${filePath} -->`;
          }
        } catch (e) {
          console.error("[Renderer] Component Render Error: " + filePath, e);
          return `<!-- Component Render Error: ${filePath} -->`;
        }
      };

      if (typeof val === "string") return renderFile(val);
      if (Array.isArray(val))
        return val
          .map((item) => renderFile(item.path || item.name, item.data || {}))
          .join("\n");
      if (val && typeof val === "object")
        return renderFile(val.path || val.name, val.data || {});
      return "";
    };

    const evaluateExpression = (expr: string, context: any): any => {
      const originalExpr = expr;
      expr = expr.trim();
      if (
        (expr.startsWith('"') && expr.endsWith('"')) ||
        (expr.startsWith("'") && expr.endsWith("'"))
      )
        return expr.slice(1, -1);
      if (expr === "true") return true;
      if (expr === "false") return false;
      if (!isNaN(Number(expr))) return Number(expr);

      const parts = expr.split(".");
      let value = context;

      if (parts[0] === "home" && context["home"] !== undefined) {
        value = context["home"];
        if (parts.length === 1) return value;
        for (let i = 1; i < parts.length; i++) {
          if (value && typeof value === "object" && parts[i] in value) {
            value = value[parts[i]];
          } else {
            return undefined;
          }
        }
        return value;
      }

      for (const part of parts) {
        if (value && typeof value === "object" && part in value) {
          value = value[part];
        } else {
          return undefined;
        }
      }
      return value;
    };

    (Twig as any).extendTag({
      type: "hook",
      regex: /^hook\s+(.+)$/,
      next: [],
      open: true,
      compile: function (token: any) {
        token.expression = token.match[1].trim();
        delete token.match;
        return token;
      },
      parse: function (token: any, context: any, chain: any) {
        let hookName = "";
        try {
          hookName = evaluateExpression(token.expression, context);
        } catch (e) {
          hookName = "error";
        }
        const hooks = (context.hooks || {}) as Record<string, string>;
        return { chain: chain, output: hooks[hookName] || "" };
      },
    });

    (Twig as any).extendTag({
      type: "salla_component",
      regex: /^salla_component\s+(.+)$/,
      next: [],
      open: true,
      compile: function (token: any) {
        token.expression = token.match[1].trim();
        delete token.match;
        return token;
      },
      parse: function (token: any, context: any, chain: any) {
        let output = "";
        try {
          const val = evaluateExpression(token.expression, context);
          output = renderComponent(val);
        } catch (e) {
          console.error("[Renderer] Component Tag Error:", e);
        }
        return { chain: chain, output: output };
      },
    });

    this.isInitialized = true;
  }

  private toPosixPath(value: string) {
    return String(value || "").replace(/\\/g, "/");
  }

  private resolveCdnUrl(value: any, themeFolder: string): string {
    const rawValue = String(value ?? "").trim();
    if (!rawValue) return "";

    if (
      /^(https?:)?\/\//i.test(rawValue) ||
      /^(data|blob|mailto|tel):/i.test(rawValue) ||
      rawValue.startsWith("#")
    ) {
      return rawValue;
    }

    if (rawValue.startsWith("/")) {
      return rawValue;
    }

    const normalizedPath = rawValue.replace(/^[./]+/, "");
    const normalizedPathLower = normalizedPath.toLowerCase();

    if (
      normalizedPathLower === "fonts/sallaicons.css" ||
      normalizedPathLower.endsWith("/fonts/sallaicons.css")
    ) {
      return "/fonts/sallaicons.css";
    }

    if (normalizedPathLower.startsWith("fonts/")) {
      return `/${normalizedPath}`;
    }

    const normalizedThemeFolder = String(themeFolder || "")
      .trim()
      .replace(/^\/+|\/+$/g, "");

    if (!normalizedThemeFolder) {
      return `/${normalizedPath}`;
    }

    return `/themes/${normalizedThemeFolder}/public/${normalizedPath}`;
  }

  private normalizeTemplateToken(value: string) {
    return String(value || "")
      .trim()
      .replace(/^\/+|\/+$/g, "")
      .replace(/\\/g, "/");
  }

  private resolvePreviewOrigin() {
    const explicitOrigin = String(
      process.env.VTDR_PREVIEW_ORIGIN ||
        process.env.VTDR_UI_ORIGIN ||
        process.env.PUBLIC_ORIGIN ||
        "",
    )
      .trim()
      .replace(/\/+$/g, "");
    if (explicitOrigin) return explicitOrigin;

    const uiPort =
      String(
        process.env.VTDR_UI_PORT || process.env.UI_PORT || "3000",
      ).trim() || "3000";
    return `http://localhost:${uiPort}`;
  }

  private toAbsolutePreviewUrl(origin: string, previewPath: string) {
    const normalizedOrigin = String(origin || "")
      .trim()
      .replace(/\/+$/g, "");
    const normalizedPath = String(previewPath || "").startsWith("/")
      ? String(previewPath || "")
      : `/${String(previewPath || "")}`;
    return `${normalizedOrigin}${normalizedPath}`;
  }

  private resolveTemplatePath(viewsPath: string, requestedTemplateId: string) {
    const token =
      this.normalizeTemplateToken(requestedTemplateId || "index") || "index";
    const aliasMap: Record<string, string[]> = {
      index: ["home"],
      home: ["index"],
      "product/index": [
        "products",
        "category/index",
        "shop/index",
        "catalog/index",
      ],
      "product/single": ["product", "products/single", "item"],
      "blog/index": ["blog"],
      "blog/single": ["blog/post", "post", "article"],
      "brands/index": ["brands"],
      "brands/single": ["brand", "brand/single"],
      checkout: ["cart"],
      "thank-you": ["thanks", "order/success", "checkout/success"],
      "page-single": ["page", "pages/single"],
      "customer/profile": ["customer/account", "account/profile", "profile"],
      "customer/wishlist": ["wishlist"],
      "customer/notifications": ["notifications"],
      "customer/wallet": ["wallet"],
      "customer/orders/index": ["customer/orders", "orders/index", "orders"],
      "customer/orders/single": [
        "customer/orders/order",
        "orders/single",
        "orders/order",
      ],
    };

    const candidates = Array.from(
      new Set(
        [
          token,
          token.includes(".") ? token.replace(/\./g, "/") : token,
          ...(aliasMap[token] || []),
          "page-single",
          "index",
          "home",
        ]
          .map((entry) => this.normalizeTemplateToken(entry))
          .filter(Boolean),
      ),
    );

    for (const candidate of candidates) {
      const filePath = path.join(viewsPath, "pages", `${candidate}.twig`);
      if (this.fs.existsSync(filePath)) {
        return {
          templatePath: filePath,
          pageName: candidate,
        };
      }
    }

    return {
      templatePath: path.join(viewsPath, "pages", `${token}.twig`),
      pageName: token,
    };
  }

  private normalizeTwigRefTarget(
    rawTarget: string,
    currentFilePath: string,
    viewsPath: string,
  ) {
    const original = String(rawTarget || "").trim();
    if (!original) return original;

    if (
      original.startsWith("@") ||
      original.startsWith("http://") ||
      original.startsWith("https://") ||
      original.startsWith("//") ||
      original.startsWith("#") ||
      original.startsWith("mailto:") ||
      original.startsWith("tel:")
    ) {
      return original;
    }

    const knownAssetExt =
      /\.(js|css|json|svg|png|jpe?g|webp|gif|ico|woff2?|ttf)$/i;
    let target = this.toPosixPath(original);

    if (
      !target.includes("/") &&
      target.includes(".") &&
      !target.endsWith(".twig") &&
      !knownAssetExt.test(target)
    ) {
      target = target.replace(/\./g, "/");
    }

    if (!target.endsWith(".twig") && !knownAssetExt.test(target)) {
      target += ".twig";
    }

    const currentDir = path.dirname(currentFilePath);
    const toRelativeFromCurrent = (absolutePath: string) =>
      this.toPosixPath(path.relative(currentDir, absolutePath));

    const tryResolve = (absolutePath: string) => {
      if (!this.fs.existsSync(absolutePath)) return null;
      const rel = toRelativeFromCurrent(absolutePath);
      return rel || "./";
    };

    if (target.startsWith("/")) {
      const fromRoot = path.join(viewsPath, target.replace(/^\/+/, ""));
      const resolved = tryResolve(fromRoot);
      return resolved || target;
    }

    if (target.startsWith("./") || target.startsWith("../")) {
      const absolute = path.resolve(currentDir, target);
      const resolved = tryResolve(absolute);
      return resolved || target;
    }

    const currentCandidate = path.resolve(currentDir, target);
    const currentResolved = tryResolve(currentCandidate);
    if (currentResolved) return currentResolved;

    const rootCandidate = path.resolve(viewsPath, target);
    const rootResolved = tryResolve(rootCandidate);
    if (rootResolved) return rootResolved;

    const normalizedTarget = target.replace(/^\/+/, "");
    return normalizedTarget || original;
  }

  private rewriteTwigTemplateReferences(
    content: string,
    currentFilePath: string,
    viewsPath: string,
  ) {
    if (!content) return content;
    return content.replace(
      /\{%\s+(extends|include|import|from)\s+["'](.+?)["'](.*?)\s+%\}/g,
      (match: string, tag: string, target: string, rest: string) => {
        const mapped = this.normalizeTwigRefTarget(
          target,
          currentFilePath,
          viewsPath,
        );
        return `{% ${tag} "${mapped}"${rest} %}`;
      },
    );
  }

  private ensurePreviewRuntimeInjected(html: string, sdkInitScript: string) {
    if (!sdkInitScript) return html;
    if (html.includes("/sdk-bridge.js")) return html;
    if (/<\/body>/i.test(html)) {
      return html.replace(/<\/body>/i, `${sdkInitScript}</body>`);
    }
    return `${html}\n${sdkInitScript}`;
  }

  private async collectFilesRecursive(
    rootDir: string,
    currentDir = rootDir,
  ): Promise<string[]> {
    const entries = await fsPromises.readdir(currentDir, {
      withFileTypes: true,
    });
    const files: string[] = [];
    for (const entry of entries) {
      const absolutePath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        files.push(
          ...(await this.collectFilesRecursive(rootDir, absolutePath)),
        );
        continue;
      }
      files.push(absolutePath);
    }
    return files;
  }

  private async copyDirectoryRecursive(
    sourceDir: string,
    targetDir: string,
  ): Promise<void> {
    await fsPromises.mkdir(targetDir, { recursive: true });
    const entries = await fsPromises.readdir(sourceDir, {
      withFileTypes: true,
    });
    for (const entry of entries) {
      const sourcePath = path.join(sourceDir, entry.name);
      const targetPath = path.join(targetDir, entry.name);
      if (entry.isDirectory()) {
        await this.copyDirectoryRecursive(sourcePath, targetPath);
        continue;
      }
      await fsPromises.copyFile(sourcePath, targetPath);
    }
  }

  private async getRuntimeViewsPath(themePath: string): Promise<string> {
    const sourceViewsPath = path.join(themePath, "src", "views");
    const files = await this.collectFilesRecursive(sourceViewsPath);
    const fileSignatures = await Promise.all(
      files.map(async (absolutePath) => {
        const stat = await fsPromises.stat(absolutePath);
        const relativePath = this.toPosixPath(
          path.relative(sourceViewsPath, absolutePath),
        );
        return `${relativePath}:${stat.mtimeMs}:${stat.size}`;
      }),
    );

    const signature = createHash("sha1")
      .update(fileSignatures.sort().join("|"))
      .digest("hex")
      .slice(0, 16);
    const cacheKey = this.toPosixPath(themePath);
    const cached = this.normalizedViewsCache.get(cacheKey);
    if (
      cached &&
      cached.signature === signature &&
      this.fs.existsSync(cached.viewsPath)
    ) {
      return cached.viewsPath;
    }

    const runtimeRoot = path.join(os.tmpdir(), "vtdr-runtime-views");
    const runtimeViewsPath = path.join(
      runtimeRoot,
      `${path.basename(themePath)}-${signature}`,
    );
    if (
      this.fs.existsSync(runtimeViewsPath) &&
      this.fs.existsSync(path.join(runtimeViewsPath, "pages"))
    ) {
      this.normalizedViewsCache.set(cacheKey, {
        signature,
        viewsPath: runtimeViewsPath,
      });
      return runtimeViewsPath;
    }

    await this.copyDirectoryRecursive(sourceViewsPath, runtimeViewsPath);

    const runtimeFiles = await this.collectFilesRecursive(runtimeViewsPath);
    const twigFiles = runtimeFiles.filter((entry) =>
      entry.toLowerCase().endsWith(".twig"),
    );
    await Promise.all(
      twigFiles.map(async (twigPath) => {
        const content = await fsPromises.readFile(twigPath, "utf8");
        const normalized = this.rewriteTwigTemplateReferences(
          content,
          twigPath,
          runtimeViewsPath,
        );
        if (normalized !== content) {
          await fsPromises.writeFile(twigPath, normalized, "utf8");
        }
      }),
    );

    this.normalizedViewsCache.set(cacheKey, {
      signature,
      viewsPath: runtimeViewsPath,
    });

    return runtimeViewsPath;
  }

  private resolveComponentBindingPaths(templatePageIdRaw: string): string[] {
    const templatePageId = String(templatePageIdRaw || "")
      .trim()
      .toLowerCase()
      .replace(/\\/g, "/");
    const bindings: string[] = [];
    const push = (value: string) => {
      const normalized = String(value || "").trim();
      if (!normalized) return;
      if (!bindings.includes(normalized)) bindings.push(normalized);
    };

    switch (templatePageId) {
      case "":
      case "index":
      case "home":
        push("home");
        break;
      case "product/single":
        push("product.single");
        break;
      case "product/index":
        push("product");
        push("category");
        break;
      case "category/index":
        push("category");
        break;
      case "cart":
      case "checkout":
        push("cart");
        break;
      case "customer/profile":
        push("customer.profile");
        break;
      case "customer/orders/index":
        push("customer.orders");
        break;
      case "customer/orders/single":
        push("customer.orders.single");
        break;
      case "customer/wishlist":
        push("customer.wishlist");
        break;
      case "customer/notifications":
        push("customer.notifications");
        break;
      case "customer/wallet":
        push("customer.wallet");
        break;
      case "blog/index":
        push("blog");
        break;
      case "blog/single":
        push("blog.single");
        break;
      case "brands/index":
        push("brands");
        break;
      case "brands/single":
        push("brands.single");
        break;
      case "thank-you":
        push("thank_you");
        break;
      case "landing-page":
        push("landing_page");
        break;
      case "page-single":
        push("page_single");
        break;
      default:
        break;
    }

    return bindings;
  }

  private assignComponentsByPath(
    target: any,
    bindingPath: string,
    components: any[],
  ) {
    if (!target || typeof target !== "object") return;
    const parts = String(bindingPath || "")
      .split(".")
      .map((entry) => entry.trim())
      .filter(Boolean);
    if (parts.length === 0) return;

    let cursor: any = target;
    for (let i = 0; i < parts.length - 1; i++) {
      const key = parts[i];
      const current = cursor[key];
      if (current == null) {
        cursor[key] = {};
      } else if (typeof current !== "object" || Array.isArray(current)) {
        return;
      }
      cursor = cursor[key];
    }

    const leafKey = parts[parts.length - 1];
    const currentLeaf = cursor[leafKey];
    if (typeof currentLeaf === "undefined") {
      cursor[leafKey] = components;
      return;
    }
    if (Array.isArray(currentLeaf)) {
      cursor[leafKey] = components;
      return;
    }
    if (currentLeaf && typeof currentLeaf === "object") {
      if (!Array.isArray((currentLeaf as any).components)) {
        (currentLeaf as any).components = components;
      } else {
        (currentLeaf as any).__components = components;
      }
    }
  }

  private injectResolvedPageComponents(
    renderContext: any,
    templatePageId: string,
    resolvedComponents: any[],
  ) {
    const components = Array.isArray(resolvedComponents)
      ? resolvedComponents
      : [];
    if (!renderContext || typeof renderContext !== "object") return;

    if (!renderContext.page || typeof renderContext.page !== "object") {
      renderContext.page = {};
    }
    (renderContext.page as any).components = components;
    (renderContext as any).__vtdr_page_components = components;

    const bindingPaths = this.resolveComponentBindingPaths(templatePageId);
    bindingPaths.forEach((bindingPath) => {
      this.assignComponentsByPath(renderContext, bindingPath, components);
    });
  }

  public async renderPage(
    context: RuntimeContext,
    themeFolder: string,
  ): Promise<string> {
    const themePath = path.join(this.themesBaseDir, themeFolder);
    const viewsPath = await this.getRuntimeViewsPath(themePath);
    const templatePageId = String(
      (context.page as any)?.template_id || context.page.id || "index",
    );
    const resolvedTemplate = this.resolveTemplatePath(
      viewsPath,
      templatePageId,
    );
    let templatePath = resolvedTemplate.templatePath;
    const previewViewport =
      String(
        (context as any)?.__preview?.viewport ||
          context.settings?.__preview_viewport ||
          "desktop",
      ).toLowerCase() === "mobile"
        ? "mobile"
        : "desktop";
    const renderScope = buildRenderScope({
      storeId: context.store?.id || context.storeId,
      themeId: context.theme?.id,
      themeVersion: context.theme?.version,
      themeFolder,
      templateId: templatePageId,
      templatePath,
      viewsPath,
      viewport: previewViewport,
    });
    const themeSchema = await this.getThemeSchema(themeFolder);

    try {
      const templateContent = await this.fs.readFile(templatePath, "utf8");
      let resolvedPageComponents: any[] = [];
      try {
        resolvedPageComponents = this.homeComponentsResolver.resolve(
          context,
          themeSchema,
          templatePageId,
        );
        if (templatePageId === "index" || templatePageId === "home") {
          (context as any)["home"] = resolvedPageComponents;
        }
        console.log(
          `[Renderer] Injected ${resolvedPageComponents.length} components for ${templatePageId}.`,
        );
      } catch (err) {
        resolvedPageComponents = [];
        if (templatePageId === "index" || templatePageId === "home") {
          (context as any)["home"] = [];
        }
      }

      try {
        const lang = context.store?.locale?.split("-")[0] || "ar";
        const localePath = path.join(
          themePath,
          "src",
          "locales",
          `${lang}.json`,
        );
        if (this.fs.existsSync(localePath)) {
          const localeContent = this.fs.readFileSync(localePath, "utf8");
          const localeJson = JSON.parse(localeContent);
          const flattened = this.flattenObject(localeJson);
          context.translations = { ...context.translations, ...flattened };
        }
      } catch (err) {}

      if (context.store) {
        const previewBasePath = `/preview/${context.store.id}/${themeFolder}/${context.theme.version}`;
        (context.store as any).url = previewBasePath;
      }

      const renderContext = this.prepareRenderContext(context, themeFolder);
      (renderContext as any).__vtdr_render_scope = {
        key: renderScope.rawKey,
        hash: renderScope.hash,
      };
      this.injectResolvedPageComponents(
        renderContext,
        templatePageId,
        resolvedPageComponents,
      );

      let processedContent = this.rewriteTwigTemplateReferences(
        templateContent,
        templatePath,
        viewsPath,
      );

      // Replace custom component tag with our unique one to avoid collisions
      processedContent = processedContent.replace(
        /\{%\s*component\s+/g,
        "{% salla_component ",
      );

      if (processedContent.includes("|map(")) {
        processedContent = processedContent.replace(
          /(\b[a-zA-Z0-9._]*products)\|\s*map\(.*?\)[\s|]*join\(.*?\)/g,
          (match: string, p1: string) => p1 + ".product_ids_mock_str",
        );
      }

      return new Promise((resolve, reject) => {
        try {
          const template = (Twig as any).twig({
            id: renderScope.templateCacheId,
            path: templatePath,
            data: processedContent,
            async: false,
            base: viewsPath,
            namespaces: {
              layouts: path.join(viewsPath, "layouts"),
              pages: path.join(viewsPath, "pages"),
              partials: path.join(viewsPath, "partials"),
            },
            rethrow: true,
          });

          const storeData = {
            translations: (context.translations || {}) as Record<
              string,
              string
            >,
            themeFolder: themeFolder,
            viewsPath: viewsPath,
            context: context,
            renderContext: renderContext,
          };

          this.storage.run(storeData, () => {
            console.log(`[Renderer] Starting render for ${templatePageId}...`);
            let html = template.render(renderContext);
            console.log(
              `[Renderer] Render complete. HTML length: ${html.length}`,
            );

            const regex = /(https?:\\?\/\\?\/)?store-[a-zA-Z0-9-]+\.salla\.sa/g;
            html = html.replace(regex, (match: string) =>
              match.includes("\\/")
                ? "http:\\/\\/localhost:3001"
                : match.startsWith("http")
                  ? "http://localhost:3001"
                  : "localhost:3001",
            );
            const clearScript =
              "<script>try{localStorage.clear();sessionStorage.clear();}catch(e){}</script>";
            html = html.replace("<head>", "<head>" + clearScript);
            html = this.ensurePreviewRuntimeInjected(
              html,
              String((renderContext as any).__vtdr_sdk_init_script || ""),
            );
            resolve(html);
          });
        } catch (e) {
          console.error("[Renderer] Twig Render Error:", e);
          reject(e);
        }
      });
    } catch (error: any) {
      console.error("[Renderer] Global Error:", error);
      return `<div style="color: red; padding: 20px;"><h1>Renderer Error</h1><pre>${error.message}</pre></div>`;
    }
  }

  private prepareRenderContext(context: RuntimeContext, themeFolder: string) {
    const previewViewport =
      String(
        (context as any)?.__preview?.viewport ||
          context.settings?.__preview_viewport ||
          "desktop",
      ).toLowerCase() === "mobile"
        ? "mobile"
        : "desktop";
    const previewOrigin = this.resolvePreviewOrigin();
    const previewBasePath = `/preview/${context.store.id}/${themeFolder}/${context.theme.version}`;
    const previewStoreUrl = this.toAbsolutePreviewUrl(
      previewOrigin,
      previewBasePath,
    );
    const localDefaultImage = "/images/placeholder.png";
    const themeTranslationsHashRaw = Number(
      (context.theme as any)?.translations_hash ?? 0,
    );
    const themeTranslationsHash =
      Number.isFinite(themeTranslationsHashRaw) && themeTranslationsHashRaw > 0
        ? Math.floor(themeTranslationsHashRaw)
        : 0;
    const store = {
      ...context.store,
      api: "/api/v1",
      url: previewBasePath,
      icon: localDefaultImage,
      avatar: localDefaultImage,
      logo: localDefaultImage,
      slogan: "سوقك في جيبك",
      username: "store_vtdr",
      contacts: {
        mobile: "966500000000",
        email: "support@salla.sa",
        whatsapp: "966500000000",
      },
      social: {
        instagram: "https://instagram.com/salla",
        twitter: "https://twitter.com/salla",
      },
    };

    const theme = {
      ...context.theme,
      is_rtl: true,
      mode: "preview",
      preview_viewport: previewViewport,
      color: {
        primary: context.settings?.primary_color || "#004d41",
        text: "#FFFFFF",
        reverse_primary: "#FFFFFF",
        reverse_text: "#004d41",
        is_dark: false,
        darker: (alpha: number) => context.settings?.primary_color || "#00362e",
        lighter: (alpha: number) =>
          context.settings?.primary_color || "#016c5b",
      },
      font: {
        name: "DINNextLTArabic-Regular",
        path: "https://cdn.salla.sa/fonts/din-next-lt-arabic.css",
        url: "https://cdn.salla.sa/fonts/din-next-lt-arabic.css",
      },
      settings: {
        get: (key: string, def: any) => context.settings?.[key] ?? def,
        set: (key: string, val: any) => "",
      },
    };
    if (themeTranslationsHash > 0) {
      (theme as any).translations_hash = themeTranslationsHash;
    }
    const sdkStore = {
      ...store,
      url: previewStoreUrl,
    };

    const defaultUser = {
      id: "vtdr_guest_1",
      type: "guest",
      is_authenticated: false,
      name: "ضيف المحاكي",
      avatar: localDefaultImage,
      language: {
        code: context.store?.locale?.split("-")[0] || "ar",
        dir:
          context.store?.locale?.startsWith("ar") || !context.store?.locale
            ? "rtl"
            : "ltr",
      },
      currency: {
        code: context.store?.currency || "SAR",
        symbol:
          context.store?.currency === "SAR"
            ? "ر.س"
            : context.store?.currency === "USD"
              ? "$"
              : context.store?.currency || "SAR",
      },
      can_access_wallet: false,
      points: 0,
    };
    const runtimeUser =
      (context as any)?.user && typeof (context as any).user === "object"
        ? ((context as any).user as Record<string, any>)
        : {};
    const user = {
      ...defaultUser,
      ...runtimeUser,
      language: {
        ...defaultUser.language,
        ...(runtimeUser.language && typeof runtimeUser.language === "object"
          ? runtimeUser.language
          : {}),
      },
      currency: {
        ...defaultUser.currency,
        ...(runtimeUser.currency && typeof runtimeUser.currency === "object"
          ? runtimeUser.currency
          : {}),
      },
    };
    if (typeof user.is_authenticated !== "boolean") {
      user.is_authenticated = user.type !== "guest";
    }
    if (!user.type) {
      user.type = user.is_authenticated ? "user" : "guest";
    }

    const resolveContextTranslation = (rawKey: string) => {
      const key = String(rawKey || "").trim();
      if (!key) return "";
      const storeBag = this.storage.getStore();
      const translations = (storeBag?.translations || {}) as Record<
        string,
        string
      >;
      const exact = translations[key];
      if (typeof exact === "string" && exact.trim()) return exact;
      const leaf = key.split(".").pop() || key;
      return leaf.replace(/[_-]+/g, " ").trim() || key;
    };

    const sallaContext = {
      products: context.products || [],
      categories: context.categories || [],
      brands: context.brands || [],
      url: (pageId: string) =>
        `/preview/${context.store.id}/${themeFolder}/${context.theme.version}?page=${pageId}&viewport=${previewViewport}`,
      trans: (key: string) => resolveContextTranslation(key),
      config: (key: string) => context.settings?.[key],
    };

    const templatePageId = String(
      (context.page as any)?.template_id || context.page.id || "",
    );
    const previewRefresh = String((context as any)?.__preview?.refresh || "");
    const previewNavigationShimScript = buildPreviewNavigationShimScript({
      previewBasePath,
      viewport: previewViewport,
      refresh: previewRefresh,
      storeId: String(context.store?.id || ""),
    });
    const previewConsoleNoiseGuardScript = `
            <script>
            (function () {
                if (window.__VTDR_CONSOLE_NOISE_GUARD__) return;
                window.__VTDR_CONSOLE_NOISE_GUARD__ = true;

                var originalError = console.error ? console.error.bind(console) : null;
                var originalTrace = console.trace ? console.trace.bind(console) : null;
                var suppressNextTrace = false;

                console.error = function () {
                    try {
                        var message = Array.prototype.slice.call(arguments).join(' ');
                        if (message.indexOf('possible EventEmitter memory leak detected') >= 0) {
                            suppressNextTrace = true;
                            return;
                        }
                    } catch (e) {}
                    if (originalError) return originalError.apply(console, arguments);
                };

                console.trace = function () {
                    if (suppressNextTrace) {
                        suppressNextTrace = false;
                        return;
                    }
                    if (originalTrace) return originalTrace.apply(console, arguments);
                };
            })();
            </script>
        `;
    const runtimeAssetVersion = encodeURIComponent(
      `${String(context.store?.id || "")}:${String(context.theme?.id || "")}:${String(context.theme?.version || "")}:${Date.now()}`,
    );
    const sdkInitScript = `
            <script>window.vtdr_context = { storeId: ${JSON.stringify(context.store.id)}, pageId: ${JSON.stringify(context.page.id)}, templatePageId: ${JSON.stringify(templatePageId)} };</script>
            ${previewNavigationShimScript}
            ${previewConsoleNoiseGuardScript}
            <script src="https://cdn.jsdelivr.net/npm/@salla.sa/twilight@latest/dist/@salla.sa/twilight.min.js"></script>
            <script src="/sdk-components-fallback.js?v=${runtimeAssetVersion}"></script>
            <script src="/sdk-bridge.js?v=${runtimeAssetVersion}"></script>
            <script>document.addEventListener('DOMContentLoaded', function() { if (window.salla) { salla.init({ store: ${JSON.stringify(sdkStore)}, user: ${JSON.stringify(user)}, theme: ${JSON.stringify(theme)} }); } });</script>
        `;

    return {
      ...context,
      salla: sallaContext,
      store,
      theme,
      user,
      settings: context.settings,
      hooks: { "body:end": sdkInitScript },
      __vtdr_sdk_init_script: sdkInitScript,
      theme_url: (p: string) => `/themes/${themeFolder}/${p}`,
      asset: (p: string) => `/themes/${themeFolder}/public/${p}`,
    };
  }

  private flattenObject(obj: any, prefix = ""): Record<string, string> {
    return Object.keys(obj).reduce((acc: any, k: any) => {
      const pre = prefix.length ? prefix + "." : "";
      if (
        typeof obj[k] === "object" &&
        obj[k] !== null &&
        !Array.isArray(obj[k])
      ) {
        Object.assign(acc, this.flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = String(obj[k]);
      }
      return acc;
    }, {});
  }
}
