"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  COMPONENTS: () => COMPONENTS,
  DOC_TYPE_LABEL: () => DOC_TYPE_LABEL,
  PAPER_SIZES: () => PAPER_SIZES,
  PAPER_SIZE_LIST: () => PAPER_SIZE_LIST,
  PAYMENT_METHODS: () => PAYMENT_METHODS,
  SELL_TYPES: () => SELL_TYPES,
  buildRenderContext: () => buildRenderContext,
  calculateTotalDiscount: () => calculateTotalDiscount,
  checkSimilarity: () => checkSimilarity,
  currencyFormatter: () => currencyFormatter,
  currencyFormatterWithoutSym: () => currencyFormatterWithoutSym,
  defaultTemplate: () => defaultTemplate,
  escapeHtml: () => escapeHtml,
  getComponent: () => getComponent,
  getDiceCoefficient: () => getDiceCoefficient,
  getLevenshteinDistance: () => getLevenshteinDistance,
  getPaperPreset: () => getPaperPreset,
  getStringSimilarity: () => getStringSimilarity,
  isGenericClientName: () => isGenericClientName,
  listComponents: () => listComponents,
  newInstanceId: () => newInstanceId,
  normalizeName: () => normalizeName,
  pdfFormatFor: () => pdfFormatFor,
  registerComponent: () => registerComponent,
  renderInvoiceTemplate: () => renderInvoiceTemplate,
  renderTemplateInner: () => renderTemplateInner,
  safeImageSrc: () => safeImageSrc
});
module.exports = __toCommonJS(index_exports);

// src/helpers/stringSimilarity.ts
function getLevenshteinDistance(a, b) {
  const tmp = [];
  const alen = a.length;
  const blen = b.length;
  if (alen === 0) return blen;
  if (blen === 0) return alen;
  for (let i = 0; i <= alen; i++) {
    tmp[i] = [i];
  }
  for (let j = 0; j <= blen; j++) {
    tmp[0][j] = j;
  }
  for (let i = 1; i <= alen; i++) {
    for (let j = 1; j <= blen; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        // eliminación
        tmp[i][j - 1] + 1,
        // inserción
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        // sustitución
      );
    }
  }
  return tmp[alen][blen];
}
function getStringSimilarity(a, b) {
  const cleanA = a.trim().toLowerCase();
  const cleanB = b.trim().toLowerCase();
  if (cleanA === cleanB) return 1;
  const distance = getLevenshteinDistance(cleanA, cleanB);
  const maxLength = Math.max(cleanA.length, cleanB.length);
  return 1 - distance / maxLength;
}
function getDiceCoefficient(a, b) {
  const cleanA = a.trim().toLowerCase();
  const cleanB = b.trim().toLowerCase();
  if (cleanA === cleanB) return 1;
  if (cleanA.length < 2 || cleanB.length < 2) return 0;
  const getBigrams = (str2) => {
    const bigrams = /* @__PURE__ */ new Set();
    for (let i = 0; i < str2.length - 1; i++) {
      bigrams.add(str2.substring(i, i + 2));
    }
    return bigrams;
  };
  const bigramsA = getBigrams(cleanA);
  const bigramsB = getBigrams(cleanB);
  let intersection = 0;
  bigramsA.forEach((bigram) => {
    if (bigramsB.has(bigram)) {
      intersection++;
    }
  });
  return 2 * intersection / (bigramsA.size + bigramsB.size);
}
var normalizeName = (str2) => {
  return str2.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
};
function checkSimilarity(name1, name2) {
  const n1 = normalizeName(name1);
  const n2 = normalizeName(name2);
  if (n1 === n2) return 1;
  if (!n1 || !n2) return 0;
  const simLev = getStringSimilarity(n1, n2);
  const simDice = getDiceCoefficient(n1, n2);
  return Math.max(simLev, simDice);
}
function isGenericClientName(name) {
  const normalized = normalizeName(name);
  const genericTerms = [
    "cliente",
    "clientes",
    "cliente contado",
    "contado",
    "mostrador",
    "publico general",
    "publico",
    "consumidor final",
    "consumidor",
    "sin nombre",
    "anonimo",
    "generico",
    "factura",
    "venta",
    "ventas"
  ];
  return genericTerms.some((term) => normalized === term || normalized.startsWith(term + " "));
}

