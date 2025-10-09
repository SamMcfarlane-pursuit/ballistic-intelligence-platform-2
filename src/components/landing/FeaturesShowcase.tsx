'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Shield, 
  FileText, 
  BarChart3, 
  Calendar,
  CheckCircle,
  Brain,
  Zap,
  Target,
  Lock,
  Globe,
  Users
} from 'lucide-react'

const intelligenceDomains = [
  {
    title: 'Investment Intelligence',
    description: 'Comprehensive funding analysis, investor networks, and market valuations',
    icon: TrendingUp,
    sources: 7,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'from-green-50 to-emerald-50',
    textColor: 'text-green-800',
    features: [
      'Crunchbase API & SEC EDGAR',
      'Real-time funding rounds',
      'Investor network mapping',
      'Market valuation analysis'
    ]
  },
  {
    title: 'Threat Intelligence',
    description: 'Real-time threats, vulnerabilities, and MITRE ATT&CK framework',
    icon: Shield,
    sources: 8,
    color: 'from-red-500 to-rose-600',
    bgColor: 'from-red-50 to-rose-50',
    textColor: 'text-red-800',
    features: [
      'MISP & CISA KEV Catalog',
      'MITRE ATT&CK techniques',
      'Real-time threat feeds',
      'Vulnerability tracking'
    ]
  },
  {
    title: 'Patent Intelligence',
    description: 'Innovation trends, IP analysis, and research datasets',
    icon: FileText,
    sources: 3,
    color: 'from-purple-500 to-violet-600',
    bgColor: 'from-purple-50 to-violet-50',
    textColor: 'text-purple-800',
    features: [
      'USPTO & Google Patents',
      'Research datasets',
      'Innovation tracking',
      'IP portfolio analysis'
    ]
  },
  {
    title: 'Market Intelligence',
    description: 'Industry reports, analyst insights, and macro trends',
    icon: BarChart3,
    sources: 7,
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'from-blue-50 to-cyan-50',
    textColor: 'text-blue-800',
    features: [
      'ACS Global Reports',
      'Industry statistics',
      'Market analysis',
      'Analyst insights'
    ]
  },
  {
    title: 'Conference Intelligence',
    description: 'Startup showcases, investor activities, and event tracking',
    icon: Calendar,
    sources: 8,
    color: 'from-orange-500 to-amber-600',
    bgColor: 'from-orange-50 to-amber-50',
    textColor: 'text-orange-800',
    features: [
      'DEF CON & Black Hat',
      'RSA & Gartner events',
      'Startup showcases',
      'Investor activities'
    ]
  }
]

const platformCapabilities = [
  {
    title: 'AI-Powered Correlation',
    description: 'Cross-domain intelligence correlation across all five intelligence types',
    icon: Brain,
    color: 'from-blue-500 to-indigo-600'
  },
  {
    title: 'Real-time Updates',
    description: 'Live data synchronization from 33 authoritative sources',
    icon: Zap,
    color: 'from-green-500 to-emerald-600'
  },
  {
    title: 'Predictive Analytics',
    description: 'Advanced forecasting for market opportunities and threat evolution',
    icon: Target,
    color: 'from-purple-500 to-violet-600'
  },
  {
    title: 'Enterprise Security',
    description: 'Bank-grade security with comprehensive access controls',
    icon: Lock,
    color: 'from-red-500 to-rose-600'
  },
  {
    title: 'Global Coverage',
    description: 'Worldwide intelligence gathering from US, Europe, and Asia-Pacific',
    icon: Globe,
    color: 'from-orange-500 to-amber-600'
  },
  {
    title: 'Multi-Role Support',
    description: 'Customized views for investors, analysts, researchers, and executives',
    icon: Users,
    color: 'from-cyan-500 to-blue-600'
  }
]

export function FeaturesShowcase() {
  return (
    <>
      {/* Intelligence Domains Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200">
              Five Intelligence Domains
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Intelligence Coverage
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Unparalleled insights across all aspects of cybersecurity intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {intelligenceDomains.map((domain, index) => {
              const IconComponent = domain.icon
              return (
                <Card 
                  key={index}
                  className={`group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br ${domain.bgColor} hover:scale-105 transform`}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${domain.color} rounded-xl shadow-lg`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className={`${domain.textColor} text-lg`}>
                          {domain.title}
                        </CardTitle>
                        <CardDescription className="font-medium">
                          {domain.sources} Sources
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {domain.description}
                    </p>
                    <div className="space-y-2">
                      {domain.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-xs text-gray-600">
                          <CheckCircle className={`h-3 w-3 mr-2 ${domain.textColor.replace('text-', 'text-').replace('-800', '-500')}`} />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Platform Capabilities Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200">
              Advanced Capabilities
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Platform Features
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Cutting-edge technology for comprehensive intelligence analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformCapabilities.map((capability, index) => {
              const IconComponent = capability.icon
              return (
                <div 
                  key={index}
                  className="text-center group hover:scale-105 transform transition-all duration-300"
                >
                  <div className={`flex items-center justify-center w-20 h-20 bg-gradient-to-br ${capability.color} rounded-2xl mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-shadow duration-300`}>
                    <IconComponent className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {capability.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {capability.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}