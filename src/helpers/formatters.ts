export interface CurrencyFormat {
  currency: string;
  value: number;
}

export function currencyFormatter({ currency, value }: CurrencyFormat) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    minimumFractionDigits: 2,
    currency
  });
  return formatter.format(value).replace('NIO', 'C$');
}

export function currencyFormatterWithoutSym(
  value: string,
  decimalPlaces: number = 2,
  locale: string = 'en-US'
): string {
  if (!value) return '';

  const cleanedValue = value.replace(/[^0-9.]/g, '');
  const parts = cleanedValue.split('.');
  const integerPart = parts[0].replace(/^0+(?!$)/, '') || '0';
  const decimalPart = parts[1] ? `.${parts[1].slice(0, decimalPlaces)}` : '';

  const formattedInteger = parseInt(integerPart, 10).toLocaleString(locale);
  return `${formattedInteger}${decimalPart}`;
}
