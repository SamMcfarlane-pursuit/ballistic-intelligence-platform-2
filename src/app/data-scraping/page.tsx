/**
 * Data Scraping Page
 * Free alternative to expensive data subscriptions
 */

import DataScrapingDashboard from '@/components/scraping/DataScrapingDashboard'

export default function DataScrapingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto py-8">
        <DataScrapingDashboard />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Data Scraping Center - CS Intelligence Platform',
  description: 'Free alternative to expensive data subscriptions - scrape public data sources'
}