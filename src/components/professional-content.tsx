"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  Brain, 
  Target, 
  Shield, 
  Globe,
  Users,
  Award,
  Zap,
  Rocket,
  Eye,
  Clock,
  Lightbulb,
  Database,
  BarChart3,
  Activity
} from 'lucide-react'

export function ProfessionalHeroSection() {
  return (
    <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white rounded-2xl p-8 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Ballistic Intelligence Platform</h1>
          <p className="text-blue-100 text-lg">
            Advanced cybersecurity investment intelligence powered by AI and machine learning
          </p>
          <div className="flex items-center gap-4 mt-4">
            <Badge className="bg-blue-600 text-blue-100 border-blue-500">
              <Shield className="h-3 w-3 mr-1" />
              Enterprise Grade
            </Badge>
            <Badge className="bg-emerald-600 text-emerald-100 border-emerald-500">
              <Brain className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
            <Badge className="bg-purple-600 text-purple-100 border-purple-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              Real-Time
            </Badge>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">99.9%</div>
              <div className="text-sm text-blue-100">Platform Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProfessionalMetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color, 
  bgColor, 
  trend,
  description 
}: {
  title: string
  value: string
  subtitle: string
  icon: any
  color: string
  bgColor: string
  trend?: string
  description?: string
}) {
  return (
    <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${bgColor} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          {trend && (
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              {trend}
            </Badge>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${color} mb-1`}>
            {value}
          </p>
          <p className="text-xs text-slate-500 mb-2">
            {subtitle}
          </p>
          {description && (
            <p className="text-xs text-slate-400 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function ProfessionalFeatureCard({ 
  title, 
  description, 
  icon: Icon, 
  color, 
  bgColor,
  badges,
  buttonText,
  onButtonClick 
}: {
  title: string
  description: string
  icon: any
  color: string
  bgColor: string
  badges?: string[]
  buttonText?: string
  onButtonClick?: () => void
}) {
  return (
    <Card className="border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 group">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
          <div className={`p-3 rounded-xl ${bgColor} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-600 mb-4 leading-relaxed">
          {description}
        </p>
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {badges.map((badge, index) => (
              <Badge key={index} variant="outline" className="text-xs border-slate-300 text-slate-700">
                {badge}
              </Badge>
            ))}
          </div>
        )}
        {buttonText && onButtonClick && (
          <Button 
            onClick={onButtonClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            {buttonText}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export function ProfessionalActivityCard({ activities }: { activities: any[] }) {
  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Activity className="h-5 w-5 text-blue-600" />
          </div>
          Intelligence Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'investment' ? 'bg-emerald-100' :
                  activity.type === 'threat' ? 'bg-red-100' :
                  'bg-blue-100'
                }`}>
                  {activity.type === 'investment' && <Rocket className="h-4 w-4 text-emerald-600" />}
                  {activity.type === 'threat' && <Shield className="h-4 w-4 text-red-600" />}
                  {activity.type === 'conference' && <Award className="h-4 w-4 text-blue-600" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                  <p className="text-xs text-slate-600">{activity.subtitle}</p>
                </div>
              </div>
              <Badge className={`${
                activity.type === 'investment' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                activity.type === 'threat' ? 'bg-red-100 text-red-700 border-red-200' :
                'bg-blue-100 text-blue-700 border-blue-200'
              }`}>
                {activity.value}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ProfessionalInsightCard({ 
  title, 
  insights, 
  icon: Icon 
}: { 
  title: string
  insights: string[]
  icon: any 
}) {
  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Icon className="h-5 w-5 text-purple-600" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-slate-700 leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ProfessionalStatsGrid({ stats }: { stats: { label: string; value: string; change: string }[] }) {
  return (
    <div className="grid grid-cols-3 gap-3 text-center">
      {stats.map((stat, index) => (
        <div key={index} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="text-lg font-bold text-slate-900">{stat.value}</div>
          <div className="text-xs text-slate-600 mb-1">{stat.label}</div>
          <div className={`text-xs font-medium ${
            stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {stat.change}
          </div>
        </div>
      ))}
    </div>
  )
}

export function ProfessionalCallToAction({ 
  title, 
  description, 
  buttonText, 
  onButtonClick 
}: { 
  title: string
  description: string
  buttonText: string
  onButtonClick: () => void 
}) {
  return (
    <Card className="border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm">
      <CardContent className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-600 mb-4">{description}</p>
          <Button 
            onClick={onButtonClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            {buttonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}