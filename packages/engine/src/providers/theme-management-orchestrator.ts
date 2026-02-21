import path from "path";
import { ThemeLoader } from "../rendering/theme-loader.js";
import { ThemeRegistry } from "../rendering/theme-registry.js";
import {
  SallaValidator,
  ThemeAnchorProbeReport,
  ThemeComponentCapabilityReport,
} from "../validators/salla-validator.js";

type ThemeActionResult<T> =
  | {
      ok: true;
      status: number;
      data: T;
    }
  | {
      ok: false;
      status: number;
      message: string;
    };

type ThemeCapabilitySnapshot = {
  folder: string;
  themeId: string;
  name: string;
  version: string;
  overallStatus: "pass" | "warning" | "fail";
  capability: ThemeComponentCapabilityReport;
  anchorProbe: ThemeAnchorProbeReport;
};

const asString = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
};

export class ThemeManagementOrchestrator {
  constructor(
    private themeRegistry: ThemeRegistry,
    private themeLoader: ThemeLoader,
    private sallaValidator: SallaValidator,
    private themesBaseDir: string,
  ) {}

  public async listThemes() {
    return this.themeRegistry.listThemes();
  }

  public async discoverThemes() {
    const localFolders = await this.themeLoader.scanThemes();
    const registeredThemes = await this.themeRegistry.listThemes();
    const registeredIds = new Set(
      registeredThemes.map((theme: any) => theme.id),
    );

    const discovery = await Promise.all(
      localFolders.map(async (folder) => {
        const schema = await this.themeLoader.loadTwilightSchema(folder);
        if (!schema) return null;

        const metadata = this.themeLoader.extractMetadata(folder, schema);
        const themePath = path.join(this.themesBaseDir, folder);
        const compatibility = await this.sallaValidator.validateTheme(
          themePath,
          schema,
        );
        const componentCapability =
          this.sallaValidator.evaluateThemeComponentCapability(schema);
        const anchorProbe = await this.sallaValidator.evaluateThemeAnchorProbe(
          themePath,
          schema,
        );
        const changeLog = await this.themeLoader.getThemeChangeLog(folder);
        const overallStatus = this.resolveThemeOverallStatus(
          componentCapability.overallStatus,
          anchorProbe.overallStatus,
        );

        return {
          ...metadata,
          folder,
          isRegistered: registeredIds.has(folder),
          compatibility,
          componentCapability,
          anchorProbe,
          changeLog,
          overallStatus,
        };
      }),
    );

    return discovery.filter((entry) => entry !== null);
  }

  public async registerTheme(folder: unknown): Promise<ThemeActionResult<any>> {
    const normalizedFolder = asString(folder).trim();
    if (!normalizedFolder) {
      return {
        ok: false,
        status: 400,
        message: "Folder name is required",
      };
    }

    const schema = await this.themeLoader.loadTwilightSchema(normalizedFolder);
    if (!schema) {
      return {
        ok: false,
        status: 404,
        message: "Theme schema not found",
      };
    }

    const metadata = this.themeLoader.extractMetadata(normalizedFolder, schema);
    const theme = await this.themeRegistry.syncTheme(
      metadata,
      schema,
      path.join(this.themesBaseDir, normalizedFolder),
    );
    const componentCapability =
      this.sallaValidator.evaluateThemeComponentCapability(schema);
    const anchorProbe = await this.sallaValidator.evaluateThemeAnchorProbe(
      path.join(this.themesBaseDir, normalizedFolder),
      schema,
    );
    const changeLog =
      await this.themeLoader.getThemeChangeLog(normalizedFolder);
    const overallStatus = this.resolveThemeOverallStatus(
      componentCapability.overallStatus,
      anchorProbe.overallStatus,
    );

    return {
      ok: true,
      status: 200,
      data: {
        ...theme,
        componentCapability,
        anchorProbe,
        changeLog,
        overallStatus,
      },
    };
  }

  public async getThemeChangeLog(
    themeId: unknown,
  ): Promise<ThemeActionResult<any>> {
    const normalizedThemeId = asString(themeId).trim();
    if (!normalizedThemeId) {
      return {
        ok: false,
        status: 400,
        message: "Theme id is required",
      };
    }

    const schema = await this.themeLoader.loadTwilightSchema(normalizedThemeId);
    if (!schema) {
      return {
        ok: false,
        status: 404,
        message: "Theme not found",
      };
    }

    const metadata = this.themeLoader.extractMetadata(
      normalizedThemeId,
      schema,
    );
    const changeLog =
      await this.themeLoader.getThemeChangeLog(normalizedThemeId);

    return {
      ok: true,
      status: 200,
      data: {
        themeId: normalizedThemeId,
        theme: metadata,
        changeLog,
      },
    };
  }

  public async syncThemes(): Promise<
    ThemeActionResult<{
      synced: number;
      capabilityGate: {
        overallStatus: "pass" | "warning" | "fail";
        themes: ThemeCapabilitySnapshot[];
      };
    }>
  > {
    try {
      const localFolders = await this.themeLoader.scanThemes();
      let syncedCount = 0;
      const capabilityReports: ThemeCapabilitySnapshot[] = [];

      for (const folder of localFolders) {
        const schema = await this.themeLoader.loadTwilightSchema(folder);
        if (!schema) continue;

        const metadata = this.themeLoader.extractMetadata(folder, schema);
        const themePath = path.join(this.themesBaseDir, folder);
        await this.themeRegistry.syncTheme(metadata, schema, themePath);
        const componentCapability =
          this.sallaValidator.evaluateThemeComponentCapability(schema);
        const anchorProbe = await this.sallaValidator.evaluateThemeAnchorProbe(
          themePath,
          schema,
        );
        const overallStatus = this.resolveThemeOverallStatus(
          componentCapability.overallStatus,
          anchorProbe.overallStatus,
        );

        capabilityReports.push({
          folder,
          themeId: metadata.id,
          name: metadata.name,
          version: metadata.version,
          overallStatus,
          capability: componentCapability,
          anchorProbe,
        });
        syncedCount++;
      }

      const overallStatus =
        this.resolveAggregateCapabilityStatus(capabilityReports);

      return {
        ok: true,
        status: 200,
        data: {
          synced: syncedCount,
          capabilityGate: {
            overallStatus,
            themes: capabilityReports,
          },
        },
      };
    } catch (error: any) {
      return {
        ok: false,
        status: 500,
        message: error?.message || "Theme sync failed",
      };
    }
  }

  private resolveAggregateCapabilityStatus(
    reports: ThemeCapabilitySnapshot[],
  ): "pass" | "warning" | "fail" {
    const statuses = reports.map((entry) => entry.overallStatus);
    if (statuses.length === 0) return "fail";
    if (statuses.includes("fail")) return "fail";
    if (statuses.includes("warning")) return "warning";
    return "pass";
  }

  private resolveThemeOverallStatus(
    capabilityStatus: "pass" | "warning" | "fail",
    anchorStatus: "pass" | "warning" | "fail",
  ): "pass" | "warning" | "fail" {
    if (capabilityStatus === "fail" || anchorStatus === "fail") return "fail";
    if (capabilityStatus === "warning" || anchorStatus === "warning")
      return "warning";
    return "pass";
  }
}
