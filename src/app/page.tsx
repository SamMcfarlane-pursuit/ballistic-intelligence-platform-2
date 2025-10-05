"use client"

import ConcisePowerfulDashboard from '@/components/concise-powerful-dashboard'
import { AuthProvider } from '@/components/auth-provider'
import ProtectedRoute from '@/components/protected-route'

function AppContent() {
  return (
    <ProtectedRoute>
      <ConcisePowerfulDashboard />
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