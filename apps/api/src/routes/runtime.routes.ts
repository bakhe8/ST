import { Router, Response } from "express";
import { PreviewRenderOrchestrator, resolveWildcardPath } from "@vtdr/engine";
import { StoreRequest } from "../middlewares/context.middleware.js";
import { ok } from "../utils/api-response.js";

export function createRuntimeRoutes(
  previewOrchestrator: PreviewRenderOrchestrator,
) {
  const router = Router();

  const isUuidLike = (value: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    );

  const extractJsBaseName = (assetPath: string) => {
    const normalizedPath = String(assetPath || "").trim();
    if (!normalizedPath.toLowerCase().endsWith(".js")) {
      return "";
    }

    const fileName = normalizedPath.split("/").filter(Boolean).pop() || "";
    return fileName.replace(/\.js$/i, "").trim().toLowerCase();
  };

  const isPreviewTranslationScriptRequest = (
    assetName: string,
    storeId: string,
  ) => {
    const scriptBase = extractJsBaseName(assetName);
    const normalizedStoreId = String(storeId || "")
      .trim()
      .toLowerCase();
    if (!scriptBase) {
      return false;
    }

    if (scriptBase === normalizedStoreId || isUuidLike(scriptBase)) {
      return true;
    }

    // Twilight may request translation bundles by numeric hash (e.g. 1771463870750.js).
    return /^\d{8,}$/.test(scriptBase);
  };

  const buildTranslationStubScript = (storeId: string, scriptBase: string) => `
;(function () {
    window.salla = window.salla || {};
    window.salla.translations = window.salla.translations || {};
    window.__VTDR_TRANSLATIONS__ = window.__VTDR_TRANSLATIONS__ || {};
    window.__VTDR_TRANSLATIONS__.storeId = ${JSON.stringify(storeId)};
    window.__VTDR_TRANSLATIONS__.hash = ${JSON.stringify(scriptBase)};
})();
`;

  const renderPreview = async (
    req: StoreRequest,
    res: Response,
    wildcardPath = "",
  ) => {
    try {
      const result = await previewOrchestrator.render({
        store: req.store,
        requestedThemeId: (req.params as any)?.themeId,
        requestedVersion: (req.params as any)?.version,
        query: req.query as Record<string, unknown>,
        wildcardPath,
      });
      if (!result.ok) {
        return res.status(result.status).send(result.message);
      }

      const baseline = previewOrchestrator.getRenderBaseline(50);
      res.setHeader("X-VTDR-Render-Total-Ms", String(result.metrics.totalMs));
      res.setHeader(
        "X-VTDR-Render-Context-Ms",
        String(result.metrics.contextBuildMs),
      );
      res.setHeader("X-VTDR-Render-P95-Ms", String(baseline.p95TotalMs));
      res.status(200).type("text/html").send(result.html);
    } catch (error: any) {
      res.status(500).send(`Preview rendering failed: ${error.message}`);
    }
  };

  router.get(
    "/preview/:storeId/:themeId/:version/*rest",
    async (req: StoreRequest, res: Response) => {
      const params = req.params as Record<string, unknown>;
      const wildcardPath = resolveWildcardPath(params.rest);
      if (
        isPreviewTranslationScriptRequest(
          wildcardPath,
          String(params.storeId || ""),
        )
      ) {
        const scriptBase = extractJsBaseName(wildcardPath);
        return res
          .status(200)
          .type("application/javascript")
          .send(
            buildTranslationStubScript(
              String(params.storeId || ""),
              scriptBase,
            ),
          );
      }
      return renderPreview(req, res, wildcardPath);
    },
  );

  router.get(
    "/preview/:storeId/:themeId/:version",
    async (req: StoreRequest, res: Response) => {
      return renderPreview(req, res, "");
    },
  );

  router.post("/render", async (req: StoreRequest, res: Response) => {
    const result = await previewOrchestrator.buildStoreContext(
      req.storeId || "",
    );
    if (!result.ok) {
      return res.status(result.status).json({
        success: false,
        error: result.message,
      });
    }

    return ok(res, { context: result.context });
  });

  return router;
}
