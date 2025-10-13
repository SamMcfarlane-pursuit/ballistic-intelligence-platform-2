"use client"

import React, { useState, useCallback } from 'react'
import { validateCompanyData, sanitizeText, CompanyDataValidation } from '@/lib/security'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface SecureFormProps {
  children: React.ReactNode
  onSubmit: (data: Record<string, any>) => void | Promise<void>
  onValidationChange?: (validation: CompanyDataValidation) => void
  className?: string
}

interface FormField {
  name: string
  value: any
  error?: string
}

export function SecureForm({ 
  children, 
  onSubmit, 
  onValidationChange,
  className 
}: SecureFormProps) {
  const [fields, setFields] = useState<Record<string, FormField>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationResult, setValidationResult] = useState<CompanyDataValidation | null>(null)

  // Update field value with validation
  const updateField = useCallback((name: string, value: any) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        name,
        value: sanitizeText(String(value || '')),
        error: undefined
      }
    }))

    // Trigger validation
    const fieldData = { ...fields, [name]: value }
    const validation = validateCompanyData(fieldData)
    setValidationResult(validation)
    
    if (onValidationChange) {
      onValidationChange(validation)
    }
  }, [fields, onValidationChange])

  // Secure form submission
  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      // Final validation
      const fieldData = Object.fromEntries(
        Object.entries(fields).map(([key, field]) => [key, field.value])
      )
      
      const validation = validateCompanyData(fieldData)
      setValidationResult(validation)

      if (!validation.isValid) {
        return
      }

      // Submit sanitized data
      await onSubmit(validation.sanitizedData)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [fields, isSubmitting, onSubmit])

  return (
    <form onSubmit={handleSubmit} className={className}>
      {/* Validation Messages */}
      {validationResult && !validationResult.isValid && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              {validationResult.errors.map((error, index) => (
                <div key={index} className="text-sm text-red-600">
                  {error}
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {validationResult && validationResult.isValid && (
        <Alert className="mb-4 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Form validation passed. Ready to submit.
          </AlertDescription>
        </Alert>
      )}

      {/* Form Fields */}
      <div className="space-y-4">
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            // Pass field update function to form fields
            return React.cloneElement(child, {
              onFieldUpdate: updateField,
              fieldValues: fields,
              isSubmitting
            } as any)
          }
          return child
        })}
      </div>
    </form>
  )
}

// Secure input field component
interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  onFieldUpdate?: (name: string, value: any) => void
  fieldValues?: Record<string, FormField>
  isSubmitting?: boolean
}

export function SecureInput({
  name,
  label,
  onFieldUpdate,
  fieldValues,
  isSubmitting,
  className,
  ...props
}: SecureInputProps) {
  const field = fieldValues?.[name]
  const hasError = field?.error

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (onFieldUpdate) {
      onFieldUpdate(name, value)
    }
  }, [name, onFieldUpdate])

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        {...props}
        id={name}
        name={name}
        value={field?.value || ''}
        onChange={handleChange}
        disabled={isSubmitting || props.disabled}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:cursor-not-allowed
          ${hasError ? 'border-red-300 bg-red-50' : 'border-gray-300'}
          ${className || ''}
        `}
      />
      {hasError && (
        <div className="text-sm text-red-600">{field.error}</div>
      )}
    </div>
  )
}

// Secure textarea component
interface SecureTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string
  label?: string
  onFieldUpdate?: (name: string, value: any) => void
  fieldValues?: Record<string, FormField>
  isSubmitting?: boolean
}

export function SecureTextarea({
  name,
  label,
  onFieldUpdate,
  fieldValues,
  isSubmitting,
  className,
  ...props
}: SecureTextareaProps) {
  const field = fieldValues?.[name]
  const hasError = field?.error

  const handleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value
    if (onFieldUpdate) {
      onFieldUpdate(name, value)
    }
  }, [name, onFieldUpdate])

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        {...props}
        id={name}
        name={name}
        value={field?.value || ''}
        onChange={handleChange}
        disabled={isSubmitting || props.disabled}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-50 disabled:cursor-not-allowed
          ${hasError ? 'border-red-300 bg-red-50' : 'border-gray-300'}
          ${className || ''}
        `}
      />
      {hasError && (
        <div className="text-sm text-red-600">{field.error}</div>
      )}
    </div>
  )
}