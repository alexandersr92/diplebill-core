/**
 * Escapa un valor para interpolarlo de forma segura dentro de HTML.
 *
 * El motor de plantillas genera HTML que se inyecta en iframes / ventanas de
 * impresión / html2pdf; TODO valor de datos o de props del usuario pasa por aquí
 * para evitar XSS (mismo criterio que las correcciones de impresión del POS).
 */
export const escapeHtml = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * Devuelve una URL de imagen segura para un atributo `src`, o cadena vacía.
 * Solo acepta data-URLs de imagen en base64 o http(s); rechaza cualquier otra
 * cosa (evita `data:image/svg+xml,<script>` y breakouts de atributo).
 */
export const safeImageSrc = (value: unknown): string => {
  const v = String(value ?? '');
  if (/^(data:image\/(png|jpe?g|gif|webp);base64,|https?:\/\/)/i.test(v)) {
    return escapeHtml(v);
  }
  return '';
};
