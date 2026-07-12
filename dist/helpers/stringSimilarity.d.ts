/**
 * Calcula la distancia de Levenshtein entre dos cadenas de texto.
 * Mide el número mínimo de operaciones requeridas para transformar una cadena en otra.
 */
export declare function getLevenshteinDistance(a: string, b: string): number;
/**
 * Normaliza la distancia de Levenshtein para obtener un porcentaje de similitud entre 0.0 y 1.0.
 */
export declare function getStringSimilarity(a: string, b: string): number;
/**
 * Calcula el coeficiente de Sorensen-Dice entre dos cadenas.
 * Es excelente para identificar similitud basada en la combinación de letras (bigramas).
 * Ayuda a detectar palabras con el orden invertido (ej. "Carlos Sanchez" vs "Sanchez Carlos").
 */
export declare function getDiceCoefficient(a: string, b: string): number;
/**
 * Normaliza una cadena de texto eliminando acentos/diacríticos, caracteres especiales
 * y espacios múltiples para poder comparar nombres de forma limpia.
 */
export declare const normalizeName: (str: string) => string;
/**
 * Devuelve el porcentaje máximo de similitud entre dos nombres (0.0 a 1.0)
 * combinando Levenshtein y Sorensen-Dice.
 */
export declare function checkSimilarity(name1: string, name2: string): number;
/**
 * Verifica si un nombre de cliente es genérico y repetitivo.
 */
export declare function isGenericClientName(name: string): boolean;
