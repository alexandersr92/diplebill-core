import { currencyFormatter } from '../helpers/formatters';
import { escapeHtml, safeImageSrc } from './escape';
import { getPaperPreset } from './paper';
import { getComponent } from './registry';
import type {
  AreaId,
  ComponentInstanceStyle,
  InvoiceRenderData,
  InvoiceTemplate,
  RenderContext,
  TemplateStyles,
} from './types';

const AREAS: AreaId[] = ['header', 'body', 'footer'];

/** CSS del estilo simple por-instancia (font-size, negrita, alineación). */
const instanceStyle = (s?: ComponentInstanceStyle): string => {
  if (!s) return '';
  let css = '';
  if (s.fontSizePt) css += `font-size:${Number(s.fontSizePt)}pt;`;
  if (s.bold) css += 'font-weight:500;';
  if (s.align) css += `text-align:${s.align};`;
  return css;
};

const DEFAULT_STYLES: Required<
  Pick<TemplateStyles, 'accent' | 'fontFamily' | 'baseFontPt' | 'align' | 'marginMm'>
> = {
  accent: '#534AB7',
  fontFamily: 'sans',
  baseFontPt: 9,
  align: 'center',
  marginMm: 4,
};

/** Construye el contexto de render (estilos con defaults, moneda, escaping). */
export const buildRenderContext = (
  template: InvoiceTemplate,
  data: InvoiceRenderData
): RenderContext => {
  const paper = getPaperPreset(template.paperSize);
  const currency = data.currency || 'NIO';
  return {
    styles: { ...DEFAULT_STYLES, ...template.styles },
    paper,
    documentType: template.documentType,
    isThermal: paper.kind === 'thermal',
    escapeHtml,
    safeImageSrc,
    money: (value) => currencyFormatter({ currency, value: Number(value) || 0 }),
  };
};

const renderInstances = (
  template: InvoiceTemplate,
  data: InvoiceRenderData,
  ctx: RenderContext
): string => {
  let out = '';
  for (const area of AREAS) {
    const list = template.areas?.[area] || [];
    if (!list.length) continue;
    let inner = '';
    for (const inst of list) {
      const def = getComponent(inst.type);
      if (!def) continue; // componente desconocido: se omite
      const html = def.render(inst.props || {}, data, ctx);
      if (html) inner += `<div style="margin:2px 0;${instanceStyle(inst.style)}">${html}</div>`;
    }
    out += `<div data-area="${area}">${inner}</div>`;
  }
  return out;
};

/** Estilo inline del contenedor de la hoja (ancho, fuente, márgenes). */
const containerStyle = (ctx: RenderContext): string => {
  const { paper, styles } = ctx;
  const font =
    styles.fontFamily === 'mono'
      ? "'Courier New', ui-monospace, monospace"
      : "-apple-system, system-ui, 'Segoe UI', Roboto, Arial, sans-serif";
  const width = `${paper.widthMm}mm`;
  const minHeight = paper.kind === 'sheet' && paper.heightMm ? `min-height:${paper.heightMm}mm;` : '';
  return (
    `box-sizing:border-box;width:${width};${minHeight}` +
    `padding:${styles.marginMm}mm;margin:0 auto;background:#fff;color:#111;` +
    `font-family:${font};font-size:${styles.baseFontPt}pt;line-height:1.4;text-align:${styles.align};`
  );
};

/**
 * Render para EMBEBER en el editor (vista previa en vivo): devuelve el
 * contenedor de la hoja con estilos inline, sin `<html>`/`<head>`.
 */
export const renderTemplateInner = (
  template: InvoiceTemplate,
  data: InvoiceRenderData
): string => {
  const ctx = buildRenderContext(template, data);
  return `<div class="pb-doc" style="${containerStyle(ctx)}">${renderInstances(template, data, ctx)}</div>`;
};

/**
 * Render de documento COMPLETO para imprimir / html2pdf: `<html>` con `@page`
 * del tamaño correcto y reset básico. El HTML es autocontenido (estilos inline).
 */
export const renderInvoiceTemplate = (
  template: InvoiceTemplate,
  data: InvoiceRenderData
): string => {
  const ctx = buildRenderContext(template, data);
  const { paper } = ctx;
  const pageSize =
    paper.kind === 'sheet' && paper.heightMm
      ? `${paper.widthMm}mm ${paper.heightMm}mm`
      : `${paper.widthMm}mm auto`;
  const inner = renderInstances(template, data, ctx);
  return (
    '<!doctype html><html><head><meta charset="utf-8">' +
    `<title>${escapeHtml(template.name || 'Documento')}</title>` +
    `<style>@page{size:${pageSize};margin:0;}` +
    '*{box-sizing:border-box;}html,body{margin:0;padding:0;}' +
    'table{border-collapse:collapse;}' +
    `</style></head><body><div class="pb-doc" style="${containerStyle(ctx)}">${inner}</div></body></html>`
  );
};

/** Dimensiones en mm para configurar el `jsPDF` de html2pdf (ancho/alto). */
export const pdfFormatFor = (template: InvoiceTemplate): { widthMm: number; heightMm: number } => {
  const paper = getPaperPreset(template.paperSize);
  return { widthMm: paper.widthMm, heightMm: paper.heightMm ?? 297 };
};
