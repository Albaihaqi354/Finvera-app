"use client"
import { useState } from 'react'
import { Landmark, CreditCard, PiggyBank, PlusCircle, Pencil, X, Trash2 } from 'lucide-react'
import { useDesktop } from '@/components/desktop/DesktopProvider'
import CurrencyInput from '@/components/ui/CurrencyInput'
import { formatCurrency } from '@/lib/currency'
import { useToast } from '@/components/ui/Toast'

const ACCOUNT_CATEGORIES = ['Cash', 'Checking', 'Savings', 'Credit Card', 'Investment', 'Wallet', 'Other']

const DEFAULT_FORM = { name: '', category: 'Checking', type: 'asset', balance: '0', color: '#E6923F' }

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteAccountModal({ account, onConfirm, onCancel }) {
  if (!account) return null
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-brand-black mb-2">Delete Account</h3>
        <p className="text-brand-black/60 text-sm mb-1">
          Are you sure you want to delete <span className="font-bold text-brand-black">{account.name}</span>?
        </p>
        <p className="text-xs text-red-400 font-semibold mb-6">All associated transactions will also be removed.</p>
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

// ── Add / Edit Account Modal ──────────────────────────────────────────────────
function AccountModal({ isOpen, onClose, onSubmit, editAccount = null, accounts = [], currency = 'IDR' }) {
  const isEdit = !!editAccount
  const [form, setForm] = useState(editAccount ? {
    name: editAccount.name,
    category: editAccount.category || 'Checking',
    type: editAccount.type,
    balance: String(editAccount.balance),
    color: editAccount.color || '#E6923F',
    parentId: editAccount.parentId || ''
  } : { ...DEFAULT_FORM, parentId: '' })

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onSubmit({
      name: form.name.trim(),
      category: form.category,
      type: form.type,
      balance: parseFloat(form.balance) || 0,
      color: form.color,
      parentId: form.parentId || null
    })
    onClose()
  }

  const COLOR_PRESETS = ['#E6923F', '#009E9E', '#F14C4C', '#065786', '#713670', '#4dd291', '#2ab4d0', '#fc892c']

  return (
    <div className="fixed inset-0 bg-brand-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-brand-black/5 flex items-center justify-between bg-base-light shrink-0">
          <h3 className="font-bold text-lg text-brand-black">{isEdit ? 'Edit Account' : 'Add Account'}</h3>
          <button type="button" onClick={onClose} className="cursor-pointer p-1.5 rounded-full hover:bg-brand-black/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto min-h-0">
          {/* Preview */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-base-light">
            <div className="w-12 h-12 rounded-xl bg-surface shadow-sm flex items-center justify-center text-lg font-bold"
              style={{ color: form.color }}>
              {form.name.charAt(0) || '?'}
            </div>
            <div>
              <p className="text-sm font-bold text-brand-black">{form.name || 'Account Name'}</p>
              <p className="text-xs text-brand-black/50">{form.category} · {form.type}</p>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-1.5 block">Account Name</label>
            <input
              required
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. BCA Savings"
              className="w-full bg-base-light rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:bg-surface focus:border focus:border-brand-black/20 border border-transparent transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-1.5 block">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full bg-base-light rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer outline-none"
              >
                {ACCOUNT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-1.5 block">Type</label>
              <select
                value={form.type}
                onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                className="w-full bg-base-light rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer outline-none"
              >
                <option value="asset">Asset</option>
                <option value="liability">Liability</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-1.5 block">Parent Account (Optional)</label>
            <select
              value={form.parentId}
              onChange={e => setForm(p => ({ ...p, parentId: e.target.value }))}
              className="w-full bg-base-light rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer outline-none focus:bg-surface focus:border focus:border-brand-black/20 border border-transparent transition-colors"
            >
              <option value="">-- None (Top Level) --</option>
              {accounts.filter(a => a.id !== editAccount?.id && !a.parentId).map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-1.5 block">
              {isEdit ? 'Balance' : 'Initial Balance'}
            </label>
            <CurrencyInput
              currency={currency}
              value={form.balance}
              onChange={val => setForm(p => ({ ...p, balance: val }))}
              className="w-full bg-base-light rounded-xl px-4 py-2.5 text-sm font-bold outline-none border border-transparent focus:border-brand-black/20"
            />
            {isEdit && (
              <p className="text-[10px] text-brand-black/40 mt-1.5">Note: changing balance won&apos;t retroactively adjust transactions.</p>
            )}
          </div>

          {/* Color picker */}
          <div>
            <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-2 block">Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_PRESETS.map(c => (
                <button
                  key={c} type="button"
                  onClick={() => setForm(p => ({ ...p, color: c }))}
                  className={`w-8 h-8 rounded-lg transition-transform cursor-pointer ${form.color === c ? 'scale-125 ring-2 ring-offset-1 ring-brand-black/40' : 'hover:scale-110'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input
                type="color" value={form.color}
                onChange={e => setForm(p => ({ ...p, color: e.target.value }))}
                className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                title="Custom color"
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-brand-black text-brand-primary rounded-xl py-3 text-sm font-bold cursor-pointer hover:bg-brand-black/80 transition-colors">
            {isEdit ? 'Save Changes' : 'Add Account'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Sub-component: Account Row ────────────────────────────────────────────────
function AccountRow({ acc, isBalanceVisible, openEdit, setDeletingAccount, currency = 'IDR' }) {
  const fmt = (n) => (isBalanceVisible ? formatCurrency(Math.abs(n), currency) : formatCurrency(0, currency).replace(/0([.,]0+)?/, '•••••••'))
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-base-light hover:bg-brand-black/5 transition-colors border border-transparent hover:border-brand-black/10 group">
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-xl bg-surface shadow-sm flex items-center justify-center text-sm font-bold"
          style={{ color: acc.color || '#E6923F' }}
        >
          {acc.name.charAt(0)}
        </div>
        <div>
          <h4 className="text-sm font-bold text-brand-black">{acc.name}</h4>
          <p className="text-xs font-medium text-brand-black/50 capitalize">
            {acc.category || acc.type} · {acc.type}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-sm font-bold ${acc.balance < 0 ? 'text-rose-500' : 'text-brand-black'}`}>
          {fmt(acc.balance)}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => openEdit(acc)}
            className="p-1.5 text-brand-black/50 hover:text-brand-black hover:bg-brand-black/10 rounded-lg transition-all cursor-pointer"
            title="Edit account"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeletingAccount(acc)}
            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
            title="Delete account"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AccountsPage() {
  const { accounts, addAccount, updateAccount, deleteAccount, isBalanceVisible, isLoaded, currency } = useDesktop()
  const toast = useToast()
  
  const [modalOpen, setModalOpen]           = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const [deletingAccount, setDeletingAccount] = useState(null)

  if (!isLoaded) return (
    <div className="space-y-4 p-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-20 bg-brand-black/5 rounded-3xl animate-pulse" />
      ))}
    </div>
  )

  const totalAssets      = accounts.filter(a => a.type === 'asset').reduce((s, a) => s + a.balance, 0)
  const totalLiabilities = accounts.filter(a => a.type === 'liability').reduce((s, a) => s + Math.abs(a.balance), 0)
  const netAssets        = totalAssets - totalLiabilities
  const fmt = (n) => (isBalanceVisible ? formatCurrency(n, currency) : formatCurrency(0, currency).replace(/0([.,]0+)?/, '•••••••'))

  const openAdd = () => { setEditingAccount(null); setModalOpen(true) }
  const openEdit = (acc) => { setEditingAccount(acc); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditingAccount(null) }

  const handleSubmit = async (data) => {
    try {
      if (editingAccount) {
        await updateAccount(editingAccount.id, data)
        toast.success('Account updated successfully')
      } else {
        await addAccount(data)
        toast.success('Account added successfully')
      }
      closeModal()
    } catch (err) {
      toast.error(err.message || 'Failed to save account')
    }
  }

  const confirmDelete = async () => {
    if (deletingAccount) {
      try {
        await deleteAccount(deletingAccount.id)
        toast.success('Account deleted successfully')
        setDeletingAccount(null)
      } catch (err) {
        toast.error(err.message || 'Failed to delete account')
      }
    }
  }

  const topLevelAccounts = accounts.filter(a => !a.parentId)
  const getChildren = (parentId) => accounts.filter(a => a.parentId === parentId)

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-brand-black">Accounts</h2>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-1.5 bg-brand-black hover:bg-brand-black/80 text-brand-primary px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Add Account
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface rounded-2xl p-4 shadow-sm border border-brand-black/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-black/5 flex items-center justify-center text-brand-black/80 border border-brand-black/10">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-wider mb-1">Total Assets</p>
            <p className="text-lg font-bold text-brand-black/90">{fmt(totalAssets)}</p>
          </div>
        </div>
        <div className="bg-surface rounded-2xl p-4 shadow-sm border border-brand-black/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-wider mb-1">Total Liabilities</p>
            <p className="text-lg font-bold text-brand-black/90">{fmt(totalLiabilities)}</p>
          </div>
        </div>
        <div className="bg-surface rounded-2xl p-4 shadow-sm border border-brand-black/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#E6923F]/10 flex items-center justify-center text-[#E6923F] border border-[#E6923F]/20">
            <PiggyBank className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-wider mb-1">Net Assets</p>
            <p className={`text-lg font-bold ${netAssets >= 0 ? 'text-brand-black/90' : 'text-rose-500'}`}>{fmt(netAssets)}</p>
          </div>
        </div>
      </div>

      {/* Account list */}
      <div className="bg-surface rounded-3xl shadow-sm border border-brand-black/5 flex-1 p-6 min-h-0 overflow-y-auto">
        <h3 className="text-sm font-bold text-brand-black mb-4">Account List</h3>
        <div className="space-y-4">
          {accounts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🏦</div>
              <p className="text-sm text-brand-black/40">No accounts yet. Add your first account.</p>
            </div>
          )}
          {topLevelAccounts.map(acc => (
            <div key={acc.id} className="space-y-2">
              <AccountRow acc={acc} isBalanceVisible={isBalanceVisible} openEdit={openEdit} setDeletingAccount={setDeletingAccount} currency={currency} />
              
              {getChildren(acc.id).length > 0 && (
                <div className="ml-6 pl-4 border-l-2 border-brand-black/5 space-y-2 relative">
                  {getChildren(acc.id).map(child => (
                    <div key={child.id} className="relative">
                      <div className="absolute top-1/2 -left-[18px] w-4 border-t-2 border-brand-black/5 -translate-y-1/2" />
                      <AccountRow acc={child} isBalanceVisible={isBalanceVisible} openEdit={openEdit} setDeletingAccount={setDeletingAccount} currency={currency} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {modalOpen && (
        <AccountModal
          isOpen={modalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          editAccount={editingAccount}
          accounts={accounts}
          currency={currency}
        />
      )}
      <DeleteAccountModal
        account={deletingAccount}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingAccount(null)}
      />
    </div>
  )
}
