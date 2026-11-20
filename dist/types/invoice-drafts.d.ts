import type { IInvoice, IInvoiceProduct } from './billing';
export type InvoiceDraftStatus = 'draft';
export interface IInvoiceDraft extends Omit<Partial<IInvoice>, 'products'> {
    id: string;
    invoice_status: InvoiceDraftStatus;
    products: IInvoiceProduct[];
    updated_at?: string;
}
export interface IInvoiceDraftInput extends Omit<Partial<IInvoice>, 'products'> {
    products: IInvoiceProduct[];
}
