export interface ThemeMetadata {
    id: string;
    name: string;
    version: string;
    author?: string;
    description?: string;
}
export interface ThemeCapabilities {
    supportedPages: string[];
    supportedComponents: string[];
    features: string[];
}
export interface ThemeVersion {
    id: string;
    versionNumber: string;
    releaseDate: string;
    schemaPath: string;
    assetsPath: string;
    viewsPath: string;
}
export interface Theme {
    metadata: ThemeMetadata;
    capabilities: ThemeCapabilities;
    activeVersion: string;
    versions: Record<string, ThemeVersion>;
}
/**
 * Represents the structure of Salla's twilight.json
 */
export interface TwilightSchema {
    name: string;
    author: string;
    version: string;
    settings: Record<string, any>;
    components: Record<string, ComponentSchema>;
}
export interface ComponentSchema {
    title: string;
    icon?: string;
    path: string;
    fields: Record<string, any>;
}
