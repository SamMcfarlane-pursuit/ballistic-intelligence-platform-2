"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'

interface ClipboardButtonProps {
  text: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  children?: React.ReactNode
  onCopy?: () => void
  onError?: (error: Error) => void
}

export function ClipboardButton({
  text,
  className = '',
  size = 'sm',
  variant = 'ghost',
  children,
  onCopy,
  onError
}: ClipboardButtonProps) {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const copyToClipboard = async () => {
    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for older browsers or non-secure contexts
        await fallbackCopyTextToClipboard(text)
      }
      
      setCopied(true)
      setError(null)
      onCopy?.()
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to copy text'
      setError(errorMessage)
      onError?.(err instanceof Error ? err : new Error(errorMessage))
      
      // Reset error state after 3 seconds
      setTimeout(() => setError(null), 3000)
    }
  }

  // Fallback method for browsers that don't support the Clipboard API
  const fallbackCopyTextToClipboard = (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const textArea = document.createElement('textarea')
      textArea.value = text
      
      // Avoid scrolling to bottom
      textArea.style.top = '0'
      textArea.style.left = '0'
      textArea.style.position = 'fixed'
      
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      try {
        // Execute copy command
        const successful = document.execCommand('copy')
        if (successful) {
          resolve()
        } else {
          throw new Error('Unable to copy using execCommand')
        }
      } catch (err) {
        reject(new Error('Failed to copy text'))
      } finally {
        document.body.removeChild(textArea)
      }
    })
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
        onClick={copyToClipboard}
        disabled={copied}
        title={error || (copied ? 'Copied!' : 'Copy to clipboard')}
      >
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
        {children}
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

// Hook for clipboard functionality
export function useClipboard() {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        await fallbackCopyTextToClipboard(text)
      }
      
      setCopied(true)
      setError(null)
      
      setTimeout(() => setCopied(false), 2000)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to copy text'
      setError(errorMessage)
      
      setTimeout(() => setError(null), 3000)
      return false
    }
  }

  return { copied, error, copyToClipboard }
}

// Export the fallback function for external use
export async function fallbackCopyTextToClipboard(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.top = '0'
    textArea.style.left = '0'
    textArea.style.position = 'fixed'
    
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    try {
      const successful = document.execCommand('copy')
      if (successful) {
        resolve()
      } else {
        throw new Error('Unable to copy using execCommand')
      }
    } catch (err) {
      reject(new Error('Failed to copy text'))
    } finally {
      document.body.removeChild(textArea)
    }
  })
}