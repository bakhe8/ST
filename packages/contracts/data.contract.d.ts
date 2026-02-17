export interface Media {
    id: string;
    type: 'image' | 'video';
    url: string;
    alt?: string;
}
export interface Price {
    amount: number;
    currency: string;
    formatted?: string;
    salePrice?: number;
}
export interface Attribute {
    key: string;
    type: 'text' | 'number' | 'boolean' | 'list' | 'table';
    label: string;
    value: any;
}
export interface Variant {
    id: string;
    options: Record<string, string>;
    price?: Price;
    media?: Media[];
    sku?: string;
}
export interface Product {
    id: string;
    title: string;
    description: string;
    price: Price;
    media: Media[];
    attributes: Attribute[];
    variants: Variant[];
    categories: string[];
    brandId?: string;
}
export interface Category {
    id: string;
    title: string;
    description?: string;
    parentId?: string;
    image?: Media;
}
export interface Collection {
    id: string;
    title: string;
    source: 'manual' | 'rule';
    items: string[];
    rules?: any;
}
export interface DataBinding {
    componentPath: string;
    bindingKey: string;
    sourceType: 'entity' | 'collection' | 'query';
    sourceId: string;
}
