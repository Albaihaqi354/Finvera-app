import { useState, useEffect } from 'react'

/**
 * Delays updating a value until the user has stopped changing it for `delay` ms.
 * Use this on search inputs to avoid filtering on every single keystroke.
 *
 * @param {*} value - The value to debounce (typically a search string)
 * @param {number} delay - Milliseconds to wait before updating (default: 300ms)
 * @returns The debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup: cancel the previous timer if value changes before delay
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
