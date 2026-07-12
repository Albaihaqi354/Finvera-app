"use client"
import { useState, useEffect, useRef } from 'react'
import { getCurrency } from '@/lib/currency'

/**
 * CurrencyInput
 *
 * Props:
 *   value        — numeric value (number or string)
 *   onChange     — called with numeric value when input changes
 *   currency     — currency code string (e.g. 'IDR', 'USD')
 *   placeholder  — string
 *   className    — extra CSS classes
 *   disabled     — boolean
 *   required     — boolean
 *   id           — string
 *
 * The display shows formatted number with thousand separators (dots for IDR)
 * as the user types in real-time. The onChange callback always fires with a
 * plain numeric value.
 */
export default function CurrencyInput({
  value,
  onChange,
  currency = 'IDR',
  placeholder = '0',
  className = '',
  disabled = false,
  required = false,
  id,
}) {
  const cur = getCurrency(currency)
  const [displayValue, setDisplayValue] = useState('')
  const isEditing = useRef(false)

  // Format a numeric value for display with thousand separators
  const format = (num) => {
    if (num === '' || num === null || num === undefined) return ''
    const n = parseFloat(num)
    if (isNaN(n)) return ''
    // Show '0' explicitly when value is zero (was returning empty string before, causing confusion)
    if (n === 0) return '0'
    return n.toLocaleString(cur.locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: cur.decimals,
    })
  }

  /**
   * Format raw string input in real-time while user types.
   * Strips non-numeric chars, then re-inserts thousand separators.
   * Returns { display: string, numeric: number }
   */
  const parseAndFormat = (raw) => {
    if (cur.code === 'IDR') {
      // IDR: dot = thousands separator, no decimals expected
      // Strip everything except digits and minus
      const digitsOnly = raw.replace(/\./g, '').replace(/[^0-9\-]/g, '')
      if (digitsOnly === '' || digitsOnly === '-') return { display: digitsOnly, numeric: 0 }
      const numeric = parseFloat(digitsOnly) || 0
      // Re-format with dot as thousands separator
      const formatted = numeric.toLocaleString('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      return { display: formatted, numeric }
    } else {
      // Other currencies: comma = thousands separator, dot = decimal
      const cleaned = raw.replace(/,/g, '').replace(/[^0-9.\-]/g, '')
      if (cleaned === '' || cleaned === '.') return { display: cleaned, numeric: 0 }
      const numeric = parseFloat(cleaned) || 0
      // Only format if user isn't in the middle of typing decimals
      const endsWithDot = cleaned.endsWith('.')
      const formatted = endsWithDot
        ? cleaned
        : numeric.toLocaleString(cur.locale, {
            minimumFractionDigits: 0,
            maximumFractionDigits: cur.decimals,
          })
      return { display: formatted, numeric }
    }
  }

  // Update display whenever external value changes (but not while user is typing)
  useEffect(() => {
    if (!isEditing.current) {
      setDisplayValue(format(value))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, currency])

  const handleChange = (e) => {
    const raw = e.target.value
    const { display, numeric } = parseAndFormat(raw)
    setDisplayValue(display)
    onChange(numeric)
  }

  const handleFocus = () => {
    isEditing.current = true
    const n = parseFloat(value) || 0
    // Clear '0' on focus so user can start typing cleanly, but keep real values
    setDisplayValue(n === 0 ? '' : format(n))
  }

  const handleBlur = () => {
    isEditing.current = false
    const n = parseFloat(value) || 0
    setDisplayValue(n === 0 ? '' : format(n))
  }

  return (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      className={className}
      autoComplete="off"
    />
  )
}
