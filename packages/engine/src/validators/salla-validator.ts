import * as fs from "fs/promises";
import * as path from "path";
import { TwilightSchema } from "@vtdr/contracts";

export interface ValidationRule {
  id: string;
  category: "structure" | "contracts" | "runtime" | "readiness";
  title: string;
  description: string;
  status: "pass" | "warning" | "fail";
  sallaDocUrl?: string;
}

export interface CompatibilityReport {
  overallStatus: "pass" | "warning" | "fail";
  summary: {
    pass: number;
    warning: number;
    fail: number;
  };
  rules: ValidationRule[];
}

export interface ThemeComponentCapabilityPage {
  id: string;
  title: string;
  prefixes: string[];
  core: boolean;
  supported: boolean;
  matchedComponents: number;
  matchedComponentKeys: string[];
  matchedPaths: string[];
}

export interface ThemeComponentCapabilityReport {
  overallStatus: "pass" | "warning" | "fail";
  summary: {
    totalPages: number;
    corePages: number;
    coveredPages: number;
    coveredCorePages: number;
    totalComponents: number;
    matchedComponents: number;
  };
  pages: ThemeComponentCapabilityPage[];
  supportedPageIds: string[];
  missingCorePages: string[];
  orphanComponentPaths: string[];
}

export interface ThemeAnchorProbePageReport {
  id: string;
  title: string;
  core: boolean;
  status: "pass" | "warning" | "fail";
  templatePath: string | null;
  declaredComponents: number;
  renderedComponents: number;
  missingAnchorPoints: string[];
  detectedAnchors: string[];
}

export interface ThemeAnchorProbeReport {
  overallStatus: "pass" | "warning" | "fail";
  summary: {
    totalPages: number;
    corePages: number;
    declaredComponents: number;
    renderedComponents: number;
    missingAnchorPoints: number;
    orphanAnchorPoints: number;
    pagesWithMissingAnchors: number;
  };
  pages: ThemeAnchorProbePageReport[];
  missingAnchorPoints: string[];
  orphanAnchorPoints: string[];
}

type ThemeComponentPageRule = {
  id: string;
  title: string;
  prefixes: string[];
  excludePrefixes?: string[];
  core: boolean;
  templateCandidates: string[];
  bindingTokens: string[];
};

type NormalizedThemeComponent = {
  key: string;
  path: string;
};

