'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  DollarSign, 
  TrendingUp, 
  Building2, 
  Users,
  Calendar,
  Target,
  Award,
  Briefcase,
  PieChart,
  BarChart3,
  RefreshCw,
  ExternalLink,
  Eye,
  Download
} from 'lucide-react'

interface CorporationFinancials {
  id: string
  name: string
  ticker?: string
  industry: string
  sector: string
  headquarters: string
  founded: number
  employees: number
  marketCap: number
  revenue: {
    gross: number
    net: number
    year: number
    growth: number
  }
  profitability: {
    grossProfit: number
    netProfit: number
    operatingIncome: number
    ebitda: number
    margins: {
      gross: number
      net: number
      operating: number
    }
  }
  executiveCompensation: {
    ceo: {
      name: string
      totalCompensation: number
      baseSalary: number
      bonus: number
      stockOptions: number
    }
    cfo: {
      name: string
      totalCompensation: number
      baseSalary: number
      bonus: number
      stockOptions: number
    }
  }
  cybersecuritySpending: {
    annual: number
    percentage: number
    categories: Array<{
      category: string
      amount: number
      percentage: number
    }>
  }
  fundraising: {
    totalRaised: number
    lastRound: {
      type: string
      amount: number
      date: string
      valuation: number
      leadInvestor: string
    }
    investors: string[]
  }
  financialHealth: {
    debtToEquity: number
    currentRatio: number
    quickRatio: number
    returnOnEquity: number
    returnOnAssets: number
  }
}

interface FundraiserMetrics {
  totalCorporations: number
  totalMarketCap: number
  totalRevenue: number
  averageGrowth: number
  topPerformers: string[]
  cybersecurityMarket: number
}

