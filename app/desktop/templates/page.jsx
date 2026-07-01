"use client"
import { useState, useMemo } from 'react'
import { PlusCircle, Search, X, Trash2, Pencil, Copy } from 'lucide-react'
import { useDesktop } from '@/components/desktop/DesktopProvider'
import { useDebounce } from '@/hooks/useDebounce'

const amountColor = (type) => {
  if (type === 'income') return 'text-emerald-500'
  if (type === 'expense') return 'text-rose-500'
  return 'text-brand-black/70'
}

function TemplateModal({ onClose, accounts, categories, tags, onSubmit, editTpl = null }) {
  const isEdit = !!editTpl

  const [form, setForm] = useState(() => {
    if (isEdit && editTpl) {
      return {
        templateName: editTpl.templateName || '',
        type: editTpl.type,
        amount: editTpl.amount ? String(editTpl.amount) : '',
        accountId: editTpl.accountId || accounts[0]?.id || '',
        targetAccountId: editTpl.targetAccountId || accounts[1]?.id || accounts[0]?.id || '',
        categoryId: editTpl.categoryId || '',
        note: editTpl.note || '',
        tagIds: editTpl.tagIds || []
      }
    }
    return {
      templateName: '', type: 'expense', amount: '',
      accountId: accounts[0]?.id || '',
      targetAccountId: accounts[1]?.id || accounts[0]?.id || '',
      categoryId: categories.find(c => c.type === 'expense')?.id || '',
      note: '', tagIds: []
    }
  })
  const [formError, setFormError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError('')
    if (!form.templateName.trim()) { setFormError('Please enter a template name.'); return }
    const amountVal = parseFloat(form.amount)
    if (form.amount && (isNaN(amountVal) || amountVal <= 0)) { setFormError('Amount must be greater than zero.'); return }
    if (!form.accountId) { setFormError('Please select an account.'); return }
    if (form.type === 'transfer' && !form.targetAccountId) { setFormError('Please select a destination account.'); return }
    if (form.type === 'transfer' && form.accountId === form.targetAccountId) { setFormError('Source and destination accounts must be different.'); return }
    if (form.type !== 'transfer' && !form.categoryId) { setFormError('Please select a category.'); return }

    onSubmit({
      templateName: form.templateName.trim(),
      type: form.type,
      amount: form.amount ? parseFloat(form.amount) : null,
      accountId: form.accountId,
      targetAccountId: form.type === 'transfer' ? form.targetAccountId : undefined,
      categoryId: form.type === 'transfer'
        ? (categories.find(c => c.type === 'transfer')?.id || form.categoryId)
        : form.categoryId,
      note: form.note,
      tagIds: form.tagIds
    })
    onClose()
  }

  const toggleTag = (tagId) => {
    setForm(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId) ? prev.tagIds.filter(id => id !== tagId) : [...prev.tagIds, tagId]
    }))
  }

  const typeColors = {
    expense: { border: 'border-rose-400 bg-rose-50 text-rose-600', label: 'text-rose-500' },
    income:  { border: 'border-emerald-400 bg-emerald-50 text-emerald-600', label: 'text-emerald-500' },
    transfer: { border: 'border-brand-black/30 bg-brand-black/5 text-brand-black', label: 'text-brand-black' },
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-3xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-brand-black/5 flex justify-between items-center bg-base-light sticky top-0 z-10">
          <h3 className="font-bold text-lg">{isEdit ? 'Edit Template' : 'Add Template'}</h3>
          <button type="button" onClick={onClose} className="cursor-pointer hover:bg-brand-black/10 p-1.5 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-500 text-xs font-bold border border-red-100">{formError}</div>
          )}

          <div>
            <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-1.5 block">Template Name</label>
            <input
              type="text" required
              value={form.templateName}
              onChange={e => setForm(p => ({ ...p, templateName: e.target.value }))}
              placeholder="e.g., Monthly Rent"
              className="w-full bg-base-light rounded-xl px-4 py-2.5 text-sm font-semibold outline-none border border-transparent focus:border-brand-black/20"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {['expense', 'income', 'transfer'].map(t => (
              <button
                key={t} type="button"
                onClick={() => setForm(p => ({
                  ...p, type: t,
                  categoryId: categories.find(c => c.type === (t === 'transfer' ? 'transfer' : t))?.id || p.categoryId
                }))}
                className={`py-2 rounded-xl text-xs font-bold capitalize border-2 cursor-pointer transition-colors ${
                  form.type === t ? typeColors[t]?.border : 'border-transparent bg-base-light text-brand-black/50 hover:bg-brand-black/10'
                }`}
              >{t}</button>
            ))}
          </div>

          <div>
            <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-1.5 block">
              Default Amount <span className="normal-case font-normal">(optional)</span>
            </label>
            <input
              type="number" step="0.01"
              value={form.amount}
              onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
              placeholder="0"
              className={`w-full bg-base-light rounded-xl px-4 py-3 text-xl font-bold outline-none border-2 border-transparent focus:border-brand-black/20 transition-colors ${typeColors[form.type]?.label || ''}`}
            />
          </div>

          {form.type === 'transfer' ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-brand-black/40 uppercase mb-1 block">From</label>
                <select value={form.accountId} onChange={e => setForm(p => ({ ...p, accountId: e.target.value }))}
                  className="w-full bg-base-light rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer outline-none border border-transparent focus:border-brand-black/20">
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-brand-black/40 uppercase mb-1 block">To</label>
                <select value={form.targetAccountId} onChange={e => setForm(p => ({ ...p, targetAccountId: e.target.value }))}
                  className="w-full bg-base-light rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer outline-none border border-transparent focus:border-brand-black/20">
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-brand-black/40 uppercase mb-1 block">Account</label>
                <select value={form.accountId} onChange={e => setForm(p => ({ ...p, accountId: e.target.value }))}
                  className="w-full bg-base-light rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer outline-none border border-transparent focus:border-brand-black/20">
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-brand-black/40 uppercase mb-1 block">Category</label>
                <select value={form.categoryId} onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}
                  className="w-full bg-base-light rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer outline-none border border-transparent focus:border-brand-black/20">
                  {categories.filter(c => c.type === form.type && !c.parentId).map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-1.5 block">
              Default Description <span className="normal-case font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={form.note}
              onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
              placeholder="Template note..."
              maxLength={200}
              className="w-full bg-base-light rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-brand-black/20"
            />
          </div>

          {tags.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-brand-black/40 uppercase mb-2">Default Tags</p>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                      form.tagIds.includes(tag.id) ? 'bg-brand-black text-brand-primary' : 'bg-base-light text-brand-black/60 hover:bg-brand-black/10'
                    }`}>
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button type="submit" className="w-full bg-brand-black text-brand-primary rounded-xl py-3.5 text-sm font-bold cursor-pointer hover:bg-brand-black/80 transition-colors">
            {isEdit ? 'Save Changes' : 'Save Template'}
          </button>
        </form>
      </div>
    </div>
  )
}

function DeleteModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-brand-black mb-2">Delete Template</h3>
        <p className="text-brand-black/60 text-sm mb-6">Are you sure you want to delete this template?</p>
        <div className="flex items-center gap-3">
          <button onClick={onCancel}
            className="flex-1 py-3 px-4 bg-brand-black/5 hover:bg-brand-black/10 text-brand-black font-bold rounded-xl transition-colors cursor-pointer text-sm">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors cursor-pointer text-sm">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TemplatesPage() {
  const { templates, accounts, categories, tags, addTemplate, updateTemplate, deleteTemplate, addTransaction, isLoaded } = useDesktop()

  const [searchInput, setSearchInput] = useState('')
  const search = useDebounce(searchInput, 300)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTpl, setEditingTpl] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [tplToDelete, setTplToDelete] = useState(null)

  const openAdd = () => { setEditingTpl(null); setIsModalOpen(true) }
  const openEdit = (t) => { setEditingTpl(t); setIsModalOpen(true) }
  const closeModal = () => { setIsModalOpen(false); setEditingTpl(null) }

  const handleSubmit = (data) => {
    if (editingTpl) updateTemplate(editingTpl.id, data)
    else addTemplate(data)
  }

  const handleDeleteClick = (id) => { setTplToDelete(id); setDeleteModalOpen(true) }
  const confirmDelete = () => {
    if (tplToDelete) { deleteTemplate(tplToDelete); setTplToDelete(null); setDeleteModalOpen(false) }
  }

  const handleUseTemplate = (tpl) => {
    // Adding transaction from template immediately uses current date and default amount
    if (!tpl.amount) {
      alert("This template has no default amount. Please edit the template to add an amount first, or it won't be recorded.")
      return
    }
    addTransaction({
      type: tpl.type,
      amount: tpl.amount,
      accountId: tpl.accountId,
      targetAccountId: tpl.targetAccountId,
      categoryId: tpl.categoryId,
      date: new Date().toISOString(),
      note: tpl.note,
      tagIds: tpl.tagIds
    })
    alert("Transaction added successfully based on template!")
  }

  const filtered = useMemo(() => {
    let list = templates
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(t => t.templateName.toLowerCase().includes(q) || t.note?.toLowerCase().includes(q))
    }
    return list
  }, [templates, search])

  if (!isLoaded) return (
    <div className="space-y-3 p-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-brand-black/5 rounded-2xl animate-pulse" />
      ))}
    </div>
  )

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-brand-black">Transaction Templates</h2>
        <button
          type="button" onClick={openAdd}
          className="flex items-center gap-1.5 bg-brand-black hover:bg-brand-black/80 text-brand-primary px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Add Template
        </button>
      </div>

      <div className="bg-surface rounded-3xl shadow-sm border border-brand-black/5 flex-1 flex flex-col min-h-0">
        <div className="p-4 border-b border-brand-black/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-brand-black">All Templates</h3>
            <span className="text-xs font-bold text-brand-black/40 bg-brand-black/5 px-2 py-0.5 rounded-full">{templates.length}</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/40" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-base-light border border-transparent rounded-lg text-sm focus:outline-none focus:bg-surface focus:border-brand-black/20 w-48 sm:w-64"
            />
            {searchInput && (
              <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-black/40 hover:text-brand-black cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📄</div>
              <p className="text-sm text-brand-black/40">
                {search ? 'No templates match your search.' : 'No templates yet. Create one to save time!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(tpl => {
                const acc = accounts.find(a => a.id === tpl.accountId)
                const cat = categories.find(c => c.id === tpl.categoryId)
                const isTransfer = tpl.type === 'transfer'
                const label = isTransfer
                  ? `${acc?.name || '?'} → ${accounts.find(a => a.id === tpl.targetAccountId)?.name || '?'}`
                  : cat?.name || 'Unknown'

                return (
                  <div key={tpl.id} className="bg-base-light rounded-2xl p-4 border border-brand-black/5 flex flex-col group transition-all hover:border-brand-black/10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-sm font-bold text-brand-black">{tpl.templateName}</h4>
                        <p className="text-xs font-semibold text-brand-black/50 capitalize">{tpl.type}</p>
                      </div>
                      <span className={`text-sm font-bold ${amountColor(tpl.type)}`}>
                        {tpl.amount ? `Rp ${tpl.amount.toLocaleString('id-ID')}` : '-'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      {!isTransfer && cat?.icon && <span className="text-base shrink-0">{cat.icon}</span>}
                      <span className="text-xs font-semibold truncate text-brand-black/80">{label}</span>
                    </div>

                    {tpl.note && <p className="text-xs text-brand-black/50 truncate mb-3">{tpl.note}</p>}

                    <div className="mt-auto pt-3 border-t border-brand-black/5 flex items-center justify-between">
                      <button
                        onClick={() => handleUseTemplate(tpl)}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#E6923F] bg-[#E6923F]/10 hover:bg-[#E6923F]/20 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" /> Use Template
                      </button>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(tpl)} className="p-1.5 text-brand-black/50 hover:text-brand-black hover:bg-brand-black/10 rounded-lg transition-colors cursor-pointer">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteClick(tpl.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <TemplateModal
          onClose={closeModal}
          accounts={accounts} categories={categories} tags={tags}
          onSubmit={handleSubmit} editTpl={editingTpl}
        />
      )}
      <DeleteModal
        isOpen={deleteModalOpen}
        onConfirm={confirmDelete}
        onCancel={() => { setDeleteModalOpen(false); setTplToDelete(null) }}
      />
    </div>
  )
}
