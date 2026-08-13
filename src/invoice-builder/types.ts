/**
 * Modelo de datos del constructor de facturas por componentes.
 *
 * Una plantilla tiene 3 áreas (encabezado / cuerpo / pie); cada área es una lista
 * ordenada de instancias de componente. Cada componente se resuelve contra el
 * registro y se dibuja con su función `render`. El mismo motor lo usan el admin
 * (editor + impresión) y el POS (impresión + PDF offline).
 */

export type DocumentType = 'invoice' | 'proforma' | 'credit_receipt';

export type PaperSizeId =
  | '80mm'
  | '70mm'
  | '58mm'
  | 'letter'
  | 'legal'
  | 'half_letter'
  | 'a4'
  | 'a5';

export type AreaId = 'header' | 'body' | 'footer';

export type TextAlign = 'left' | 'center' | 'right';

/** Estilo simple por-instancia, común a todos los componentes de texto. */
export interface ComponentInstanceStyle {
  /** tamaño de fuente del bloque en pt (vacío = hereda el base de la plantilla). */
  fontSizePt?: number;
  bold?: boolean;
  align?: TextAlign;
}

/** Una instancia de componente colocada en un área. */
export interface ComponentInstance {
  /** id único dentro de la plantilla (para reordenar/editar). */
  id: string;
  /** clave del componente en el registro. */
  type: string;
  /** props específicas del componente (según su `propsSchema`). */
  props?: Record<string, unknown>;
  /** estilo simple (font-size, negrita, alineación) aplicado a este bloque. */
  style?: ComponentInstanceStyle;
}

export interface TemplateStyles {
  /** color de acento (hex) para título y total. */
  accent?: string;
  fontFamily?: 'sans' | 'mono';
  /** tamaño base de fuente en puntos. */
  baseFontPt?: number;
  align?: TextAlign;
  /** margen interno de la hoja en mm. */
  marginMm?: number;
}

export interface InvoiceTemplate {
  id?: string;
  name: string;
  documentType: DocumentType;
  paperSize: PaperSizeId;
  styles: TemplateStyles;
  areas: Record<AreaId, ComponentInstance[]>;
}

// ----------------------------------------------------------------------------
// Datos normalizados que consume el motor (las apps mapean su factura a esto).
// ----------------------------------------------------------------------------

export interface RenderBusiness {
  name?: string;
  address?: string;
  taxId?: string;
  phone?: string;
  email?: string;
  /** data:image/...;base64 o https (se valida antes de usar). */
  logo?: string;
}

export interface RenderDocument {
  /** título explícito; si falta, se usa el rótulo del tipo de documento. */
  title?: string;
  number?: string;
  series?: string;
  date?: string;
  seller?: string;
  reference?: string;
}

export interface RenderClient {
  name?: string;
  taxId?: string;
  address?: string;
  phone?: string;
}

export interface RenderItem {
  description?: string;
  sku?: string;
  quantity?: number;
  unitPrice?: number;
  discount?: number;
  total?: number;
}

export interface RenderTotals {
  subtotal?: number;
  discount?: number;
  tax?: number;
  taxLabel?: string;
  total?: number;
}

export interface RenderPayment {
  method?: string;
  received?: number;
  change?: number;
  reference?: string;
}

export interface RenderCredit {
  previousDebt?: number;
  payment?: number;
  newBalance?: number;
}

export interface InvoiceRenderData {
  /** código de moneda ISO (ej. 'NIO', 'USD'); por defecto 'NIO' → C$. */
  currency?: string;
  business?: RenderBusiness;
  document?: RenderDocument;
  client?: RenderClient;
  items?: RenderItem[];
  totals?: RenderTotals;
  payment?: RenderPayment;
  credit?: RenderCredit;
}

// ----------------------------------------------------------------------------
// Registro de componentes
// ----------------------------------------------------------------------------

export type PropFieldType = 'text' | 'textarea' | 'boolean' | 'number' | 'select';

/** Descriptor de un campo editable de un componente (el editor genera el control). */
export interface PropField {
  key: string;
  label: string;
  type: PropFieldType;
  options?: { value: string; label: string }[];
  default?: unknown;
}

export interface PaperPreset {
  id: PaperSizeId;
  label: string;
  kind: 'thermal' | 'sheet';
  widthMm: number;
  heightMm?: number;
}

/** Contexto que el motor pasa a cada `render` de componente. */
export interface RenderContext {
  styles: Required<Pick<TemplateStyles, 'accent' | 'fontFamily' | 'baseFontPt' | 'align' | 'marginMm'>>;
  paper: PaperPreset;
  documentType: DocumentType;
  isThermal: boolean;
  escapeHtml: (value: unknown) => string;
  safeImageSrc: (value: unknown) => string;
  /** formatea un monto con la moneda de los datos (NIO → C$). */
  money: (value: number | undefined | null) => string;
}

export interface ComponentDefinition {
  type: string;
  label: string;
  /** nombre de icono Tabler (sin prefijo), para la biblioteca del editor. */
  icon: string;
  /** true si el componente lee de los datos de la venta (no solo de sus props). */
  dataBound?: boolean;
  /** true si es un bloque de texto: el editor le muestra el estilo (font-size/negrita/alineación). */
  textual?: boolean;
  /** áreas sugeridas donde tiene sentido (informativo para el editor). */
  suggestedAreas?: AreaId[];
  propsSchema: PropField[];
  defaultProps?: Record<string, unknown>;
  render: (
    props: Record<string, unknown>,
    data: InvoiceRenderData,
    ctx: RenderContext
  ) => string;
}