const THEME_COMPONENT_PAGE_RULES: ThemeComponentPageRule[] = [
  {
    id: "home",
    title: "Home",
    prefixes: ["home"],
    core: true,
    templateCandidates: [
      "src/views/pages/index.twig",
      "src/views/pages/home.twig",
    ],
    bindingTokens: ["home"],
  },
  {
    id: "product-list",
    title: "Product List",
    prefixes: ["product"],
    excludePrefixes: ["product.single"],
    core: true,
    templateCandidates: [
      "src/views/pages/product/index.twig",
      "src/views/pages/products.twig",
      "src/views/pages/category/index.twig",
      "src/views/pages/shop/index.twig",
      "src/views/pages/catalog/index.twig",
    ],
    bindingTokens: ["product"],
  },
  {
    id: "product-single",
    title: "Product Single",
    prefixes: ["product.single"],
    core: false,
    templateCandidates: [
      "src/views/pages/product/single.twig",
      "src/views/pages/product.twig",
    ],
    bindingTokens: ["product.single"],
  },
  {
    id: "category",
    title: "Category",
    prefixes: ["category"],
    core: true,
    templateCandidates: [
      "src/views/pages/category/index.twig",
      "src/views/pages/product/index.twig",
    ],
    bindingTokens: ["category"],
  },
  {
    id: "cart",
    title: "Cart",
    prefixes: ["cart"],
    core: false,
    templateCandidates: [
      "src/views/pages/cart.twig",
      "src/views/pages/checkout.twig",
    ],
    bindingTokens: ["cart"],
  },
  {
    id: "profile",
    title: "Customer Profile",
    prefixes: ["customer.profile"],
    core: false,
    templateCandidates: ["src/views/pages/customer/profile.twig"],
    bindingTokens: ["customer.profile"],
  },
  {
    id: "orders-list",
    title: "Customer Orders",
    prefixes: ["customer.orders"],
    excludePrefixes: ["customer.orders.single"],
    core: false,
    templateCandidates: ["src/views/pages/customer/orders/index.twig"],
    bindingTokens: ["customer.orders"],
  },
  {
    id: "wishlist",
    title: "Customer Wishlist",
    prefixes: ["customer.wishlist"],
    core: false,
    templateCandidates: ["src/views/pages/customer/wishlist.twig"],
    bindingTokens: ["customer.wishlist"],
  },
  {
    id: "notifications",
    title: "Customer Notifications",
    prefixes: ["customer.notifications"],
    core: false,
    templateCandidates: ["src/views/pages/customer/notifications.twig"],
    bindingTokens: ["customer.notifications"],
  },
  {
    id: "blog-list",
    title: "Blog List",
    prefixes: ["blog"],
    excludePrefixes: ["blog.single"],
    core: true,
    templateCandidates: [
      "src/views/pages/blog/index.twig",
      "src/views/pages/blog.twig",
    ],
    bindingTokens: ["blog"],
  },
  {
    id: "blog-single",
    title: "Blog Single",
    prefixes: ["blog.single"],
    core: false,
    templateCandidates: ["src/views/pages/blog/single.twig"],
    bindingTokens: ["blog.single"],
  },
  {
    id: "brands-list",
    title: "Brands List",
    prefixes: ["brands"],
    excludePrefixes: ["brands.single"],
    core: true,
    templateCandidates: [
      "src/views/pages/brands/index.twig",
      "src/views/pages/brands.twig",
    ],
    bindingTokens: ["brands"],
  },
  {
    id: "brand-single",
    title: "Brand Single",
    prefixes: ["brands.single"],
    core: false,
    templateCandidates: ["src/views/pages/brands/single.twig"],
    bindingTokens: ["brands.single"],
  },
  {
    id: "thank-you",
    title: "Thank You",
    prefixes: ["thank-you"],
    core: false,
    templateCandidates: [
      "src/views/pages/thank-you.twig",
      "src/views/pages/thank_you.twig",
    ],
    bindingTokens: ["thank_you"],
  },
  {
    id: "landing-page",
    title: "Landing Page",
    prefixes: ["landing-page"],
    core: false,
    templateCandidates: ["src/views/pages/landing-page.twig"],
    bindingTokens: ["landing_page"],
  },
  {
    id: "page-single",
    title: "Static Page",
    prefixes: ["page-single"],
    core: false,
    templateCandidates: [
      "src/views/pages/page-single.twig",
      "src/views/pages/page/single.twig",
    ],
    bindingTokens: ["page_single"],
  },
];

