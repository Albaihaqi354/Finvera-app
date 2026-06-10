"use client"
import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] h-full p-6 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-brand-black mb-2">Something went wrong</h2>
          <p className="text-sm text-brand-black/60 mb-6 max-w-md">
            An unexpected error occurred in this component. Try refreshing the page, or reset the state if the problem persists.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-brand-black text-brand-primary font-bold rounded-xl text-sm"
            >
              Reload Page
            </button>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-6 py-2.5 bg-brand-black/5 text-brand-black font-bold rounded-xl text-sm hover:bg-brand-black/10 transition-colors"
            >
              Try Again
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-8 p-4 bg-red-50 text-red-800 text-left rounded-xl text-xs overflow-auto max-w-2xl w-full">
              <p className="font-bold mb-1">{this.state.error.toString()}</p>
            </div>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
