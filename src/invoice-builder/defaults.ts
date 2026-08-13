import type {
  ComponentInstance,
  DocumentType,
  InvoiceTemplate,
  PaperSizeId,
} from './types';

let seq = 0;
/** id de instancia único y estable dentro del proceso. */
export const newInstanceId = (type: string): string => `${type}-${++seq}`;

const inst = (type: string, props?: Record<string, unknown>): ComponentInstance => ({
  id: newInstanceId(type),
  type,
  props,
});

/**
 * Plantilla por defecto para un tipo de documento y tamaño. Es el punto de
 * partida que el dueño luego edita. El 80mm por defecto replica el diseño actual.
 */
export const defaultTemplate = (
  documentType: DocumentType = 'invoice',
  paperSize: PaperSizeId = '80mm'
): InvoiceTemplate => {
  const base = {
    name: 'Nueva plantilla',
    documentType,
    paperSize,
    styles: {},
  };

  if (documentType === 'credit_receipt') {
    return {
      ...base,
      areas: {
        header: [inst('logo'), inst('business'), inst('title'), inst('meta')],
        body: [inst('divider'), inst('client'), inst('credit'), inst('payment')],
        footer: [inst('divider'), inst('signature')],
      },
    };
  }

  if (documentType === 'proforma') {
    return {
      ...base,
      areas: {
        header: [inst('logo'), inst('business'), inst('title'), inst('meta')],
        body: [inst('divider'), inst('client'), inst('items'), inst('totals')],
        footer: [inst('divider'), inst('text', { content: 'Documento no válido como factura.' })],
      },
    };
  }

  return {
    ...base,
    areas: {
      header: [inst('logo'), inst('business'), inst('title'), inst('meta')],
      body: [inst('divider'), inst('client'), inst('items'), inst('totals'), inst('payment')],
      footer: [inst('divider'), inst('text', { content: '¡Gracias por su compra!' })],
    },
  };
};
