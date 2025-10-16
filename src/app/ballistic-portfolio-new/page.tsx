'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  TrendingUp, 
  DollarSign,
  Building2,
  MapPin,
  Calendar,
  Banknote,
  Users,
  Shield,
  Target,
  Award
} from 'lucide-react'
import TrendingFactorsCard from '@/components/trending/TrendingFactorsCard'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface PortfolioCompany {
  id: string
  name: string
  description: string
  sector: string
  location: string
  founded: string
  investmentStage: string
  currentValuation: string
  investmentAmount: string
  ownershipPercentage: string
  revenueGrowth: string
  lastRound: string
  latestDate: string
  icon: any
  color: string
}

export default function BallisticPortfolio() {
  // Portfolio companies data
  const companies: PortfolioCompany[] = [
    {
      id: 'veza',
      name: 'Veza Inc.',
      description: 'Authorization platform providing visibility and control over data permissions across cloud services. Unified identity security helping enterprises manage 500K+ identities with real-time access intelligence and automated remediation.',
      sector: 'Authorization',
      location: 'Los Altos, USA',
      founded: '2020',
      investmentStage: 'Series C',
      currentValuation: '$285M',
      investmentAmount: '$110M',
      ownershipPercentage: '18.5%',
      revenueGrowth: '+245%',
      lastRound: 'Series C - $75M',
      latestDate: 'Jan 15, 2024',
      icon: Shield,
      color: 'from-blue-50 to-blue-100'
    },
    {
      id: 'concentric',
      name: 'Concentric AI',
      description: 'AI-powered data security platform discovering and protecting sensitive information. Deep learning classification engine securing 10PB+ data across enterprises with autonomous data protection and risk scoring.',
      sector: 'Data Protection',
      location: 'San Jose, USA',
      founded: '2018',
      investmentStage: 'Series B',
      currentValuation: '$198M',
      investmentAmount: '$52M',
      ownershipPercentage: '22.3%',
      revenueGrowth: '+210%',
      lastRound: 'Series B - $45M',
      latestDate: 'Mar 22, 2024',
      icon: Target,
      color: 'from-green-50 to-green-100'
    },
    {
      id: 'pangea',
      name: 'Pangea Cyber',
      description: 'Security services platform offering API-first security building blocks. Developers trust Pangea for file scanning, redaction, and authentication services processing 100M+ API calls monthly.',
      sector: 'Application Security',
      location: 'Palo Alto, USA',
      founded: '2021',
      investmentStage: 'Series A',
      currentValuation: '$156M',
      investmentAmount: '$35M',
      ownershipPercentage: '25.8%',
      revenueGrowth: '+180%',
      lastRound: 'Series A - $25M',
      latestDate: 'Feb 10, 2024',
      icon: Building2,
      color: 'from-purple-50 to-purple-100'
    },
    {
      id: 'armis',
      name: 'Armis Security',
      description: 'Asset intelligence platform providing visibility into all managed and unmanaged devices. Protecting critical infrastructure by monitoring 3B+ devices globally with real-time threat detection.',
      sector: 'Device Security',
      location: 'Palo Alto, USA',
      founded: '2015',
      investmentStage: 'Series D',
      currentValuation: '$142M',
      investmentAmount: '$65M',
      ownershipPercentage: '15.2%',
      revenueGrowth: '+195%',
      lastRound: 'Series D - $125M',
      latestDate: 'Apr 5, 2024',
      icon: Award,
      color: 'from-orange-50 to-orange-100'
    },
    {
      id: 'nudge',
      name: 'Nudge Security',
      description: 'SaaS security solution discovering shadow IT and managing application sprawl. Continuous discovery platform helping IT teams govern 200+ SaaS apps per organization with automated workflows.',
      sector: 'Application Security',
      location: 'San Francisco, USA',
      founded: '2022',
      investmentStage: 'Series A',
      currentValuation: '$85M',
      investmentAmount: '$22M',
      ownershipPercentage: '28.5%',
      revenueGrowth: '+320%',
      lastRound: 'Series A - $15M',
      latestDate: 'May 18, 2024',
      icon: Users,
      color: 'from-indigo-50 to-indigo-100'
    },
    {
      id: 'talon',
      name: 'Talon Cyber Security',
      description: 'Enterprise browser security platform isolating threats while enabling seamless user experience. Securing workforce browsers with zero-trust architecture protecting 50K+ enterprise users.',
      sector: 'Application Security',
      location: 'Santa Monica, USA',
      founded: '2021',
      investmentStage: 'Series B',
      currentValuation: '$124M',
      investmentAmount: '$38M',
      ownershipPercentage: '20.1%',
      revenueGrowth: '+265%',
      lastRound: 'Series B - $26M',
      latestDate: 'Jun 12, 2024',
      icon: Shield,
      color: 'from-red-50 to-red-100'
    }
  ]

  // Chart data
  const portfolioGrowthData = [
    { quarter: 'Q1 2023', value: 680 },
    { quarter: 'Q2 2023', value: 785 },
    { quarter: 'Q3 2023', value: 920 },
    { quarter: 'Q4 2023', value: 1050 },
    { quarter: 'Q1 2024', value: 1150 },
    { quarter: 'Q2 2024', value: 1200 }
  ]

  const performanceData = [
    { company: 'Veza', growth: 245 },
    { company: 'Nudge', growth: 320 },
    { company: 'Talon', growth: 265 },
    { company: 'Concentric', growth: 210 },
    { company: 'Pangea', growth: 180 },
    { company: 'Armis', growth: 195 }
  ]

  const stageDistribution = [
    { stage: 'Seed', count: 0, value: 0 },
    { stage: 'Series A', count: 2, value: 241 },
    { stage: 'Series B', count: 2, value: 322 },
    { stage: 'Series C', count: 1, value: 285 },
    { stage: 'Series D', count: 1, value: 142 }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Portfolio Intelligence</h1>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar Navigation */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4 space-y-6">
            {/* Navigation Buttons */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Navigation</h3>
              <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                📊 Portfolio Overview
              </Button>
              <Button variant="outline" className="w-full justify-start">
                📈 Performance
              </Button>
              <Button variant="outline" className="w-full justify-start">
                📄 Exit Pipeline
              </Button>
            </div>

            {/* Region Filter */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Region</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start text-sm text-blue-600 bg-blue-50 hover:bg-blue-100">
                  All Regions ✓
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm text-gray-700 hover:bg-gray-100">
                  USA
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm text-gray-700 hover:bg-gray-100">
                  Canada
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm text-gray-700 hover:bg-gray-100">
                  Israel
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm text-gray-700 hover:bg-gray-100">
                  Europe
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm text-gray-700 hover:bg-gray-100">
                  Asia Pacific
                </Button>
              </div>
            </div>

            {/* Investment Stage Filter */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Investment Stage</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start text-sm text-blue-600 bg-blue-50 hover:bg-blue-100">
                  All Stages ✓
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm text-gray-700 hover:bg-gray-100">
                  Pre-Seed
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm text-gray-700 hover:bg-gray-100">
                  Seed
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm text-gray-700 hover:bg-gray-100">
                  Series A
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm text-gray-700 hover:bg-gray-100">
                  Series B
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm text-gray-700 hover:bg-gray-100">
                  Series C
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm text-gray-700 hover:bg-gray-100">
                  Series D+
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm text-gray-700 hover:bg-gray-100">
                  IPO
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-all bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <DollarSign className="h-8 w-8 text-blue-600" />
                      <Badge className="bg-blue-200 text-blue-800 px-2 py-1 text-xs">Portfolio</Badge>
                    </div>
                    <CardTitle className="text-2xl mt-4 text-blue-900">$1.2B</CardTitle>
                    <CardDescription className="text-blue-700 text-sm">Total Portfolio Value</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>6 companies</span>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                    Portfolio Value Growth
                  </DialogTitle>
                </DialogHeader>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={portfolioGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-all bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <TrendingUp className="h-8 w-8 text-green-600" />
                      <Badge className="bg-green-200 text-green-800 px-2 py-1 text-xs">Growth</Badge>
                    </div>
                    <CardTitle className="text-2xl mt-4 text-green-900">+235%</CardTitle>
                    <CardDescription className="text-green-700 text-sm">Avg Revenue Growth</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>Year over year</span>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                    Company Performance
                  </DialogTitle>
                </DialogHeader>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="company" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="growth" fill="#16a34a" />
                  </BarChart>
                </ResponsiveContainer>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-lg transition-all bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Banknote className="h-8 w-8 text-purple-600" />
                      <Badge className="bg-purple-200 text-purple-800 px-2 py-1 text-xs">Invested</Badge>
                    </div>
                    <CardTitle className="text-2xl mt-4 text-purple-900">$322M</CardTitle>
                    <CardDescription className="text-purple-700 text-sm">Total Capital Deployed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-purple-600">
                      <DollarSign className="h-4 w-4" />
                      <span>3.7x MOIC</span>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Banknote className="h-6 w-6 text-purple-600" />
                    Investment by Stage
                  </DialogTitle>
                </DialogHeader>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stageDistribution} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="stage" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#9333ea" />
                  </BarChart>
                </ResponsiveContainer>
              </DialogContent>
            </Dialog>
          </div>

          {/* Company Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {companies.map((company) => {
              const Icon = company.icon
              return (
                <Card key={company.id} className="hover:shadow-lg transition-all bg-white border-2 border-gray-100">
                  <CardHeader className="pb-4">
                    <CardDescription className="text-sm text-gray-600 leading-relaxed mb-4">
                      {company.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Sector:</span>
                      <span className="text-sm font-bold text-gray-900">{company.sector}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Location:</span>
                      <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {company.location}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Founded:</span>
                      <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {company.founded}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Stage:</span>
                      <span className="text-sm font-medium text-blue-600 flex items-center gap-1">
                        {company.investmentStage}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm text-gray-500">Current Valuation:</span>
                      <span className="text-lg font-bold text-gray-900">{company.currentValuation}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Our Investment:</span>
                      <span className="text-sm font-semibold text-gray-900">{company.investmentAmount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Ownership:</span>
                      <span className="text-sm font-medium text-gray-900">{company.ownershipPercentage}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4">
                      <span className="text-sm text-gray-500">Revenue Growth:</span>
                      <span className="text-sm font-bold text-green-600">{company.revenueGrowth}</span>
                    </div>
                    
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-5"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button variant="outline" className="text-gray-600">Previous</Button>
            <Button className="bg-blue-600 text-white w-10 h-10">1</Button>
            <Button variant="outline" className="w-10 h-10">2</Button>
            <Button variant="outline" className="text-gray-600">Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
