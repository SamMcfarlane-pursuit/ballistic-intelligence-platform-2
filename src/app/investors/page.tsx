import { InvestorSearch } from '@/components/investors/InvestorSearch'

export default function InvestorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <InvestorSearch />
      </div>
    </div>
  )
}