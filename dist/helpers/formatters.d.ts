export interface CurrencyFormat {
    currency: string;
    value: number;
}
export declare function currencyFormatter({ currency, value }: CurrencyFormat): string;
export declare function currencyFormatterWithoutSym(value: string, decimalPlaces?: number, locale?: string): string;
