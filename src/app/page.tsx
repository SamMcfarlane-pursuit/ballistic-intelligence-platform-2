"use client"

import EnhancedDashboard from '@/components/enhanced-dashboard'
import { AuthProvider } from '@/components/auth-provider'
import ProtectedRoute from '@/components/protected-route'

function AppContent() {
  return (
    <ProtectedRoute>
      <EnhancedDashboard />
    </ProtectedRoute>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}