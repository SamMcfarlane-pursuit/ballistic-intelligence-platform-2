import { FundingTrackerDashboard } from '@/components/funding-tracker/FundingTrackerDashboard'

export default function FundingTrackerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <FundingTrackerDashboard />
      </div>
    </div>
  )
}