export class SallaValidator {
  /**
   * Runs an exhaustive compatibility check on a local theme based on official checklist
   */
  public async validateTheme(
    themePath: string,
    schema: TwilightSchema,
  ): Promise<CompatibilityReport> {
    const rules: ValidationRule[] = [];

    // --- Category A: Structure ---
    rules.push(
      await this.checkPath(
        themePath,
        "src/views/layouts/master.twig",
        "structure",
        "Master Layout",
        "Official themes must have src/views/layouts/master.twig",
        "https://docs.salla.dev/421918m0",
        false,
      ),
    );
    rules.push(
      await this.checkPath(
        themePath,
        "src/views/pages/index.twig",
        "structure",
        "Index Page",
        "Official themes must have src/views/pages/index.twig",
        "https://docs.salla.dev/421918m0",
        false,
      ),
    );
    rules.push(
      await this.checkPath(
        themePath,
        "src/locales",
        "structure",
        "Locales Folder",
        "Translation files folder",
        "https://docs.salla.dev/421918m0",
        true,
      ),
    );
    rules.push(
      await this.checkPath(
        themePath,
        "src/assets/js",
        "structure",
        "JS Assets",
        "JavaScript source folder",
        "https://docs.salla.dev/421918m0",
        true,
      ),
    );
    rules.push(
      await this.checkPath(
        themePath,
        "src/assets/styles",
        "structure",
        "Style Assets",
        "CSS/SASS source folder",
        "https://docs.salla.dev/421918m0",
        true,
      ),
    );

    // --- Category B: Contracts ---
    rules.push(
      this.checkSchemaKey(
        schema,
        "name",
        "contracts",
        "Theme Name",
        "Mandatory theme name in twilight.json",
        "https://docs.salla.dev/421921m0",
      ),
    );
    rules.push(
      this.checkSchemaKey(
        schema,
        "version",
        "contracts",
        "Version",
        "Mandatory version in twilight.json",
        "https://docs.salla.dev/421921m0",
      ),
    );
    rules.push(
      this.checkSchemaKey(
        schema,
        "author",
        "contracts",
        "Author",
        "Mandatory author info",
        "https://docs.salla.dev/421889m0",
      ),
    );
    rules.push(
      this.checkSchemaMetadataPresence(
        schema,
        ["description", "description.ar", "description.en"],
        "Theme Description Metadata",
        "Theme metadata should include a clear description for listing/review contexts.",
        "https://docs.salla.dev/421889m0",
        "warning",
      ),
    );
    rules.push(
      this.checkSchemaMetadataPresence(
        schema,
        ["author_email", "support_email"],
        "Theme Support Metadata",
        "Theme metadata should include a support/author email for review and maintenance communication.",
        "https://docs.salla.dev/421889m0",
        "warning",
      ),
    );
    rules.push(
      this.checkSchemaMetadataUrl(
        schema,
        ["repository", "support_url"],
        "Theme Links Metadata",
        "Theme metadata should include valid repository/support URLs when provided.",
        "https://docs.salla.dev/421889m0",
        "warning",
      ),
    );

    // Component Path Alignment
    if (schema.components) {
      for (const comp of schema.components) {
        if (comp.path) {
          rules.push(
            await this.checkPath(
              themePath,
              path.join("src/views", comp.path),
              "contracts",
              `Component: ${comp.name}`,
              `Component template must exist at src/views/${comp.path}`,
              "https://docs.salla.dev/421921m0",
              false,
            ),
          );
        }
      }
    }

    // --- Category D: Publish Readiness (Placeholders for manual/advanced checks) ---
    rules.push(
      await this.checkLayoutPattern(
        themePath,
        "src/views/layouts/master.twig",
        /<meta[^>]+name=["']viewport["']/i,
        "readiness",
        "UI/UX Responsive Viewport",
        "Master layout should include a responsive viewport meta tag.",
        "https://docs.salla.dev/421918m0",
        "warning",
      ),
    );
    rules.push(
      await this.checkLayoutPattern(
        themePath,
        "src/views/layouts/master.twig",
        /<html[^>]+dir\s*=\s*["'][^"']+["']/i,
        "readiness",
        "UI/UX Direction Support",
        "Master layout should define HTML dir attribute (rtl/ltr) for multilingual rendering.",
        "https://docs.salla.dev/421918m0",
        "warning",
      ),
    );
    rules.push(
      await this.checkLayoutPattern(
        themePath,
        "src/views/layouts/master.twig",
        /<main\b/i,
        "readiness",
        "UI/UX Main Landmark",
        "Master layout should include a <main> landmark to preserve content structure and navigation semantics.",
        "https://docs.salla.dev/421918m0",
        "warning",
      ),
    );
    rules.push({
      id: "readiness-docs",
      category: "readiness",
      title: "Salla Docs Linkage",
      description:
        "Platform verification: Direct links to Salla documentation for all requirements.",
      status: "pass",
      sallaDocUrl: "https://docs.salla.dev/421885m0",
    });

    // Calculate Summary & Overall Status
    const summary = {
      pass: rules.filter((r) => r.status === "pass").length,
      warning: rules.filter((r) => r.status === "warning").length,
      fail: rules.filter((r) => r.status === "fail").length,
    };

    let overallStatus: "pass" | "warning" | "fail" = "pass";
    if (summary.fail > 0) overallStatus = "fail";
    else if (summary.warning > 0) overallStatus = "warning";

    return { overallStatus, summary, rules };
  }

  public evaluateThemeComponentCapability(
    schema: TwilightSchema,
  ): ThemeComponentCapabilityReport {
    const components = this.normalizeThemeComponents(schema);
    const pages = THEME_COMPONENT_PAGE_RULES.map((pageRule) => {
      const matched = components.filter((component) =>
        this.componentMatchesPageRule(component.path, pageRule),
      );

      const matchedPaths = Array.from(
        new Set(matched.map((entry) => entry.path)),
      );
      const matchedComponentKeys = Array.from(
        new Set(matched.map((entry) => entry.key)),
      );

      return {
        id: pageRule.id,
        title: pageRule.title,
        prefixes: pageRule.prefixes,
        core: pageRule.core,
        supported: matched.length > 0,
        matchedComponents: matched.length,
        matchedComponentKeys,
        matchedPaths,
      } satisfies ThemeComponentCapabilityPage;
    });

    const supportedPageIds = pages
      .filter((page) => page.supported)
      .map((page) => page.id);
    const missingCorePages = pages
      .filter((page) => page.core && !page.supported)
      .map((page) => page.id);
    const orphanComponentPaths = Array.from(
      new Set(
        components
          .filter(
            (component) =>
              !THEME_COMPONENT_PAGE_RULES.some((pageRule) =>
                this.componentMatchesPageRule(component.path, pageRule),
              ),
          )
          .map((component) => component.path),
      ),
    );

    const coveredPages = pages.filter((page) => page.supported).length;
    const corePages = pages.filter((page) => page.core).length;
    const coveredCorePages = pages.filter(
      (page) => page.core && page.supported,
    ).length;
    const matchedComponents = pages.reduce(
      (sum, page) => sum + page.matchedComponents,
      0,
    );

    let overallStatus: "pass" | "warning" | "fail" = "pass";
    if (components.length === 0) {
      overallStatus = "fail";
    } else if (missingCorePages.length > 0) {
      overallStatus = "warning";
    }

    return {
      overallStatus,
      summary: {
        totalPages: pages.length,
        corePages,
        coveredPages,
        coveredCorePages,
        totalComponents: components.length,
        matchedComponents,
      },
      pages,
      supportedPageIds,
      missingCorePages,
      orphanComponentPaths,
    };
  }

  public async evaluateThemeAnchorProbe(
    themePath: string,
    schema: TwilightSchema,
  ): Promise<ThemeAnchorProbeReport> {
    const components = this.normalizeThemeComponents(schema);
    const layoutAnchors = await this.collectLayoutAnchors(themePath);
    const pages: ThemeAnchorProbePageReport[] = [];
    const missingAnchorPoints = new Set<string>();
    const orphanAnchorPoints = new Set<string>();

    let declaredComponents = 0;
    let renderedComponents = 0;

    for (const pageRule of THEME_COMPONENT_PAGE_RULES) {
      const pageComponents = components.filter((component) =>
        this.componentMatchesPageRule(component.path, pageRule),
      );
      declaredComponents += pageComponents.length;

      const templatePath = await this.resolveFirstExistingTemplate(
        themePath,
        pageRule.templateCandidates,
      );
      const pageAnchors = new Set<string>(layoutAnchors);
      if (templatePath) {
        const templateContent = await this.readTextSafe(
          path.join(themePath, templatePath),
        );
        this.extractComponentAnchors(templateContent).forEach((anchor) =>
          pageAnchors.add(anchor),
        );
      }

      const missingInPage: string[] = [];
      let renderedInPage = 0;
      for (const component of pageComponents) {
        const covered = Array.from(pageAnchors).some((anchor) =>
          this.anchorCoversComponent(
            anchor,
            component.path,
            pageRule.bindingTokens,
          ),
        );
        if (covered) {
          renderedComponents += 1;
          renderedInPage += 1;
        } else {
          missingAnchorPoints.add(component.path);
          missingInPage.push(component.path);
        }
      }

      let pageStatus: "pass" | "warning" | "fail" = "pass";
      if (missingInPage.length > 0) {
        pageStatus = pageRule.core ? "fail" : "warning";
      }

      pages.push({
        id: pageRule.id,
        title: pageRule.title,
        core: pageRule.core,
        status: pageStatus,
        templatePath,
        declaredComponents: pageComponents.length,
        renderedComponents: renderedInPage,
        missingAnchorPoints: missingInPage,
        detectedAnchors: Array.from(pageAnchors),
      });
    }

    const allAnchors = new Set<string>();
    pages.forEach((page) =>
      page.detectedAnchors.forEach((anchor) => allAnchors.add(anchor)),
    );
    for (const anchor of allAnchors) {
      if (!this.isSpecificComponentAnchor(anchor)) continue;
      const referenced = components.some((component) =>
        this.anchorRefersToComponent(anchor, component.path),
      );
      if (!referenced) orphanAnchorPoints.add(anchor);
    }

    const coreMissing = pages.some(
      (page) => page.core && page.missingAnchorPoints.length > 0,
    );
    const pageMissingCount = pages.filter(
      (page) => page.missingAnchorPoints.length > 0,
    ).length;

    let overallStatus: "pass" | "warning" | "fail" = "pass";
    if (components.length === 0 || coreMissing) {
      overallStatus = "fail";
    } else if (missingAnchorPoints.size > 0 || orphanAnchorPoints.size > 0) {
      overallStatus = "warning";
    }

    return {
      overallStatus,
      summary: {
        totalPages: pages.length,
        corePages: pages.filter((page) => page.core).length,
        declaredComponents,
        renderedComponents,
        missingAnchorPoints: missingAnchorPoints.size,
        orphanAnchorPoints: orphanAnchorPoints.size,
        pagesWithMissingAnchors: pageMissingCount,
      },
      pages,
      missingAnchorPoints: Array.from(missingAnchorPoints),
      orphanAnchorPoints: Array.from(orphanAnchorPoints),
    };
  }

  private normalizeThemeComponents(
    schema: TwilightSchema,
  ): NormalizedThemeComponent[] {
    if (!Array.isArray(schema?.components)) return [];
    return schema.components
      .map((component: any, index: number) => {
        const path = this.normalizeComponentPath(component?.path);
        if (!path) return null;
        const keyCandidate =
          typeof component?.key === "string" ? component.key.trim() : "";
        const key = keyCandidate || `component-${index + 1}`;
        return { key, path } satisfies NormalizedThemeComponent;
      })
      .filter((entry): entry is NormalizedThemeComponent => entry !== null);
  }

  private normalizeComponentPath(pathValue: unknown): string {
    const raw = typeof pathValue === "string" ? pathValue.trim() : "";
    if (!raw) return "";
    return raw
      .replace(/^\/+|\/+$/g, "")
      .replace(/\\/g, "/")
      .toLowerCase();
  }

  private pathMatchesPrefix(
    componentPath: string,
    prefixValue: string,
  ): boolean {
    const prefix = this.normalizeComponentPath(prefixValue);
    if (!prefix) return false;
    if (componentPath === prefix) return true;
    return (
      componentPath.startsWith(`${prefix}.`) ||
      componentPath.startsWith(`${prefix}/`)
    );
  }

  private componentMatchesPageRule(
    componentPathValue: string,
    pageRule: ThemeComponentPageRule,
  ): boolean {
    const componentPath = this.normalizeComponentPath(componentPathValue);
    if (!componentPath) return false;

    const included = pageRule.prefixes.some((prefix) =>
      this.pathMatchesPrefix(componentPath, prefix),
    );
    if (!included) return false;

    const excluded = (pageRule.excludePrefixes || []).some((prefix) =>
      this.pathMatchesPrefix(componentPath, prefix),
    );
    if (excluded) return false;

    return true;
  }

  private async resolveFirstExistingTemplate(
    themePath: string,
    candidates: string[],
  ): Promise<string | null> {
    for (const candidate of candidates) {
      const normalizedCandidate = candidate.replace(/\\/g, "/");
      const fullPath = path.join(themePath, normalizedCandidate);
      try {
        const stat = await fs.stat(fullPath);
        if (stat.isFile()) return normalizedCandidate;
      } catch {
        // continue
      }
    }
    return null;
  }

  private async readTextSafe(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, "utf8");
    } catch {
      return "";
    }
  }

  private extractComponentAnchors(content: string): string[] {
    if (!content) return [];
    const anchors = new Set<string>();
    const pattern = /\{%\s*(?:salla_component|component)\s+([\s\S]*?)%\}/gim;
    let match: RegExpExecArray | null = null;
    while ((match = pattern.exec(content)) !== null) {
      const expression = String(match[1] || "").trim();
      if (!expression) continue;
      const rawToken = expression
        .replace(/\s+with[\s\S]*$/i, "")
        .replace(/\s+only[\s\S]*$/i, "")
        .trim();
      if (!rawToken) continue;

      const quoted = rawToken.match(/^["']([^"']+)["']/);
      const tokenCandidate = quoted ? quoted[1] : rawToken.split(/\s+/)[0];
      const normalized = this.normalizeAnchorToken(tokenCandidate);
      if (normalized) anchors.add(normalized);
    }
    return Array.from(anchors);
  }

  private normalizeAnchorToken(tokenValue: unknown): string {
    const raw = String(tokenValue || "").trim();
    if (!raw) return "";
    if (raw.includes("{{") || raw.includes("}}")) return "";
    const withoutWrappers = raw.replace(/^\(+|\)+$/g, "").trim();
    if (!withoutWrappers) return "";
    const normalized = this.normalizeComponentPath(withoutWrappers).replace(
      /\//g,
      ".",
    );
    if (!normalized) return "";
    if (!/^[a-z0-9._-]+$/i.test(normalized)) return "";
    return normalized;
  }

  private isSpecificComponentAnchor(anchor: string): boolean {
    if (!anchor) return false;
    return anchor.includes(".");
  }

  private anchorRefersToComponent(
    anchorValue: string,
    componentPathValue: string,
  ): boolean {
    const anchor = this.normalizeAnchorToken(anchorValue);
    const componentPath = this.normalizeComponentPath(
      componentPathValue,
    ).replace(/\//g, ".");
    if (!anchor || !componentPath) return false;
    if (anchor === componentPath) return true;
    return (
      componentPath.startsWith(`${anchor}.`) ||
      anchor.startsWith(`${componentPath}.`)
    );
  }

  private anchorCoversComponent(
    anchorValue: string,
    componentPathValue: string,
    bindingTokens: string[],
  ): boolean {
    const anchor = this.normalizeAnchorToken(anchorValue);
    const componentPath = this.normalizeComponentPath(
      componentPathValue,
    ).replace(/\//g, ".");
    if (!anchor || !componentPath) return false;

    if (anchor === componentPath) return true;
    if (componentPath.startsWith(`${anchor}.`)) return true;

    const normalizedBindings = bindingTokens
      .map((entry) => this.normalizeAnchorToken(entry))
      .filter(Boolean);
    if (normalizedBindings.includes(anchor)) {
      return componentPath === anchor || componentPath.startsWith(`${anchor}.`);
    }

    return false;
  }

  private async collectLayoutAnchors(themePath: string): Promise<Set<string>> {
    const anchors = new Set<string>();
    const layoutsDir = path.join(themePath, "src", "views", "layouts");
    let entries: string[] = [];
    try {
      entries = await fs.readdir(layoutsDir);
    } catch {
      return anchors;
    }

    for (const entry of entries) {
      if (!entry.toLowerCase().endsWith(".twig")) continue;
      const content = await this.readTextSafe(path.join(layoutsDir, entry));
      this.extractComponentAnchors(content).forEach((anchor) =>
        anchors.add(anchor),
      );
    }
    return anchors;
  }

  private async checkPath(
    basePath: string,
    subPath: string,
    category: any,
    title: string,
    description: string,
    url: string,
    isDirectory: boolean,
  ): Promise<ValidationRule> {
    const fullPath = path.join(basePath, subPath);
    try {
      const stats = await fs.stat(fullPath);
      const isValid = isDirectory ? stats.isDirectory() : stats.isFile();
      return {
        id: subPath,
        category,
        title,
        description,
        status: isValid ? "pass" : "fail",
        sallaDocUrl: url,
      };
    } catch {
      return {
        id: subPath,
        category,
        title,
        description,
        status: "fail",
        sallaDocUrl: url,
      };
    }
  }

  private checkSchemaKey(
    schema: any,
    key: string,
    category: any,
    title: string,
    description: string,
    url: string,
  ): ValidationRule {
    const value = schema[key];
    const status = value && value !== "" ? "pass" : "fail";
    return {
      id: `schema-${key}`,
      category,
      title,
      description,
      status,
      sallaDocUrl: url,
    };
  }

  private async checkLayoutPattern(
    themePath: string,
    layoutRelativePath: string,
    pattern: RegExp,
    category: ValidationRule["category"],
    title: string,
    description: string,
    sallaDocUrl: string,
    missingSeverity: "warning" | "fail" = "warning",
  ): Promise<ValidationRule> {
    const fullPath = path.join(themePath, layoutRelativePath);
    const content = await this.readTextSafe(fullPath);
    if (!content) {
      return {
        id: `layout-pattern-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        category,
        title,
        description,
        status: "fail",
        sallaDocUrl,
      };
    }

    return {
      id: `layout-pattern-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      category,
      title,
      description,
      status: pattern.test(content) ? "pass" : missingSeverity,
      sallaDocUrl,
    };
  }

  private getSchemaValueByPath(schema: any, pathExpr: string): unknown {
    const parts = String(pathExpr || "")
      .split(".")
      .map((entry) => entry.trim())
      .filter(Boolean);

    let cursor: any = schema;
    for (const part of parts) {
      if (!cursor || typeof cursor !== "object" || !(part in cursor)) {
        return undefined;
      }
      cursor = cursor[part];
    }

    return cursor;
  }

  private hasMeaningfulValue(value: unknown): boolean {
    if (value == null) return false;
    if (typeof value === "string") return value.trim().length > 0;
    if (typeof value === "number") return Number.isFinite(value);
    if (typeof value === "boolean") return true;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object")
      return Object.keys(value as Record<string, unknown>).length > 0;
    return false;
  }

  private checkSchemaMetadataPresence(
    schema: any,
    candidatePaths: string[],
    title: string,
    description: string,
    url: string,
    severity: "warning" | "fail" = "warning",
  ): ValidationRule {
    const hasValue = candidatePaths.some((entry) =>
      this.hasMeaningfulValue(this.getSchemaValueByPath(schema, entry)),
    );
    const status: "pass" | "warning" | "fail" = hasValue ? "pass" : severity;
    return {
      id: `metadata-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      category: "readiness",
      title,
      description,
      status,
      sallaDocUrl: url,
    };
  }

  private checkSchemaMetadataUrl(
    schema: any,
    candidatePaths: string[],
    title: string,
    description: string,
    url: string,
    missingSeverity: "warning" | "fail" = "warning",
  ): ValidationRule {
    const values = candidatePaths
      .map((entry) => this.getSchemaValueByPath(schema, entry))
      .filter((entry) => this.hasMeaningfulValue(entry))
      .map((entry) => String(entry).trim());

    if (values.length === 0) {
      return {
        id: `metadata-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        category: "readiness",
        title,
        description,
        status: missingSeverity,
        sallaDocUrl: url,
      };
    }

    const invalid = values.some((entry) => {
      try {
        const parsed = new URL(entry);
        return !["http:", "https:"].includes(parsed.protocol);
      } catch {
        return true;
      }
    });

    return {
      id: `metadata-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      category: "readiness",
      title,
      description,
      status: invalid ? "fail" : "pass",
      sallaDocUrl: url,
    };
  }
}
