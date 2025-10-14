/**
 * Missed Opportunity Analyzer Page
 * Compares AI-discovered companies against manual tracking system
 * Highlights potential gaps in deal-sourcing efforts
 */

import MissedOpportunityAnalyzer from '@/components/analysis/MissedOpportunityAnalyzer'

export default function MissedOpportunitiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
      <div className="container mx-auto py-8">
        <MissedOpportunityAnalyzer />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Missed Opportunity Analyzer - CS Intelligence Platform',
  description: 'Identify funding gaps and missed investment opportunities in cybersecurity'
}