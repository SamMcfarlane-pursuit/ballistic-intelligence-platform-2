/**
 * Company Deep Dive Page
 * Consolidates all known intelligence on a single company
 * Accessed by clicking "View Details" on company cards
 */

import CompanyDeepDive from '@/components/company/CompanyDeepDive'

interface CompanyPageProps {
  params: {
    id: string
  }
}

export default function CompanyPage({ params }: CompanyPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto py-8">
        <CompanyDeepDive companyId={params.id} />
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: CompanyPageProps) {
  // In a real app, you'd fetch the company name from the API
  return {
    title: `Company Analysis - CS Intelligence Platform`,
    description: `Comprehensive intelligence analysis and funding history`
  }
}