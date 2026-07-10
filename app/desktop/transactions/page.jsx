"use client"
import { useState, useMemo, useEffect, useCallback, Suspense } from 'react'
import { api } from '@/lib/api/client'
import { useSearchParams } from 'next/navigation'
import { PlusCircle, Search, X, Trash2, ChevronLeft, ChevronRight, Pencil, Download } from 'lucide-react'
import { useDesktop } from '@/components/desktop/DesktopProvider'
import { useDebounce } from '@/hooks/useDebounce'
import CurrencyInput from '@/components/ui/CurrencyInput'
import { formatCurrency, formatConverted } from '@/lib/currency'
import { useToast } from '@/components/ui/Toast'

// ─── Helpers ─────────────────────────────────────────────────────────────────
const amountColor = (type) => {
  if (type === 'income')  return 'text-emerald-500'
  if (type === 'expense') return 'text-rose-500'
  return 'text-brand-black/70'
}

// ─── Sub-component: Transaction Row ──────────────────────────────────────────
function TxRow({ tx, accounts, categories, onDelete, onEdit, currency = 'IDR', exchangeRates = null }) {
  const acc = accounts.find(a => a.id === tx.accountId)
  const cat = categories.find(c => c.id === tx.categoryId)
  const isTransfer = tx.type === 'transfer'
  const label = isTransfer
    ? `${acc?.name || '?'} → ${accounts.find(a => a.id === tx.targetAccountId)?.name || '?'}`
    : cat?.name || 'Unknown'

  return (
    <div className="grid grid-cols-[100px_1fr_140px_160px_1fr_72px] gap-2 px-5 py-3.5 border-b hover:bg-base-light items-center group transition-colors">
      <p className="text-xs font-bold text-brand-black/60">{tx.time}</p>
      <div className="flex items-center gap-2 min-w-0">
        {!isTransfer && cat?.icon && (
          <span className="text-base shrink-0">{cat.icon}</span>
        )}
        <span className="text-xs font-semibold truncate text-brand-black/80">{label}</span>
      </div>
      <span className={`text-sm font-bold ${amountColor(tx.type)}`}>
        {formatConverted(tx.amount, currency, exchangeRates)}
      </span>
      <span className="text-xs font-semibold truncate text-brand-black/70">{acc?.name}</span>
      <span className="text-xs text-brand-black/50 truncate">{tx.note}</span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => onEdit(tx)}
          className="p-1.5 text-brand-black/50 hover:text-brand-black hover:bg-brand-black/10 rounded-lg transition-colors cursor-pointer"
          title="Edit"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(tx.id)}
          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

