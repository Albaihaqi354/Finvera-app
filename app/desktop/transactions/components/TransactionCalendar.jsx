import { ChevronLeft, ChevronRight } from 'lucide-react'

const amountColor = (type) => {
  if (type === 'income')  return 'text-emerald-500'
  if (type === 'expense') return 'text-rose-500'
  return 'text-brand-black/70'
}

export default function TransactionCalendar({ calendarMonth, setCalendarMonth, calendarDays, selectedDay, setSelectedDay, selectedDayTx, formatAmount }) {
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
                <span className={`font-bold ${amountColor(tx.type)}`}>{formatAmount(tx.amount, tx.currency || 'IDR')}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
