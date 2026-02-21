import { ThemeMetadata } from "./theme.js";
import { ComponentInstance } from "./component.js";

export interface StoreBranding {
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
}

export interface StoreSocial {
  telegram?: string;
  twitter?: string;
  facebook?: string;
  maroof?: string;
  youtube?: string;
  snapchat?: string;
  whatsapp?: string;
  appstore_link?: string;
  googleplay_link?: string;
}

export interface StoreLicenses {
  tax_number?: string;
  commercial_number?: string;
  freelance_number?: string;
}

export interface StoreBranch {
  id: string;
  name: string;
  type: string;
  status: string;
  is_main: boolean;
  phone?: string;
  email?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface StoreTax {
  id: string;
  name: string;
  tax_number: string;
  amount: number;
  status: string;
  is_global: boolean;
}

export interface StoreShipping {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  status: string;
}

export interface StoreCurrency {
  id: string;
  name: string;
  symbol: string;
  code: string;
  is_default: boolean;
  exchange_rate: number;
}

export interface StoreLanguage {
  id: string;
  name: string;
  code: string;
  is_default: boolean;
  status: string;
}

export interface StoreState {
  id: string;
  name: string;
  entity?: string;
  email?: string;
  avatar?: string;
  plan?: string;
  type?: string;
  status?: string;
  verified?: boolean;
  domain?: string;
  description?: string;
  locale: string;
  currency: string;
  branding: StoreBranding;
  social?: StoreSocial;
  licenses?: StoreLicenses;
  branches?: StoreBranch[];
  taxes?: StoreTax[];
  shipping?: StoreShipping[];
  currencies?: StoreCurrency[];
  languages?: StoreLanguage[];
  settings: Record<string, any>; // Global store settings
  themeId?: string;
  themeVersionId?: string;
}

export interface Store extends StoreState {
  title: string;
  isActive: boolean;
  fakerSeed?: string;
  blueprintId?: string;
  isMaster?: boolean;
  parentStoreId?: string;
}

// Webhook subscription contract (Store-First runtime)
export interface WebhookSubscription {
  id: string;
  url: string;
  secret: string;
  events: string[];
  isActive: boolean;
}

// VirtualStore removed in favor of Store

import * as Salla from "./src/salla.generated.js";

/**
 * The final context injected into the Theme Renderer (Salla's Twig environment)
 */
export interface RuntimeContext {
  storeId: string;
  theme: ThemeMetadata;
  store: StoreState;
  page: {
    id: string;
    components: ComponentInstance[];
  };
  settings: Record<string, any>; // Merged theme settings
  translations: Record<string, string>;
  hooks?: Record<string, string>;

  // Rich Data Injections
  products?: SallaProduct[];
  categories?: Salla.components["schemas"]["Category"][];
  brands?: Salla.components["schemas"]["Brand"][];
  pages?: Record<string, any>[];
  blog_articles?: Record<string, any>[];
  blog_categories?: Record<string, any>[];
  orders?: SallaOrder[];
  exports?: SallaExport[];
  optionTemplates?: SallaProductOptionTemplate[];
  specialOffers?: SallaSpecialOffer[];
  affiliates?: SallaAffiliate[];
  coupons?: SallaCoupon[];
  loyalty?: SallaLoyalty;
  landing?: Record<string, any>;
}

export interface SallaCustomer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  avatar?: string;
}

export interface SallaAddress {
  shipping_address: string;
  billing_address: string;
  city: string;
  country: string;
  postal_code?: string;
}

export interface SallaOrderItem {
  id: string;
  name: string;
  sku?: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
}

export interface SallaOrderHistory {
  id: string;
  status: string;
  note?: string;
  created_at: string;
}

export interface SallaProductTag {
  id: string;
  name: string;
  url?: string;
}

export interface SallaProductVariant {
  id: string;
  sku?: string;
  price: number;
  sale_price?: number;
  is_available: boolean;
  images?: Salla.components["schemas"]["ProductImage"][];
  options?: {
    name: string;
    value: string;
  }[];
}

export interface SallaProduct extends Omit<
  Salla.components["schemas"]["Product"],
  "id" | "name"
> {
  id: string;
  name: string;
  tags?: SallaProductTag[];
  variants?: SallaProductVariant[];
}

export interface SallaExport {
  id: string;
  type: "product" | "order" | "customer" | "custom-url";
  status: "pending" | "completed" | "failed";
  url?: string;
  created_at: string;
}

export interface SallaProductOptionTemplate {
  id: string;
  name: string;
  type: string;
  description?: string;
  sort?: number;
  display_type?: string;
  required?: boolean;
  associated_with_order_time?: boolean;
  not_same_day_order?: boolean;
  availability_range?: boolean;
  from_date_time?: string;
  to_date_time?: string;
  visibility_condition_type?: string;
  visibility_condition_option?: string;
  visibility_condition_value?: string;
  visibility_condition?: Record<string, unknown>;
  advance?: Record<string, unknown>;
  values?: {
    id: string;
    name: string;
    price?: number;
    full_name?: string;
    additional_price?: number;
    image?: string;
    color?: string;
    is_default?: boolean;
    is_selected?: boolean;
    is_out?: boolean;
  }[];
}

export interface SallaSpecialOffer {
  id: string;
  name: string;
  type: string;
  status: string;
  start_date?: string;
  end_date?: string;
  products?: string[];
}

export interface SallaAffiliate {
  id: string;
  name: string;
  code: string;
  commission_type: "fixed" | "percentage";
  commission_value: number;
  status: string;
}

export interface SallaOrder {
  id: string;
  order_number: string;
  status: {
    id: string;
    name: string;
    type: string;
  };
  total: {
    amount: number;
    currency: string;
  };
  created_at: string;
  updated_at: string;
  customer: SallaCustomer;
  address: SallaAddress;
  items: SallaOrderItem[];
  history?: SallaOrderHistory[];
  payment_method?: string;
  shipping_method?: string;
}

export interface SallaCoupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  amount: number;
  description: string;
  expiry_date: string;
}

export interface SallaLoyalty {
  points: number;
  level: string;
  points_to_next_level: number;
  exchange_rate: number; // Points per currency unit
}

export interface ExtendedRuntimeContext extends RuntimeContext {
  loyalty?: SallaLoyalty; // Injected into user context usually
  coupons?: SallaCoupon[]; // Available coupons for the store
}
