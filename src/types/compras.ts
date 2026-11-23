export interface IPurchaseExcelRow {
  sku: string;
  category?: string;
  brand?: string;
  name: string;
  barcode?: string;
  price: number;
  quantity: number;
  cost: number;
  total?: number;
  supplier?: string;
}

export interface IComprasProductItem {
  product_id?: string | number | null;
  sku: string;
  product_name: string;
  barcode?: string;
  category_id?: string | null;
  category_name?: string | null;
  brand_id?: string | null;
  brand_name?: string | null;
  supplier_id?: string | null;
  supplier_name?: string | null;
  quantity: number;
  cost: number;
  price: number;
  total?: number;
}

export interface IComprasInvalidRow {
  row: number;
  errors: string[];
  field_errors?: Record<string, string>;
  data: {
    sku?: string;
    category?: string;
    brand?: string;
    name?: string;
    barcode?: string;
    price?: string | number;
    quantity?: string | number;
    cost?: string | number;
    total?: string | number;
    supplier?: string;
  };
}

export interface IComprasUploadResponse {
  valid_existing: IComprasProductItem[];
  valid_new: IComprasProductItem[];
  invalid: IComprasInvalidRow[];
}
