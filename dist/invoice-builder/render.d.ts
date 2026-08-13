import type { InvoiceRenderData, InvoiceTemplate, RenderContext } from './types';
/** Construye el contexto de render (estilos con defaults, moneda, escaping). */
export declare const buildRenderContext: (template: InvoiceTemplate, data: InvoiceRenderData) => RenderContext;
/**
 * Render para EMBEBER en el editor (vista previa en vivo): devuelve el
 * contenedor de la hoja con estilos inline, sin `<html>`/`<head>`.
 */
export declare const renderTemplateInner: (template: InvoiceTemplate, data: InvoiceRenderData) => string;
/**
 * Render de documento COMPLETO para imprimir / html2pdf: `<html>` con `@page`
 * del tamaño correcto y reset básico. El HTML es autocontenido (estilos inline).
 */
export declare const renderInvoiceTemplate: (template: InvoiceTemplate, data: InvoiceRenderData) => string;
/** Dimensiones en mm para configurar el `jsPDF` de html2pdf (ancho/alto). */
export declare const pdfFormatFor: (template: InvoiceTemplate) => {
    widthMm: number;
    heightMm: number;
};
