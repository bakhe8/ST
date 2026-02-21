import { createHash } from "crypto";

export type RenderScopeInput = {
  storeId?: string;
  themeId?: string;
  themeVersion?: string;
  themeFolder?: string;
  templateId?: string;
  templatePath?: string;
  viewsPath?: string;
  viewport?: string;
};

const normalizeToken = (value: unknown, fallback = "na") => {
  const token = String(value || "").trim();
  return token || fallback;
};

const normalizePathToken = (value: unknown) => {
  return normalizeToken(value).replace(/\\/g, "/");
};

export type RenderScope = {
  rawKey: string;
  hash: string;
  templateCacheId: string;
};

export const buildRenderScope = (input: RenderScopeInput): RenderScope => {
  const rawKey = [
    `store:${normalizeToken(input.storeId, "store-unknown")}`,
    `theme:${normalizeToken(input.themeId, "theme-unknown")}`,
    `version:${normalizeToken(input.themeVersion, "version-unknown")}`,
    `folder:${normalizePathToken(input.themeFolder)}`,
    `template:${normalizeToken(input.templateId, "index")}`,
    `templatePath:${normalizePathToken(input.templatePath)}`,
    `views:${normalizePathToken(input.viewsPath)}`,
    `viewport:${normalizeToken(input.viewport, "desktop").toLowerCase()}`,
  ].join("|");

  const hash = createHash("sha1").update(rawKey).digest("hex").slice(0, 20);
  return {
    rawKey,
    hash,
    templateCacheId: `vtdr:${hash}`,
  };
};
