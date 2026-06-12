"use client"
import { useState, useMemo } from 'react'
import { PlusCircle, Search, X, Trash2, Pencil, CalendarClock, Power, PowerOff } from 'lucide-react'
import { useDesktop } from '@/components/desktop/DesktopProvider'
import { useDebounce } from '@/hooks/useDebounce'

const amountColor = (type) => {
  if (type === 'income') return 'text-emerald-500'
  if (type === 'expense') return 'text-rose-500'
  return 'text-brand-black/70'
}

const FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
]

function ScheduledModal({ onClose, accounts, categories, tags, onSubmit, editItem = null }) {
  const isEdit = !!editItem

  const [form, setForm] = useState(() => {
    if (isEdit && editItem) {
      return {
        name: editItem.name || '',
        type: editItem.type,
        amount: String(editItem.amount),
        accountId: editItem.accountId || accounts[0]?.id || '',
        targetAccountId: editItem.targetAccountId || accounts[1]?.id || accounts[0]?.id || '',
        categoryId: editItem.categoryId || '',
        note: editItem.note || '',
        tagIds: editItem.tagIds || [],
        frequency: editItem.frequency || 'monthly',
        nextRun: editItem.nextRun ? new Date(editItem.nextRun).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        isActive: editItem.isActive ?? true
      }
    }
    return {
      name: '', type: 'expense', amount: '',
      accountId: accounts[0]?.id || '',
      targetAccountId: accounts[1]?.id || accounts[0]?.id || '',
      categoryId: categories.find(c => c.type === 'expense')?.id || '',
      note: '', tagIds: [], frequency: 'monthly',
      nextRun: new Date().toISOString().slice(0, 16), isActive: true
    }
  })
  const [formError, setFormError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError('')
    if (!form.name.trim()) { setFormError('Please enter a name.'); return }
    const amountVal = parseFloat(form.amount)
    if (isNaN(amountVal) || amountVal <= 0) { setFormError('Amount must be greater than zero.'); return }
    if (!form.accountId) { setFormError('Please select an account.'); return }
    if (form.type === 'transfer' && !form.targetAccountId) { setFormError('Please select a destination account.'); return }
    if (form.type === 'transfer' && form.accountId === form.targetAccountId) { setFormError('Source and destination accounts must be different.'); return }
    if (form.type !== 'transfer' && !form.categoryId) { setFormError('Please select a category.'); return }

    onSubmit({
      name: form.name.trim(),
      type: form.type,
      amount: parseFloat(form.amount),
      accountId: form.accountId,
      targetAccountId: form.type === 'transfer' ? form.targetAccountId : undefined,
      categoryId: form.type === 'transfer'
        ? (categories.find(c => c.type === 'transfer')?.id || form.categoryId)
        : form.categoryId,
      note: form.note,
      tagIds: form.tagIds,
      frequency: form.frequency,
      nextRun: new Date(form.nextRun).toISOString(),
      isActive: form.isActive
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
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-brand-black/5 flex justify-between items-center bg-[#F8F8F8] sticky top-0 z-10">
          <h3 className="font-bold text-lg">{isEdit ? 'Edit Scheduled Transaction' : 'Add Scheduled Transaction'}</h3>
          <button type="button" onClick={onClose} className="cursor-pointer hover:bg-brand-black/10 p-1.5 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-500 text-xs font-bold border border-red-100">{formError}</div>
          )}

          <div>
            <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-1.5 block">Name</label>
            <input
              type="text" required
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g., Netflix Subscription"
              className="w-full bg-[#F8F8F8] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none border border-transparent focus:border-brand-black/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-1.5 block">Frequency</label>
              <select value={form.frequency} onChange={e => setForm(p => ({ ...p, frequency: e.target.value }))}
                className="w-full bg-[#F8F8F8] rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer outline-none border border-transparent focus:border-brand-black/20">
                {FREQUENCIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-1.5 block">Next Run</label>
              <input
                type="datetime-local" required
                value={form.nextRun}
                onChange={e => setForm(p => ({ ...p, nextRun: e.target.value }))}
                className="w-full bg-[#F8F8F8] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none cursor-pointer border border-transparent focus:border-brand-black/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            {['expense', 'income', 'transfer'].map(t => (
              <button
                key={t} type="button"
                onClick={() => setForm(p => ({
                  ...p, type: t,
                  categoryId: categories.find(c => c.type === (t === 'transfer' ? 'transfer' : t))?.id || p.categoryId
                }))}
                className={`py-2 rounded-xl text-xs font-bold capitalize border-2 cursor-pointer transition-colors ${
                  form.type === t ? typeColors[t]?.border : 'border-transparent bg-[#F8F8F8] text-brand-black/50 hover:bg-brand-black/10'
                }`}
              >{t}</button>
            ))}
          </div>

          <div>
            <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-1.5 block">Amount (Rp)</label>
            <input
              type="number" step="0.01" required
              value={form.amount}
              onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
              placeholder="0"
              className={`w-full bg-[#F8F8F8] rounded-xl px-4 py-3 text-xl font-bold outline-none border-2 border-transparent focus:border-brand-black/20 transition-colors ${typeColors[form.type]?.label || ''}`}
            />
          </div>

          {form.type === 'transfer' ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-brand-black/40 uppercase mb-1 block">From</label>
                <select value={form.accountId} onChange={e => setForm(p => ({ ...p, accountId: e.target.value }))}
                  className="w-full bg-[#F8F8F8] rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer outline-none border border-transparent focus:border-brand-black/20">
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-brand-black/40 uppercase mb-1 block">To</label>
                <select value={form.targetAccountId} onChange={e => setForm(p => ({ ...p, targetAccountId: e.target.value }))}
                  className="w-full bg-[#F8F8F8] rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer outline-none border border-transparent focus:border-brand-black/20">
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-brand-black/40 uppercase mb-1 block">Account</label>
                <select value={form.accountId} onChange={e => setForm(p => ({ ...p, accountId: e.target.value }))}
                  className="w-full bg-[#F8F8F8] rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer outline-none border border-transparent focus:border-brand-black/20">
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-brand-black/40 uppercase mb-1 block">Category</label>
                <select value={form.categoryId} onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}
                  className="w-full bg-[#F8F8F8] rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer outline-none border border-transparent focus:border-brand-black/20">
                  {categories.filter(c => c.type === form.type && !c.parentId).map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-1.5 block">
              Description <span className="normal-case font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={form.note}
              onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
              placeholder="Auto-scheduled..."
              maxLength={200}
              className="w-full bg-[#F8F8F8] rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-brand-black/20"
            />
          </div>

          {tags.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-brand-black/40 uppercase mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                      form.tagIds.includes(tag.id) ? 'bg-brand-black text-brand-primary' : 'bg-[#F8F8F8] text-brand-black/60 hover:bg-brand-black/10'
                    }`}>
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isEdit && (
            <label className="flex items-center gap-2 cursor-pointer mt-4 bg-[#F8F8F8] p-3 rounded-xl border border-brand-black/5 hover:border-brand-black/10 transition-colors">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))}
                className="w-4 h-4 rounded text-brand-black focus:ring-brand-black/20"
              />
              <span className="text-sm font-bold text-brand-black/80">Active (Auto-execute when due)</span>
            </label>
          )}

          <button type="submit" className="w-full bg-brand-black text-brand-primary rounded-xl py-3.5 text-sm font-bold cursor-pointer hover:bg-brand-black/80 transition-colors mt-6">
            {isEdit ? 'Save Changes' : 'Create Scheduled Transaction'}
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
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-brand-black mb-2">Delete Scheduled Transaction</h3>
        <p className="text-brand-black/60 text-sm mb-6">Are you sure? It will no longer be executed automatically.</p>
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

export default function ScheduledPage() {
  const { scheduled, accounts, categories, tags, addScheduled, updateScheduled, deleteScheduled, isLoaded } = useDesktop()

  const [searchInput, setSearchInput] = useState('')
  const search = useDebounce(searchInput, 300)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  const openAdd = () => { setEditingItem(null); setIsModalOpen(true) }
  const openEdit = (t) => { setEditingItem(t); setIsModalOpen(true) }
  const closeModal = () => { setIsModalOpen(false); setEditingItem(null) }

  const handleSubmit = (data) => {
    if (editingItem) updateScheduled(editingItem.id, data)
    else addScheduled(data)
  }

  const handleDeleteClick = (id) => { setItemToDelete(id); setDeleteModalOpen(true) }
  const confirmDelete = () => {
    if (itemToDelete) { deleteScheduled(itemToDelete); setItemToDelete(null); setDeleteModalOpen(false) }
  }

  const toggleActive = (e, item) => {
    e.stopPropagation()
    updateScheduled(item.id, { isActive: !item.isActive })
  }

  const filtered = useMemo(() => {
    let list = scheduled
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(t => t.name.toLowerCase().includes(q) || t.note?.toLowerCase().includes(q))
    }
    return list
  }, [scheduled, search])

  if (!isLoaded) return (
    <div className="space-y-3 p-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-20 bg-brand-black/5 rounded-2xl animate-pulse" />
      ))}
    </div>
  )

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-brand-black">Scheduled Transactions</h2>
        <button
          type="button" onClick={openAdd}
          className="flex items-center gap-1.5 bg-brand-black hover:bg-brand-black/80 text-brand-primary px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Add Scheduled
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-brand-black/5 flex-1 flex flex-col min-h-0">
        <div className="p-4 border-b border-brand-black/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-brand-black">All Scheduled</h3>
            <span className="text-xs font-bold text-brand-black/40 bg-brand-black/5 px-2 py-0.5 rounded-full">{scheduled.length}</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/40" />
            <input
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-[#F8F8F8] border border-transparent rounded-lg text-sm focus:outline-none focus:bg-white focus:border-brand-black/20 w-48 sm:w-64"
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
              <div className="text-4xl mb-3">🕒</div>
              <p className="text-sm text-brand-black/40">
                {search ? 'No matches found.' : 'No scheduled transactions. Automate your recurring expenses!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(item => {
                const acc = accounts.find(a => a.id === item.accountId)
                const cat = categories.find(c => c.id === item.categoryId)
                const isTransfer = item.type === 'transfer'
                const label = isTransfer
                  ? `${acc?.name || '?'} → ${accounts.find(a => a.id === item.targetAccountId)?.name || '?'}`
                  : cat?.name || 'Unknown'
                const nextDate = new Date(item.nextRun).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

                return (
                  <div key={item.id} className={`bg-[#F8F8F8] rounded-2xl p-4 border flex flex-col group transition-all ${item.isActive ? 'border-brand-black/5 hover:border-brand-black/10' : 'border-dashed border-brand-black/10 opacity-70'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-brand-black">{item.name}</h4>
                          {!item.isActive && <span className="text-[9px] font-bold bg-brand-black/10 text-brand-black/60 px-1.5 py-0.5 rounded uppercase tracking-wider">Paused</span>}
                        </div>
                        <p className="text-xs font-semibold text-brand-black/50 capitalize mt-0.5">{item.type} • {item.frequency}</p>
                      </div>
                      <span className={`text-sm font-bold ${amountColor(item.type)}`}>
                        Rp {item.amount.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      {!isTransfer && cat?.icon && <span className="text-base shrink-0">{cat.icon}</span>}
                      <span className="text-xs font-semibold truncate text-brand-black/80">{label}</span>
                    </div>

                    <div className="mt-auto pt-3 border-t border-brand-black/5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-black/50">
                        <CalendarClock className="w-3.5 h-3.5 text-brand-black/40" /> Next: {nextDate}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => toggleActive(e, item)} className={`p-1.5 rounded-lg transition-colors cursor-pointer ${item.isActive ? 'text-brand-black/40 hover:text-brand-black hover:bg-brand-black/10' : 'text-emerald-500 hover:bg-emerald-50'}`} title={item.isActive ? 'Pause' : 'Resume'}>
                          {item.isActive ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => openEdit(item)} className="p-1.5 text-brand-black/50 hover:text-brand-black hover:bg-brand-black/10 rounded-lg transition-colors cursor-pointer">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteClick(item.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
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
        <ScheduledModal
          onClose={closeModal}
          accounts={accounts} categories={categories} tags={tags}
          onSubmit={handleSubmit} editItem={editingItem}
        />
      )}
      <DeleteModal
        isOpen={deleteModalOpen}
        onConfirm={confirmDelete}
        onCancel={() => { setDeleteModalOpen(false); setItemToDelete(null) }}
      />
    </div>
  )
}
