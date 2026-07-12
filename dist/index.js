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
  PAYMENT_METHODS: () => PAYMENT_METHODS,
  SELL_TYPES: () => SELL_TYPES,
  calculateTotalDiscount: () => calculateTotalDiscount,
  checkSimilarity: () => checkSimilarity,
  currencyFormatter: () => currencyFormatter,
  currencyFormatterWithoutSym: () => currencyFormatterWithoutSym,
  getDiceCoefficient: () => getDiceCoefficient,
  getLevenshteinDistance: () => getLevenshteinDistance,
  getStringSimilarity: () => getStringSimilarity,
  isGenericClientName: () => isGenericClientName,
  normalizeName: () => normalizeName
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
  const getBigrams = (str) => {
    const bigrams = /* @__PURE__ */ new Set();
    for (let i = 0; i < str.length - 1; i++) {
      bigrams.add(str.substring(i, i + 2));
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
var normalizeName = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PAYMENT_METHODS,
  SELL_TYPES,
  calculateTotalDiscount,
  checkSimilarity,
  currencyFormatter,
  currencyFormatterWithoutSym,
  getDiceCoefficient,
  getLevenshteinDistance,
  getStringSimilarity,
  isGenericClientName,
  normalizeName
});
//# sourceMappingURL=index.js.map