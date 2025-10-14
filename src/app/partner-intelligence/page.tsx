/**
 * Partner Intelligence Page
 * AI-powered analysis of partner notes, company correlations, and market trends
 */

import PartnerNotesAnalyzer from '@/components/intelligence/PartnerNotesAnalyzer'

export default function PartnerIntelligencePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto py-8">
        <PartnerNotesAnalyzer />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Partner Intelligence - CS Intelligence Platform',
  description: 'AI-powered analysis of partner notes, company correlations, and market trends'
}