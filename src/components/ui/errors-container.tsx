"use client"

import React, { useState, useEffect } from 'react'
import { ErrorOverlay } from './error-overlay'
import { useErrorOverlay } from './error-overlay'

interface Error {
  id: string
  error: Error
  stackTrace?: string
  timestamp: Date
}

interface ErrorsContainerProps {
  maxErrors?: number
  className?: string
}

export function ErrorsContainer({ maxErrors = 10, className = '' }: ErrorsContainerProps) {
  const [errors, setErrors] = useState<Error[]>([])
  const { showError } = useErrorOverlay()

  // Global error handler
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const error = event.error || new Error(event.message)
      const newError: Error = {
        id: Math.random().toString(36).substr(2, 9),
        error,
        stackTrace: error.stack,
        timestamp: new Date()
      }

      setErrors(prev => {
        const updated = [newError, ...prev].slice(0, maxErrors)
        return updated
      })

      // Show the most recent error in overlay
      showError(error, error.stack)
    }

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason))
      const newError: Error = {
        id: Math.random().toString(36).substr(2, 9),
        error,
        stackTrace: error.stack,
        timestamp: new Date()
      }

      setErrors(prev => {
        const updated = [newError, ...prev].slice(0, maxErrors)
        return updated
      })

      // Show the most recent error in overlay
      showError(error, error.stack)
    }

    // Add event listeners
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [maxErrors, showError])

  const dismissError = (id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id))
  }

  const clearAllErrors = () => {
    setErrors([])
  }

  if (errors.length === 0) {
    return null
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 space-y-2 ${className}`}>
      {/* Error summary */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 max-w-sm">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-slate-800">
            Errors ({errors.length})
          </h4>
          <button
            onClick={clearAllErrors}
            className="text-xs text-slate-500 hover:text-slate-700"
          >
            Clear All
          </button>
        </div>
        
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {errors.slice(0, 5).map((error) => (
            <div
              key={error.id}
              className="flex items-center justify-between p-2 bg-slate-50 rounded text-xs"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-800 truncate">
                  {error.error.message}
                </div>
                <div className="text-slate-500">
                  {error.timestamp.toLocaleTimeString()}
                </div>
              </div>
              <button
                onClick={() => dismissError(error.id)}
                className="ml-2 text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>
          ))}
          {errors.length > 5 && (
            <div className="text-xs text-slate-500 text-center py-1">
              +{errors.length - 5} more errors
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Global error boundary component
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <ErrorOverlay error={this.state.error!} />
      )
    }

    return this.props.children
  }
}