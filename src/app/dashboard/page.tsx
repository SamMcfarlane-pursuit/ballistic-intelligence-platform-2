'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { FundingOverviewChart } from '@/components/dashboard/FundingOverviewChart'
import { StartupsByStageChart } from '@/components/dashboard/StartupsByStageChart'
import { TopPerformingStartups } from '@/components/dashboard/TopPerformingStartups'
import { RecentFunding } from '@/components/dashboard/RecentFunding'
import { StartupsTable } from '@/components/dashboard/StartupsTable'
import { MarketDistribution } from '@/components/dashboard/MarketDistribution'
import { ThreatIntelligence } from '@/components/dashboard/ThreatIntelligence'
import { PatentIntelligence } from '@/components/dashboard/PatentIntelligence'
import { ConferenceIntelligence } from '@/components/dashboard/ConferenceIntelligence'
import { FundraiserFinancials } from '@/components/dashboard/FundraiserFinancials'
import { DashboardCustomizer } from '@/components/dashboard/DashboardCustomizer'
import { DataSourcesManager } from '@/components/dashboard/DataSourcesManager'
import { useDashboard } from '@/hooks/useDashboard'
import { useDashboardCustomization } from '@/hooks/useDashboardCustomization'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { Button } from '@/components/ui/button'
import { Settings, Database } from 'lucide-react'

export default function DashboardPage() {
  const { 
    dashboard, 
    stats, 
    analytics, 
    loading, 
    error, 
    refetch 
  } = useDashboard()

  const {
    customization,
    updateWidgets,
    isWidgetEnabled
  } = useDashboardCustomization()

  const [showCustomizer, setShowCustomizer] = useState(false)
  const [showDataSources, setShowDataSources] = useState(false)

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Failed to load dashboard
          </h2>
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    )
  }

  const renderWidget = (widgetId: string) => {
    if (!isWidgetEnabled(widgetId)) return null

    switch (widgetId) {
      case 'stats-cards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="Total Funding"
              value={stats?.data?.funding?.formatted || "$0"}
              change="+12.5%"
              trend="up"
              icon="dollar"
            />
            <StatsCard 
              title="Active Startups"
              value={stats?.data?.companies?.total || 0}
              change="+8.2%"
              trend="up"
              icon="building"
            />
            <StatsCard 
              title="Avg. Funding"
              value="$45.2M"
              change="+3.1%"
              trend="up"
              icon="trending"
            />
            <StatsCard 
              title="Success Rate"
              value="68%"
              change="+5.4%"
              trend="up"
              icon="target"
            />
          </div>
        )
      case 'funding-overview':
        return <FundingOverviewChart data={analytics?.fundingTrends} />
      case 'startups-by-stage':
        return <StartupsByStageChart data={analytics?.fundingTrends} />
      case 'top-startups':
        return <TopPerformingStartups companies={dashboard?.data?.topCompanies} />
      case 'recent-funding':
        return <RecentFunding activities={dashboard?.data?.recentActivity} />
      case 'startups-table':
        return <StartupsTable companies={dashboard?.data?.topCompanies} />
      case 'market-distribution':
        return <MarketDistribution data={analytics?.marketAnalysis} />
      case 'threat-intelligence':
        return <ThreatIntelligence />
      case 'patent-intelligence':
        return <PatentIntelligence />
      case 'conference-intelligence':
        return <ConferenceIntelligence />
      case 'fundraiser-financials':
        return <FundraiserFinancials />
      default:
        return null
    }
  }

  return (
    <ErrorBoundary>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Customization Button */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                Customize your view with the settings button
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowDataSources(true)}
                className="flex items-center space-x-2"
              >
                <Database className="h-4 w-4" />
                <span>Data Sources</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCustomizer(true)}
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Customize</span>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          {renderWidget('stats-cards')}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-8">
              {renderWidget('funding-overview')}
              {renderWidget('startups-by-stage')}
              {renderWidget('market-distribution')}
            </div>

            {/* Right Column - Lists and Info */}
            <div className="space-y-8">
              {renderWidget('top-startups')}
              {renderWidget('recent-funding')}
              {renderWidget('threat-intelligence')}
              {renderWidget('patent-intelligence')}
              {renderWidget('conference-intelligence')}
            </div>
          </div>

          {/* Bottom Section - Table */}
          {renderWidget('startups-table')}
        </div>

        {/* Dashboard Customizer */}
        <DashboardCustomizer
          isOpen={showCustomizer}
          onClose={() => setShowCustomizer(false)}
          widgets={customization.widgets}
          onUpdateWidgets={updateWidgets}
        />

        {/* Data Sources Manager */}
        <DataSourcesManager
          isOpen={showDataSources}
          onClose={() => setShowDataSources(false)}
        />
      </DashboardLayout>
    </ErrorBoundary>
  )
}