'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ExecutiveLayout } from '@/components/layouts/ExecutiveLayout'
import { 
  TrendingUp, 
  Shield, 
  DollarSign,
  Building2,
  RefreshCw,
  MapPin,
  Calendar,
  Banknote,
  Users
} from 'lucide-react'
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

interface CompanyMetric {
  id: string
  name: string
  description: string
  sector: string
  location: string
  founded: string
  fundingFrom: string
  totalFunding: string
  lastRound: string
  latestDate: string
  icon: any
  color: string
}

export default function ExecutiveDashboardNew() {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Portfolio companies data
  const companies: CompanyMetric[] = [
    {
      id: 'shieldtech',
      name: 'ShieldTech',
      description: 'AI-powered network security platform specializing in real-time intrusion detection. Recognized for their proprietary behavioral analysis engine achieving 99.7% accuracy in detecting zero-day attacks, processing 10B+ network events daily for Fortune 500 clients.',
      sector: 'Network Security',
      location: 'San Francisco, USA',
      founded: '2019',
      fundingFrom: 'Ballistic Ventures',
      totalFunding: '$45.0M',
      lastRound: 'Series B - $25.0M',
      latestDate: 'Sep 15, 2025',
      icon: Shield,
      color: 'from-blue-50 to-blue-100'
    },
    {
      id: 'cryptoguard',
      name: 'CryptoGuard',
      description: 'Post-quantum cryptography solutions future-proofing enterprise data security. Industry leader in lattice-based encryption algorithms, partnered with NIST to develop quantum-resistant standards for financial institutions and government agencies.',
      sector: 'Encryption',
      location: 'New York, USA',
      founded: '2020',
      fundingFrom: 'CyberForge Capital',
      totalFunding: '$38.0M',
      lastRound: 'Series A - $18.0M',
      latestDate: 'Sep 8, 2025',
      icon: Building2,
      color: 'from-purple-50 to-purple-100'
    },
    {
      id: 'threatvision',
      name: 'ThreatVision',
      description: 'Real-time threat intelligence platform with predictive ML capabilities. Known for accurately forecasting attack vectors 72 hours in advance by aggregating data from 50,000+ global honeypots and dark web sources.',
      sector: 'Threat Intelligence',
      location: 'Boston, USA',
      founded: '2021',
      fundingFrom: 'Ballistic Ventures',
      totalFunding: '$22.0M',
      lastRound: 'Series A - $15.0M',
      latestDate: 'Sep 1, 2025',
      icon: TrendingUp,
      color: 'from-green-50 to-green-100'
    }
  ]

  // Chart data for each metric
  const portfolioGrowthData = [
    { month: 'Jan', value: 850 },
    { month: 'Feb', value: 920 },
    { month: 'Mar', value: 1050 },
    { month: 'Apr', value: 1150 },
    { month: 'May', value: 1200 },
    { month: 'Jun', value: 1200 }
  ]

  const securityData = [
    { metric: 'Active Systems', value: 100 },
    { metric: 'Threat Detection', value: 98.7 },
    { metric: 'Data Protection', value: 100 },
    { metric: 'API Health', value: 97.7 }
  ]

  const fundingData = [
    { company: 'ShieldTech', amount: 45 },
    { company: 'CryptoGuard', amount: 38 },
    { company: 'ThreatVision', amount: 22 }
  ]

  return (
    <ExecutiveLayout>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ball-Intel</h1>
              <p className="text-sm text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex gap-4">
              <Button 
                variant="default"
                className="bg-blue-600 hover:bg-blue-700"
              >
                📊 Market Intelligence
              </Button>
              <Button variant="outline">
                📈 Trending Sectors
              </Button>
              <Button variant="outline">
                📄 Patent Deep Dive
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Portfolio Value Card */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className={`cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <DollarSign className="h-8 w-8 text-blue-600" />
                    <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                      Portfolio
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl mt-4 text-blue-900">$1.2B</CardTitle>
                  <CardDescription className="text-blue-700">
                    Total Portfolio Value
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>+12.5% vs last month</span>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                  Portfolio Growth Trend
                </DialogTitle>
              </DialogHeader>
              <div className="mt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={portfolioGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </DialogContent>
          </Dialog>

          {/* System Health Card */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className={`cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-gradient-to-br from-green-50 to-green-100 border-green-200`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Shield className="h-8 w-8 text-green-600" />
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      Security
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl mt-4 text-green-900">98.7%</CardTitle>
                  <CardDescription className="text-green-700">
                    System Health
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Shield className="h-4 w-4" />
                    <span>All systems operational</span>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Shield className="h-6 w-6 text-green-600" />
                  Security Health Metrics
                </DialogTitle>
              </DialogHeader>
              <div className="mt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={securityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#16a34a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </DialogContent>
          </Dialog>

          {/* Total Funding Card */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className={`cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Banknote className="h-8 w-8 text-purple-600" />
                    <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                      Funding
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl mt-4 text-purple-900">$105M</CardTitle>
                  <CardDescription className="text-purple-700">
                    Total Funding Deployed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-purple-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>3 active investments</span>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Banknote className="h-6 w-6 text-purple-600" />
                  Funding Distribution
                </DialogTitle>
              </DialogHeader>
              <div className="mt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={fundingData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="company" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#9333ea" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Company Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => {
            const Icon = company.icon
            return (
              <Card key={company.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 bg-gradient-to-br ${company.color} rounded-lg`}>
                      <Icon className="h-6 w-6 text-gray-700" />
                    </div>
                    <CardTitle className="text-xl">{company.name}</CardTitle>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    {company.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sector:</span>
                    <Badge variant="outline">{company.sector}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Location:</span>
                    <span className="text-sm flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {company.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Founded:</span>
                    <span className="text-sm flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {company.founded}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Funding From:</span>
                    <span className="text-sm flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {company.fundingFrom}
                    </span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Total Funding:</span>
                      <span className="text-lg font-bold text-gray-900">{company.totalFunding}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last Round:</span>
                      <span className="font-medium">{company.lastRound}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-600">Latest Date of Funding:</span>
                      <span className="font-medium">{company.latestDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Filter Sidebar (matching the image) */}
        <div className="fixed left-0 top-32 bg-gray-50 border-r w-64 p-4 space-y-6 hidden lg:block">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">SECTOR</h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-sm text-blue-600">
                All Sectors ✓
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                Network Security
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                Cloud Security
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                Data Protection
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                Identity Management
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                Threat Intelligence
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                Endpoint Security
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                Encryption
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                Email Security
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">REGION</h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-sm text-blue-600">
                All Regions ✓
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                Canada
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                Israel
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                USA
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">FUNDING STAGE</h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-sm text-blue-600">
                All Stages ✓
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                Seed
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                Series A
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ExecutiveLayout>
  )
}
