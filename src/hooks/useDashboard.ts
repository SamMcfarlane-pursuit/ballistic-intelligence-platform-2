'use client'

import { useState, useEffect, useCallback } from 'react'

interface DashboardData {
  summary: {
    totalCompanies: number
    totalFunding: number
    averageFunding: number
    totalConventions: number
    totalPortfolio: number
  }
  topCompanies: Array<{
    id: string
    name: string
    category: string
    funding: number
    stage: string
    employees?: number
    founded?: number
    score: number
  }>
  upcomingConventions: Array<{
    id: string
    name: string
    location: string
    startDate: string
    endDate: string
    companies: number
    daysUntil: number
  }>
  recentActivity: Array<{
    id: string
    type: string
    title: string
    description: string
    timestamp: string
    category: string
  }>
  quickActions: Array<{
    id: string
    label: string
    icon: string
    endpoint: string
  }>
}

interface StatsData {
  companies: { total: number; trend: string; color: string }
  funding: { total: number; formatted: string; trend: string; color: string }
  conventions: { total: number; trend: string; color: string }
  portfolio: { total: number; trend: string; color: string }
}

interface AnalyticsData {
  fundingTrends: {
    stageBreakdown: Array<{
      stage: string
      count: number
      totalFunding: number
      averageFunding: number
    }>
    yearlyTrends: Array<{
      year: number
      funding: number
      deals: number
    }>
  }
  marketAnalysis: {
    marketMap: Array<{
      category: string
      companies: number
      totalFunding: number
      marketShare: number
    }>
  }
}

export function useDashboard() {
  const [dashboard, setDashboard] = useState<{ data: DashboardData } | null>(null)
  const [stats, setStats] = useState<{ data: StatsData } | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all dashboard data in parallel
      const [dashboardRes, statsRes, fundingTrendsRes, marketAnalysisRes] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/analytics?metric=funding-trends'),
        fetch('/api/dashboard/analytics?metric=market-analysis')
      ])

      if (!dashboardRes.ok || !statsRes.ok || !fundingTrendsRes.ok || !marketAnalysisRes.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const [dashboardData, statsData, fundingTrendsData, marketAnalysisData] = await Promise.all([
        dashboardRes.json(),
        statsRes.json(),
        fundingTrendsRes.json(),
        marketAnalysisRes.json()
      ])

      setDashboard(dashboardData)
      setStats(statsData)
      setAnalytics({
        fundingTrends: fundingTrendsData.data,
        marketAnalysis: marketAnalysisData.data
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  const refetch = useCallback(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  useEffect(() => {
    fetchDashboardData()

    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [fetchDashboardData])

  return {
    dashboard,
    stats,
    analytics,
    loading,
    error,
    refetch
  }
}