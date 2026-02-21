export interface IThemeRuntimeAdapter {
  /**
   * Loads full theme schema (twilight.json) for a given theme id.
   */
  getThemeSchema(themeId: string): Promise<any | null>;

  /**
   * Returns normalized settings array from theme schema.
   */
  getThemeSettings(themeId: string): Promise<any[]>;

  /**
   * Returns normalized components array from theme schema.
   */
  getThemeComponents(themeId: string): Promise<any[]>;

  /**
   * Checks whether a theme directory exists locally.
   */
  themeExists(themeId: string): Promise<boolean>;

  /**
   * Resolves a neutral fallback placeholder image.
   */
  resolvePlaceholderImage(themeId?: string | null): string;
}
