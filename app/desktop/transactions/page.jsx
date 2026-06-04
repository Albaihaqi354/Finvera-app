"use client"
import { useState, useMemo, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PlusCircle, Search, X, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useDesktop } from '@/components/desktop/DesktopProvider'
import { useDebounce } from '@/hooks/useDebounce'

// ─── Helpers ─────────────────────────────────────────────────────────────────
const amountColor = (type) => {
  if (type === 'income') return 'text-[#F14C4C]'
  if (type === 'expense') return 'text-[#009E9E]'
  return 'text-brand-black/70'
}

// ─── Sub-component: Transaction Row ──────────────────────────────────────────
function TxRow({ tx, accounts, categories, onDelete }) {
  const acc = accounts.find(a => a.id === tx.accountId)
  const cat = categories.find(c => c.id === tx.categoryId)
  const isTransfer = tx.type === 'transfer'
  const label = isTransfer
    ? `${acc?.name || '?'} → ${accounts.find(a => a.id === tx.targetAccountId)?.name || '?'}`
    : cat?.name || 'Unknown'

  return (
    <div className="grid grid-cols-[100px_1fr_130px_160px_1fr_40px] gap-2 px-5 py-3.5 border-b hover:bg-[#F8F8F8] items-center group">
      <p className="text-xs font-bold">{tx.time}</p>
      <div className="flex items-center gap-2 min-w-0">
        {!isTransfer && cat?.icon && (
          <span className="text-base shrink-0">{cat.icon}</span>
        )}
        <span className="text-xs font-semibold truncate">{label}</span>
      </div>
      <span className={`text-sm font-bold ${amountColor(tx.type)}`}>
        Rp {tx.amount.toLocaleString('id-ID')}
      </span>
      <span className="text-xs font-semibold truncate">{acc?.name}</span>
      <span className="text-xs text-brand-black/50 truncate">{tx.note}</span>
      <button
        type="button"
        onClick={() => onDelete(tx.id)}
        className="opacity-0 group-hover:opacity-100 text-red-500 cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
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
          className="w-full bg-[#F8F8F8] rounded-xl px-4 py-2.5 text-sm font-bold text-brand-black/80 cursor-pointer outline-none"
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
          className="w-full bg-[#F8F8F8] rounded-xl px-4 py-2.5 text-sm font-bold text-brand-black/80 cursor-pointer outline-none"
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
function TransactionCalendar({ calendarMonth, setCalendarMonth, calendarDays, selectedDay, setSelectedDay, selectedDayTx }) {
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
                <span className={`font-bold ${amountColor(tx.type)}`}>Rp {tx.amount.toLocaleString('id-ID')}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ─── Sub-component: Add Transaction Modal ────────────────────────────────────
function AddTransactionModal({ isOpen, onClose, accounts, categories, tags, onSubmit }) {
  const [newTx, setNewTx] = useState({
    type: 'expense', amount: '', accountId: '', targetAccountId: '',
    categoryId: '', date: new Date().toISOString().slice(0, 16), note: '', tagIds: []
  })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (accounts.length) {
      setNewTx(prev => ({
        ...prev,
        accountId: prev.accountId || accounts[0]?.id || '',
        targetAccountId: prev.targetAccountId || accounts[1]?.id || accounts[0]?.id || '',
        categoryId: prev.categoryId || categories.find(c => c.type === 'expense')?.id || ''
      }))
    }
  }, [accounts, categories])

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError('')
    const amountVal = parseFloat(newTx.amount)
    if (isNaN(amountVal) || amountVal <= 0) { setFormError('Amount must be greater than zero.'); return }
    if (!newTx.accountId) { setFormError('Please select an account.'); return }
    if (newTx.type === 'transfer' && !newTx.targetAccountId) { setFormError('Please select a destination account for the transfer.'); return }
    if (newTx.type === 'transfer' && newTx.accountId === newTx.targetAccountId) { setFormError('Source and destination accounts must be different.'); return }
    if (newTx.type !== 'transfer' && !newTx.categoryId) { setFormError('Please select a category.'); return }
    if (newTx.note && newTx.note.length > 100) { setFormError('Description cannot exceed 100 characters.'); return }

    onSubmit({
      type: newTx.type,
      amount: parseFloat(newTx.amount),
      accountId: newTx.accountId,
      targetAccountId: newTx.type === 'transfer' ? newTx.targetAccountId : undefined,
      categoryId: newTx.type === 'transfer'
        ? (categories.find(c => c.type === 'transfer')?.id || newTx.categoryId)
        : newTx.categoryId,
      date: new Date(newTx.date).toISOString(),
      note: newTx.note,
      tagIds: newTx.tagIds
    })
    setNewTx(prev => ({ ...prev, amount: '', note: '', tagIds: [] }))
    setFormError('')
    onClose()
  }

  const toggleTag = (tagId) => {
    setNewTx(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId) ? prev.tagIds.filter(id => id !== tagId) : [...prev.tagIds, tagId]
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-brand-black/5 flex justify-between items-center bg-[#F8F8F8] sticky top-0">
          <h3 className="font-bold text-lg">Add Transaction</h3>
          <button type="button" onClick={onClose} className="cursor-pointer hover:bg-brand-black/10 p-1 rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-500 text-xs font-bold border border-red-100">{formError}</div>
          )}
          <div className="grid grid-cols-3 gap-2">
            {['expense', 'income', 'transfer'].map(t => (
              <button
                key={t} type="button"
                onClick={() => setNewTx(p => ({
                  ...p, type: t,
                  categoryId: categories.find(c => c.type === (t === 'transfer' ? 'transfer' : t))?.id || p.categoryId
                }))}
                className={`py-2 rounded-xl text-xs font-bold capitalize border-2 cursor-pointer ${
                  newTx.type === t
                    ? t === 'expense' ? 'border-[#009E9E] bg-[#009E9E]/10 text-[#009E9E]'
                    : t === 'income'  ? 'border-[#F14C4C] bg-[#F14C4C]/10 text-[#F14C4C]'
                    : 'border-brand-black/30 bg-brand-black/5'
                    : 'border-transparent bg-[#F8F8F8] text-brand-black/50 hover:bg-brand-black/10'
                }`}
              >{t}</button>
            ))}
          </div>

          <input
            type="number" step="0.01" required
            value={newTx.amount}
            onChange={e => setNewTx(p => ({ ...p, amount: e.target.value }))}
            placeholder="Amount (Rp)"
            className="w-full bg-[#F8F8F8] rounded-xl px-4 py-3 text-lg font-bold outline-none border border-transparent focus:border-brand-black/20"
          />

          {newTx.type === 'transfer' ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-brand-black/40 uppercase mb-1 block">From</label>
                <select value={newTx.accountId} onChange={e => setNewTx(p => ({ ...p, accountId: e.target.value }))}
                  className="w-full bg-[#F8F8F8] rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer outline-none border border-transparent focus:border-brand-black/20">
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-brand-black/40 uppercase mb-1 block">To</label>
                <select value={newTx.targetAccountId} onChange={e => setNewTx(p => ({ ...p, targetAccountId: e.target.value }))}
                  className="w-full bg-[#F8F8F8] rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer outline-none border border-transparent focus:border-brand-black/20">
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-brand-black/40 uppercase mb-1 block">Account</label>
                <select value={newTx.accountId} onChange={e => setNewTx(p => ({ ...p, accountId: e.target.value }))}
                  className="w-full bg-[#F8F8F8] rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer outline-none border border-transparent focus:border-brand-black/20">
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-brand-black/40 uppercase mb-1 block">Category</label>
                <select value={newTx.categoryId} onChange={e => setNewTx(p => ({ ...p, categoryId: e.target.value }))}
                  className="w-full bg-[#F8F8F8] rounded-xl px-3 py-2.5 text-sm font-semibold cursor-pointer outline-none border border-transparent focus:border-brand-black/20">
                  {categories.filter(c => c.type === newTx.type && !c.parentId).map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <input
            type="datetime-local" required
            value={newTx.date}
            onChange={e => setNewTx(p => ({ ...p, date: e.target.value }))}
            className="w-full bg-[#F8F8F8] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none cursor-pointer border border-transparent focus:border-brand-black/20"
          />

          <input
            type="text"
            value={newTx.note}
            onChange={e => setNewTx(p => ({ ...p, note: e.target.value }))}
            placeholder="Description (optional)"
            maxLength={100}
            className="w-full bg-[#F8F8F8] rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-brand-black/20"
          />

          {tags.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-brand-black/40 uppercase mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${
                      newTx.tagIds.includes(tag.id) ? 'bg-brand-black text-brand-primary' : 'bg-[#F8F8F8] text-brand-black/60'
                    }`}>
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button type="submit" className="w-full bg-brand-black text-brand-primary rounded-xl py-3.5 text-sm font-bold cursor-pointer">
            Save Transaction
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
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200">
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
  const { transactions, accounts, categories, tags, addTransaction, deleteTransaction, isLoaded } = useDesktop()

  const [searchInput, setSearchInput]     = useState('')
  const [typeFilter, setTypeFilter]       = useState('All Types')
  const [accountFilter, setAccountFilter] = useState('All Accounts')
  const [activeSubTab, setActiveSubTab]   = useState('Transaction List')
  const [calendarMonth, setCalendarMonth] = useState(() => new Date())
  const [selectedDay, setSelectedDay]     = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [txToDelete, setTxToDelete]       = useState(null)

  // Debounce search — only re-filter 300ms after the user stops typing
  const search = useDebounce(searchInput, 300)

  useEffect(() => {
    if (searchParams.get('add') === '1') setIsAddModalOpen(true)
  }, [searchParams])

  // ── Memoised derivations ────────────────────────────────────────────────────
  const filteredTransactions = useMemo(() => {
    let list = transactions
    if (search) list = list.filter(t => t.note?.toLowerCase().includes(search.toLowerCase()))
    if (typeFilter !== 'All Types') list = list.filter(t => t.type === typeFilter.toLowerCase())
    if (accountFilter !== 'All Accounts') {
      list = list.filter(t => t.accountId === accountFilter || t.targetAccountId === accountFilter)
    }
    return list
  }, [transactions, search, typeFilter, accountFilter])

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

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleDeleteClick = useCallback((id) => { setTxToDelete(id); setDeleteModalOpen(true) }, [])
  const confirmDelete = useCallback(() => {
    if (txToDelete) { deleteTransaction(txToDelete); setTxToDelete(null); setDeleteModalOpen(false) }
  }, [txToDelete, deleteTransaction])

  if (!isLoaded) return <div className="p-8 text-center text-brand-black/50">Loading...</div>

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white rounded-3xl p-6 shadow-sm border border-brand-black/5 relative">
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
            <button
              type="button" onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 bg-brand-black hover:bg-brand-black/80 text-brand-primary px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/40" />
            <input
              type="text"
              placeholder="Search transaction description"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#F8F8F8] rounded-xl text-sm focus:outline-none focus:bg-white focus:border focus:border-brand-black/20 w-72"
            />
          </div>
        </div>

        {/* Summary bar */}
        <div className="flex items-center justify-between bg-[#F8F8F8] rounded-2xl px-5 py-3 mb-4">
          <span className="text-xs font-bold text-brand-black/40">Date Range: All Time</span>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-brand-black/50">
              Total Income <span className="text-[#F14C4C]">Rp {totalIncome.toLocaleString('id-ID')}</span>
            </span>
            <span className="text-xs font-bold text-brand-black/50">
              Total Expense <span className="text-[#009E9E]">Rp {totalExpense.toLocaleString('id-ID')}</span>
            </span>
          </div>
        </div>

        {/* Content */}
        {activeSubTab === 'Transaction List' ? (
          <div className="bg-white rounded-2xl border border-brand-black/5 flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="grid grid-cols-[100px_1fr_130px_160px_1fr_40px] gap-2 px-5 py-3 border-b bg-[#F8F8F8]">
              {['TIME', 'CATEGORY', 'AMOUNT', 'ACCOUNT', 'DESCRIPTION', ''].map(label => (
                <span key={label} className="text-[10px] font-bold text-brand-black/40 uppercase">{label}</span>
              ))}
            </div>
            <div className="overflow-y-auto flex-1">
              {groupedTransactions.length === 0 && (
                <p className="p-8 text-center text-brand-black/40 text-sm">No transactions found.</p>
              )}
              {groupedTransactions.map(group => (
                <div key={group.date}>
                  <div className="flex items-center gap-3 px-5 py-2.5 bg-[#F8F8F8]/50 border-b">
                    <span className="text-xs font-bold">{group.date}</span>
                    <span className="text-[10px] font-bold text-brand-black/40 bg-brand-black/5 px-2 py-0.5 rounded-full">{group.day}</span>
                  </div>
                  {group.items.map(tx => (
                    <TxRow
                      key={tx.id}
                      tx={tx}
                      accounts={accounts}
                      categories={categories}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <TransactionCalendar
            calendarMonth={calendarMonth}
            setCalendarMonth={setCalendarMonth}
            calendarDays={calendarDays}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            selectedDayTx={selectedDayTx}
          />
        )}
      </div>

      {/* ── Modals ── */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        accounts={accounts}
        categories={categories}
        tags={tags}
        onSubmit={addTransaction}
      />
      <DeleteModal
        isOpen={deleteModalOpen}
        onConfirm={confirmDelete}
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
