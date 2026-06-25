"use client"
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({
  theme: 'system',
  setTheme: () => {}
})

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('system')

  useEffect(() => {
    // Load from local storage
    const saved = localStorage.getItem('finvera_theme')
    if (saved) setThemeState(saved)
  }, [])

  useEffect(() => {
    const applyTheme = (mode) => {
      const root = window.document.documentElement
      if (mode === 'dark') {
        root.classList.add('dark')
      } else if (mode === 'light') {
        root.classList.remove('dark')
      } else {
        // System
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
      }
    }

    applyTheme(theme)

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = () => applyTheme('system')
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    }
  }, [theme])

  const setTheme = (newTheme) => {
    setThemeState(newTheme)
    localStorage.setItem('finvera_theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
