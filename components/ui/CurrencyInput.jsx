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
 * The display shows formatted number with thousand separators.
 * The onChange callback always fires with a plain numeric value.
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

  // Format a numeric value for display
  const format = (num) => {
    if (num === '' || num === null || num === undefined || isNaN(num)) return ''
    const n = parseFloat(num)
    if (isNaN(n)) return ''
    return n.toLocaleString(cur.locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: cur.decimals,
    })
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

    // Allow only digits, one decimal point/comma, minus
    // Strip thousand separators (dot for IDR, comma for others)
    let cleaned = raw
    if (cur.code === 'IDR') {
      // IDR uses dots as thousands separator — strip them
      cleaned = raw.replace(/\./g, '').replace(/[^0-9,\-]/g, '').replace(',', '.')
    } else {
      // Other currencies use commas as thousands — strip them
      cleaned = raw.replace(/,/g, '').replace(/[^0-9.\-]/g, '')
    }

    const numeric = parseFloat(cleaned) || 0

    // Show the raw input while typing (don't re-format mid-edit)
    setDisplayValue(raw)
    onChange(numeric)
  }

  const handleFocus = () => {
    isEditing.current = true
    // Show raw number without formatting on focus for easier editing
    const n = parseFloat(value) || 0
    setDisplayValue(n === 0 ? '' : String(n))
  }

  const handleBlur = () => {
    isEditing.current = false
    // Re-format on blur
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
