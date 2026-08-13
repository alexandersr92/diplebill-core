import type { ComponentDefinition, DocumentType, PropField } from './types';
export declare const DOC_TYPE_LABEL: Record<DocumentType, string>;
export declare const COMPONENTS: Record<string, ComponentDefinition>;
/**
 * Campos de estilo comunes a todos los bloques de texto. El editor los renderiza
 * en una sección "Estilo" y los liga a `instance.style` (no a `instance.props`).
 */
export declare const COMMON_STYLE_FIELDS: PropField[];
/** Registra (o reemplaza) un componente en la biblioteca. Extensible en runtime. */
export declare const registerComponent: (def: ComponentDefinition) => void;
export declare const getComponent: (type: string) => ComponentDefinition | undefined;
/** Lista para la biblioteca del editor (type, label, icon, área sugerida). */
export declare const listComponents: () => ComponentDefinition[];
