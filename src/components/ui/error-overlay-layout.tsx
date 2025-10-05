"use client"

import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ErrorOverlayToolbar } from './error-overlay-toolbar'
import { AlertTriangle, Info, XCircle, RefreshCw } from 'lucide-react'

interface ErrorOverlayLayoutProps {
  type: 'error' | 'warning' | 'info'
  title: string
  message?: string
  stackTrace?: string
  actions?: ReactNode
  onRefresh?: () => void
  onDismiss?: () => void
  className?: string
  children?: ReactNode
}

export function ErrorOverlayLayout({
  type,
  title,
  message,
  stackTrace = '',
  actions,
  onRefresh,
  onDismiss,
  className = '',
  children
}: ErrorOverlayLayoutProps) {
  const getTypeConfig = () => {
    switch (type) {
      case 'error':
        return {
          icon: XCircle,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          badgeVariant: 'destructive' as const,
          badgeText: 'Error'
        }
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          badgeVariant: 'default' as const,
          badgeText: 'Warning'
        }
      case 'info':
      default:
        return {
          icon: Info,
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          badgeVariant: 'secondary' as const,
          badgeText: 'Info'
        }
    }
  }

  const config = getTypeConfig()
  const Icon = config.icon

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${className}`}>
      <Card className={`w-full max-w-2xl max-h-[80vh] overflow-hidden ${config.bgColor} ${config.borderColor}`}>
        <ErrorOverlayToolbar
          stackTrace={stackTrace}
          onRefresh={onRefresh}
          onDismiss={onDismiss}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config.bgColor}`}>
              <Icon className={`h-5 w-5 ${config.iconColor}`} />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              {message && (
                <p className="text-sm text-slate-600 mt-1">{message}</p>
              )}
            </div>
            <Badge variant={config.badgeVariant}>
              {config.badgeText}
            </Badge>
          </div>
        </ErrorOverlayToolbar>
        
        <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
          {children}
          
          {stackTrace && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Stack Trace</h4>
              <pre className="text-xs bg-slate-100 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap text-slate-700">
                {stackTrace}
              </pre>
            </div>
          )}
          
          {actions && (
            <div className="mt-6 flex items-center justify-end gap-3">
              {actions}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}