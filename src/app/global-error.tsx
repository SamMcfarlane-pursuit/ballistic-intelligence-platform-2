"use client"

import { useEffect } from 'react'
import { ErrorOverlay } from '@/components/ui/error-overlay'
import { ErrorsContainer } from '@/components/ui/errors-container'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <ErrorsContainer />
        <ErrorOverlay 
          error={error}
          stackTrace={error.stack}
        />
      </body>
    </html>
  )
}