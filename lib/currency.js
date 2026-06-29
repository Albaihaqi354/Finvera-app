/**
 * Currency utilities for Finvera
 * Supports IDR, USD, EUR, SGD, MYR, JPY, GBP, AUD
 */

export const CURRENCIES = [
  { code: 'IDR', label: 'IDR - Indonesian Rupiah',  symbol: 'Rp',  locale: 'id-ID', decimals: 0 },
  { code: 'USD', label: 'USD - US Dollar',           symbol: '$',   locale: 'en-US', decimals: 2 },
  { code: 'EUR', label: 'EUR - Euro',                symbol: '€',   locale: 'de-DE', decimals: 2 },
  { code: 'SGD', label: 'SGD - Singapore Dollar',    symbol: 'S$',  locale: 'en-SG', decimals: 2 },
  { code: 'MYR', label: 'MYR - Malaysian Ringgit',   symbol: 'RM',  locale: 'ms-MY', decimals: 2 },
  { code: 'JPY', label: 'JPY - Japanese Yen',        symbol: '¥',   locale: 'ja-JP', decimals: 0 },
  { code: 'GBP', label: 'GBP - British Pound',       symbol: '£',   locale: 'en-GB', decimals: 2 },
  { code: 'AUD', label: 'AUD - Australian Dollar',   symbol: 'A$',  locale: 'en-AU', decimals: 2 },
]

export function getCurrency(code) {
  return CURRENCIES.find(c => c.code === code) || CURRENCIES[0]
}

/**
 * Format a numeric amount as a currency string.
 * e.g. formatCurrency(1500000, 'IDR') → "Rp 1.500.000"
 *      formatCurrency(1234.56, 'USD') → "$ 1,234.56"
 */
export function formatCurrency(amount, currencyCode = 'IDR') {
  const cur = getCurrency(currencyCode)
  const num = parseFloat(amount) || 0
  const formatted = Math.abs(num).toLocaleString(cur.locale, {
    minimumFractionDigits: cur.decimals,
    maximumFractionDigits: cur.decimals,
  })
  return `${cur.symbol} ${formatted}`
}

/**
 * Format only the number part with thousand separators (for input display).
 * Uses the locale separator of the selected currency.
 * e.g. formatNumber(1500000, 'IDR') → "1.500.000"
 *      formatNumber(1234.56, 'USD') → "1,234.56"
 */
export function formatNumber(amount, currencyCode = 'IDR') {
  const cur = getCurrency(currencyCode)
  const num = parseFloat(amount) || 0
  return num.toLocaleString(cur.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: cur.decimals,
  })
}

/**
 * Parse a formatted number string back to a float.
 * Handles both dot and comma separators.
 */
export function parseFormattedNumber(str) {
  if (!str) return 0
  // Remove all non-numeric except last decimal separator
  // Strategy: remove dots that are thousands separators (IDR style),
  // and convert comma decimal to dot
  const cleaned = String(str)
    .replace(/\./g, '') // remove IDR thousand dots
    .replace(/,/g, '')  // remove USD/EUR thousand commas
  return parseFloat(cleaned) || 0
}
