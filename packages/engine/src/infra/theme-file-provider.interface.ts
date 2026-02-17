export interface IThemeFileProvider {
    /**
     * Reads the twilight.json file for a specific theme.
     * Implementation handles path resolution (OS-specific).
     */
    getThemeSettings(themeId: string): Promise<any>;

    /**
     * Checks if a theme directory exists.
     */
    themeExists(themeId: string): Promise<boolean>;
}
