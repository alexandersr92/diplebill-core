import type { PaperPreset, PaperSizeId } from './types';

/** Presets de tamaño de papel. Térmicas: ancho fijo, alto continuo (rollo). */
export const PAPER_SIZES: Record<PaperSizeId, PaperPreset> = {
  '80mm': { id: '80mm', label: '80 mm (térmica)', kind: 'thermal', widthMm: 80 },
  '70mm': { id: '70mm', label: '70 mm (térmica)', kind: 'thermal', widthMm: 70 },
  '58mm': { id: '58mm', label: '58 mm (térmica)', kind: 'thermal', widthMm: 58 },
  letter: { id: 'letter', label: 'Carta (216 × 279 mm)', kind: 'sheet', widthMm: 216, heightMm: 279 },
  legal: { id: 'legal', label: 'Legal (216 × 356 mm)', kind: 'sheet', widthMm: 216, heightMm: 356 },
  half_letter: { id: 'half_letter', label: 'Media carta (140 × 216 mm)', kind: 'sheet', widthMm: 140, heightMm: 216 },
  a4: { id: 'a4', label: 'A4 (210 × 297 mm)', kind: 'sheet', widthMm: 210, heightMm: 297 },
  a5: { id: 'a5', label: 'A5 (148 × 210 mm)', kind: 'sheet', widthMm: 148, heightMm: 210 },
};

export const PAPER_SIZE_LIST: PaperPreset[] = Object.values(PAPER_SIZES);

export const getPaperPreset = (id: PaperSizeId): PaperPreset =>
  PAPER_SIZES[id] ?? PAPER_SIZES['80mm'];
