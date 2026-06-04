"use client"
import { Save, Globe, Clock, Palette, CreditCard } from 'lucide-react'

export default function AppSettingsPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-brand-black">Application Settings</h2>
        <button className="flex items-center gap-1.5 bg-brand-black hover:bg-brand-black/80 text-brand-primary px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm">
          <Save className="w-3.5 h-3.5" />
          Save Settings
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-brand-black/5 flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-3xl space-y-8">
          
          {/* General */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-brand-black border-b border-brand-black/5 pb-2">General Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-black/60 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-brand-black/40" />
                  Language
                </label>
                <select className="w-full appearance-none bg-[#F8F8F8] border border-transparent focus:bg-white focus:border-brand-black/20 rounded-xl px-4 py-2.5 text-sm font-bold text-brand-black/80 cursor-pointer outline-none transition-all">
                  <option>English (United States)</option>
                  <option>Bahasa Indonesia</option>
                  <option>中文 (Simplified Chinese)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-black/60 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-black/40" />
                  Timezone
                </label>
                <select className="w-full appearance-none bg-[#F8F8F8] border border-transparent focus:bg-white focus:border-brand-black/20 rounded-xl px-4 py-2.5 text-sm font-bold text-brand-black/80 cursor-pointer outline-none transition-all">
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
                <select className="w-full appearance-none bg-[#F8F8F8] border border-transparent focus:bg-white focus:border-brand-black/20 rounded-xl px-4 py-2.5 text-sm font-bold text-brand-black/80 cursor-pointer outline-none transition-all">
                  <option>Light (Finvera Style)</option>
                  <option>Dark Mode</option>
                  <option>System Default</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-black/60 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-brand-black/40" />
                  Default Currency
                </label>
                <select className="w-full appearance-none bg-[#F8F8F8] border border-transparent focus:bg-white focus:border-brand-black/20 rounded-xl px-4 py-2.5 text-sm font-bold text-brand-black/80 cursor-pointer outline-none transition-all">
                  <option>USD - US Dollar</option>
                  <option>IDR - Indonesian Rupiah</option>
                  <option>EUR - Euro</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer group w-max">
                <div className="w-5 h-5 rounded border-2 border-brand-black/20 group-hover:border-brand-black/40 flex items-center justify-center transition-colors bg-brand-black">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-sm font-semibold text-brand-black/80">Show amount with decimals</span>
              </label>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
