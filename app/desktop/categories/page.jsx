"use client"
import { useMemo, useState, useEffect } from 'react'
import { PlusCircle, Search, Pencil, Trash2, X, Check } from 'lucide-react'
import { useDesktop } from '@/components/desktop/DesktopProvider'
import { useDebounce } from '@/hooks/useDebounce'

const EMOJI_SUGGESTIONS = ['🍔','🚗','🏠','💊','📚','✈️','🎮','👕','💡','🏋️','🛒','💰','🎁','🎵','🍕','☕','🚌','💳','💼','🌱']

// ── Edit/Add Category Modal ────────────────────────────────────────────────────
function CategoryModal({ isOpen, onClose, onSubmit, editCategory = null, parentOptions = [], activeTab }) {
  const isEdit = !!editCategory
  const [form, setForm] = useState({ name: '', icon: '📁', parentId: '' })

  useEffect(() => {
    if (!isOpen) return
    if (isEdit && editCategory) {
      setForm({ name: editCategory.name, icon: editCategory.icon || '📁', parentId: editCategory.parentId || '' })
    } else {
      setForm({ name: '', icon: '📁', parentId: '' })
    }
  }, [isOpen, isEdit, editCategory])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onSubmit({ name: form.name.trim(), icon: form.icon || '📁', parentId: form.parentId || null })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-brand-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-black/5 flex items-center justify-between bg-[#F8F8F8]">
          <h3 className="font-bold text-lg text-brand-black capitalize">
            {isEdit ? 'Edit Category' : `Add ${activeTab} Category`}
          </h3>
          <button type="button" onClick={onClose} className="cursor-pointer p-1.5 rounded-full hover:bg-brand-black/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Preview */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8F8F8]">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl">
              {form.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-brand-black">{form.name || 'Category name'}</p>
              <p className="text-xs text-brand-black/40 capitalize">{activeTab} category</p>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-1.5 block">Category Name</label>
            <input
              required
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Food & Dining"
              className="w-full bg-[#F8F8F8] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:bg-white focus:border focus:border-brand-black/20 border border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-2 block">
              Icon (Emoji) <span className="normal-case font-normal">— or type your own</span>
            </label>
            <input
              value={form.icon}
              onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}
              placeholder="Emoji icon"
              className="w-full bg-[#F8F8F8] rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-brand-black/20 mb-2"
            />
            <div className="flex flex-wrap gap-2">
              {EMOJI_SUGGESTIONS.map(emoji => (
                <button
                  key={emoji} type="button"
                  onClick={() => setForm(p => ({ ...p, icon: emoji }))}
                  className={`w-9 h-9 rounded-lg text-lg transition-all cursor-pointer ${
                    form.icon === emoji ? 'bg-brand-black text-white scale-105' : 'bg-[#F8F8F8] hover:bg-brand-black/10'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Parent category (only for new categories, not edit) */}
          {!isEdit && parentOptions.length > 0 && (
            <div>
              <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-1.5 block">
                Parent Category <span className="normal-case font-normal">(optional — for sub-category)</span>
              </label>
              <select
                value={form.parentId}
                onChange={e => setForm(p => ({ ...p, parentId: e.target.value }))}
                className="w-full bg-[#F8F8F8] rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer outline-none"
              >
                <option value="">None (main category)</option>
                {parentOptions.map(p => (
                  <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                ))}
              </select>
            </div>
          )}

          <button type="submit"
            className="w-full bg-brand-black text-brand-primary rounded-xl py-3 text-sm font-bold cursor-pointer hover:bg-brand-black/80 transition-colors">
            {isEdit ? 'Save Changes' : 'Add Category'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Delete Category Modal ──────────────────────────────────────────────────────
function DeleteCategoryModal({ category, subCount, onConfirm, onCancel }) {
  if (!category) return null
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center">
        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-brand-black mb-2">Delete Category</h3>
        <p className="text-brand-black/60 text-sm mb-1">
          Delete <span className="font-bold text-brand-black">{category.icon} {category.name}</span>?
        </p>
        {subCount > 0 && (
          <p className="text-xs text-red-400 font-semibold mb-1">
            This will also delete {subCount} sub-categor{subCount > 1 ? 'ies' : 'y'}.
          </p>
        )}
        <p className="text-xs text-brand-black/40 mb-6">Transactions using this category will be unlinked.</p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-3 bg-brand-black/5 hover:bg-brand-black/10 text-brand-black font-bold rounded-xl transition-colors cursor-pointer text-sm">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors cursor-pointer text-sm">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory, isLoaded } = useDesktop()
  const [activeTab, setActiveTab] = useState('expense')
  const [searchInput, setSearchInput] = useState('')
  const search = useDebounce(searchInput, 300)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deletingCategory, setDeletingCategory] = useState(null)

  const grouped = useMemo(() => {
    const ofType = categories.filter(c => c.type === activeTab && !c.parentId)
    return ofType
      .map(parent => ({
        ...parent,
        subCategories: categories.filter(c => c.parentId === parent.id)
      }))
      .filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.subCategories.some(s => s.name.toLowerCase().includes(search.toLowerCase()))
      )
  }, [categories, activeTab, search])

  const parentOptions = categories.filter(c => c.type === activeTab && !c.parentId)

  if (!isLoaded) return (
    <div className="space-y-3 p-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-brand-black/5 rounded-2xl animate-pulse" />
      ))}
    </div>
  )

  const openAdd = () => { setEditingCategory(null); setModalOpen(true) }
  const openEdit = (cat) => { setEditingCategory(cat); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditingCategory(null) }

  const handleSubmit = ({ name, icon, parentId }) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, { name, icon })
    } else {
      addCategory({ name, type: activeTab, icon, parentId: parentId || null })
    }
  }

  const handleDeleteConfirm = () => {
    if (deletingCategory) {
      deleteCategory(deletingCategory.id)
      setDeletingCategory(null)
    }
  }

  const subCountOf = (cat) => categories.filter(c => c.parentId === cat.id).length

  const TAB_COLORS = {
    income: 'border-emerald-400 text-emerald-600',
    expense: 'border-rose-400 text-rose-600',
    transfer: 'border-brand-black/30 text-brand-black/70',
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-brand-black">Transaction Categories</h2>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-1.5 bg-brand-black hover:bg-brand-black/80 text-brand-primary px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Add Category
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Type tabs */}
        <div className="w-full lg:w-52 shrink-0 space-y-2">
          {['income', 'expense', 'transfer'].map(tab => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 rounded-xl cursor-pointer text-sm font-bold transition-all capitalize border-2 ${
                activeTab === tab
                  ? `bg-white shadow-sm ${TAB_COLORS[tab]}`
                  : 'text-brand-black/60 hover:bg-brand-black/5 border-transparent'
              }`}
            >
              {tab === 'income' ? '💚' : tab === 'expense' ? '🔴' : '🔄'} {tab}
              <span className="ml-2 text-[10px] font-bold text-brand-black/30">
                {categories.filter(c => c.type === tab && !c.parentId).length}
              </span>
            </div>
          ))}
        </div>

        {/* Categories list */}
        <div className="bg-white rounded-3xl shadow-sm border border-brand-black/5 flex-1 flex flex-col min-w-0">
          <div className="p-4 border-b border-brand-black/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-brand-black capitalize">{activeTab} Categories</h3>
              <span className="text-xs font-bold text-brand-black/40 bg-brand-black/5 px-2 py-0.5 rounded-full">
                {grouped.length}
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/40" />
              <input
                type="text"
                placeholder="Search category..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-[#F8F8F8] rounded-lg text-sm focus:outline-none focus:bg-white focus:border-brand-black/20 w-48 sm:w-64"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {grouped.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📂</div>
                <p className="text-sm text-brand-black/40">
                  {search ? 'No categories match your search.' : `No ${activeTab} categories yet.`}
                </p>
              </div>
            )}
            {grouped.map(cat => (
              <div key={cat.id} className="bg-[#F8F8F8] rounded-2xl border border-brand-black/5 overflow-hidden">
                {/* Parent row */}
                <div className="flex items-center justify-between p-4 group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${cat.colorClass || 'bg-white'}`}>
                      <span className="text-lg leading-none">{cat.icon || '📁'}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-brand-black">{cat.name}</h4>
                      {cat.subCategories.length > 0 && (
                        <p className="text-xs text-brand-black/40">{cat.subCategories.length} sub-categor{cat.subCategories.length > 1 ? 'ies' : 'y'}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => openEdit(cat)}
                      className="p-1.5 text-brand-black/50 hover:text-brand-black hover:bg-brand-black/10 rounded-lg transition-all cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingCategory(cat)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sub-categories */}
                {cat.subCategories.length > 0 && (
                  <div className="border-t border-brand-black/5 bg-white/50 pl-14 pr-4 py-2 space-y-1">
                    {cat.subCategories.map(sub => (
                      <div key={sub.id} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-[#F8F8F8] group/sub transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{sub.icon || '📁'}</span>
                          <span className="text-xs font-bold text-brand-black/70">{sub.name}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => openEdit(sub)}
                            className="p-1 text-brand-black/40 hover:text-brand-black hover:bg-brand-black/10 rounded-lg transition-all cursor-pointer"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingCategory(sub)}
                            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <CategoryModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editCategory={editingCategory}
        parentOptions={parentOptions}
        activeTab={activeTab}
      />
      <DeleteCategoryModal
        category={deletingCategory}
        subCount={deletingCategory ? subCountOf(deletingCategory) : 0}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingCategory(null)}
      />
    </div>
  )
}
