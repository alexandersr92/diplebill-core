/**
 * Escapa un valor para interpolarlo de forma segura dentro de HTML.
 *
 * El motor de plantillas genera HTML que se inyecta en iframes / ventanas de
 * impresión / html2pdf; TODO valor de datos o de props del usuario pasa por aquí
 * para evitar XSS (mismo criterio que las correcciones de impresión del POS).
 */
export declare const escapeHtml: (value: unknown) => string;
/**
 * Devuelve una URL de imagen segura para un atributo `src`, o cadena vacía.
 * Solo acepta data-URLs de imagen en base64 o http(s); rechaza cualquier otra
 * cosa (evita `data:image/svg+xml,<script>` y breakouts de atributo).
 */
export declare const safeImageSrc: (value: unknown) => string;