// src/helpers/formatters.ts
function currencyFormatter({ currency, value }) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    minimumFractionDigits: 2,
    currency
  });
  return formatter.format(value).replace("NIO", "C$");
}
function currencyFormatterWithoutSym(value, decimalPlaces = 2, locale = "en-US") {
  if (!value) return "";
  const cleanedValue = value.replace(/[^0-9.]/g, "");
  const parts = cleanedValue.split(".");
  const integerPart = parts[0].replace(/^0+(?!$)/, "") || "0";
  const decimalPart = parts[1] ? `.${parts[1].slice(0, decimalPlaces)}` : "";
  const formattedInteger = parseInt(integerPart, 10).toLocaleString(locale);
  return `${formattedInteger}${decimalPart}`;
}

// src/helpers/math.ts
var calculateTotalDiscount = (input, subtotal) => {
  let discount = 0;
  const result = { percentage: 0, fixed: 0 };
  if (input.endsWith("%")) {
    const percentage = parseFloat(input.slice(0, -1));
    if (!isNaN(percentage) && percentage <= 100) {
      discount = percentage / 100 * subtotal;
      result.percentage = percentage;
    }
  } else {
    const fixedDiscount = parseFloat(input);
    if (!isNaN(fixedDiscount)) {
      discount = fixedDiscount;
      result.fixed = fixedDiscount;
      const percentageFromFixed = fixedDiscount / subtotal * 100;
      result.percentage = parseFloat(percentageFromFixed.toFixed(2));
    }
  }
  const discountRounded = Math.round(discount * 100) / 100;
  return { ...result, discount: discountRounded };
};

// src/types/billing.ts
var SELL_TYPES = {
  CREDITO: "credito",
  CONTADO: "contado"
};
var PAYMENT_METHODS = {
  EFECTIVO: "CASH",
  TRANSFERENCIA: "BACS"
};

// src/invoice-builder/escape.ts
var escapeHtml = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
var safeImageSrc = (value) => {
  const v = String(value ?? "");
  if (/^(data:image\/(png|jpe?g|gif|webp);base64,|https?:\/\/)/i.test(v)) {
    return escapeHtml(v);
  }
  return "";
};

// src/invoice-builder/paper.ts
var PAPER_SIZES = {
  "80mm": { id: "80mm", label: "80 mm (t\xE9rmica)", kind: "thermal", widthMm: 80 },
  "70mm": { id: "70mm", label: "70 mm (t\xE9rmica)", kind: "thermal", widthMm: 70 },
  "58mm": { id: "58mm", label: "58 mm (t\xE9rmica)", kind: "thermal", widthMm: 58 },
  letter: { id: "letter", label: "Carta (216 \xD7 279 mm)", kind: "sheet", widthMm: 216, heightMm: 279 },
  legal: { id: "legal", label: "Legal (216 \xD7 356 mm)", kind: "sheet", widthMm: 216, heightMm: 356 },
  half_letter: { id: "half_letter", label: "Media carta (140 \xD7 216 mm)", kind: "sheet", widthMm: 140, heightMm: 216 },
  a4: { id: "a4", label: "A4 (210 \xD7 297 mm)", kind: "sheet", widthMm: 210, heightMm: 297 },
  a5: { id: "a5", label: "A5 (148 \xD7 210 mm)", kind: "sheet", widthMm: 148, heightMm: 210 }
};
var PAPER_SIZE_LIST = Object.values(PAPER_SIZES);
var getPaperPreset = (id) => PAPER_SIZES[id] ?? PAPER_SIZES["80mm"];

