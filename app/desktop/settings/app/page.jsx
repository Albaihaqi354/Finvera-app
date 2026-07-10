"use client"
import { useRef, useState } from 'react'
import { Save, Globe, Clock, Palette, CreditCard, AlertTriangle } from 'lucide-react'
import { useDesktop } from '@/components/desktop/DesktopProvider'
import { useTheme } from '@/components/desktop/ThemeProvider'
import { useI18n } from '@/lib/i18n'
import { CURRENCIES } from '@/lib/currency'
import { useToast } from '@/components/ui/Toast'

export default function AppSettingsPage() {
  const { theme, setTheme } = useTheme()
  const { lang, setLang, t } = useI18n()
  const { currency, setCurrency } = useDesktop()
  const toast = useToast()

  const handleSave = () => {
    toast.success(t('settings_saved') || 'Settings saved successfully.')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-brand-black">{t('app_settings')}</h2>
        <button 
          onClick={handleSave}
          className="flex items-center gap-1.5 bg-brand-black hover:bg-brand-black/80 text-brand-primary px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          {t('save_settings')}
        </button>
      </div>

      <div className="bg-surface rounded-3xl shadow-sm border border-brand-black/5 flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-3xl space-y-8">
          
          {/* General */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-brand-black border-b border-brand-black/5 pb-2">General Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-black/60 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-brand-black/40" />
                  {t('language')}
                </label>
                <select 
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="w-full appearance-none bg-base-light border border-transparent focus:bg-surface focus:border-brand-black/20 rounded-xl px-4 py-2.5 text-sm font-bold text-brand-black/80 cursor-pointer outline-none transition-all"
                >
                  <option value="en">English</option>
                  <option value="id">Bahasa Indonesia</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-black/60 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-black/40" />
                  Timezone
                </label>
                <select className="w-full appearance-none bg-base-light border border-transparent focus:bg-surface focus:border-brand-black/20 rounded-xl px-4 py-2.5 text-sm font-bold text-brand-black/80 cursor-pointer outline-none transition-all">
                  <option>UTC - Coordinated Universal Time</option>
                  <option>Asia/Jakarta (UTC+07:00)</option>
                  <option>America/New_York (UTC-05:00)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-brand-black border-b border-brand-black/5 pb-2">Preferences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-black/60 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-brand-black/40" />
                  Theme
                </label>
                <select 
                  value={theme}
                  onChange={e => setTheme(e.target.value)}
                  className="w-full appearance-none bg-base-light border border-transparent focus:bg-surface focus:border-brand-black/20 rounded-xl px-4 py-2.5 text-sm font-bold text-brand-black/80 cursor-pointer outline-none transition-all"
                >
                  <option value="light">Light (Finvera Style)</option>
                  <option value="dark">Dark Mode</option>
                  <option value="system">System Default</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-black/60 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-brand-black/40" />
                  {t('default_currency')}
                </label>
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full appearance-none bg-base-light border border-transparent focus:bg-surface focus:border-brand-black/20 rounded-xl px-4 py-2.5 text-sm font-bold text-brand-black/80 cursor-pointer outline-none transition-all"
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
                {currency !== 'IDR' && (
                  <p className="text-[10px] text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-1.5 font-medium">
                    ⚡ Live exchange rates applied. Values stored in IDR and converted for display.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Data Management */}
          <section className="space-y-4 pt-4 border-t border-brand-black/5">
            <h3 className="text-sm font-bold text-brand-black pb-2">Data Management (Database)</h3>
            <p className="text-xs text-brand-black/60">
              Your data is now stored securely in the Finvera cloud database.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
