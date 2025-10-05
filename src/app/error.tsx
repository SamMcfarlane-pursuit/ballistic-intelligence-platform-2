"use client"

import { useEffect } from 'react'
import { ErrorOverlay } from '@/components/ui/error-overlay'
import { ErrorsContainer } from '@/components/ui/errors-container'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <ErrorsContainer />
      <ErrorOverlay 
        error={error}
        stackTrace={error.stack}
      />
    </div>
  )
}