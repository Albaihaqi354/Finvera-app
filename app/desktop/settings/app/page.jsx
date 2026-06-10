"use client"
import { useRef, useState } from 'react'
import { Save, Globe, Clock, Palette, CreditCard, Download, Upload, AlertTriangle } from 'lucide-react'
import { storageAPI } from '@/lib/storage'

export default function AppSettingsPage() {
  const fileInputRef = useRef(null)
  const [importStatus, setImportStatus] = useState(null)

  const handleExport = () => {
    const data = {
      accounts: storageAPI.accounts.getAll() || [],
      categories: storageAPI.categories.getAll() || [],
      tags: storageAPI.tags.getAll() || [],
      transactions: storageAPI.transactions.getAll() || [],
      templates: storageAPI.templates.getAll() || [],
      scheduled: storageAPI.scheduled.getAll() || [],
      preferences: {
        balanceVisible: storageAPI.preferences.getBalanceVisible(),
        categoriesVersion: storageAPI.categories.getVersion()
      }
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `finvera-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        
        // Basic validation
        if (!data.transactions || !data.accounts) {
          throw new Error("Invalid Finvera backup file")
        }

        if (data.accounts) storageAPI.accounts.saveAll(data.accounts)
        if (data.categories) storageAPI.categories.saveAll(data.categories)
        if (data.tags) storageAPI.tags.saveAll(data.tags)
        if (data.transactions) storageAPI.transactions.saveAll(data.transactions)
        if (data.templates) storageAPI.templates.saveAll(data.templates)
        if (data.scheduled) storageAPI.scheduled.saveAll(data.scheduled)
        
        if (data.preferences) {
          if (data.preferences.balanceVisible !== undefined) {
            storageAPI.preferences.saveBalanceVisible(data.preferences.balanceVisible)
          }
          if (data.preferences.categoriesVersion !== undefined) {
            storageAPI.categories.saveVersion(data.preferences.categoriesVersion)
          }
        }

        setImportStatus({ success: true, message: "Data imported successfully! Reloading..." })
        setTimeout(() => window.location.reload(), 1500)
      } catch (err) {
        setImportStatus({ success: false, message: "Failed to import: " + err.message })
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-brand-black">Application Settings</h2>
        <button className="flex items-center gap-1.5 bg-brand-black hover:bg-brand-black/80 text-brand-primary px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer">
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
                  <option>IDR - Indonesian Rupiah</option>
                  <option>USD - US Dollar</option>
                  <option>EUR - Euro</option>
                </select>
              </div>
            </div>
          </section>

          {/* Data Management */}
          <section className="space-y-4 pt-4 border-t border-brand-black/5">
            <h3 className="text-sm font-bold text-brand-black pb-2">Data Management (Local Storage)</h3>
            <p className="text-xs text-brand-black/60">
              Your data is currently stored locally in your browser. You can export a backup or import data from a previous backup.
            </p>
            
            {importStatus && (
              <div className={`p-3 rounded-xl text-xs font-bold ${importStatus.success ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-500 border border-red-100'}`}>
                {importStatus.message}
              </div>
            )}

            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 bg-[#F8F8F8] hover:bg-brand-black/5 border border-brand-black/10 px-5 py-3 rounded-xl text-sm font-bold text-brand-black transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Export Data Backup
              </button>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImport} 
                accept=".json" 
                className="hidden" 
              />
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-brand-black hover:bg-brand-black/80 px-5 py-3 rounded-xl text-sm font-bold text-brand-primary transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Import Data
              </button>
            </div>
            
            <div className="flex items-start gap-2 mt-4 p-4 bg-[#E6923F]/10 rounded-xl border border-[#E6923F]/20">
              <AlertTriangle className="w-5 h-5 text-[#E6923F] shrink-0" />
              <p className="text-xs text-[#E6923F] font-medium leading-relaxed">
                <strong>Warning:</strong> Importing data will overwrite all your current local data. Make sure to export a backup first if you want to keep your current data.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
