/**
 * News & Signals Page
 * Proactive monitoring and momentum analysis of company business milestones
 * 3-Phase Framework: Gather → Process → Analyze
 */

import NewsSignalsDashboard from '@/components/news-signals/NewsSignalsDashboard'

export default function NewsSignalsPage() {
  return (
    <div className="container mx-auto py-8">
      <NewsSignalsDashboard />
    </div>
  )
}

export const metadata = {
  title: 'News & Signals - CS Intelligence Platform',
  description: 'Proactive monitoring and momentum analysis of company business milestones'
}