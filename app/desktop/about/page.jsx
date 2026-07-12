"use client"
import FinveraLogo from '@/components/FinveraLogo'
import { Github, Globe, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-brand-black">About</h2>
      </div>

      <div className="bg-surface rounded-3xl shadow-sm border border-brand-black/5 flex-1 p-8 flex flex-col items-center justify-center text-center">
        <div className="max-w-md w-full space-y-8 flex flex-col items-center">

          {/* Theme-aware logo */}
          <FinveraLogo variant="full" size="xl" priority />

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-brand-black">Finvera App</h1>
            <p className="text-sm font-semibold text-brand-black/50 bg-brand-black/5 px-3 py-1 rounded-full w-max mx-auto">
              Version 1.0.0
            </p>
          </div>

          <div className="text-sm font-medium text-brand-black/60 space-y-4">
            <p>
              A beautifully designed personal finance and bookkeeping application inspired by ezBookkeeping.
              Track your daily expenses, analyze your financial health, and achieve your financial goals with ease.
            </p>
            <p className="flex items-center justify-center gap-1.5 text-xs">
              Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> by You
            </p>
          </div>

          <div className="w-full h-px bg-brand-black/5 my-4" />

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#" className="flex items-center gap-2 text-sm font-bold text-brand-black/70 hover:text-brand-black transition-colors bg-base-light px-5 py-2.5 rounded-xl border border-transparent hover:border-brand-black/10">
              <Globe className="w-4 h-4" />
              Website
            </a>
            <a href="#" className="flex items-center gap-2 text-sm font-bold text-brand-black/70 hover:text-brand-black transition-colors bg-base-light px-5 py-2.5 rounded-xl border border-transparent hover:border-brand-black/10">
              <Github className="w-4 h-4" />
              Source Code
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}
