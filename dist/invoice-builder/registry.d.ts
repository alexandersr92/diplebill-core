import type { ComponentDefinition, DocumentType } from './types';
export declare const DOC_TYPE_LABEL: Record<DocumentType, string>;
export declare const COMPONENTS: Record<string, ComponentDefinition>;
/** Registra (o reemplaza) un componente en la biblioteca. Extensible en runtime. */
export declare const registerComponent: (def: ComponentDefinition) => void;
export declare const getComponent: (type: string) => ComponentDefinition | undefined;
/** Lista para la biblioteca del editor (type, label, icon, área sugerida). */
export declare const listComponents: () => ComponentDefinition[];
