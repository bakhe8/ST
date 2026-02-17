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
    features: string[]; // e.g., 'dark-mode', 'wishlist'
}

export interface ThemeVersion {
    id: string; // usually same as metadata.id for now or hash
    versionNumber: string;
    releaseDate: string;
    schemaPath: string; // path to twilight.json or equivalent
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
    name: string | { ar: string; en: string };
    version: string;
    description?: string;
    author?: string;
    author_email?: string;
    repository?: string;
    features?: string[];
    settings?: any[];
    components?: any[];
    screens?: any;
    layouts?: any;
}

export interface ComponentSchema {
    title: string;
    icon?: string;
    path: string;
    fields: Record<string, any>; // Field definitions for the component
}
