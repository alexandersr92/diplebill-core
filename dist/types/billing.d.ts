import { ICategory } from './categories';
import { IBrand } from './brands';
export declare const SELL_TYPES: {
    CREDITO: string;
    CONTADO: string;
};
export declare const PAYMENT_METHODS: {
    EFECTIVO: string;
    TRANSFERENCIA: string;
};
export type InvoiceItemType = 'product' | 'free';
export interface IGetBillingProducts {
    page: number;
    perPage: number;
    storeId?: string;
}
export type { ICategory };
export interface ITag {
    id: string;
    name: string;
}
export interface IProducts {
    id: string;
    product_id: string;
    sku: string;
    barcode: string;
    name: string;
    product?: string;
    image: string;
    cost: number;
    price: number;
    quantity: number;
    min_stock: number;
    unit_of_measure: string;
    category_id?: string | null;
    brand_id?: string | null;
    brand?: IBrand | null;
    categories: ICategory[];
    tags: ITag[];
    inventory: IInventoryInProduct[];
}
export interface IInventoryInProduct {
    id: string;
    quantity: number;
    inventory_id: string;
    inventory_name: string;
}
export interface IInvoiceProduct extends Omit<Partial<IProducts>, 'product_id'> {
    id: string;
    name: string;
    item_type?: InvoiceItemType;
    description?: string | null;
    product_id?: string | null;
    cost?: number;
    inventory_name?: string;
    inventory_id?: string | null;
    quantity: number;
    price: number;
    discount: number;
    total: number;
    tax: number;
    grand_total: number;
    temp_id?: string;
}
export interface IGetBillingProductsResponse {
    data: IProducts[];
    meta: {
        per_page: number;
        total: number;
        current_page: number;
    };
}
export interface IBillingProductsProductsState {
    products: IProducts[];
    productsSelected: IInvoiceProduct[];
    invoice: IInvoice;
    invoices: ISingleInvoice[];
    lastNumberInvoice: string | number;
    isLoading: boolean;
    error: null | string;
    status: 'idle' | 'pending' | 'fulfilled' | 'rejected';
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
    isEditing: boolean;
    editingInvoiceId: string | null;
    editingInvoiceNumber: string | null;
}
export interface IInvoice {
    client_id: string | null;
    store_id: string;
    invoice_number: string;
    invoice_date: string;
    invoice_note: string;
    client_name: string;
    total: number;
    discount: number;
    tax: number;
    grand_total: number;
    payment_method: string;
    payment_date: string;
    products: IInvoiceProducts[];
    isCredit: boolean;
    init_payment: number;
    seller_id: string | null;
    payment_metadata?: any;
}
export interface IInvoices extends IInvoice {
    id: string;
    invoice_status?: 'draft' | 'proforma' | 'completed' | 'credit' | 'canceled' | string;
    total_items?: number;
    client?: IInvoiceClient;
}
export interface IInvoiceProducts {
    item_type?: InvoiceItemType;
    description?: string | null;
    product_id?: string | null;
    inventory_id?: string | null;
    quantity: number;
    price: number;
    cost?: number;
    total: number;
    discount: number;
    tax: number;
    grand_total: number;
}
export interface IInvoiceBase {
    id?: string;
    client_name: string;
    invoice_number: string;
    invoice_date: string;
    invoice_status: string;
    total_items: number;
    client: IInvoiceClient;
    grand_total: number;
    invoice_note?: string | null;
}
export interface IInvoiceClient {
    id?: string;
    organization_id: string;
    name: string;
    cedula_ruc?: string | null;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip: null | string;
    status: string;
    wholesaler: number;
    notes: string;
}
export interface ISingleInvoice extends IInvoiceBase {
    client_id: string | null;
    discount: number;
    tax: number;
    method: null | string;
    invoice_type?: string;
    invoice_note?: string;
    payment_metadata?: any;
    seller_id?: string | null;
    seller?: string | null;
    client_cedula_ruc?: string | null;
    invoice_details: {
        id: string;
        item_type?: InvoiceItemType;
        description?: string | null;
        product_id?: string | null;
        product_name?: string | null;
        inventory_id?: string | null;
        quantity: number;
        price: number;
        cost?: number;
        total: number;
        sku?: string | null;
        barcode?: string | null;
        discount?: number;
        tax?: number;
        grand_total?: number;
        sort_order?: number;
    }[];
}
export interface IGetSingleInvoiceResponse {
    data: ISingleInvoice;
}
export interface IReplaceInvoiceResponse {
    message: string;
    invoice: ISingleInvoice;
}
export interface IGetInvoiceResponse {
    data: ISingleInvoice[];
    meta: {
        last_page: number;
        per_page: number;
        total: number;
        current_page: number;
    };
}
