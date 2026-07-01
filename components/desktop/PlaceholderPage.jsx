"use client"
import { SlidersHorizontal } from 'lucide-react'

export default function PlaceholderPage({ title, description }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-brand-black/30 gap-4 h-[calc(100vh-140px)] bg-surface rounded-3xl shadow-sm border border-brand-black/5 px-6">
      <div className="w-20 h-20 rounded-full bg-base-light flex items-center justify-center mb-2">
        <SlidersHorizontal className="w-10 h-10 opacity-40 text-brand-black" />
      </div>
      <h2 className="text-2xl font-bold text-brand-black/80">{title}</h2>
      <p className="text-sm font-medium text-brand-black/40 text-center max-w-md">
        {description || 'This module is under development.'}
      </p>
    </div>
  )
}
