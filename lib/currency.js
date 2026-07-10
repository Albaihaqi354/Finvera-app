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
 */
export function parseFormattedNumber(str) {
  if (!str) return 0
  const cleaned = String(str)
    .replace(/\./g, '')
    .replace(/,/g, '')
  return parseFloat(cleaned) || 0
}

/**
 * Convert an amount from one currency to another using a rates map.
 * All rates are relative to IDR (base currency).
 * e.g. rates = { USD: 0.000062, EUR: 0.000057, IDR: 1 }
 *
 * @param {number} amount       - The raw amount stored (always in base currency IDR)
 * @param {string} toCurrency   - The target display currency code
 * @param {object} rates        - Map of { currencyCode: rateFromIDR }
 * @returns {number}
 */
export function convertAmount(amount, toCurrency, rates) {
  if (!rates || !toCurrency || toCurrency === 'IDR') return parseFloat(amount) || 0
  const rate = rates[toCurrency]
  if (!rate) return parseFloat(amount) || 0
  return (parseFloat(amount) || 0) * rate
}

/**
 * Format an amount stored in IDR into the display currency,
 * applying conversion if rates are available.
 *
 * @param {number} amount       - Raw amount in IDR (base)
 * @param {string} displayCurrency - Target currency code
 * @param {object|null} rates   - Exchange rates map (null = no conversion, symbol swap only)
 */
export function formatConverted(amount, displayCurrency = 'IDR', rates = null) {
  const converted = rates
    ? convertAmount(amount, displayCurrency, rates)
    : parseFloat(amount) || 0
  return formatCurrency(converted, displayCurrency)
}

/**
 * Fetch live exchange rates from a free, no-auth API.
 * Returns rates relative to IDR base: { USD: 0.000062, EUR: 0.000057, ... }
 * Falls back to hardcoded approximate rates if the API is unavailable.
 */
const FALLBACK_RATES = {
  IDR: 1,
  USD: 0.000062,
  EUR: 0.000057,
  SGD: 0.000084,
  MYR: 0.000292,
  JPY: 0.0095,
  GBP: 0.000049,
  AUD: 0.000097,
}

export async function fetchExchangeRates() {
  try {
    // Using Frankfurter API (free, no API key required) — base IDR
    const res = await fetch('https://api.frankfurter.app/latest?base=IDR', {
      next: { revalidate: 3600 }, // cache for 1 hour in Next.js
    })
    if (!res.ok) throw new Error('Rate fetch failed')
    const data = await res.json()
    // data.rates is { USD: 0.000062, EUR: ... } — add IDR itself
    return { IDR: 1, ...data.rates }
  } catch {
    console.warn('[Finvera] Exchange rate fetch failed, using fallback rates.')
    return FALLBACK_RATES
  }
}
