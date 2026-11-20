export interface IProductBulkUpdateRow {
    sku: string;
    new_sku?: string;
    category?: string;
    brand?: string;
    name?: string;
    barcode?: string;
    tags?: string;
}
export interface IProductBulkDiffField<T = string | null> {
    current: T;
    new: T;
    changed: boolean;
}
export interface IProductBulkItemPreview {
    product_id: string;
    sku: string;
    new_sku?: IProductBulkDiffField<string>;
    name: IProductBulkDiffField<string>;
    barcode: IProductBulkDiffField<string | null>;
    category_id: IProductBulkDiffField<string | null>;
    category_name: IProductBulkDiffField<string | null>;
    brand_id: IProductBulkDiffField<string | null>;
    brand_name: IProductBulkDiffField<string | null>;
    tags?: IProductBulkDiffField<string[]>;
    has_changes: boolean;
}
export interface IProductBulkInvalidRow {
    row: number;
    sku?: string;
    errors: string[];
    field_errors?: Record<string, string>;
    data: Record<string, any>;
}
export interface IProductBulkPreviewResponse {
    total_rows: number;
    valid_count: number;
    changed_count: number;
    invalid_count: number;
    items: IProductBulkItemPreview[];
    invalid: IProductBulkInvalidRow[];
}
export interface IProductBulkConfirmResponse {
    success: boolean;
    message: string;
    updated_count: number;
    not_found_count: number;
    errors_count: number;
    errors: string[];
}
