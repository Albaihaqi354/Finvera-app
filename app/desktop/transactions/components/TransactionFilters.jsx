export default function TransactionFilters({ typeFilter, setTypeFilter, accountFilter, setAccountFilter, accounts, startDate, setStartDate, endDate, setEndDate }) {
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
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-2">From</p>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="w-full bg-base-light rounded-xl px-3 py-2.5 text-xs font-bold text-brand-black/80 cursor-pointer outline-none"
          />
        </div>
        <div>
          <p className="text-[10px] font-bold text-brand-black/40 uppercase tracking-widest mb-2">To</p>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="w-full bg-base-light rounded-xl px-3 py-2.5 text-xs font-bold text-brand-black/80 cursor-pointer outline-none"
          />
        </div>
      </div>
    </div>
  )
}
