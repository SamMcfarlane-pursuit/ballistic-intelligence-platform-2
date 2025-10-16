'use client'

import { CrunchbaseIntegration } from '@/components/dashboard/CrunchbaseIntegration'

export default function CrunchbaseDataPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Crunchbase Intelligence</h1>
              <p className="text-gray-600 mt-2">Real-time cybersecurity company data and funding insights</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-8">
        <CrunchbaseIntegration />
      </main>
    </div>
  )
}
