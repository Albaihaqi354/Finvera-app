"use client"
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({
  theme: 'system',
  setTheme: () => {},
  resolvedTheme: 'light',
})

function getStoredTheme() {
  if (typeof window === 'undefined') return 'system'
  return localStorage.getItem('finvera_theme') || 'system'
}

function resolveTheme(mode) {
  if (mode === 'dark') return 'dark'
  if (mode === 'light') return 'light'
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

function applyThemeClass(mode) {
  const root = window.document.documentElement
  const resolved = resolveTheme(mode)
  if (resolved === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  return resolved
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getStoredTheme)
  const [resolvedTheme, setResolvedTheme] = useState('light')

  useEffect(() => {
    setResolvedTheme(applyThemeClass(theme))

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => setResolvedTheme(applyThemeClass('system'))
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }
  }, [theme])

  const setTheme = (newTheme) => {
    setThemeState(newTheme)
    localStorage.setItem('finvera_theme', newTheme)
    setResolvedTheme(applyThemeClass(newTheme))
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
