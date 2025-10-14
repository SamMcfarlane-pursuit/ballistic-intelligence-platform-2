/**
 * Company Intelligence Page
 * Comprehensive company analysis with export capabilities
 */

import CompanyIntelligenceDashboard from '@/components/intelligence/CompanyIntelligenceDashboard'

interface CompanyIntelligencePageProps {
  params: {
    id: string
  }
}

export default function CompanyIntelligencePage({ params }: CompanyIntelligencePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto py-8">
        <CompanyIntelligenceDashboard companyId={params.id} />
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: CompanyIntelligencePageProps) {
  return {
    title: `Company Intelligence - CS Intelligence Platform`,
    description: `Comprehensive intelligence analysis with export capabilities for investor presentations`
  }
}