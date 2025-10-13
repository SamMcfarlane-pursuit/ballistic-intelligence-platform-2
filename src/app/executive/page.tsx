/**
 * Executive Dashboard Page
 * Strategic cybersecurity investment intelligence and portfolio management
 * Comprehensive executive-level analytics with actionable insights
 */

import ExecutiveDashboard from '@/components/executive/ExecutiveDashboard'

export default function ExecutivePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto py-8">
        <ExecutiveDashboard />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Executive Command Center - CS Intelligence Platform',
  description: 'Strategic cybersecurity investment intelligence and portfolio management for executives'
}