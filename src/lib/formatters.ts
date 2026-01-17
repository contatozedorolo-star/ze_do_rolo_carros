/**
 * Utility functions for formatting and parsing values in Brazilian format
 */

/**
 * Formats a number as Brazilian currency (BRL)
 * Example: 110000 -> "R$ 110.000,00"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(value);
}

/**
 * Formats a number as Brazilian currency without cents
 * Example: 110000 -> "R$ 110.000"
 */
export function formatCurrencyShort(value: number): string {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Formats a number with Brazilian thousand separators
 * Example: 110000 -> "110.000"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

/**
 * Formats a price input with thousand separators (for display in input)
 * Example: "110000" -> "110.000"
 */
export function formatPriceInput(value: string): string {
  // Remove any non-digit characters
  const numericValue = value.replace(/\D/g, '');
  
  // Return empty if no value
  if (!numericValue) return '';
  
  // Parse as integer and format with thousand separators
  const number = parseInt(numericValue, 10);
  return new Intl.NumberFormat('pt-BR').format(number);
}

/**
 * Parses a formatted price string to a number
 * Example: "110.000" -> 110000
 */
export function parsePriceInput(formattedValue: string): number {
  // Remove all non-digit characters (dots, commas, spaces)
  const numericString = formattedValue.replace(/\D/g, '');
  return parseInt(numericString, 10) || 0;
}

/**
 * Handles price input change - formats for display while keeping numeric value
 * Returns the formatted string for display
 */
export function handlePriceChange(inputValue: string): string {
  return formatPriceInput(inputValue);
}
