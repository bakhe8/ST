import { ThemeMetadata } from "./theme.contract";
import { ComponentInstance } from "./component.contract";
export interface StoreBranding {
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
}
export interface StoreState {
  id: string;
  name: string;
  locale: string;
  currency: string;
  branding: StoreBranding;
  settings: Record<string, any>;
}
export interface Scenario {
  id: string;
  name: string;
  description?: string;
  storeState: Partial<StoreState>;
  pageOverrides: Record<string, Partial<ComponentInstance>[]>;
}
export interface VirtualStore {
  id: string;
  name: string;
  activeThemeId: string;
  activeThemeVersion: string;
  state: StoreState;
  activeScenarioId?: string;
}
/**
 * The final context injected into the Theme Renderer (Salla's Twig environment)
 */
export interface RuntimeContext {
  theme: ThemeMetadata;
  store: StoreState;
  page: {
    id: string;
    components: ComponentInstance[];
  };
  settings: Record<string, any>;
  translations: Record<string, string>;
}
