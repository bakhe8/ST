import { Router } from "express";
import type { PreviewRenderOrchestrator } from "@vtdr/engine";
import { ok } from "../utils/api-response.js";

export function createSystemRoutes(
  themesBaseDir: string,
  previewOrchestrator?: PreviewRenderOrchestrator,
) {
  const router = Router();

  router.get("/info", (req, res) => {
    return ok(res, {
      version: "1.0.0",
      environment: "development",
      activeRuntime: true,
    });
  });

  router.get("/status", (req, res) => {
    return ok(res, {
      name: "VTDR API",
      status: "active",
      themesPath: themesBaseDir,
    });
  });

  router.get("/preview/metrics", (req, res) => {
    const limit = Math.max(1, Math.min(200, Number(req.query.limit || 20)));
    if (!previewOrchestrator) {
      return ok(res, {
        enabled: false,
        reason: "PreviewRenderOrchestrator not configured",
        metrics: [],
        baseline: {
          samples: 0,
          avgTotalMs: 0,
          p95TotalMs: 0,
          avgRenderMs: 0,
        },
      });
    }

    const metrics = previewOrchestrator.getRenderMetrics(limit);
    const baseline = previewOrchestrator.getRenderBaseline(limit);
    return ok(res, {
      enabled: true,
      limit,
      metrics,
      baseline,
    });
  });

  return router;
}
