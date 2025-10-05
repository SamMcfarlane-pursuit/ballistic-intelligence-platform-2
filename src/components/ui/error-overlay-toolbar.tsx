"use client"

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { CopyStackTraceButton } from './copy-stack-trace-button'
import { RefreshCw, X } from 'lucide-react'

interface ErrorOverlayToolbarProps {
  stackTrace?: string
  onRefresh?: () => void
  onDismiss?: () => void
  className?: string
  children?: ReactNode
}

export function ErrorOverlayToolbar({
  stackTrace = '',
  onRefresh,
  onDismiss,
  className = '',
  children
}: ErrorOverlayToolbarProps) {
  return (
    <div className={`flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 ${className}`}>
      <div className="flex items-center gap-2">
        {children}
      </div>
      
      <div className="flex items-center gap-2">
        {stackTrace && (
          <CopyStackTraceButton 
            stackTrace={stackTrace}
            variant="outline"
            size="sm"
          />
        )}
        
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="h-8 w-8 p-0"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
        
        {onDismiss && (
          <Button
            variant="outline"
            size="sm"
            onClick={onDismiss}
            className="h-8 w-8 p-0"
            title="Dismiss"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}