// ─── Sub-component: Transaction Filters sidebar ───────────────────────────────
function TransactionFilters({ typeFilter, setTypeFilter, accountFilter, setAccountFilter, accounts }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-2">Transaction Type</p>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="w-full bg-base-light rounded-xl px-4 py-2.5 text-sm font-bold text-brand-black/80 cursor-pointer outline-none"
        >
          {['All Types', 'Income', 'Expense', 'Transfer'].map(t => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-2">Account</p>
        <select
          value={accountFilter}
          onChange={e => setAccountFilter(e.target.value)}
          className="w-full bg-base-light rounded-xl px-4 py-2.5 text-sm font-bold text-brand-black/80 cursor-pointer outline-none"
        >
          <option>All Accounts</option>
          {accounts.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

// ─── Sub-component: Transaction Calendar ─────────────────────────────────────
function TransactionCalendar({ calendarMonth, setCalendarMonth, calendarDays, selectedDay, setSelectedDay, selectedDayTx, currency = 'IDR', exchangeRates = null }) {
  return (
    <div className="flex-1 flex flex-col min-h-0 gap-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
          className="p-2 rounded-lg hover:bg-brand-black/5 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-bold">
          {calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <button
          type="button"
          onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
          className="p-2 rounded-lg hover:bg-brand-black/5 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-brand-black/40 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 flex-1">
        {calendarDays.map((cell, i) =>
          cell ? (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedDay(cell.date)}
              className={`min-h-16 p-1 rounded-xl border text-left transition-colors cursor-pointer ${
                selectedDay?.toDateString() === cell.date.toDateString()
                  ? 'border-brand-black bg-brand-black/5'
                  : 'border-brand-black/5 hover:border-brand-black/15'
              }`}
            >
              <span className="text-xs font-bold">{cell.day}</span>
              {cell.count > 0 && (
                <span className="block mt-1 text-[9px] font-bold text-[#E6923F]">{cell.count} tx</span>
              )}
            </button>
          ) : (
            <div key={i} />
          )
        )}
      </div>
      {selectedDay && (
        <div className="border-t pt-4 max-h-40 overflow-y-auto">
          <p className="text-xs font-bold text-brand-black/50 mb-2">
            {selectedDay.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          {selectedDayTx.length === 0 ? (
            <p className="text-xs text-brand-black/40">No transactions on this day.</p>
          ) : (
            selectedDayTx.map(tx => (
              <div key={tx.id} className="flex justify-between py-1.5 text-xs">
                <span>{tx.note || tx.type}</span>
                <span className={`font-bold ${amountColor(tx.type)}`}>{formatConverted(tx.amount, currency, exchangeRates)}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ─── Sub-component: Add / Edit Transaction Modal ──────────────────────────────
function TransactionModal({ onClose, accounts, categories, tags, onSubmit, editTx = null, currency = 'IDR' }) {
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
            <div className="p-3 rounded-xl bg-red-50 text-red-500 text-xs font-bold border border-red-100">{formError}</div>
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

// ─── Sub-component: Delete Confirm Modal ─────────────────────────────────────
function DeleteModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-brand-black mb-2">Delete Transaction</h3>
        <p className="text-brand-black/60 text-sm mb-6">Are you sure you want to delete this transaction? This action cannot be undone.</p>
        <div className="flex items-center gap-3">
          <button onClick={onCancel}
            className="flex-1 py-3 px-4 bg-brand-black/5 hover:bg-brand-black/10 text-brand-black font-bold rounded-xl transition-colors cursor-pointer text-sm">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors cursor-pointer text-sm shadow-lg shadow-red-500/20">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Content Component ───────────────────────────────────────────────────
function TransactionsContent() {
  const searchParams = useSearchParams()
  const { transactions, accounts, categories, tags, addTransaction, updateTransaction, deleteTransaction, isLoaded, currency, exchangeRates } = useDesktop()
  const toast = useToast()

  const [searchInput, setSearchInput]       = useState('')
  const [typeFilter, setTypeFilter]         = useState('All Types')
  const [accountFilter, setAccountFilter]   = useState('All Accounts')
  const [activeSubTab, setActiveSubTab]     = useState('Transaction List')
  const [calendarMonth, setCalendarMonth]   = useState(() => new Date())
  const [selectedDay, setSelectedDay]       = useState(null)
  const [isModalOpen, setIsModalOpen]       = useState(false)
  const [editingTx, setEditingTx]           = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [txToDelete, setTxToDelete]         = useState(null)

  const [page, setPage]                     = useState(1)
  const limit = 50
  const [serverTxs, setServerTxs]           = useState([])
  const [totalTxs, setTotalTxs]             = useState(0)
  const [isLoadingServer, setIsLoadingServer] = useState(false)

  const search = useDebounce(searchInput, 300)

  useEffect(() => {
    if (searchParams.get('add') === '1') setIsModalOpen(true)
  }, [searchParams])

  const fetchTransactions = useCallback(async () => {
    if (!isLoaded) return
    setIsLoadingServer(true)
    try {
      const res = await api.transactions.getAll({
        page,
        limit,
        type: typeFilter === 'All Types' ? '' : typeFilter.toLowerCase(),
        accountId: accountFilter === 'All Accounts' ? '' : accountFilter,
        search: search
      })
      const txs   = Array.isArray(res) ? res : (res.data || [])
      const total = res.meta?.total_items || 0
      const normalizedTxs = txs.map(tx => ({
        ...tx,
        accountId:       tx.account?.id       || tx.accountId,
        targetAccountId: tx.targetAccount?.id || tx.targetAccountId,
        categoryId:      tx.category?.id      || tx.categoryId,
        tagIds:          tx.tags?.map(t => t.id) || tx.tagIds || []
      }))
      setServerTxs(normalizedTxs)
      setTotalTxs(total)
    } catch (err) {
      console.error('Failed to fetch transactions:', err)
    } finally {
      setIsLoadingServer(false)
    }
  }, [page, limit, typeFilter, accountFilter, search, isLoaded])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  // ── Handlers ────────────────────────────────────────────────────────────────
  const openEdit  = useCallback((tx) => { setEditingTx(tx); setIsModalOpen(true) }, [])
  const closeModal = useCallback(() => { setIsModalOpen(false); setEditingTx(null) }, [])

  const handleAddSubmit = async (data) => {
    try {
      if (editingTx) {
        await updateTransaction(editingTx.id, data)
        toast.success('Transaction updated successfully')
      } else {
        await addTransaction(data)
        toast.success('Transaction added successfully')
      }
      setIsModalOpen(false)
      setEditingTx(null)
      fetchTransactions()
    } catch (err) {
      toast.error(err.message || 'Failed to save transaction')
    }
  }

  const handleDeleteConfirm = async () => {
    if (txToDelete) {
      try {
        await deleteTransaction(txToDelete)
        toast.success('Transaction deleted successfully')
        setDeleteModalOpen(false)
        setTxToDelete(null)
        fetchTransactions()
      } catch (err) {
        toast.error(err.message || 'Failed to delete transaction')
      }
    }
  }

  const handleOpenAddModal = () => {
    if (accounts.length === 0 || categories.length === 0) {
      toast.warning('Please create at least one Account and Category first to add transactions.')
      return
    }
    setEditingTx(null)
    setIsModalOpen(true)
  }

  // ── Memoised derivations ────────────────────────────────────────────────────
  const filteredTransactions = serverTxs

  const handleExportExcel = useCallback(async () => {
    if (filteredTransactions.length === 0) return
    const ExcelJS = (await import('exceljs')).default
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'Finvera'
    workbook.created = new Date()
    const sheet = workbook.addWorksheet('Transactions', {
      pageSetup: { fitToPage: true, orientation: 'landscape' }
    })
    sheet.columns = [
      { key: 'no',      width: 6  },
      { key: 'date',    width: 14 },
      { key: 'time',    width: 10 },
      { key: 'type',    width: 12 },
      { key: 'cat',     width: 22 },
      { key: 'amount',  width: 20 },
      { key: 'account', width: 22 },
      { key: 'dest',    width: 22 },
      { key: 'note',    width: 36 },
    ]
    // Title
    sheet.mergeCells('A1:I1')
    const titleCell = sheet.getCell('A1')
    titleCell.value = 'FINVERA — Transaction Report'
    titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FF1A1A1A' } }
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' }
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF9F0' } }
    sheet.getRow(1).height = 36
    // Meta
    sheet.mergeCells('A2:I2')
    const now = new Date()
    const metaCell = sheet.getCell('A2')
    metaCell.value = `Exported: ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}   |   Total Records: ${filteredTransactions.length}`
    metaCell.font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF888888' } }
    metaCell.alignment = { horizontal: 'center', vertical: 'middle' }
    metaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF9F0' } }
    sheet.getRow(2).height = 20
    // Summary
    const totalInc = filteredTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const totalExp = filteredTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    const net = totalInc - totalExp
    const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: currency || 'IDR', maximumFractionDigits: 0 }).format(n)
    sheet.mergeCells('A3:C3')
    sheet.getCell('A3').value = `Total Income: ${fmt(totalInc)}`
    sheet.getCell('A3').font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF059669' } }
    sheet.getCell('A3').alignment = { horizontal: 'center', vertical: 'middle' }
    sheet.getCell('A3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0FDF4' } }
    sheet.mergeCells('D3:F3')
    sheet.getCell('D3').value = `Total Expense: ${fmt(totalExp)}`
    sheet.getCell('D3').font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFE11D48' } }
    sheet.getCell('D3').alignment = { horizontal: 'center', vertical: 'middle' }
    sheet.getCell('D3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF1F2' } }
    sheet.mergeCells('G3:I3')
    const isPositive = net >= 0
    sheet.getCell('G3').value = `Net: ${fmt(net)}`
    sheet.getCell('G3').font = { name: 'Calibri', size: 10, bold: true, color: { argb: isPositive ? 'FF059669' : 'FFE11D48' } }
    sheet.getCell('G3').alignment = { horizontal: 'center', vertical: 'middle' }
    sheet.getCell('G3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isPositive ? 'FFF0FDF4' : 'FFFFF1F2' } }
    sheet.getRow(3).height = 22
    sheet.getRow(4).height = 6
    // Header row
    const headerRow = sheet.addRow(['#', 'Date', 'Time', 'Type', 'Category', 'Amount', 'Account', 'Destination', 'Note'])
    headerRow.height = 26
    headerRow.eachCell(cell => {
      cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A1A1A' } }
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: false }
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF333333' } }, bottom: { style: 'thin', color: { argb: 'FF333333' } },
        left: { style: 'thin', color: { argb: 'FF333333' } }, right: { style: 'thin', color: { argb: 'FF333333' } },
      }
    })
    // Data rows
    const typeColors = {
      income:   { bg: 'FFD1FAE5', text: 'FF059669' },
      expense:  { bg: 'FFFEE2E2', text: 'FFE11D48' },
      transfer: { bg: 'FFE0F2FE', text: 'FF0284C7' },
    }
    filteredTransactions.forEach((tx, idx) => {
      const d = new Date(tx.date)
      const dateStr = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
      const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
      const cat      = categories.find(c => c.id === tx.categoryId)?.name || '—'
      const acc      = accounts.find(a => a.id === tx.accountId)?.name   || '—'
      const targetAcc = tx.type === 'transfer' ? (accounts.find(a => a.id === tx.targetAccountId)?.name || '—') : ''
      const typeLabel = tx.type ? tx.type.charAt(0).toUpperCase() + tx.type.slice(1) : ''
      const rowBg = idx % 2 === 0 ? 'FFFFFFFF' : 'FFF9FAFB'
      const row = sheet.addRow([idx + 1, dateStr, timeStr, typeLabel, cat, tx.amount, acc, targetAcc, tx.note || ''])
      row.height = 22
      row.eachCell((cell, colNumber) => {
        cell.font = { name: 'Calibri', size: 10, color: { argb: 'FF374151' } }
        cell.alignment = { vertical: 'middle', wrapText: false }
        cell.border = {
          top: { style: 'hair', color: { argb: 'FFE5E7EB' } }, bottom: { style: 'hair', color: { argb: 'FFE5E7EB' } },
          left: { style: 'hair', color: { argb: 'FFE5E7EB' } }, right: { style: 'hair', color: { argb: 'FFE5E7EB' } },
        }
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } }
        if (colNumber === 1) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' }
          cell.font = { name: 'Calibri', size: 10, color: { argb: 'FF9CA3AF' } }
        } else if (colNumber === 4) {
          const colors = typeColors[tx.type] || { bg: 'FFF3F4F6', text: 'FF6B7280' }
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.bg } }
          cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: colors.text } }
          cell.alignment = { horizontal: 'center', vertical: 'middle' }
        } else if (colNumber === 6) {
          cell.numFmt = currency === 'IDR' ? '"Rp "#,##0' : `"${currency} "#,##0.00`
          const amtColors = typeColors[tx.type] || { text: 'FF374151' }
          cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: amtColors.text } }
          cell.alignment = { horizontal: 'right', vertical: 'middle' }
        } else if (colNumber === 2 || colNumber === 3) {
          cell.alignment = { horizontal: 'center', vertical: 'middle' }
        } else if (colNumber === 9) {
          cell.alignment = { vertical: 'middle', wrapText: true }
          cell.font = { name: 'Calibri', size: 9, italic: true, color: { argb: 'FF9CA3AF' } }
        }
      })
    })
    // Footer
    sheet.addRow([])
    const footerIdx = sheet.rowCount + 1
    sheet.mergeCells(`A${footerIdx}:I${footerIdx}`)
    const footerCell = sheet.getCell(`A${footerIdx}`)
    footerCell.value = `Generated by Finvera  •  ${now.toISOString()}`
    footerCell.font = { name: 'Calibri', size: 9, italic: true, color: { argb: 'FFAAAAAA' } }
    footerCell.alignment = { horizontal: 'center', vertical: 'middle' }
    sheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 5 }]
    sheet.autoFilter = { from: 'A5', to: 'I5' }
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `finvera_transactions_${now.toISOString().slice(0, 10)}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  }, [filteredTransactions, categories, accounts, currency])

  const { totalIncome, totalExpense } = useMemo(() => ({
    totalIncome:  filteredTransactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0),
    totalExpense: filteredTransactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0),
  }), [filteredTransactions])

  const groupedTransactions = useMemo(() => {
    const groups = {}
    filteredTransactions.forEach(tx => {
      const d = new Date(tx.date)
      const dateStr = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      const dayStr  = d.toLocaleDateString('en-US', { weekday: 'long' })
      const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      if (!groups[dateStr]) groups[dateStr] = { date: dateStr, day: dayStr, items: [] }
      groups[dateStr].items.push({ ...tx, time: timeStr })
    })
    return Object.values(groups).sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [filteredTransactions])

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear()
    const month = calendarMonth.getMonth()
    const first = new Date(year, month, 1)
    const startPad = first.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < startPad; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d)
      const dayTx = filteredTransactions.filter(t => {
        const td = new Date(t.date)
        return td.getFullYear() === year && td.getMonth() === month && td.getDate() === d
      })
      cells.push({ day: d, date, count: dayTx.length, transactions: dayTx })
    }
    return cells
  }, [calendarMonth, filteredTransactions])

  const selectedDayTx = useMemo(() => {
    if (!selectedDay) return []
    return filteredTransactions.filter(t => new Date(t.date).toDateString() === selectedDay.toDateString())
  }, [selectedDay, filteredTransactions])

  if (!isLoaded) return (
    <div className="space-y-3 p-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-brand-black/5 rounded-xl animate-pulse" />
      ))}
    </div>
  )

  return (
    <div className="flex h-[calc(100vh-140px)] bg-surface rounded-2xl p-4 shadow-sm border border-brand-black/5 relative">
      {/* ── Sidebar ── */}
      <div className="w-52 shrink-0 pr-4 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          {['Transaction List', 'Transaction Calendar'].map(tab => (
            <div
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-4 py-2.5 rounded-xl cursor-pointer text-sm font-bold transition-all ${
                activeSubTab === tab ? 'bg-brand-black text-brand-primary shadow-sm' : 'text-brand-black/70 hover:bg-brand-black/5'
              }`}
            >{tab}</div>
          ))}
        </div>
        <TransactionFilters
          typeFilter={typeFilter} setTypeFilter={setTypeFilter}
          accountFilter={accountFilter} setAccountFilter={setAccountFilter}
          accounts={accounts}
        />
      </div>

      {/* ── Main area ── */}
      <div className="grow flex flex-col min-w-0 border-l border-brand-black/5 pl-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-brand-black">
              {activeSubTab === 'Transaction List' ? 'Transaction List' : 'Transaction Calendar'}
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button" onClick={handleExportExcel}
                className="flex items-center gap-1.5 bg-base-light hover:bg-brand-black/5 text-brand-black/70 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors border border-brand-black/5"
                title="Export current view to Excel"
              >
                <Download className="w-3.5 h-3.5" /> Export Excel
              </button>
              <button
                type="button" onClick={handleOpenAddModal}
                className="flex items-center gap-1.5 bg-brand-black hover:bg-brand-black/80 text-brand-primary px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/40" />
            <input
              type="text"
              placeholder="Search by description, category, account..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="pl-9 pr-4 py-2 bg-base-light rounded-xl text-sm focus:outline-none focus:bg-surface focus:border focus:border-brand-black/20 w-80"
            />
            {searchInput && (
              <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-black/40 hover:text-brand-black cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Summary bar */}
        <div className="flex items-center justify-between bg-base-light rounded-2xl px-5 py-3 mb-4">
          <span className="text-xs font-bold text-brand-black/40">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-6">
            <span className="text-xs font-bold text-brand-black/50">
              Income <span className="text-emerald-500">{formatConverted(totalIncome, currency, exchangeRates)}</span>
            </span>
            <span className="text-xs font-bold text-brand-black/50">
              Expense <span className="text-rose-500">{formatConverted(totalExpense, currency, exchangeRates)}</span>
            </span>
          </div>
        </div>

        {/* Content */}
        {activeSubTab === 'Transaction List' ? (
          <div className="bg-surface rounded-2xl border border-brand-black/5 flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="grid grid-cols-[100px_1fr_140px_160px_1fr_72px] gap-2 px-5 py-3 border-b bg-base-light">
              {['TIME', 'CATEGORY', 'AMOUNT', 'ACCOUNT', 'DESCRIPTION', ''].map(label => (
                <span key={label} className="text-[10px] font-bold text-brand-black/40 uppercase">{label}</span>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto min-h-0 bg-surface rounded-t-xl pb-4">
              {isLoadingServer ? (
                <div className="flex items-center justify-center h-full text-brand-black/40 text-sm font-bold animate-pulse">
                  Loading transactions...
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="flex items-center justify-center h-full text-brand-black/40 text-sm font-bold">
                  No transactions found.
                </div>
              ) : (
                <div className="flex flex-col">
                  {filteredTransactions.map(tx => (
                    <TxRow
                      key={tx.id} tx={tx}
                      accounts={accounts} categories={categories}
                      onDelete={(id) => { setTxToDelete(id); setDeleteModalOpen(true) }}
                      onEdit={openEdit}
                      currency={currency}
                      exchangeRates={exchangeRates}
                    />
                  ))}
                </div>
              )}
            </div>
            {/* Pagination */}
            {totalTxs > limit && (
              <div className="flex items-center justify-between border-t border-brand-black/5 pt-4 pb-4 px-5">
                <span className="text-xs font-bold text-brand-black/40">
                  Showing {Math.min((page - 1) * limit + 1, totalTxs)} to {Math.min(page * limit, totalTxs)} of {totalTxs}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || isLoadingServer}
                    className="px-3 py-1.5 rounded-lg bg-base-light text-brand-black/70 font-bold text-xs hover:bg-brand-black/5 disabled:opacity-50"
                  >Previous</button>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page * limit >= totalTxs || isLoadingServer}
                    className="px-3 py-1.5 rounded-lg bg-base-light text-brand-black/70 font-bold text-xs hover:bg-brand-black/5 disabled:opacity-50"
                  >Next</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <TransactionCalendar
            calendarMonth={calendarMonth}
            setCalendarMonth={setCalendarMonth}
            calendarDays={calendarDays}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            selectedDayTx={selectedDayTx}
            currency={currency}
            exchangeRates={exchangeRates}
          />
        )}
      </div>

      {isModalOpen && (
        <TransactionModal
          onClose={closeModal}
          accounts={accounts}
          categories={categories}
          tags={tags}
          onSubmit={handleAddSubmit}
          editTx={editingTx}
          currency={currency}
        />
      )}

      <DeleteModal
        isOpen={deleteModalOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setDeleteModalOpen(false); setTxToDelete(null) }}
      />
    </div>
  )
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function TransactionsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-brand-black/50">Loading...</div>}>
      <TransactionsContent />
    </Suspense>
  )
}
