"use client"
import { useState } from 'react'
import { Landmark, CreditCard, PiggyBank, PlusCircle, MoreVertical, X, Trash2 } from 'lucide-react'
import { useDesktop } from '@/components/desktop/DesktopProvider'

export default function AccountsPage() {
  const { accounts, addAccount, deleteAccount, isBalanceVisible, isLoaded } = useDesktop()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    category: 'Checking',
    type: 'asset',
    balance: '0',
    color: '#E6923F'
  })

  if (!isLoaded) return <div className="p-8 text-center text-brand-black/50">Loading...</div>

  const totalAssets = accounts.filter(a => a.type === 'asset').reduce((s, a) => s + a.balance, 0)
  const totalLiabilities = accounts.filter(a => a.type === 'liability').reduce((s, a) => s + Math.abs(a.balance), 0)
  const netAssets = totalAssets - totalLiabilities
  const fmt = (n) => (isBalanceVisible ? `$ ${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '$ •••••••')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    addAccount({
      name: form.name.trim(),
      category: form.category,
      type: form.type,
      balance: parseFloat(form.balance) || 0,
      color: form.color
    })
    setIsModalOpen(false)
    setForm({ name: '', category: 'Checking', type: 'asset', balance: '0', color: '#E6923F' })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-brand-black">Accounts</h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 bg-brand-black hover:bg-brand-black/80 text-brand-primary px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Add Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-black/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-black/5 flex items-center justify-center text-brand-black/80 border border-brand-black/10">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-wider mb-1">Total Assets</p>
            <p className="text-lg font-bold text-brand-black/90">{fmt(totalAssets)}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-black/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#009E9E]/10 flex items-center justify-center text-[#009E9E] border border-[#009E9E]/20">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-wider mb-1">Total Liabilities</p>
            <p className="text-lg font-bold text-brand-black/90">{fmt(totalLiabilities)}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-black/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#E6923F]/10 flex items-center justify-center text-[#E6923F] border border-[#E6923F]/20">
            <PiggyBank className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-wider mb-1">Net Assets</p>
            <p className="text-lg font-bold text-brand-black/90">{fmt(netAssets)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-brand-black/5 flex-1 p-6 min-h-0 overflow-y-auto">
        <h3 className="text-sm font-bold text-brand-black mb-4">Account List</h3>
        <div className="space-y-3">
          {accounts.length === 0 && (
            <p className="text-sm text-brand-black/40 text-center py-8">No accounts yet. Add your first account.</p>
          )}
          {accounts.map(acc => (
            <div
              key={acc.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-[#F8F8F8] hover:bg-brand-black/5 transition-colors border border-transparent hover:border-brand-black/10 group"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-sm font-bold"
                  style={{ color: acc.color || '#E6923F' }}
                >
                  {acc.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-black">{acc.name}</h4>
                  <p className="text-xs font-medium text-brand-black/50">{acc.category || acc.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-bold ${acc.balance < 0 ? 'text-[#009E9E]' : 'text-brand-black'}`}>
                  {isBalanceVisible
                    ? `$ ${Math.abs(acc.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                    : '$ •••••••'}
                </span>
                <button
                  type="button"
                  onClick={() => deleteAccount(acc.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                  title="Delete account"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <MoreVertical className="w-4 h-4 text-brand-black/30" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-brand-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-black/5 flex items-center justify-between bg-[#F8F8F8]">
              <h3 className="font-bold text-lg text-brand-black">Add Account</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="cursor-pointer p-1 rounded-full hover:bg-brand-black/10">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-1.5 block">Account Name</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-[#F8F8F8] rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:bg-white focus:border focus:border-brand-black/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-1.5 block">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full bg-[#F8F8F8] rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer outline-none"
                  >
                    {['Cash', 'Checking', 'Savings', 'Credit Card', 'Investment'].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-1.5 block">Type</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    className="w-full bg-[#F8F8F8] rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer outline-none"
                  >
                    <option value="asset">Asset</option>
                    <option value="liability">Liability</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-1.5 block">Initial Balance</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.balance}
                  onChange={e => setForm(p => ({ ...p, balance: e.target.value }))}
                  className="w-full bg-[#F8F8F8] rounded-xl px-4 py-2.5 text-sm font-bold outline-none"
                />
              </div>
              <button type="submit" className="w-full bg-brand-black text-brand-primary rounded-xl py-3 text-sm font-bold cursor-pointer">
                Save Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
