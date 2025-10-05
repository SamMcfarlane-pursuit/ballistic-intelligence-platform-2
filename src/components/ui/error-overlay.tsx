"use client"

import { ReactNode } from 'react'
import { ErrorOverlayLayout } from './error-overlay-layout'
import { Button } from '@/components/ui/button'
import { ExternalLink, Github, Bug } from 'lucide-react'

interface ErrorOverlayProps {
  error: Error
  stackTrace?: string
  className?: string
  children?: ReactNode
}

export function ErrorOverlay({ 
  error, 
  stackTrace = error.stack || '', 
  className = '',
  children 
}: ErrorOverlayProps) {
  const handleRefresh = () => {
    window.location.reload()
  }

  const handleDismiss = () => {
    // Remove the error overlay from DOM
    const overlay = document.querySelector('[data-error-overlay]')
    if (overlay) {
      overlay.remove()
    }
  }

  const handleReportIssue = () => {
    const issueUrl = `https://github.com/your-repo/issues/new?title=${encodeURIComponent(`Error: ${error.message}`)}&body=${encodeURIComponent(
      `## Error Description\n${error.message}\n\n## Stack Trace\n\`\`\`\n${stackTrace}\n\`\`\`\n\n## Environment\n- URL: ${window.location.href}\n- User Agent: ${navigator.userAgent}\n- Timestamp: ${new Date().toISOString()}`
    )}`
    window.open(issueUrl, '_blank')
  }

  return (
    <ErrorOverlayLayout
      type="error"
      title="Application Error"
      message={error.message}
      stackTrace={stackTrace}
      onRefresh={handleRefresh}
      onDismiss={handleDismiss}
      className={className}
    >
      {children}
      
      <div className="space-y-4">
        <div className="bg-slate-100 p-4 rounded-lg">
          <h4 className="font-semibold text-slate-800 mb-2">What happened?</h4>
          <p className="text-sm text-slate-600">
            An unexpected error occurred while running the application. This could be due to a temporary issue or a bug in the code.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="w-full"
          >
            Refresh Page
          </Button>
          
          <Button
            variant="outline"
            onClick={handleReportIssue}
            className="w-full"
          >
            <Github className="h-4 w-4 mr-2" />
            Report Issue
          </Button>
        </div>
        
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-slate-500 hover:text-slate-700"
          >
            Dismiss this error
          </Button>
        </div>
      </div>
    </ErrorOverlayLayout>
  )
}

// Hook for global error handling
export function useErrorOverlay() {
  const showError = (error: Error, stackTrace?: string) => {
    // Remove any existing error overlay
    const existingOverlay = document.querySelector('[data-error-overlay]')
    if (existingOverlay) {
      existingOverlay.remove()
    }

    // Create new overlay container
    const overlayContainer = document.createElement('div')
    overlayContainer.setAttribute('data-error-overlay', 'true')
    document.body.appendChild(overlayContainer)

    // Import React and render the error overlay
    import('react').then((React) => {
      import('react-dom/client').then((ReactDOM) => {
        const root = ReactDOM.createRoot(overlayContainer)
        root.render(
          React.createElement(ErrorOverlay, {
            error,
            stackTrace,
            onDismiss: () => {
              root.unmount()
              overlayContainer.remove()
            }
          })
        )
      })
    })
  }

  return { showError }
}