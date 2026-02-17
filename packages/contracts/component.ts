export interface ComponentInstance {
    id: string;
    componentKey: string; // Reference to ComponentSchema in theme
    title: string;
    settings: Record<string, any>;
    order: number;
    isVisible: boolean;
}

export interface ComponentRegistry {
    [key: string]: {
        path: string;
        schema: any;
        capabilities: string[];
    };
}

export interface PageDefinition {
    id: string;
    name: string;
    path: string;
    components: ComponentInstance[];
}
