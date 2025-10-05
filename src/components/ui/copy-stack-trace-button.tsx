"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'
import { useClipboard } from './clipboard-button'

interface CopyStackTraceButtonProps {
  stackTrace: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
}

export function CopyStackTraceButton({
  stackTrace,
  className = '',
  size = 'sm',
  variant = 'ghost'
}: CopyStackTraceButtonProps) {
  const { copied, error, copyToClipboard } = useClipboard()

  const handleCopy = async () => {
    await copyToClipboard(stackTrace)
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'lg':
        return 'h-10 w-10'
      case 'md':
        return 'h-8 w-8'
      case 'sm':
      default:
        return 'h-6 w-6'
    }
  }

  return (
    <div className="relative inline-block">
      <Button
        variant={variant}
        size={size}
        className={`${getSizeClasses()} ${className}`}
        onClick={handleCopy}
        disabled={copied}
        title={error || (copied ? 'Stack trace copied!' : 'Copy stack trace')}
      >
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
      
      {/* Error tooltip */}
      {error && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-red-600 rounded whitespace-nowrap">
          {error}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-600"></div>
        </div>
      )}
    </div>
  )
}