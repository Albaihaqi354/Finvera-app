import { useState } from 'react'
import { X } from 'lucide-react'
import CurrencyInput from '@/components/ui/CurrencyInput'

export default function TransactionModal({ onClose, accounts, categories, tags, onSubmit, editTx = null, currency = 'IDR' }) {
  const isEdit = !!editTx

  const [form, setForm] = useState(() => {
    if (isEdit && editTx) {
      return {
        type: editTx.type,
        amount: editTx.amount,
        accountId: editTx.accountId || accounts[0]?.id || '',
        targetAccountId: editTx.targetAccountId || accounts[1]?.id || accounts[0]?.id || '',
        categoryId: editTx.categoryId || '',
        date: editTx.date ? new Date(editTx.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        note: editTx.note || '',
        tagIds: editTx.tagIds || []
      }
    }
    return {
      type: 'expense',
      amount: '',
      accountId: accounts[0]?.id || '',
      targetAccountId: accounts[1]?.id || accounts[0]?.id || '',
      categoryId: categories.find(c => c.type === 'expense')?.id || '',
      date: new Date().toISOString().slice(0, 16),
      note: '',
      tagIds: []
    }
  })
  const [formError, setFormError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError('')
    const amountVal = parseFloat(form.amount)
    if (isNaN(amountVal) || amountVal <= 0) { setFormError('Amount must be greater than zero.'); return }
    if (!form.accountId) { setFormError('Please select an account.'); return }
    if (form.type === 'transfer' && !form.targetAccountId) { setFormError('Please select a destination account.'); return }
    if (form.type === 'transfer' && form.accountId === form.targetAccountId) { setFormError('Source and destination accounts must be different.'); return }
    if (form.type !== 'transfer' && !form.categoryId) { setFormError('Please select a category.'); return }
    if (form.note && form.note.length > 200) { setFormError('Description cannot exceed 200 characters.'); return }

    onSubmit({
      type: form.type,
      amount: parseFloat(form.amount),
      accountId: form.accountId,
      targetAccountId: form.type === 'transfer' ? form.targetAccountId : undefined,
      categoryId: form.type === 'transfer'
        ? (categories.find(c => c.type === 'transfer')?.id || form.categoryId)
        : form.categoryId,
      date: new Date(form.date).toISOString(),
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
    expense:  { border: 'border-rose-400 bg-rose-50 text-rose-600',     label: 'text-rose-500'    },
    income:   { border: 'border-emerald-400 bg-emerald-50 text-emerald-600', label: 'text-emerald-500' },
    transfer: { border: 'border-brand-black/30 bg-brand-black/5 text-brand-black', label: 'text-brand-black' },
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-3xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-brand-black/5 flex justify-between items-center bg-base-light sticky top-0">
          <h3 className="font-bold text-lg">{isEdit ? 'Edit Transaction' : 'Add Transaction'}</h3>
          <button type="button" onClick={onClose} className="cursor-pointer hover:bg-brand-black/10 p-1.5 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-50 text-xs font-bold border border-red-100">{formError}</div>
          )}
          {/* Type selector */}
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
          {/* Amount */}
          <div>
            <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-1.5 block">Amount</label>
            <CurrencyInput
              currency={currency}
              required
              value={form.amount}
              onChange={val => setForm(p => ({ ...p, amount: val }))}
              placeholder="0"
              className={`w-full bg-base-light rounded-xl px-4 py-3 text-xl font-bold outline-none border-2 border-transparent focus:border-brand-black/20 transition-colors ${typeColors[form.type]?.label || ''}`}
            />
          </div>
          {/* Account / Transfer */}
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
          {/* Date */}
          <div>
            <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-1.5 block">Date & Time</label>
            <input
              type="datetime-local" required
              value={form.date}
              onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
              className="w-full bg-base-light rounded-xl px-4 py-2.5 text-sm font-semibold outline-none cursor-pointer border border-transparent focus:border-brand-black/20"
            />
          </div>
          {/* Note */}
          <div>
            <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-1.5 block">
              Description <span className="normal-case font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={form.note}
              onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
              placeholder="Add a note..."
              maxLength={200}
              className="w-full bg-base-light rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-brand-black/20"
            />
          </div>
          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-brand-black/40 uppercase mb-2">Tags</p>
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
            {isEdit ? 'Save Changes' : 'Save Transaction'}
          </button>
        </form>
      </div>
    </div>
  )
}
