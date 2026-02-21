import { CompositionEngine } from "../core/composition-engine.js";
import { StoreLogic } from "../core/store-logic.js";
import {
  bindPreviewContext,
  resolvePreviewTarget,
} from "./preview-context-service.js";
import { RendererService } from "./renderer-service.js";
import { PreviewThemeResolver } from "./preview-theme-resolver.js";
import {
  hydratePreviewEntities,
  renderPreviewWithFallback,
} from "./preview-runtime-service.js";
import { SeederService } from "../providers/seeder-service.js";
import type { RuntimeContext } from "@vtdr/contracts";

type StoreLike = {
  id?: string;
  themeId?: string;
  themeVersionId?: string;
};

export type PreviewViewport = "desktop" | "mobile";

export type PreviewRenderMetrics = {
  recordedAt: string;
  storeId: string;
  themeId: string;
  themeVersion: string;
  pageId: string;
  viewport: PreviewViewport;
  contextBuildMs: number;
  hydrateMs: number;
  renderMs: number;
  totalMs: number;
};

export type PreviewRenderBaseline = {
  samples: number;
  avgTotalMs: number;
  p95TotalMs: number;
  avgRenderMs: number;
};

export type PreviewRenderResult =
  | {
      ok: true;
      status: 200;
      html: string;
      metrics: PreviewRenderMetrics;
    }
  | {
      ok: false;
      status: number;
      message: string;
    };

export type RuntimeContextResult =
  | {
      ok: true;
      status: 200;
      context: RuntimeContext;
    }
  | {
      ok: false;
      status: number;
      message: string;
    };

const asString = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
};

const resolveViewport = (query: Record<string, unknown>): PreviewViewport => {
  const raw = String(query.viewport || "desktop").toLowerCase();
  return raw === "mobile" ? "mobile" : "desktop";
};

const now = () => {
  if (
    typeof performance !== "undefined" &&
    typeof performance.now === "function"
  ) {
    return performance.now();
  }
  return Date.now();
};

const roundMs = (value: number) => Math.round(value * 100) / 100;

const percentile = (values: number[], p: number) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.max(
    0,
    Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1),
  );
  return sorted[index];
};

export const resolveWildcardPath = (value: unknown): string => {
  return Array.isArray(value)
    ? value.map((entry) => asString(entry)).join("/")
    : asString(value);
};

export class PreviewRenderOrchestrator {
  private previewThemeResolver: PreviewThemeResolver;
  private renderMetrics: PreviewRenderMetrics[] = [];
  private readonly maxRenderMetrics = 250;
  private readonly previewBackfillTtlMs = 30000;
  private previewBackfillStamp = new Map<string, number>();

  constructor(
    private engine: CompositionEngine,
    private renderer: RendererService,
    private storeLogic: StoreLogic,
    themeRegistry: any,
    private seeder?: SeederService,
  ) {
    this.previewThemeResolver = new PreviewThemeResolver(themeRegistry);
  }

  private shouldBackfillStore(storeId: string): boolean {
    const now = Date.now();
    const last = this.previewBackfillStamp.get(storeId) || 0;
    if (now - last < this.previewBackfillTtlMs) {
      return false;
    }
    this.previewBackfillStamp.set(storeId, now);
    return true;
  }

  private async ensurePreviewBackfill(storeId: string): Promise<void> {
    if (!this.seeder) return;
    if (!this.shouldBackfillStore(storeId)) return;

    try {
      const result = await this.seeder.ensureMinimumCoreData(storeId);
      const added = result.added;
      const totalAdded = Object.values(added).reduce(
        (sum, value) => sum + Number(value || 0),
        0,
      );
      if (totalAdded > 0) {
        console.log(
          `[Preview] Backfilled core data for store=${storeId} ` +
            `(store=${added.store}, brands=${added.brands}, categories=${added.categories}, ` +
            `products=${added.products}, pages=${added.pages}, menus=${added.menus}, ` +
            `blogCategories=${added.blogCategories}, blogArticles=${added.blogArticles}, ` +
            `loyalty=${added.loyalty}, landing=${added.landing}, wishlist=${added.wishlist}, ` +
            `orders=${added.orders}, checkoutSessions=${added.checkoutSessions})`,
        );
      }
    } catch (error: any) {
      console.warn(
        `[Preview] Backfill skipped for store=${storeId}: ${error?.message || "unknown error"}`,
      );
    }
  }

