"use client"

import { useState, useEffect } from 'react'

interface FundingData {
  month: string
  amount: number
}

interface FundingByStage {
  name: string
  value: number
  color: string
}

interface Vulnerability {
  id: string
  title: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  affectedCompanies: number
  discoveredDate: string
  description: string
}

interface DashboardStats {
  totalInvestment: number
  companiesTracked: number
  newVulnerabilities: number
  activeConferences: number
}

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInvestment: 0,
    companiesTracked: 0,
    newVulnerabilities: 0,
    activeConferences: 0
  })
  const [fundingOverTime, setFundingOverTime] = useState<FundingData[]>([])
  const [fundingByStage, setFundingByStage] = useState<FundingByStage[]>([])
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Fetch funding rounds data
      const fundingResponse = await fetch('/api/funding-rounds?limit=100')
      const fundingData = await fundingResponse.json()
      
      // Fetch analytics data
      const analyticsResponse = await fetch('/api/analytics')
      const analyticsData = await analyticsResponse.json()
      
      // Fetch active conventions
      const conventionsResponse = await fetch('/api/conventions?active=true')
      const conventionsData = await conventionsResponse.json()

      // Process funding over time data
      const monthlyTrends = analyticsData.monthlyTrends || {}
      const fundingOverTimeData = Object.entries(monthlyTrends)
        .map(([month, data]: [string, any]) => ({
          month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
          amount: Math.round((data.totalAmount || 0) / 1000000)
        }))
        .slice(-9)

      // Process funding by stage data
      const fundingByRoundType = analyticsData.fundingByRoundType || {}
      const stageColors = {
        'Seed': '#8884d8',
        'Series A': '#82ca9d',
        'Series B': '#ffc658',
        'Series C': '#ff7c7c',
        'Series D': '#8dd1e1',
        'Pre-Seed': '#d084d0',
        'Other': '#ffb347'
      }

      const fundingByStageData = Object.entries(fundingByRoundType)
        .map(([stage, data]: [string, any]) => ({
          name: stage,
          value: Math.round((data.totalAmount || 0) / 1000000),
          color: stageColors[stage as keyof typeof stageColors] || '#8884d8'
        }))

      // Mock vulnerabilities data
      const mockVulnerabilities: Vulnerability[] = [
        {
          id: '1',
          title: 'Zero-day in Cloud Security Platform',
          severity: 'critical',
          affectedCompanies: 3,
          discoveredDate: '2024-09-28',
          description: 'Critical vulnerability discovered in major cloud security platform affecting multiple enterprise customers.'
        },
        {
          id: '2',
          title: 'Authentication Bypass in SaaS Solutions',
          severity: 'high',
          affectedCompanies: 2,
          discoveredDate: '2024-09-27',
          description: 'Authentication bypass vulnerability allows unauthorized access to sensitive data.'
        },
        {
          id: '3',
          title: 'Data Exposure in API Endpoints',
          severity: 'medium',
          affectedCompanies: 1,
          discoveredDate: '2024-09-26',
          description: 'Improperly secured API endpoints exposing sensitive customer information.'
        }
      ]

      // Update stats with real data
      const totalInvestment = Math.round((analyticsData.summary?.totalFunding || 0) / 1000000)
      const companiesTracked = new Set(fundingData.data?.map((item: any) => item.company.company_name)).size
      const activeConferences = conventionsData.data?.length || 0

      setStats({
        totalInvestment,
        companiesTracked,
        newVulnerabilities: 3,
        activeConferences
      })

      setFundingOverTime(fundingOverTimeData)
      setFundingByStage(fundingByStageData)
      setVulnerabilities(mockVulnerabilities)

    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Failed to load dashboard data')
      
      // Fallback to mock data
      setFundingOverTime([
        { month: 'Jan', amount: 5 },
        { month: 'Feb', amount: 8 },
        { month: 'Mar', amount: 12 },
        { month: 'Apr', amount: 7 },
        { month: 'May', amount: 15 },
        { month: 'Jun', amount: 18 },
        { month: 'Jul', amount: 22 },
        { month: 'Aug', amount: 25 },
        { month: 'Sep', amount: 30 }
      ])
      
      setFundingByStage([
        { name: 'Seed', value: 35, color: '#8884d8' },
        { name: 'Series A', value: 25, color: '#82ca9d' },
        { name: 'Series B', value: 20, color: '#ffc658' },
        { name: 'Series C', value: 15, color: '#ff7c7c' },
        { name: 'Other', value: 5, color: '#8dd1e1' }
      ])
    }
    
    setLoading(false)
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return {
    stats,
    fundingOverTime,
    fundingByStage,
    vulnerabilities,
    loading,
    error,
    refetch: fetchDashboardData
  }
}