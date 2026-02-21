import * as path from "path";
import { TwilightSchema, ThemeMetadata } from "@vtdr/contracts";
import { IFileSystem } from "../infra/file-system.interface.js";

type ThemeChangeLogEntry = {
  title: string;
  date: string | null;
  items: string[];
};

type ThemeChangeLog = {
  themeId: string;
  exists: boolean;
  sourceFile: string | null;
  sourcePath: string | null;
  content: string;
  entries: ThemeChangeLogEntry[];
};

export class ThemeLoader {
  constructor(
    private themesBaseDir: string,
    private fs: IFileSystem,
  ) {}

  /**
   * Scans the base directory for theme folders (containing twilight.json)
   */
  public async scanThemes(): Promise<string[]> {
    try {
      const entries = await this.fs.readdir(this.themesBaseDir);
      const themeFolders = [];

      for (const folderName of entries) {
        const twilightPath = path.join(
          this.themesBaseDir,
          folderName,
          "twilight.json",
        );
        if (await this.fs.exists(twilightPath)) {
          themeFolders.push(folderName);
        }
      }

      return themeFolders;
    } catch (error) {
      console.error("Error scanning themes:", error);
      return [];
    }
  }

  /**
   * Loads and validates the twilight.json file from a specific theme
   */
  public async loadTwilightSchema(
    themeFolderName: string,
  ): Promise<TwilightSchema | null> {
    const twilightPath = path.join(
      this.themesBaseDir,
      themeFolderName,
      "twilight.json",
    );
    try {
      const content = await this.fs.readFile(twilightPath, "utf8");
      const schema = JSON.parse(content) as TwilightSchema;

      // Basic validation (required fields)
      if (!schema.name || !schema.version) {
        throw new Error("Invalid twilight.json: Missing name or version");
      }

      return schema;
    } catch (error) {
      console.error(
        `Error loading theme schema for ${themeFolderName}:`,
        error,
      );
      return null;
    }
  }

  /**
   * Extracts ThemeMetadata from a twilight.json schema
   */
  public extractMetadata(
    themeFolderName: string,
    schema: TwilightSchema,
  ): ThemeMetadata {
    return {
      id: themeFolderName, // Using folder name as stable ID for local themes
      name:
        typeof schema.name === "string"
          ? schema.name
          : (schema.name as any).ar ||
            (schema.name as any).en ||
            themeFolderName,
      version: schema.version || "1.0.0",
      author: (schema as any).author || (schema as any).author_email || "Salla",
      description:
        typeof (schema as any).description === "string"
          ? (schema as any).description
          : (schema as any).description?.en ||
            (schema as any).description?.ar ||
            "",
    };
  }

  public async getThemeChangeLog(
    themeFolderName: string,
  ): Promise<ThemeChangeLog> {
    const themePath = path.join(this.themesBaseDir, themeFolderName);
    const candidates = [
      "CHANGELOG.md",
      "changelog.md",
      "CHANGES.md",
      "changes.md",
      "ChangeLog.md",
      path.join("docs", "CHANGELOG.md"),
      path.join("docs", "changelog.md"),
    ];

    for (const candidate of candidates) {
      const filePath = path.join(themePath, candidate);
      if (!(await this.fs.exists(filePath))) continue;

      const content = await this.fs.readFile(filePath, "utf8");
      return {
        themeId: themeFolderName,
        exists: true,
        sourceFile: path.basename(candidate),
        sourcePath: filePath,
        content,
        entries: this.parseChangeLogEntries(content),
      };
    }

    return {
      themeId: themeFolderName,
      exists: false,
      sourceFile: null,
      sourcePath: null,
      content: "",
      entries: [],
    };
  }

  private parseChangeLogEntries(content: string): ThemeChangeLogEntry[] {
    const normalized = String(content || "").replace(/\r/g, "");
    const lines = normalized.split("\n");
    const entries: ThemeChangeLogEntry[] = [];

    let current: ThemeChangeLogEntry | null = null;

    for (const lineRaw of lines) {
      const line = String(lineRaw || "").trim();
      if (!line) continue;

      const headingMatch = /^(#{2,3})\s+(.+)$/.exec(line);
      if (headingMatch) {
        if (current) entries.push(current);
        const headingText = String(headingMatch[2] || "").trim();
        const dateMatch = /\[(\d{4}-\d{2}-\d{2})\]|(\d{4}-\d{2}-\d{2})/.exec(
          headingText,
        );
        const date = dateMatch ? dateMatch[1] || dateMatch[2] || null : null;
        const title =
          headingText
            .replace(/\[(\d{4}-\d{2}-\d{2})\]/g, "")
            .replace(/^\-+|\-+$/g, "")
            .trim() || headingText;
        current = {
          title,
          date,
          items: [],
        };
        continue;
      }

      const bulletMatch = /^[-*]\s+(.+)$/.exec(line);
      if (bulletMatch) {
        if (!current) {
          current = {
            title: "General",
            date: null,
            items: [],
          };
        }
        current.items.push(String(bulletMatch[1] || "").trim());
      }
    }

    if (current) entries.push(current);
    return entries;
  }

  /**
   * Discovers sub-directories for views, assets, etc.
   */
  public async getThemeStructure(themeFolderName: string) {
    const themePath = path.join(this.themesBaseDir, themeFolderName);
    return {
      views: path.join(themePath, "src", "views"), // Standard Salla theme structure
      assets: path.join(themePath, "public"),
      config: path.join(themePath, "config"),
    };
  }
}
