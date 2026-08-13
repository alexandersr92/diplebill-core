import type { PaperPreset, PaperSizeId } from './types';
/** Presets de tamaño de papel. Térmicas: ancho fijo, alto continuo (rollo). */
export declare const PAPER_SIZES: Record<PaperSizeId, PaperPreset>;
export declare const PAPER_SIZE_LIST: PaperPreset[];
export declare const getPaperPreset: (id: PaperSizeId) => PaperPreset;
