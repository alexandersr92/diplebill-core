import type { DocumentType, InvoiceTemplate, PaperSizeId } from './types';
/** id de instancia único y estable dentro del proceso. */
export declare const newInstanceId: (type: string) => string;
/**
 * Plantilla por defecto para un tipo de documento y tamaño. Es el punto de
 * partida que el dueño luego edita. El 80mm por defecto replica el diseño actual.
 */
export declare const defaultTemplate: (documentType?: DocumentType, paperSize?: PaperSizeId) => InvoiceTemplate;
