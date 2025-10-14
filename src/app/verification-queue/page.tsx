'use client'

import React from 'react'
import VerificationQueueDashboard from '@/components/verification/VerificationQueueDashboard'

export default function VerificationQueuePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <VerificationQueueDashboard />
      </div>
    </div>
  )
}