import { Pencil, Trash2 } from 'lucide-react'

const amountColor = (type) => {
  if (type === 'income')  return 'text-emerald-500'
  if (type === 'expense') return 'text-rose-500'
  return 'text-brand-black/70'
}

export default function TxRow({ tx, accounts, categories, onDelete, onEdit, formatAmount }) {
  const acc = accounts.find(a => a.id === tx.accountId)
  const cat = categories.find(c => c.id === tx.categoryId)
  const isTransfer = tx.type === 'transfer'
  const label = isTransfer
    ? `${acc?.name || '?'} → ${accounts.find(a => a.id === tx.targetAccountId)?.name || '?'}`
    : cat?.name || 'Unknown'

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:grid grid-cols-[100px_1fr_140px_160px_1fr_72px] gap-2 px-5 py-3.5 border-b hover:bg-base-light items-center group transition-colors">
        <p className="text-xs font-bold text-brand-black/60">{tx.time}</p>
        <div className="flex items-center gap-2 min-w-0">
          {!isTransfer && cat?.icon && (
            <span className="text-base shrink-0">{cat.icon}</span>
          )}
          <span className="text-xs font-semibold truncate text-brand-black/80">{label}</span>
        </div>
        <span className={`text-sm font-bold ${amountColor(tx.type)}`}>
          {formatAmount(tx.amount, tx.currency || 'IDR')}
        </span>
        <span className="text-xs font-semibold truncate text-brand-black/70">{acc?.name}</span>
        <span className="text-xs text-brand-black/50 truncate">{tx.note}</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
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

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col gap-2 px-4 py-3.5 border-b hover:bg-base-light transition-colors">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {!isTransfer && cat?.icon && (
              <span className="text-lg shrink-0">{cat.icon}</span>
            )}
            <span className="text-sm font-bold truncate text-brand-black/80">{label}</span>
          </div>
          <span className={`text-sm font-bold shrink-0 ${amountColor(tx.type)}`}>
            {formatAmount(tx.amount, tx.currency || 'IDR')}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-brand-black/60 font-semibold truncate">
            <span>{tx.time}</span>
            <span>•</span>
            <span className="truncate">{acc?.name}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onEdit(tx)}
              className="p-1.5 text-brand-black/50 hover:text-brand-black hover:bg-brand-black/10 rounded-lg transition-colors cursor-pointer"
              title="Edit"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(tx.id)}
              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        {tx.note && (
          <p className="text-xs text-brand-black/50 italic line-clamp-1 mt-0.5">{tx.note}</p>
        )}
      </div>
    </>
  )
}