export function FundraiserFinancials() {
  const [corporations, setCorporations] = useState<CorporationFinancials[]>([])
  const [metrics, setMetrics] = useState<FundraiserMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCorp, setSelectedCorp] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  useEffect(() => {
    fetchFinancialData()
    const interval = setInterval(fetchFinancialData, 10 * 60 * 1000) // Update every 10 minutes
    return () => clearInterval(interval)
  }, [])

  const fetchFinancialData = async () => {
    try {
      // Mock comprehensive financial data
      const mockCorporations: CorporationFinancials[] = [
        {
          id: 'corp-001',
          name: 'CyberTech Solutions Inc.',
          ticker: 'CYBT',
          industry: 'Cybersecurity',
          sector: 'Technology',
          headquarters: 'San Francisco, CA',
          founded: 2015,
          employees: 2500,
          marketCap: 15000000000,
          revenue: {
            gross: 2800000000,
            net: 420000000,
            year: 2024,
            growth: 28.5
          },
          profitability: {
            grossProfit: 1680000000,
            netProfit: 420000000,
            operatingIncome: 560000000,
            ebitda: 700000000,
            margins: {
              gross: 60.0,
              net: 15.0,
              operating: 20.0
            }
          },
          executiveCompensation: {
            ceo: {
              name: 'Sarah Chen',
              totalCompensation: 18500000,
              baseSalary: 1200000,
              bonus: 2800000,
              stockOptions: 14500000
            },
            cfo: {
              name: 'Michael Rodriguez',
              totalCompensation: 12300000,
              baseSalary: 850000,
              bonus: 1950000,
              stockOptions: 9500000
            }
          },
          cybersecuritySpending: {
            annual: 180000000,
            percentage: 6.4,
            categories: [
              { category: 'R&D', amount: 90000000, percentage: 50.0 },
              { category: 'Infrastructure', amount: 45000000, percentage: 25.0 },
              { category: 'Personnel', amount: 27000000, percentage: 15.0 },
              { category: 'Compliance', amount: 18000000, percentage: 10.0 }
            ]
          },
          fundraising: {
            totalRaised: 450000000,
            lastRound: {
              type: 'Series D',
              amount: 120000000,
              date: '2023-09-15',
              valuation: 8500000000,
              leadInvestor: 'Sequoia Capital'
            },
            investors: ['Sequoia Capital', 'Andreessen Horowitz', 'GV', 'Kleiner Perkins']
          },
          financialHealth: {
            debtToEquity: 0.25,
            currentRatio: 2.8,
            quickRatio: 2.1,
            returnOnEquity: 18.5,
            returnOnAssets: 12.3
          }
        },
        {
          id: 'corp-002',
          name: 'SecureCloud Enterprises',
          ticker: 'SCLD',
          industry: 'Cloud Security',
          sector: 'Technology',
          headquarters: 'Austin, TX',
          founded: 2018,
          employees: 1800,
          marketCap: 8500000000,
          revenue: {
            gross: 1650000000,
            net: 248000000,
            year: 2024,
            growth: 35.2
          },
          profitability: {
            grossProfit: 1155000000,
            netProfit: 248000000,
            operatingIncome: 330000000,
            ebitda: 412000000,
            margins: {
              gross: 70.0,
              net: 15.0,
              operating: 20.0
            }
          },
          executiveCompensation: {
            ceo: {
              name: 'David Kim',
              totalCompensation: 15200000,
              baseSalary: 950000,
              bonus: 2250000,
              stockOptions: 12000000
            },
            cfo: {
              name: 'Lisa Thompson',
              totalCompensation: 9800000,
              baseSalary: 720000,
              bonus: 1580000,
              stockOptions: 7500000
            }
          },
          cybersecuritySpending: {
            annual: 125000000,
            percentage: 7.6,
            categories: [
              { category: 'R&D', amount: 75000000, percentage: 60.0 },
              { category: 'Infrastructure', amount: 25000000, percentage: 20.0 },
              { category: 'Personnel', amount: 15000000, percentage: 12.0 },
              { category: 'Compliance', amount: 10000000, percentage: 8.0 }
            ]
          },
          fundraising: {
            totalRaised: 280000000,
            lastRound: {
              type: 'Series C',
              amount: 85000000,
              date: '2023-11-20',
              valuation: 4200000000,
              leadInvestor: 'Accel Partners'
            },
            investors: ['Accel Partners', 'Index Ventures', 'Bessemer Venture Partners', 'Lightspeed']
          },
          financialHealth: {
            debtToEquity: 0.15,
            currentRatio: 3.2,
            quickRatio: 2.8,
            returnOnEquity: 22.1,
            returnOnAssets: 16.8
          }
        },
        {
          id: 'corp-003',
          name: 'AI Defense Systems Corp',
          ticker: 'AIDF',
          industry: 'AI Security',
          sector: 'Technology',
          headquarters: 'Boston, MA',
          founded: 2020,
          employees: 950,
          marketCap: 5200000000,
          revenue: {
            gross: 890000000,
            net: 125000000,
            year: 2024,
            growth: 45.8
          },
          profitability: {
            grossProfit: 623000000,
            netProfit: 125000000,
            operatingIncome: 178000000,
            ebitda: 225000000,
            margins: {
              gross: 70.0,
              net: 14.0,
              operating: 20.0
            }
          },
          executiveCompensation: {
            ceo: {
              name: 'Dr. Amanda Foster',
              totalCompensation: 12800000,
              baseSalary: 800000,
              bonus: 2000000,
              stockOptions: 10000000
            },
            cfo: {
              name: 'Robert Chang',
              totalCompensation: 8500000,
              baseSalary: 650000,
              bonus: 1350000,
              stockOptions: 6500000
            }
          },
          cybersecuritySpending: {
            annual: 95000000,
            percentage: 10.7,
            categories: [
              { category: 'R&D', amount: 65000000, percentage: 68.4 },
              { category: 'Infrastructure', amount: 15000000, percentage: 15.8 },
              { category: 'Personnel', amount: 10000000, percentage: 10.5 },
              { category: 'Compliance', amount: 5000000, percentage: 5.3 }
            ]
          },
          fundraising: {
            totalRaised: 180000000,
            lastRound: {
              type: 'Series B',
              amount: 65000000,
              date: '2024-01-10',
              valuation: 2800000000,
              leadInvestor: 'Khosla Ventures'
            },
            investors: ['Khosla Ventures', 'Founders Fund', 'Data Collective', 'In-Q-Tel']
          },
          financialHealth: {
            debtToEquity: 0.08,
            currentRatio: 4.1,
            quickRatio: 3.5,
            returnOnEquity: 28.5,
            returnOnAssets: 21.2
          }
        }
      ]

      const mockMetrics: FundraiserMetrics = {
        totalCorporations: 3,
        totalMarketCap: 28700000000,
        totalRevenue: 5340000000,
        averageGrowth: 36.5,
        topPerformers: ['AI Defense Systems Corp', 'SecureCloud Enterprises', 'CyberTech Solutions Inc.'],
        cybersecurityMarket: 400000000
      }

      setCorporations(mockCorporations)
      setMetrics(mockMetrics)
      setLastUpdate(new Date().toISOString())
    } catch (error) {
      console.error('Failed to fetch financial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`
    }
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    return `$${(amount / 1000).toFixed(0)}K`
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`
  }

  const getGrowthColor = (growth: number) => {
    if (growth >= 30) return 'text-green-600'
    if (growth >= 15) return 'text-blue-600'
    if (growth >= 0) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Fundraiser Corporation Financials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      {metrics && (
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Corporation Financial Overview
                </CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchFinancialData}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-lg font-bold text-blue-600">{metrics.totalCorporations}</p>
                <p className="text-xs text-gray-500">Corporations</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-lg font-bold text-green-600">{formatCurrency(metrics.totalMarketCap)}</p>
                <p className="text-xs text-gray-500">Total Market Cap</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-lg font-bold text-purple-600">{formatCurrency(metrics.totalRevenue)}</p>
                <p className="text-xs text-gray-500">Total Revenue</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
                <p className="text-lg font-bold text-orange-600">{formatPercentage(metrics.averageGrowth)}</p>
                <p className="text-xs text-gray-500">Avg Growth</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Corporation Details */}
      <div className="space-y-4">
        {corporations.map((corp) => (
          <Card key={corp.id} className="bg-white border border-gray-100 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {corp.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{corp.name}</h3>
                    <div className="flex items-center gap-2">
                      {corp.ticker && (
                        <Badge variant="outline" className="text-xs">
                          {corp.ticker}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {corp.industry}
                      </Badge>
                      <span className="text-sm text-gray-500">{corp.headquarters}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCorp(selectedCorp === corp.id ? null : corp.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {selectedCorp === corp.id ? 'Hide Details' : 'View Details'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm font-bold text-blue-600">{formatCurrency(corp.marketCap)}</div>
                  <div className="text-xs text-gray-600">Market Cap</div>
                </div>
                
                <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-sm font-bold text-green-600">{formatCurrency(corp.revenue.gross)}</div>
                  <div className="text-xs text-gray-600">Gross Revenue</div>
                </div>
                
                <div className="text-center p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="text-sm font-bold text-purple-600">{formatCurrency(corp.revenue.net)}</div>
                  <div className="text-xs text-gray-600">Net Revenue</div>
                </div>
                
                <div className="text-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className={`text-sm font-bold ${getGrowthColor(corp.revenue.growth)}`}>
                    {formatPercentage(corp.revenue.growth)}
                  </div>
                  <div className="text-xs text-gray-600">Growth Rate</div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="text-sm font-bold text-gray-600">{formatNumber(corp.employees)}</div>
                  <div className="text-xs text-gray-600">Employees</div>
                </div>
                
                <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-sm font-bold text-red-600">{formatCurrency(corp.cybersecuritySpending.annual)}</div>
                  <div className="text-xs text-gray-600">Security Spend</div>
                </div>
              </div>

              {/* Executive Compensation */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  Executive Compensation
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">CEO - {corp.executiveCompensation.ceo.name}</span>
                      <Badge variant="outline" className="text-xs">Chief Executive</Badge>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Compensation:</span>
                        <span className="font-semibold">{formatCurrency(corp.executiveCompensation.ceo.totalCompensation)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Salary:</span>
                        <span className="font-medium">{formatCurrency(corp.executiveCompensation.ceo.baseSalary)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bonus:</span>
                        <span className="font-medium">{formatCurrency(corp.executiveCompensation.ceo.bonus)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stock Options:</span>
                        <span className="font-medium">{formatCurrency(corp.executiveCompensation.ceo.stockOptions)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">CFO - {corp.executiveCompensation.cfo.name}</span>
                      <Badge variant="outline" className="text-xs">Chief Financial</Badge>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Compensation:</span>
                        <span className="font-semibold">{formatCurrency(corp.executiveCompensation.cfo.totalCompensation)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Salary:</span>
                        <span className="font-medium">{formatCurrency(corp.executiveCompensation.cfo.baseSalary)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bonus:</span>
                        <span className="font-medium">{formatCurrency(corp.executiveCompensation.cfo.bonus)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stock Options:</span>
                        <span className="font-medium">{formatCurrency(corp.executiveCompensation.cfo.stockOptions)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedCorp === corp.id && (
                <div className="space-y-6 pt-4 border-t">
                  {/* Profitability Breakdown */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-green-600" />
                      Profitability Analysis
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="text-sm font-bold text-green-600">{formatCurrency(corp.profitability.grossProfit)}</div>
                        <div className="text-xs text-gray-600">Gross Profit</div>
                        <div className="text-xs text-green-600">{formatPercentage(corp.profitability.margins.gross)} margin</div>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-sm font-bold text-blue-600">{formatCurrency(corp.profitability.netProfit)}</div>
                        <div className="text-xs text-gray-600">Net Profit</div>
                        <div className="text-xs text-blue-600">{formatPercentage(corp.profitability.margins.net)} margin</div>
                      </div>
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="text-sm font-bold text-purple-600">{formatCurrency(corp.profitability.operatingIncome)}</div>
                        <div className="text-xs text-gray-600">Operating Income</div>
                        <div className="text-xs text-purple-600">{formatPercentage(corp.profitability.margins.operating)} margin</div>
                      </div>
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="text-sm font-bold text-orange-600">{formatCurrency(corp.profitability.ebitda)}</div>
                        <div className="text-xs text-gray-600">EBITDA</div>
                      </div>
                    </div>
                  </div>

                  {/* Cybersecurity Spending Breakdown */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4 text-red-600" />
                      Cybersecurity Investment Breakdown
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {corp.cybersecuritySpending.categories.map((category) => (
                        <div key={category.category} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="text-sm font-bold text-red-600">{formatCurrency(category.amount)}</div>
                          <div className="text-xs text-gray-600">{category.category}</div>
                          <div className="text-xs text-red-600">{formatPercentage(category.percentage)} of total</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Health Metrics */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-600" />
                      Financial Health Indicators
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                        <div className="text-sm font-bold text-yellow-600">{corp.financialHealth.debtToEquity.toFixed(2)}</div>
                        <div className="text-xs text-gray-600">Debt/Equity</div>
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                        <div className="text-sm font-bold text-yellow-600">{corp.financialHealth.currentRatio.toFixed(1)}</div>
                        <div className="text-xs text-gray-600">Current Ratio</div>
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                        <div className="text-sm font-bold text-yellow-600">{corp.financialHealth.quickRatio.toFixed(1)}</div>
                        <div className="text-xs text-gray-600">Quick Ratio</div>
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                        <div className="text-sm font-bold text-yellow-600">{formatPercentage(corp.financialHealth.returnOnEquity)}</div>
                        <div className="text-xs text-gray-600">ROE</div>
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                        <div className="text-sm font-bold text-yellow-600">{formatPercentage(corp.financialHealth.returnOnAssets)}</div>
                        <div className="text-xs text-gray-600">ROA</div>
                      </div>
                    </div>
                  </div>

                  {/* Fundraising History */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-indigo-600" />
                      Fundraising Information
                    </h4>
                    <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-2">Latest Round</div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Type:</span>
                              <span className="font-medium">{corp.fundraising.lastRound.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Amount:</span>
                              <span className="font-medium">{formatCurrency(corp.fundraising.lastRound.amount)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Valuation:</span>
                              <span className="font-medium">{formatCurrency(corp.fundraising.lastRound.valuation)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Lead Investor:</span>
                              <span className="font-medium">{corp.fundraising.lastRound.leadInvestor}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 mb-2">Total Raised: {formatCurrency(corp.fundraising.totalRaised)}</div>
                          <div className="text-xs text-gray-600 mb-2">Key Investors:</div>
                          <div className="flex flex-wrap gap-1">
                            {corp.fundraising.investors.map((investor) => (
                              <Badge key={investor} variant="outline" className="text-xs">
                                {investor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}