"use client"
import { useMemo, useState } from 'react'
import { PlusCircle, Search, Trash2, X } from 'lucide-react'
import { useDesktop } from '@/components/desktop/DesktopProvider'

export default function CategoriesPage() {
  const { categories, addCategory, deleteCategory, isLoaded } = useDesktop()
  const [activeTab, setActiveTab] = useState('expense')
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', icon: '📁', parentId: '' })

  const grouped = useMemo(() => {
    const ofType = categories.filter(c => c.type === activeTab && !c.parentId)
    return ofType
      .map(parent => ({
        ...parent,
        subCategories: categories.filter(c => c.parentId === parent.id)
      }))
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.subCategories.some(s => s.name.toLowerCase().includes(search.toLowerCase())))
  }, [categories, activeTab, search])

  if (!isLoaded) return <div className="p-8 text-center text-brand-black/50">Loading...</div>

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    addCategory({
      name: form.name.trim(),
      type: activeTab,
      icon: form.icon || '📁',
      parentId: form.parentId || null
    })
    setForm({ name: '', icon: '📁', parentId: '' })
    setShowAdd(false)
  }

  const parentOptions = categories.filter(c => c.type === activeTab && !c.parentId)

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-brand-black">Transaction Categories</h2>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 bg-brand-black hover:bg-brand-black/80 text-brand-primary px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Add Category
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        <div className="w-full lg:w-52 shrink-0 space-y-2">
          {['Expense', 'Income', 'Transfer'].map(tab => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-4 py-3 rounded-xl cursor-pointer text-sm font-bold transition-all ${
                activeTab === tab.toLowerCase()
                  ? 'bg-brand-black text-brand-primary shadow-sm'
                  : 'text-brand-black/70 hover:bg-brand-black/5'
              }`}
            >
              {tab}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-brand-black/5 flex-1 flex flex-col min-w-0">
          <div className="p-4 border-b border-brand-black/5 flex items-center justify-between">
            <h3 className="text-sm font-bold text-brand-black capitalize">{activeTab} Categories</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/40" />
              <input
                type="text"
                placeholder="Search category"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-[#F8F8F8] rounded-lg text-sm focus:outline-none focus:bg-white focus:border-brand-black/20 w-48 sm:w-64"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {grouped.length === 0 && (
              <p className="text-sm text-brand-black/40 text-center py-8">No categories in this group.</p>
            )}
            {grouped.map(cat => (
              <div key={cat.id} className="bg-[#F8F8F8] rounded-2xl border border-brand-black/5 overflow-hidden">
                <div className="flex items-center justify-between p-4 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm">
                      {cat.icon || '📁'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-brand-black">{cat.name}</h4>
                      <p className="text-[10px] font-semibold text-brand-black/40">
                        {cat.subCategories.length} sub-categories
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteCategory(cat.id)}
                    className="p-1.5 text-red-500/0 group-hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {cat.subCategories.length > 0 && (
                  <div className="border-t border-brand-black/5 bg-white/50 pl-14 pr-4 py-2 space-y-1">
                    {cat.subCategories.map(sub => (
                      <div key={sub.id} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-[#F8F8F8] group/sub">
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{sub.icon || '📁'}</span>
                          <span className="text-xs font-bold text-brand-black/70">{sub.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteCategory(sub.id)}
                          className="p-1 opacity-0 group-hover/sub:opacity-100 text-red-500 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-brand-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold">Add Category</h3>
              <button type="button" onClick={() => setShowAdd(false)} className="cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <input
                required
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Category name"
                className="w-full bg-[#F8F8F8] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none"
              />
              <input
                value={form.icon}
                onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}
                placeholder="Icon (emoji)"
                className="w-full bg-[#F8F8F8] rounded-xl px-4 py-2.5 text-sm outline-none"
              />
              {parentOptions.length > 0 && (
                <select
                  value={form.parentId}
                  onChange={e => setForm(p => ({ ...p, parentId: e.target.value }))}
                  className="w-full bg-[#F8F8F8] rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer outline-none"
                >
                  <option value="">Main category (no parent)</option>
                  {parentOptions.map(p => (
                    <option key={p.id} value={p.id}>Sub of: {p.name}</option>
                  ))}
                </select>
              )}
              <button type="submit" className="w-full bg-brand-black text-brand-primary rounded-xl py-3 text-sm font-bold cursor-pointer">
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
