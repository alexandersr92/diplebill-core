import type {
  ComponentDefinition,
  DocumentType,
  InvoiceRenderData,
  PropField,
  RenderContext,
} from './types';

export const DOC_TYPE_LABEL: Record<DocumentType, string> = {
  invoice: 'FACTURA',
  proforma: 'PROFORMA',
  credit_receipt: 'RECIBO DE ABONO',
};

// --- coerción de props (llegan como unknown) ---
const str = (v: unknown, d = ''): string => (v == null ? d : String(v));
const bool = (v: unknown, d = true): boolean => (v == null ? d : v !== false && v !== 'false' && v !== 0);
const num = (v: unknown, d = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

/** Fila etiqueta/valor (label a la izquierda, value a la derecha). */
const row = (label: string, value: string, bold = false): string =>
  `<div style="display:flex;justify-content:space-between;gap:8px;${bold ? 'font-weight:500;' : ''}">` +
  `<span>${label}</span><span>${value}</span></div>`;

const muted = '#555';

export const COMPONENTS: Record<string, ComponentDefinition> = {
  logo: {
    type: 'logo',
    label: 'Logo',
    icon: 'photo',
    dataBound: true,
    suggestedAreas: ['header'],
    propsSchema: [
      { key: 'align', label: 'Alineación', type: 'select', options: [
        { value: 'left', label: 'Izquierda' }, { value: 'center', label: 'Centro' }, { value: 'right', label: 'Derecha' },
      ], default: 'center' },
      { key: 'sizePx', label: 'Alto máx (px)', type: 'number', default: 64 },
    ],
    render: (props, data, ctx) => {
      const src = ctx.safeImageSrc(data.business?.logo);
      if (!src) return '';
      const al = str(props.align, 'center');
      const size = num(props.sizePx, 64);
      return `<div style="text-align:${al};margin:2px 0;"><img src="${src}" alt="logo" style="max-height:${size}px;max-width:100%;" /></div>`;
    },
  },

  business: {
    type: 'business',
    label: 'Datos del negocio',
    icon: 'building-store',
    dataBound: true,
    suggestedAreas: ['header'],
    propsSchema: [
      { key: 'showAddress', label: 'Mostrar dirección', type: 'boolean', default: true },
      { key: 'showTaxId', label: 'Mostrar RUC', type: 'boolean', default: true },
      { key: 'showPhone', label: 'Mostrar teléfono', type: 'boolean', default: true },
      { key: 'showEmail', label: 'Mostrar correo', type: 'boolean', default: false },
    ],
    render: (props, data, ctx) => {
      const b = data.business || {};
      const e = ctx.escapeHtml;
      const al = ctx.styles.align;
      let h = `<div style="text-align:${al};">`;
      if (b.name) h += `<div style="font-weight:600;">${e(b.name)}</div>`;
      const line: string[] = [];
      if (bool(props.showAddress) && b.address) line.push(e(b.address));
      if (bool(props.showTaxId) && b.taxId) line.push('RUC ' + e(b.taxId));
      if (bool(props.showPhone) && b.phone) line.push('Tel ' + e(b.phone));
      if (bool(props.showEmail, false) && b.email) line.push(e(b.email));
      if (line.length) h += `<div style="color:${muted};">${line.join(' · ')}</div>`;
      return h + '</div>';
    },
  },

  title: {
    type: 'title',
    label: 'Título del documento',
    icon: 'heading',
    dataBound: true,
    suggestedAreas: ['header'],
    propsSchema: [
      { key: 'text', label: 'Texto (vacío = automático)', type: 'text', default: '' },
    ],
    render: (props, data, ctx) => {
      const text = str(props.text) || data.document?.title || DOC_TYPE_LABEL[ctx.documentType];
      return `<div style="text-align:center;font-weight:600;letter-spacing:.5px;color:${ctx.styles.accent};margin:3px 0;">${ctx.escapeHtml(text)}</div>`;
    },
  },

  meta: {
    type: 'meta',
    label: 'N° / Fecha / Vendedor',
    icon: 'info-circle',
    dataBound: true,
    suggestedAreas: ['header', 'body'],
    propsSchema: [
      { key: 'showNumber', label: 'Mostrar número', type: 'boolean', default: true },
      { key: 'showDate', label: 'Mostrar fecha', type: 'boolean', default: true },
      { key: 'showSeller', label: 'Mostrar vendedor', type: 'boolean', default: true },
      { key: 'showReference', label: 'Mostrar referencia', type: 'boolean', default: false },
    ],
    render: (props, data, ctx) => {
      const d = data.document || {};
      const e = ctx.escapeHtml;
      let h = `<div style="color:${muted};">`;
      if (bool(props.showNumber) && d.number) {
        const n = d.series ? `${e(d.series)}-${e(d.number)}` : e(d.number);
        h += row('N°', n);
      }
      if (bool(props.showDate) && d.date) h += row('Fecha', e(d.date));
      if (bool(props.showSeller) && d.seller) h += row('Vendedor', e(d.seller));
      if (bool(props.showReference, false) && d.reference) h += row('Referencia', e(d.reference));
      return h + '</div>';
    },
  },

  client: {
    type: 'client',
    label: 'Datos del cliente',
    icon: 'user',
    dataBound: true,
    suggestedAreas: ['body'],
    propsSchema: [
      { key: 'title', label: 'Etiqueta', type: 'text', default: 'Cliente' },
      { key: 'showTaxId', label: 'Mostrar RUC/cédula', type: 'boolean', default: true },
      { key: 'showAddress', label: 'Mostrar dirección', type: 'boolean', default: false },
      { key: 'showPhone', label: 'Mostrar teléfono', type: 'boolean', default: true },
    ],
    render: (props, data, ctx) => {
      const c = data.client || {};
      const e = ctx.escapeHtml;
      let h = row(str(props.title, 'Cliente') + ':', e(c.name || '—'), true);
      const line: string[] = [];
      if (bool(props.showTaxId) && c.taxId) line.push(e(c.taxId));
      if (bool(props.showPhone) && c.phone) line.push(e(c.phone));
      if (bool(props.showAddress, false) && c.address) line.push(e(c.address));
      if (line.length) h += `<div style="color:${muted};">${line.join(' · ')}</div>`;
      return h;
    },
  },

  items: {
    type: 'items',
    label: 'Tabla de ítems',
    icon: 'list',
    dataBound: true,
    suggestedAreas: ['body'],
    propsSchema: [
      { key: 'showSku', label: 'Columna SKU', type: 'boolean', default: false },
      { key: 'showQty', label: 'Columna cantidad', type: 'boolean', default: true },
      { key: 'showUnitPrice', label: 'Columna precio unit.', type: 'boolean', default: true },
      { key: 'showDiscount', label: 'Columna descuento', type: 'boolean', default: false },
    ],
    render: (props, data, ctx) => {
      const items = data.items || [];
      const e = ctx.escapeHtml;
      const m = ctx.money;
      if (ctx.isThermal) {
        // Compacto: descripción + subrenglón "cant × unit" y total a la derecha.
        let h = `<div style="display:flex;justify-content:space-between;color:${muted};border-bottom:1px solid #ddd;padding-bottom:2px;"><span>Descripción</span><span>Importe</span></div>`;
        for (const it of items) {
          const sub: string[] = [];
          if (bool(props.showQty) && it.quantity != null) sub.push(String(it.quantity) + '×');
          if (bool(props.showUnitPrice) && it.unitPrice != null) sub.push(m(it.unitPrice));
          if (bool(props.showDiscount, false) && it.discount) sub.push('-' + m(it.discount));
          h += `<div style="display:flex;justify-content:space-between;gap:8px;padding-top:3px;"><span>${e(it.description || '')}` +
            (sub.length ? ` <span style="color:#888;">${sub.join(' ')}</span>` : '') +
            `</span><span>${m(it.total)}</span></div>`;
        }
        return h;
      }
      // Hoja: tabla real con columnas configurables.
      const cols: string[] = ['Descripción'];
      if (bool(props.showSku, false)) cols.unshift('SKU');
      if (bool(props.showQty)) cols.push('Cant.');
      if (bool(props.showUnitPrice)) cols.push('P. Unit');
      if (bool(props.showDiscount, false)) cols.push('Desc.');
      cols.push('Importe');
      let h = '<table style="width:100%;border-collapse:collapse;"><thead><tr>';
      cols.forEach((c, i) => {
        h += `<th style="text-align:${i === 0 || (i === 1 && bool(props.showSku, false)) ? 'left' : 'right'};border-bottom:1px solid #ccc;padding:3px 4px;color:${muted};font-weight:500;">${c}</th>`;
      });
      h += '</tr></thead><tbody>';
      for (const it of items) {
        h += '<tr>';
        if (bool(props.showSku, false)) h += `<td style="padding:3px 4px;">${e(it.sku || '')}</td>`;
        h += `<td style="padding:3px 4px;">${e(it.description || '')}</td>`;
        if (bool(props.showQty)) h += `<td style="text-align:right;padding:3px 4px;">${it.quantity ?? ''}</td>`;
        if (bool(props.showUnitPrice)) h += `<td style="text-align:right;padding:3px 4px;">${m(it.unitPrice)}</td>`;
        if (bool(props.showDiscount, false)) h += `<td style="text-align:right;padding:3px 4px;">${it.discount ? m(it.discount) : '—'}</td>`;
        h += `<td style="text-align:right;padding:3px 4px;">${m(it.total)}</td></tr>`;
      }
      return h + '</tbody></table>';
    },
  },

  totals: {
    type: 'totals',
    label: 'Totales',
    icon: 'calculator',
    dataBound: true,
    suggestedAreas: ['body'],
    propsSchema: [
      { key: 'showSubtotal', label: 'Mostrar subtotal', type: 'boolean', default: true },
      { key: 'showDiscount', label: 'Mostrar descuento', type: 'boolean', default: true },
      { key: 'showTax', label: 'Mostrar impuesto', type: 'boolean', default: true },
    ],
    render: (props, data, ctx) => {
      const t = data.totals || {};
      const m = ctx.money;
      let h = '';
      if (bool(props.showSubtotal) && t.subtotal != null) h += row('Subtotal', m(t.subtotal));
      if (bool(props.showDiscount) && t.discount) h += row('Descuento', '-' + m(t.discount));
      if (bool(props.showTax) && t.tax != null) h += row(ctx.escapeHtml(t.taxLabel || 'Impuesto'), m(t.tax));
      h += `<div style="color:${ctx.styles.accent};font-size:1.15em;">${row('TOTAL', m(t.total), true)}</div>`;
      return h;
    },
  },

  payment: {
    type: 'payment',
    label: 'Pago / vuelto',
    icon: 'cash',
    dataBound: true,
    suggestedAreas: ['body', 'footer'],
    propsSchema: [
      { key: 'showMethod', label: 'Mostrar método', type: 'boolean', default: true },
      { key: 'showReceived', label: 'Mostrar recibido', type: 'boolean', default: true },
      { key: 'showChange', label: 'Mostrar vuelto', type: 'boolean', default: true },
      { key: 'showReference', label: 'Mostrar referencia', type: 'boolean', default: true },
    ],
    render: (props, data, ctx) => {
      const p = data.payment || {};
      const e = ctx.escapeHtml;
      const m = ctx.money;
      let h = `<div style="color:${muted};">`;
      if (bool(props.showMethod) && p.method) h += row('Método', e(p.method));
      if (bool(props.showReceived) && p.received != null) h += row('Recibido', m(p.received));
      if (bool(props.showChange) && p.change != null) h += row('Vuelto', m(p.change));
      if (bool(props.showReference) && p.reference) h += row('Referencia', e(p.reference));
      return h + '</div>';
    },
  },

  credit: {
    type: 'credit',
    label: 'Resumen de crédito',
    icon: 'credit-card',
    dataBound: true,
    suggestedAreas: ['body'],
    propsSchema: [],
    render: (_props, data, ctx) => {
      const c = data.credit || {};
      const m = ctx.money;
      let h = `<div style="color:${muted};">`;
      if (c.previousDebt != null) h += row('Deuda anterior', m(c.previousDebt));
      if (c.payment != null) h += row('Abono', m(c.payment));
      if (c.newBalance != null) h += `<div style="color:${ctx.styles.accent};">${row('Nuevo saldo', m(c.newBalance), true)}</div>`;
      return h + '</div>';
    },
  },

  text: {
    type: 'text',
    label: 'Texto libre',
    icon: 'text-caption',
    suggestedAreas: ['header', 'body', 'footer'],
    propsSchema: [
      { key: 'content', label: 'Contenido', type: 'textarea', default: '¡Gracias por su compra!' },
      { key: 'align', label: 'Alineación', type: 'select', options: [
        { value: 'left', label: 'Izquierda' }, { value: 'center', label: 'Centro' }, { value: 'right', label: 'Derecha' },
      ], default: 'center' },
      { key: 'bold', label: 'Negrita', type: 'boolean', default: false },
    ],
    render: (props, _data, ctx) => {
      const content = ctx.escapeHtml(str(props.content)).replace(/\n/g, '<br>');
      if (!content) return '';
      const al = str(props.align, 'center');
      const b = bool(props.bold, false) ? 'font-weight:500;' : '';
      return `<div style="text-align:${al};color:${muted};${b}">${content}</div>`;
    },
  },

  divider: {
    type: 'divider',
    label: 'Separador',
    icon: 'separator-horizontal',
    suggestedAreas: ['header', 'body', 'footer'],
    propsSchema: [
      { key: 'style', label: 'Estilo', type: 'select', options: [
        { value: 'dashed', label: 'Punteado' }, { value: 'solid', label: 'Sólido' },
      ], default: 'dashed' },
    ],
    render: (props) =>
      `<div style="border-top:1px ${str(props.style, 'dashed')} #bbb;margin:5px 0;"></div>`,
  },

  signature: {
    type: 'signature',
    label: 'Firma',
    icon: 'signature',
    suggestedAreas: ['footer'],
    propsSchema: [
      { key: 'label', label: 'Etiqueta', type: 'text', default: 'Firma del cliente' },
      { key: 'widthPct', label: 'Ancho de línea (%)', type: 'number', default: 70 },
    ],
    render: (props, _data, ctx) => {
      const w = num(props.widthPct, 70);
      return `<div style="margin-top:18px;text-align:center;color:${muted};">` +
        `<div style="border-top:1px solid #333;width:${w}%;margin:0 auto 2px;"></div>` +
        `${ctx.escapeHtml(str(props.label, 'Firma del cliente'))}</div>`;
    },
  },

  qr: {
    type: 'qr',
    label: 'Código QR',
    icon: 'qrcode',
    suggestedAreas: ['footer', 'header'],
    propsSchema: [
      { key: 'value', label: 'Contenido (vacío = N° de factura)', type: 'text', default: '' },
      { key: 'sizePx', label: 'Tamaño (px)', type: 'number', default: 72 },
    ],
    render: (props, data, ctx) => {
      const value = str(props.value) || data.document?.number || '';
      const size = num(props.sizePx, 72);
      // Placeholder visual; un generador real de QR se conecta en las apps
      // (encodea `value`). Se muestra el valor debajo, escapado.
      return `<div style="text-align:center;margin:4px 0;">` +
        `<div style="width:${size}px;height:${size}px;margin:0 auto;border:2px solid #111;` +
        `background:repeating-conic-gradient(#111 0 25%,#fff 0 50%) 0/${Math.round(size / 6)}px ${Math.round(size / 6)}px;"></div>` +
        (value ? `<div style="color:${muted};font-size:.85em;">${ctx.escapeHtml(value)}</div>` : '') +
        `</div>`;
    },
  },

  barcode: {
    type: 'barcode',
    label: 'Código de barras',
    icon: 'barcode',
    suggestedAreas: ['footer', 'header'],
    propsSchema: [
      { key: 'value', label: 'Contenido (vacío = N° de factura)', type: 'text', default: '' },
    ],
    render: (props, data, ctx) => {
      const value = str(props.value) || data.document?.number || '';
      return `<div style="text-align:center;margin:4px 0;">` +
        `<div style="font-family:monospace;letter-spacing:1px;">▐│▌║▐│║▌│▐║│▌║▐│▌</div>` +
        (value ? `<div style="color:${muted};font-size:.85em;">${ctx.escapeHtml(value)}</div>` : '') +
        `</div>`;
    },
  },

  spacer: {
    type: 'spacer',
    label: 'Espacio',
    icon: 'arrows-vertical',
    suggestedAreas: ['header', 'body', 'footer'],
    propsSchema: [
      { key: 'heightMm', label: 'Alto (mm)', type: 'number', default: 4 },
    ],
    render: (props) => `<div style="height:${num(props.heightMm, 4)}mm;"></div>`,
  },
};

// Bloques de texto: el editor les muestra el estilo simple (tamaño/negrita/alineación).
const TEXTUAL_TYPES = ['business', 'title', 'meta', 'client', 'items', 'totals', 'payment', 'credit', 'text', 'signature'];
for (const t of TEXTUAL_TYPES) {
  if (COMPONENTS[t]) COMPONENTS[t].textual = true;
}

/**
 * Campos de estilo comunes a todos los bloques de texto. El editor los renderiza
 * en una sección "Estilo" y los liga a `instance.style` (no a `instance.props`).
 */
export const COMMON_STYLE_FIELDS: PropField[] = [
  { key: 'fontSizePt', label: 'Tamaño de fuente (pt)', type: 'number' },
  { key: 'bold', label: 'Negrita', type: 'boolean', default: false },
  { key: 'align', label: 'Alineación', type: 'select', options: [
    { value: 'left', label: 'Izquierda' }, { value: 'center', label: 'Centro' }, { value: 'right', label: 'Derecha' },
  ] },
];

/** Registra (o reemplaza) un componente en la biblioteca. Extensible en runtime. */
export const registerComponent = (def: ComponentDefinition): void => {
  COMPONENTS[def.type] = def;
};

export const getComponent = (type: string): ComponentDefinition | undefined => COMPONENTS[type];

/** Lista para la biblioteca del editor (type, label, icon, área sugerida). */
export const listComponents = (): ComponentDefinition[] => Object.values(COMPONENTS);
