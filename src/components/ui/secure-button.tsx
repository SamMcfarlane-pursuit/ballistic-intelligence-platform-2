"use client"

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SecureButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>
  loading?: boolean
  loadingText?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  debounceMs?: number
  requireConfirmation?: boolean
  confirmationText?: string
  maxClicksPerMinute?: number
  className?: string
}

export function SecureButton({
  children,
  onClick,
  loading = false,
  loadingText = 'Loading...',
  variant = 'default',
  size = 'default',
  debounceMs = 300,
  requireConfirmation = false,
  confirmationText = 'Are you sure?',
  maxClicksPerMinute = 60,
  className,
  disabled,
  ...props
}: SecureButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  // Rate limiting check
  const isRateLimited = useCallback(() => {
    const now = Date.now()
    const oneMinuteAgo = now - 60000

    // Reset click count if more than a minute has passed
    if (lastClickTime < oneMinuteAgo) {
      setClickCount(0)
    }

    return clickCount >= maxClicksPerMinute
  }, [clickCount, lastClickTime, maxClicksPerMinute])

  // Secure click handler with debouncing and rate limiting
  const handleSecureClick = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent default and stop propagation for security
    event.preventDefault()
    event.stopPropagation()

    // Check if already processing
    if (isProcessing || loading) {
      return
    }

    // Check rate limiting
    if (isRateLimited()) {
      console.warn('Button click rate limit exceeded')
      return
    }

    // Clear existing debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    // Set debounce timer
    const timer = setTimeout(async () => {
      try {
        // Update click tracking
        const now = Date.now()
        setClickCount(prev => prev + 1)
        setLastClickTime(now)

        // Confirmation check
        if (requireConfirmation) {
          const confirmed = window.confirm(confirmationText)
          if (!confirmed) {
            return
          }
        }

        // Set processing state
        setIsProcessing(true)

        // Execute onClick handler
        if (onClick) {
          await onClick(event)
        }
      } catch (error) {
        console.error('Button click error:', error)
        // Don't expose error details to user for security
      } finally {
        setIsProcessing(false)
      }
    }, debounceMs)

    setDebounceTimer(timer)
  }, [
    isProcessing,
    loading,
    isRateLimited,
    debounceTimer,
    debounceMs,
    requireConfirmation,
    confirmationText,
    onClick
  ])

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  }, [debounceTimer])

  const isDisabled = disabled || loading || isProcessing || isRateLimited()
  const showLoading = loading || isProcessing

  return (
    <Button
      {...props}
      variant={variant}
      size={size}
      disabled={isDisabled}
      onClick={handleSecureClick}
      className={cn(
        'relative transition-all duration-200',
        showLoading && 'cursor-not-allowed',
        className
      )}
    >
      {showLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {showLoading ? loadingText : children}
    </Button>
  )
}

// Specialized secure buttons for common use cases
export function SecureSubmitButton(props: Omit<SecureButtonProps, 'variant' | 'requireConfirmation'>) {
  return (
    <SecureButton
      {...props}
      variant="default"
      requireConfirmation={false}
      loadingText="Submitting..."
      maxClicksPerMinute={10}
    />
  )
}

export function SecureDeleteButton(props: Omit<SecureButtonProps, 'variant' | 'requireConfirmation'>) {
  return (
    <SecureButton
      {...props}
      variant="destructive"
      requireConfirmation={true}
      confirmationText="Are you sure you want to delete this item?"
      loadingText="Deleting..."
      maxClicksPerMinute={5}
    />
  )
}

export function SecureActionButton(props: Omit<SecureButtonProps, 'variant'>) {
  return (
    <SecureButton
      {...props}
      variant="outline"
      loadingText="Processing..."
      maxClicksPerMinute={30}
    />
  )