  public async render(input: {
    store: StoreLike | null | undefined;
    requestedThemeId?: unknown;
    requestedVersion?: unknown;
    query: Record<string, unknown>;
    wildcardPath?: string;
  }): Promise<PreviewRenderResult> {
    const store = input.store;
    const storeId = String(store?.id || "").trim();
    if (!store || !storeId) {
      return {
        ok: false,
        status: 404,
        message: "Store context not found",
      };
    }

    const target = resolvePreviewTarget(
      input.query.page,
      String(input.wildcardPath || ""),
    );
    const viewport = resolveViewport(input.query);
    const startedAt = now();

    await this.ensurePreviewBackfill(storeId);

    const themeResolution = await this.previewThemeResolver.resolve({
      store,
      requestedThemeId: input.requestedThemeId,
      requestedVersion: input.requestedVersion,
    });
    if (!themeResolution.ok) {
      return themeResolution;
    }

    const contextStartedAt = now();
    const context = await this.engine.buildContext(storeId, target.pageId, {
      themeId: themeResolution.themeId,
      themeVersionId: themeResolution.themeVersionId,
    });
    const contextBuildMs = roundMs(now() - contextStartedAt);
    if (!context) {
      return {
        ok: false,
        status: 500,
        message: "Failed to build context",
      };
    }

    const hydrateStartedAt = now();
    await hydratePreviewEntities({
      storeId,
      context,
      storeLogic: this.storeLogic,
    });
    const hydrateMs = roundMs(now() - hydrateStartedAt);

    bindPreviewContext({
      context,
      target,
      query: input.query,
      viewport,
      theme: {
        themeId: themeResolution.themeId,
        themeVersionId: themeResolution.themeVersionId,
        themeVersion: themeResolution.themeVersion,
      },
    });

    const renderStartedAt = now();
    const html = await renderPreviewWithFallback({
      renderer: this.renderer,
      context,
      themeId: themeResolution.themeId,
      target,
    });
    const renderMs = roundMs(now() - renderStartedAt);
    const totalMs = roundMs(now() - startedAt);

    const metrics: PreviewRenderMetrics = {
      recordedAt: new Date().toISOString(),
      storeId,
      themeId: String(themeResolution.themeId || ""),
      themeVersion: String(themeResolution.themeVersion || ""),
      pageId: target.pageId,
      viewport,
      contextBuildMs,
      hydrateMs,
      renderMs,
      totalMs,
    };

    this.recordMetrics(metrics);

    return {
      ok: true,
      status: 200,
      html,
      metrics,
    };
  }

  public getRenderMetrics(limit = 20): PreviewRenderMetrics[] {
    const safeLimit = Number.isFinite(limit)
      ? Math.max(1, Math.floor(limit))
      : 20;
    return this.renderMetrics.slice(-safeLimit);
  }

  public getRenderBaseline(limit = 50): PreviewRenderBaseline {
    const sample = this.getRenderMetrics(limit);
    if (!sample.length) {
      return {
        samples: 0,
        avgTotalMs: 0,
        p95TotalMs: 0,
        avgRenderMs: 0,
      };
    }

    const totalValues = sample.map((entry) => entry.totalMs);
    const renderValues = sample.map((entry) => entry.renderMs);
    const avgTotalMs = roundMs(
      totalValues.reduce((acc, item) => acc + item, 0) / sample.length,
    );
    const avgRenderMs = roundMs(
      renderValues.reduce((acc, item) => acc + item, 0) / sample.length,
    );
    const p95TotalMs = roundMs(percentile(totalValues, 95));

    return {
      samples: sample.length,
      avgTotalMs,
      p95TotalMs,
      avgRenderMs,
    };
  }

  public async buildStoreContext(
    storeId: string,
  ): Promise<RuntimeContextResult> {
    const normalizedStoreId = String(storeId || "").trim();
    if (!normalizedStoreId) {
      return {
        ok: false,
        status: 400,
        message: "Store context required",
      };
    }

    const context = await this.engine.buildContext(normalizedStoreId);
    if (!context) {
      return {
        ok: false,
        status: 404,
        message: "Store not found",
      };
    }

    return {
      ok: true,
      status: 200,
      context,
    };
  }

  private recordMetrics(entry: PreviewRenderMetrics) {
    this.renderMetrics.push(entry);
    if (this.renderMetrics.length > this.maxRenderMetrics) {
      this.renderMetrics.splice(
        0,
        this.renderMetrics.length - this.maxRenderMetrics,
      );
    }
  }
}
