"use client"

import { ReactNode } from 'react'
import { useAuth } from '@/components/auth-provider'
import LoginForm from '@/components/login-form'

interface ProtectedRouteProps {
  children: ReactNode
  requiredPermissions?: string[]
  fallback?: ReactNode
}

export default function ProtectedRoute({ 
  children, 
  requiredPermissions = [],
  fallback 
}: ProtectedRouteProps) {
  const { user, isLoading, hasPermission } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    if (fallback) {
      return <>{fallback}</>
    }
    return <LoginForm />
  }

  // Check permissions
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => hasPermission(permission))
    if (!hasAllPermissions) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-4">
              You don't have the required permissions to access this resource.
            </p>
            <p className="text-sm text-gray-500">
              Required permissions: {requiredPermissions.join(', ')}
            </p>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}