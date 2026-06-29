"use client"
import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const ICONS = {
  success: <CheckCircle className="w-4 h-4 shrink-0" />,
  error:   <XCircle    className="w-4 h-4 shrink-0" />,
  warning: <AlertCircle className="w-4 h-4 shrink-0" />,
  info:    <Info       className="w-4 h-4 shrink-0" />,
}

const STYLES = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  error:   'bg-red-50    border-red-200    text-red-700',
  warning: 'bg-amber-50  border-amber-200  text-amber-700',
  info:    'bg-blue-50   border-blue-200   text-blue-700',
}

function ToastItem({ toast, onRemove }) {
  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-semibold
        backdrop-blur-sm animate-in slide-in-from-right-4 fade-in duration-300
        ${STYLES[toast.type] || STYLES.info}`}
      style={{ minWidth: 280, maxWidth: 360 }}
    >
      {ICONS[toast.type]}
      <span className="flex-1 leading-relaxed">{toast.message}</span>
      <button
        type="button"
        onClick={() => onRemove(toast.id)}
        className="shrink-0 opacity-50 hover:opacity-100 transition-opacity cursor-pointer mt-0.5"
        aria-label="Dismiss"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const counterRef = useRef(0)

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++counterRef.current
    setToasts(prev => [...prev, { id, message, type }])
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, duration)
    }
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error:   (msg, dur) => addToast(msg, 'error',   dur),
    warning: (msg, dur) => addToast(msg, 'warning', dur),
    info:    (msg, dur) => addToast(msg, 'info',    dur),
    show:    addToast,
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container – fixed bottom-right */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
