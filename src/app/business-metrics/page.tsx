/**
 * Business Metrics Page
 * Key performance indicators and financial metrics for business decisions
 */

import BusinessMetricsDashboard from '@/components/business/BusinessMetricsDashboard'

export default function BusinessMetricsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto py-8">
        <BusinessMetricsDashboard />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Business Metrics - CS Intelligence Platform',
  description: 'Key performance indicators and financial metrics for business decisions'
}