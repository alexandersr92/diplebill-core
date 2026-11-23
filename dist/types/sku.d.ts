export interface ISkuConfig {
    enabled: boolean;
    pattern: string;
    counter: number;
    preview_example?: string;
}
export interface IUpdateSkuConfigRequest {
    enabled: boolean;
    pattern: string;
}
export interface ISkuRegenerationPreviewItem {
    id: string;
    name: string;
    current_sku: string | null;
    proposed_sku: string;
    category_name?: string | null;
    brand_name?: string | null;
}
export interface ISkuRegenerationMissingData {
    id: string;
    name: string;
    sku: string | null;
    missing_fields: ('categoria' | 'marca')[];
}
export interface ISkuRegenerationPreviewResponse {
    can_proceed: boolean;
    total_products: number;
    preview_token: string;
    pattern: string;
    items: ISkuRegenerationPreviewItem[];
    missing_data: ISkuRegenerationMissingData[];
    message?: string;
}
export interface IConfirmSkuRegenerationRequest {
    preview_token: string;
}
export interface ISkuMapEntry {
    id: string;
    name: string;
    old_sku: string | null;
    new_sku: string;
}
export interface ISkuRegenerationConfirmResponse {
    success: boolean;
    message: string;
    total_updated: number;
    pattern: string;
    executed_at: string;
    executed_by?: string;
    sku_map: ISkuMapEntry[];
}
