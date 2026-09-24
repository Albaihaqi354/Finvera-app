"use client"
import { useState, useMemo, useEffect, useCallback, Suspense } from 'react'
import { api } from '@/lib/api/client'
import { useSearchParams } from 'next/navigation'
import { PlusCircle, Search, X, Trash2, ChevronLeft, ChevronRight, Pencil, Download } from 'lucide-react'
import { useDesktop } from '@/components/desktop/DesktopProvider'
import { useDebounce } from '@/hooks/useDebounce'
import CurrencyInput from '@/components/ui/CurrencyInput'
import { formatCurrency } from '@/lib/currency'
import { useToast } from '@/components/ui/Toast'

import TxRow from './components/TxRow'
import TransactionFilters from './components/TransactionFilters'
import TransactionCalendar from './components/TransactionCalendar'
import TransactionModal from './components/TransactionModal'
import DeleteModal from './components/DeleteModal'

// ─── Helpers ─────────────────────────────────────────────────────────────────
const amountColor = (type) => {
  if (type === 'income')  return 'text-emerald-500'
  if (type === 'expense') return 'text-rose-500'
  return 'text-brand-black/70'
}

const toIsoDateString = (val, endOfDay = false) => {
  if (!val) return undefined
  const d = new Date(val)
  if (isNaN(d.getTime())) return undefined
  if (endOfDay) {
    d.setHours(23, 59, 59, 999)
  } else {
    d.setHours(0, 0, 0, 0)
  }
  return d.toISOString()
}

// ─── Main Content Component ───────────────────────────────────────────────────
function TransactionsContent() {
  const searchParams = useSearchParams()
  const { transactions, accounts, categories, tags, addTransaction, updateTransaction, deleteTransaction, isLoaded, currency, convertAmount, formatAmount } = useDesktop()
  const toast = useToast()

  const [searchInput, setSearchInput]       = useState('')
  const [typeFilter, setTypeFilter]         = useState('All Types')
  const [accountFilter, setAccountFilter]   = useState('All Accounts')
  const [startDate, setStartDate]           = useState('')
  const [endDate, setEndDate]               = useState('')
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
        search: search,
        startDate: toIsoDateString(startDate, false),
        endDate: toIsoDateString(endDate, true)
      })
      const txs   = Array.isArray(res) ? res : (res.data || [])
      const total = res.meta?.totalItems || 0
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
  }, [page, limit, typeFilter, accountFilter, search, startDate, endDate, isLoaded])

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
    const totalInc = filteredTransactions.filter(t => t.type === 'income').reduce((s, t) => s + convertAmount(t.amount, t.currency || 'IDR'), 0)
    const totalExp = filteredTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + convertAmount(t.amount, t.currency || 'IDR'), 0)
    const net = totalInc - totalExp
    const fmt = (n) => formatAmount(n, currency) // format as display currency
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
  }, [filteredTransactions, categories, accounts, currency, convertAmount, formatAmount])

  const { totalIncome, totalExpense } = useMemo(() => ({
    totalIncome:  filteredTransactions.filter(t => t.type === 'income').reduce((a, t) => a + convertAmount(t.amount, t.currency || 'IDR'), 0),
    totalExpense: filteredTransactions.filter(t => t.type === 'expense').reduce((a, t) => a + convertAmount(t.amount, t.currency || 'IDR'), 0),
  }), [filteredTransactions, convertAmount])

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
    <div className="flex flex-col lg:flex-row h-auto min-h-[calc(100vh-140px)] bg-surface rounded-2xl p-4 md:p-6 shadow-sm border border-brand-black/5 relative gap-6">
      {/* ── Filter Sidebar ── */}
      <div className="w-full lg:w-64 shrink-0 flex flex-col">
        <div className="flex bg-base-light rounded-xl p-1 mb-6">
          {['Transaction List', 'Calendar'].map(tab => (
            <div
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`flex-1 text-center py-2 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                activeSubTab === tab ? 'bg-surface shadow-sm text-brand-black' : 'text-brand-black/40 hover:text-brand-black/60'
              }`}
            >{tab}</div>
          ))}
        </div>
        <TransactionFilters
          typeFilter={typeFilter} setTypeFilter={setTypeFilter}
          accountFilter={accountFilter} setAccountFilter={setAccountFilter}
          accounts={accounts}
          startDate={startDate} setStartDate={setStartDate}
          endDate={endDate} setEndDate={setEndDate}
        />
      </div>

      {/* ── Main area ── */}
      <div className="grow flex flex-col min-w-0 lg:border-l lg:border-brand-black/5 lg:pl-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-brand-black">
              {activeSubTab === 'Transaction List' ? 'Transaction List' : 'Transaction Calendar'}
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button" onClick={handleExportExcel}
                className="hidden sm:flex items-center gap-1.5 bg-base-light hover:bg-brand-black/5 text-brand-black/70 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors border border-brand-black/5"
                title="Export current view to Excel"
              >
                <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Export</span>
              </button>
              <button
                type="button" onClick={handleOpenAddModal}
                className="flex items-center gap-1.5 bg-brand-black hover:bg-brand-black/80 text-brand-primary px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>
          <div className="relative w-full lg:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-black/40" />
            <input
              type="text"
              placeholder="Search by description, category, account..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="pl-9 pr-4 py-2 bg-base-light rounded-xl text-sm focus:outline-none focus:bg-surface focus:border focus:border-brand-black/20 w-full lg:w-80"
            />
            {searchInput && (
              <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-black/40 hover:text-brand-black cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Summary bar */}
        <div className="flex flex-wrap items-center justify-between bg-base-light rounded-2xl px-4 py-3 mb-4 gap-2">
          <span className="text-xs font-bold text-brand-black/40">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
            <span className="text-xs font-bold text-brand-black/50">
              Income <span className="text-emerald-500">{formatAmount(totalIncome, currency)}</span>
            </span>
            <span className="text-xs font-bold text-brand-black/50">
              Expense <span className="text-rose-500">{formatAmount(totalExpense, currency)}</span>
            </span>
          </div>
        </div>

        {/* Content */}
        {activeSubTab === 'Transaction List' ? (
          <div className="bg-surface rounded-2xl border border-brand-black/5 flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="hidden lg:grid grid-cols-[100px_1fr_140px_160px_1fr_72px] gap-2 px-5 py-3 border-b bg-base-light">
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
                      onDelete={handleDeleteConfirm}
                      onEdit={openEdit}
                      formatAmount={formatAmount}
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
            formatAmount={formatAmount}
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
