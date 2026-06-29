"use client"
import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import en from './locales/en'
import id from './locales/id'

const LOCALES = { en, id }

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState('en')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finvera_lang')
      if (saved && LOCALES[saved]) setLangState(saved)
    }
  }, [])

  const setLang = useCallback((newLang) => {
    if (!LOCALES[newLang]) return
    setLangState(newLang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('finvera_lang', newLang)
    }
  }, [])

  const t = useCallback((key) => {
    const locale = LOCALES[lang] || en
    return locale[key] || en[key] || key
  }, [lang])

  return (
    <I18nContext.Provider value={{ lang, setLang, t, locales: Object.keys(LOCALES) }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