// src/invoice-builder/registry.ts
var DOC_TYPE_LABEL = {
  invoice: "FACTURA",
  proforma: "PROFORMA",
  credit_receipt: "RECIBO DE ABONO"
};
var str = (v, d = "") => v == null ? d : String(v);
var bool = (v, d = true) => v == null ? d : v !== false && v !== "false" && v !== 0;
var num = (v, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};
var row = (label, value, bold = false) => `<div style="display:flex;justify-content:space-between;gap:8px;${bold ? "font-weight:500;" : ""}"><span>${label}</span><span>${value}</span></div>`;
var muted = "#555";
var COMPONENTS = {
  logo: {
    type: "logo",
    label: "Logo",
    icon: "photo",
    dataBound: true,
    suggestedAreas: ["header"],
    propsSchema: [
      { key: "align", label: "Alineaci\xF3n", type: "select", options: [
        { value: "left", label: "Izquierda" },
        { value: "center", label: "Centro" },
        { value: "right", label: "Derecha" }
      ], default: "center" },
      { key: "sizePx", label: "Alto m\xE1x (px)", type: "number", default: 64 }
    ],
    render: (props, data, ctx) => {
      const src = ctx.safeImageSrc(data.business?.logo);
      if (!src) return "";
      const al = str(props.align, "center");
      const size = num(props.sizePx, 64);
      return `<div style="text-align:${al};margin:2px 0;"><img src="${src}" alt="logo" style="max-height:${size}px;max-width:100%;" /></div>`;
    }
  },
  business: {
    type: "business",
    label: "Datos del negocio",
    icon: "building-store",
    dataBound: true,
    suggestedAreas: ["header"],
    propsSchema: [
      { key: "showAddress", label: "Mostrar direcci\xF3n", type: "boolean", default: true },
      { key: "showTaxId", label: "Mostrar RUC", type: "boolean", default: true },
      { key: "showPhone", label: "Mostrar tel\xE9fono", type: "boolean", default: true },
      { key: "showEmail", label: "Mostrar correo", type: "boolean", default: false }
    ],
    render: (props, data, ctx) => {
      const b = data.business || {};
      const e = ctx.escapeHtml;
      const al = ctx.styles.align;
      let h = `<div style="text-align:${al};">`;
      if (b.name) h += `<div style="font-weight:600;">${e(b.name)}</div>`;
      const line = [];
      if (bool(props.showAddress) && b.address) line.push(e(b.address));
      if (bool(props.showTaxId) && b.taxId) line.push("RUC " + e(b.taxId));
      if (bool(props.showPhone) && b.phone) line.push("Tel " + e(b.phone));
      if (bool(props.showEmail, false) && b.email) line.push(e(b.email));
      if (line.length) h += `<div style="color:${muted};">${line.join(" \xB7 ")}</div>`;
      return h + "</div>";
    }
  },
  title: {
    type: "title",
    label: "T\xEDtulo del documento",
    icon: "heading",
    dataBound: true,
    suggestedAreas: ["header"],
    propsSchema: [
      { key: "text", label: "Texto (vac\xEDo = autom\xE1tico)", type: "text", default: "" }
    ],
    render: (props, data, ctx) => {
      const text = str(props.text) || data.document?.title || DOC_TYPE_LABEL[ctx.documentType];
      return `<div style="text-align:center;font-weight:600;letter-spacing:.5px;color:${ctx.styles.accent};margin:3px 0;">${ctx.escapeHtml(text)}</div>`;
    }
  },
  meta: {
    type: "meta",
    label: "N\xB0 / Fecha / Vendedor",
    icon: "info-circle",
    dataBound: true,
    suggestedAreas: ["header", "body"],
    propsSchema: [
      { key: "showNumber", label: "Mostrar n\xFAmero", type: "boolean", default: true },
      { key: "showDate", label: "Mostrar fecha", type: "boolean", default: true },
      { key: "showSeller", label: "Mostrar vendedor", type: "boolean", default: true },
      { key: "showReference", label: "Mostrar referencia", type: "boolean", default: false }
    ],
    render: (props, data, ctx) => {
      const d = data.document || {};
      const e = ctx.escapeHtml;
      let h = `<div style="color:${muted};">`;
      if (bool(props.showNumber) && d.number) {
        const n = d.series ? `${e(d.series)}-${e(d.number)}` : e(d.number);
        h += row("N\xB0", n);
      }
      if (bool(props.showDate) && d.date) h += row("Fecha", e(d.date));
      if (bool(props.showSeller) && d.seller) h += row("Vendedor", e(d.seller));
      if (bool(props.showReference, false) && d.reference) h += row("Referencia", e(d.reference));
      return h + "</div>";
    }
  },
  client: {
    type: "client",
    label: "Datos del cliente",
    icon: "user",
    dataBound: true,
    suggestedAreas: ["body"],
    propsSchema: [
      { key: "title", label: "Etiqueta", type: "text", default: "Cliente" },
      { key: "showTaxId", label: "Mostrar RUC/c\xE9dula", type: "boolean", default: true },
      { key: "showAddress", label: "Mostrar direcci\xF3n", type: "boolean", default: false },
      { key: "showPhone", label: "Mostrar tel\xE9fono", type: "boolean", default: true }
    ],
    render: (props, data, ctx) => {
      const c = data.client || {};
      const e = ctx.escapeHtml;
      let h = row(str(props.title, "Cliente") + ":", e(c.name || "\u2014"), true);
      const line = [];
      if (bool(props.showTaxId) && c.taxId) line.push(e(c.taxId));
      if (bool(props.showPhone) && c.phone) line.push(e(c.phone));
      if (bool(props.showAddress, false) && c.address) line.push(e(c.address));
      if (line.length) h += `<div style="color:${muted};">${line.join(" \xB7 ")}</div>`;
      return h;
    }
  },
  items: {
    type: "items",
    label: "Tabla de \xEDtems",
    icon: "list",
    dataBound: true,
    suggestedAreas: ["body"],
    propsSchema: [
      { key: "showSku", label: "Columna SKU", type: "boolean", default: false },
      { key: "showQty", label: "Columna cantidad", type: "boolean", default: true },
      { key: "showUnitPrice", label: "Columna precio unit.", type: "boolean", default: true },
      { key: "showDiscount", label: "Columna descuento", type: "boolean", default: false }
    ],
    render: (props, data, ctx) => {
      const items = data.items || [];
      const e = ctx.escapeHtml;
      const m = ctx.money;
      if (ctx.isThermal) {
        let h2 = `<div style="display:flex;justify-content:space-between;color:${muted};border-bottom:1px solid #ddd;padding-bottom:2px;"><span>Descripci\xF3n</span><span>Importe</span></div>`;
        for (const it of items) {
          const sub = [];
          if (bool(props.showQty) && it.quantity != null) sub.push(String(it.quantity) + "\xD7");
          if (bool(props.showUnitPrice) && it.unitPrice != null) sub.push(m(it.unitPrice));
          if (bool(props.showDiscount, false) && it.discount) sub.push("-" + m(it.discount));
          h2 += `<div style="display:flex;justify-content:space-between;gap:8px;padding-top:3px;"><span>${e(it.description || "")}` + (sub.length ? ` <span style="color:#888;">${sub.join(" ")}</span>` : "") + `</span><span>${m(it.total)}</span></div>`;
        }
        return h2;
      }
      const cols = ["Descripci\xF3n"];
      if (bool(props.showSku, false)) cols.unshift("SKU");
      if (bool(props.showQty)) cols.push("Cant.");
      if (bool(props.showUnitPrice)) cols.push("P. Unit");
      if (bool(props.showDiscount, false)) cols.push("Desc.");
      cols.push("Importe");
      let h = '<table style="width:100%;border-collapse:collapse;"><thead><tr>';
      cols.forEach((c, i) => {
        h += `<th style="text-align:${i === 0 || i === 1 && bool(props.showSku, false) ? "left" : "right"};border-bottom:1px solid #ccc;padding:3px 4px;color:${muted};font-weight:500;">${c}</th>`;
      });
      h += "</tr></thead><tbody>";
      for (const it of items) {
        h += "<tr>";
        if (bool(props.showSku, false)) h += `<td style="padding:3px 4px;">${e(it.sku || "")}</td>`;
        h += `<td style="padding:3px 4px;">${e(it.description || "")}</td>`;
        if (bool(props.showQty)) h += `<td style="text-align:right;padding:3px 4px;">${it.quantity ?? ""}</td>`;
        if (bool(props.showUnitPrice)) h += `<td style="text-align:right;padding:3px 4px;">${m(it.unitPrice)}</td>`;
        if (bool(props.showDiscount, false)) h += `<td style="text-align:right;padding:3px 4px;">${it.discount ? m(it.discount) : "\u2014"}</td>`;
        h += `<td style="text-align:right;padding:3px 4px;">${m(it.total)}</td></tr>`;
      }
      return h + "</tbody></table>";
    }
  },
  totals: {
    type: "totals",
    label: "Totales",
    icon: "calculator",
    dataBound: true,
    suggestedAreas: ["body"],
    propsSchema: [
      { key: "showSubtotal", label: "Mostrar subtotal", type: "boolean", default: true },
      { key: "showDiscount", label: "Mostrar descuento", type: "boolean", default: true },
      { key: "showTax", label: "Mostrar impuesto", type: "boolean", default: true }
    ],
    render: (props, data, ctx) => {
      const t = data.totals || {};
      const m = ctx.money;
      let h = "";
      if (bool(props.showSubtotal) && t.subtotal != null) h += row("Subtotal", m(t.subtotal));
      if (bool(props.showDiscount) && t.discount) h += row("Descuento", "-" + m(t.discount));
      if (bool(props.showTax) && t.tax != null) h += row(ctx.escapeHtml(t.taxLabel || "Impuesto"), m(t.tax));
      h += `<div style="color:${ctx.styles.accent};font-size:1.15em;">${row("TOTAL", m(t.total), true)}</div>`;
      return h;
    }
  },
  payment: {
    type: "payment",
    label: "Pago / vuelto",
    icon: "cash",
    dataBound: true,
    suggestedAreas: ["body", "footer"],
    propsSchema: [
      { key: "showMethod", label: "Mostrar m\xE9todo", type: "boolean", default: true },
      { key: "showReceived", label: "Mostrar recibido", type: "boolean", default: true },
      { key: "showChange", label: "Mostrar vuelto", type: "boolean", default: true },
      { key: "showReference", label: "Mostrar referencia", type: "boolean", default: true }
    ],
    render: (props, data, ctx) => {
      const p = data.payment || {};
      const e = ctx.escapeHtml;
      const m = ctx.money;
      let h = `<div style="color:${muted};">`;
      if (bool(props.showMethod) && p.method) h += row("M\xE9todo", e(p.method));
      if (bool(props.showReceived) && p.received != null) h += row("Recibido", m(p.received));
      if (bool(props.showChange) && p.change != null) h += row("Vuelto", m(p.change));
      if (bool(props.showReference) && p.reference) h += row("Referencia", e(p.reference));
      return h + "</div>";
    }
  },
  credit: {
    type: "credit",
    label: "Resumen de cr\xE9dito",
    icon: "credit-card",
    dataBound: true,
    suggestedAreas: ["body"],
    propsSchema: [],
    render: (_props, data, ctx) => {
      const c = data.credit || {};
      const m = ctx.money;
      let h = `<div style="color:${muted};">`;
      if (c.previousDebt != null) h += row("Deuda anterior", m(c.previousDebt));
      if (c.payment != null) h += row("Abono", m(c.payment));
      if (c.newBalance != null) h += `<div style="color:${ctx.styles.accent};">${row("Nuevo saldo", m(c.newBalance), true)}</div>`;
      return h + "</div>";
    }
  },
  text: {
    type: "text",
    label: "Texto libre",
    icon: "text-caption",
    suggestedAreas: ["header", "body", "footer"],
    propsSchema: [
      { key: "content", label: "Contenido", type: "textarea", default: "\xA1Gracias por su compra!" },
      { key: "align", label: "Alineaci\xF3n", type: "select", options: [
        { value: "left", label: "Izquierda" },
        { value: "center", label: "Centro" },
        { value: "right", label: "Derecha" }
      ], default: "center" },
      { key: "bold", label: "Negrita", type: "boolean", default: false }
    ],
    render: (props, _data, ctx) => {
      const content = ctx.escapeHtml(str(props.content)).replace(/\n/g, "<br>");
      if (!content) return "";
      const al = str(props.align, "center");
      const b = bool(props.bold, false) ? "font-weight:500;" : "";
      return `<div style="text-align:${al};color:${muted};${b}">${content}</div>`;
    }
  },
  divider: {
    type: "divider",
    label: "Separador",
    icon: "separator-horizontal",
    suggestedAreas: ["header", "body", "footer"],
    propsSchema: [
      { key: "style", label: "Estilo", type: "select", options: [
        { value: "dashed", label: "Punteado" },
        { value: "solid", label: "S\xF3lido" }
      ], default: "dashed" }
    ],
    render: (props) => `<div style="border-top:1px ${str(props.style, "dashed")} #bbb;margin:5px 0;"></div>`
  },
  signature: {
    type: "signature",
    label: "Firma",
    icon: "signature",
    suggestedAreas: ["footer"],
    propsSchema: [
      { key: "label", label: "Etiqueta", type: "text", default: "Firma del cliente" },
      { key: "widthPct", label: "Ancho de l\xEDnea (%)", type: "number", default: 70 }
    ],
    render: (props, _data, ctx) => {
      const w = num(props.widthPct, 70);
      return `<div style="margin-top:18px;text-align:center;color:${muted};"><div style="border-top:1px solid #333;width:${w}%;margin:0 auto 2px;"></div>${ctx.escapeHtml(str(props.label, "Firma del cliente"))}</div>`;
    }
  },
  qr: {
    type: "qr",
    label: "C\xF3digo QR",
    icon: "qrcode",
    suggestedAreas: ["footer", "header"],
    propsSchema: [
      { key: "value", label: "Contenido (vac\xEDo = N\xB0 de factura)", type: "text", default: "" },
      { key: "sizePx", label: "Tama\xF1o (px)", type: "number", default: 72 }
    ],
    render: (props, data, ctx) => {
      const value = str(props.value) || data.document?.number || "";
      const size = num(props.sizePx, 72);
      return `<div style="text-align:center;margin:4px 0;"><div style="width:${size}px;height:${size}px;margin:0 auto;border:2px solid #111;background:repeating-conic-gradient(#111 0 25%,#fff 0 50%) 0/${Math.round(size / 6)}px ${Math.round(size / 6)}px;"></div>` + (value ? `<div style="color:${muted};font-size:.85em;">${ctx.escapeHtml(value)}</div>` : "") + `</div>`;
    }
  },
  barcode: {
    type: "barcode",
    label: "C\xF3digo de barras",
    icon: "barcode",
    suggestedAreas: ["footer", "header"],
    propsSchema: [
      { key: "value", label: "Contenido (vac\xEDo = N\xB0 de factura)", type: "text", default: "" }
    ],
    render: (props, data, ctx) => {
      const value = str(props.value) || data.document?.number || "";
      return `<div style="text-align:center;margin:4px 0;"><div style="font-family:monospace;letter-spacing:1px;">\u2590\u2502\u258C\u2551\u2590\u2502\u2551\u258C\u2502\u2590\u2551\u2502\u258C\u2551\u2590\u2502\u258C</div>` + (value ? `<div style="color:${muted};font-size:.85em;">${ctx.escapeHtml(value)}</div>` : "") + `</div>`;
    }
  },
  spacer: {
    type: "spacer",
    label: "Espacio",
    icon: "arrows-vertical",
    suggestedAreas: ["header", "body", "footer"],
    propsSchema: [
      { key: "heightMm", label: "Alto (mm)", type: "number", default: 4 }
    ],
    render: (props) => `<div style="height:${num(props.heightMm, 4)}mm;"></div>`
  }
};
var registerComponent = (def) => {
  COMPONENTS[def.type] = def;
};
var getComponent = (type) => COMPONENTS[type];
var listComponents = () => Object.values(COMPONENTS);

