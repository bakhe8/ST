import * as fs from "fs";
import * as path from "path";
import type { IThemeRuntimeAdapter } from "@vtdr/engine/src/infra/theme-runtime-adapter.interface.js";

export class LocalThemeRuntimeAdapter implements IThemeRuntimeAdapter {
  private readonly neutralPlaceholder = "/images/placeholder.png";

  constructor(private readonly themesBaseDir: string) {}

  public async getThemeSchema(themeId: string): Promise<any | null> {
    const normalizedThemeId = String(themeId || "").trim();
    if (!normalizedThemeId) return null;

    const twilightPath = path.join(
      this.themesBaseDir,
      normalizedThemeId,
      "twilight.json",
    );
    if (!fs.existsSync(twilightPath)) return null;

    try {
      const content = fs.readFileSync(twilightPath, "utf8");
      return JSON.parse(content);
    } catch (error) {
      console.error(
        `[LocalThemeRuntimeAdapter] Failed to parse twilight.json for ${normalizedThemeId}:`,
        error,
      );
      return null;
    }
  }

  public async getThemeSettings(themeId: string): Promise<any[]> {
    const schema = await this.getThemeSchema(themeId);
    return Array.isArray(schema?.settings) ? schema.settings : [];
  }

  public async getThemeComponents(themeId: string): Promise<any[]> {
    const schema = await this.getThemeSchema(themeId);
    return Array.isArray(schema?.components) ? schema.components : [];
  }

  public async themeExists(themeId: string): Promise<boolean> {
    const normalizedThemeId = String(themeId || "").trim();
    if (!normalizedThemeId) return false;
    const themePath = path.join(this.themesBaseDir, normalizedThemeId);
    return fs.existsSync(themePath);
  }

  public resolvePlaceholderImage(themeId?: string | null): string {
    const normalizedThemeId = String(themeId || "").trim();
    if (!normalizedThemeId) {
      return this.neutralPlaceholder;
    }

    const candidates = [
      "public/images/placeholder.png",
      "public/images/s-empty-square.png",
      "public/images/s-empty.png",
      "src/assets/images/placeholder.png",
    ];

    for (const candidate of candidates) {
      const absolute = path.join(
        this.themesBaseDir,
        normalizedThemeId,
        candidate,
      );
      if (fs.existsSync(absolute)) {
        const normalizedCandidate = candidate.replace(/\\/g, "/");
        return `/themes/${normalizedThemeId}/${normalizedCandidate}`;
      }
    }

    return this.neutralPlaceholder;
  }
}