// src/invoice-builder/render.ts
var AREAS = ["header", "body", "footer"];
var DEFAULT_STYLES = {
  accent: "#534AB7",
  fontFamily: "sans",
  baseFontPt: 9,
  align: "center",
  marginMm: 4
};
var buildRenderContext = (template, data) => {
  const paper = getPaperPreset(template.paperSize);
  const currency = data.currency || "NIO";
  return {
    styles: { ...DEFAULT_STYLES, ...template.styles },
    paper,
    documentType: template.documentType,
    isThermal: paper.kind === "thermal",
    escapeHtml,
    safeImageSrc,
    money: (value) => currencyFormatter({ currency, value: Number(value) || 0 })
  };
};
var renderInstances = (template, data, ctx) => {
  let out = "";
  for (const area of AREAS) {
    const list = template.areas?.[area] || [];
    if (!list.length) continue;
    let inner = "";
    for (const inst2 of list) {
      const def = getComponent(inst2.type);
      if (!def) continue;
      const html = def.render(inst2.props || {}, data, ctx);
      if (html) inner += `<div style="margin:2px 0;">${html}</div>`;
    }
    out += `<div data-area="${area}">${inner}</div>`;
  }
  return out;
};
var containerStyle = (ctx) => {
  const { paper, styles } = ctx;
  const font = styles.fontFamily === "mono" ? "'Courier New', ui-monospace, monospace" : "-apple-system, system-ui, 'Segoe UI', Roboto, Arial, sans-serif";
  const width = `${paper.widthMm}mm`;
  const minHeight = paper.kind === "sheet" && paper.heightMm ? `min-height:${paper.heightMm}mm;` : "";
  return `box-sizing:border-box;width:${width};${minHeight}padding:${styles.marginMm}mm;margin:0 auto;background:#fff;color:#111;font-family:${font};font-size:${styles.baseFontPt}pt;line-height:1.4;text-align:${styles.align};`;
};
var renderTemplateInner = (template, data) => {
  const ctx = buildRenderContext(template, data);
  return `<div class="pb-doc" style="${containerStyle(ctx)}">${renderInstances(template, data, ctx)}</div>`;
};
var renderInvoiceTemplate = (template, data) => {
  const ctx = buildRenderContext(template, data);
  const { paper } = ctx;
  const pageSize = paper.kind === "sheet" && paper.heightMm ? `${paper.widthMm}mm ${paper.heightMm}mm` : `${paper.widthMm}mm auto`;
  const inner = renderInstances(template, data, ctx);
  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(template.name || "Documento")}</title><style>@page{size:${pageSize};margin:0;}*{box-sizing:border-box;}html,body{margin:0;padding:0;}table{border-collapse:collapse;}</style></head><body><div class="pb-doc" style="${containerStyle(ctx)}">${inner}</div></body></html>`;
};
var pdfFormatFor = (template) => {
  const paper = getPaperPreset(template.paperSize);
  return { widthMm: paper.widthMm, heightMm: paper.heightMm ?? 297 };
};

// src/invoice-builder/defaults.ts
var seq = 0;
var newInstanceId = (type) => `${type}-${++seq}`;
var inst = (type, props) => ({
  id: newInstanceId(type),
  type,
  props
});
var defaultTemplate = (documentType = "invoice", paperSize = "80mm") => {
  const base = {
    name: "Nueva plantilla",
    documentType,
    paperSize,
    styles: {}
  };
  if (documentType === "credit_receipt") {
    return {
      ...base,
      areas: {
        header: [inst("logo"), inst("business"), inst("title"), inst("meta")],
        body: [inst("divider"), inst("client"), inst("credit"), inst("payment")],
        footer: [inst("divider"), inst("signature")]
      }
    };
  }
  if (documentType === "proforma") {
    return {
      ...base,
      areas: {
        header: [inst("logo"), inst("business"), inst("title"), inst("meta")],
        body: [inst("divider"), inst("client"), inst("items"), inst("totals")],
        footer: [inst("divider"), inst("text", { content: "Documento no v\xE1lido como factura." })]
      }
    };
  }
  return {
    ...base,
    areas: {
      header: [inst("logo"), inst("business"), inst("title"), inst("meta")],
      body: [inst("divider"), inst("client"), inst("items"), inst("totals"), inst("payment")],
      footer: [inst("divider"), inst("text", { content: "\xA1Gracias por su compra!" })]
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  COMPONENTS,
  DOC_TYPE_LABEL,
  PAPER_SIZES,
  PAPER_SIZE_LIST,
  PAYMENT_METHODS,
  SELL_TYPES,
  buildRenderContext,
  calculateTotalDiscount,
  checkSimilarity,
  currencyFormatter,
  currencyFormatterWithoutSym,
  defaultTemplate,
  escapeHtml,
  getComponent,
  getDiceCoefficient,
  getLevenshteinDistance,
  getPaperPreset,
  getStringSimilarity,
  isGenericClientName,
  listComponents,
  newInstanceId,
  normalizeName,
  pdfFormatFor,
  registerComponent,
  renderInvoiceTemplate,
  renderTemplateInner,
  safeImageSrc
});
//# sourceMappingURL=index.js.map