"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Shield, 
  Database, 
  Network, 
  Brain,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'

interface LoadingStep {
  id: string
  title: string
  description: string
  icon: any
  status: 'pending' | 'loading' | 'completed' | 'error'
}

export function EnhancedLoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<LoadingStep[]>([
    {
      id: 'auth',
      title: 'Authentication',
      description: 'Verifying secure access credentials',
      icon: Shield,
      status: 'pending'
    },
    {
      id: 'database',
      title: 'Database Connection',
      description: 'Establishing secure data pipeline',
      icon: Database,
      status: 'pending'
    },
    {
      id: 'network',
      title: 'Network Intelligence',
      description: 'Connecting to threat intelligence feeds',
      icon: Network,
      status: 'pending'
    },
    {
      id: 'ai',
      title: 'AI Systems',
      description: 'Initializing analysis engines',
      icon: Brain,
      status: 'pending'
    }
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setSteps(prev => prev.map((step, index) => ({
          ...step,
          status: index === currentStep ? 'loading' : 
                  index < currentStep ? 'completed' : 'pending'
        })))
        
        if (currentStep < steps.length - 1) {
          setTimeout(() => setCurrentStep(prev => prev + 1), 1500)
        } else {
          clearInterval(interval)
        }
      }
    }, 800)

    return () => clearInterval(interval)
  }, [currentStep, steps.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Main Loading Card */}
        <Card className="border border-slate-200 bg-white shadow-xl">
          <CardContent className="p-8">
            {/* Logo and Title */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Ballistic Intelligence</h1>
              <p className="text-slate-600">Initializing advanced cybersecurity platform</p>
            </div>

            {/* Progress Steps */}
            <div className="space-y-4 mb-6">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {step.status === 'pending' && (
                      <div className="w-8 h-8 rounded-full border-2 border-slate-300 bg-slate-50 flex items-center justify-center">
                        <step.icon className="h-4 w-4 text-slate-400" />
                      </div>
                    )}
                    {step.status === 'loading' && (
                      <div className="w-8 h-8 rounded-full border-2 border-blue-600 bg-blue-50 flex items-center justify-center animate-pulse">
                        <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                      </div>
                    )}
                    {step.status === 'completed' && (
                      <div className="w-8 h-8 rounded-full border-2 border-emerald-600 bg-emerald-50 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      </div>
                    )}
                    {step.status === 'error' && (
                      <div className="w-8 h-8 rounded-full border-2 border-red-600 bg-red-50 flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${
                      step.status === 'completed' ? 'text-emerald-700' :
                      step.status === 'loading' ? 'text-blue-700' :
                      step.status === 'error' ? 'text-red-700' :
                      'text-slate-700'
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm ${
                      step.status === 'completed' ? 'text-emerald-600' :
                      step.status === 'loading' ? 'text-blue-600' :
                      step.status === 'error' ? 'text-red-600' :
                      'text-slate-500'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Overall Progress */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">Overall Progress</span>
                <span className="text-sm text-slate-600">
                  {Math.round((currentStep / steps.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Message */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-600">
            {currentStep < steps.length ? 'Preparing your intelligence workspace...' : 'Ready to launch'}
          </p>
        </div>
      </div>
    </div>
  )
}

export function MetricCardSkeleton() {
  return (
    <Card className="border border-slate-200 bg-white">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ActivityFeedSkeleton() {
  return (
    <Card className="border border-slate-200 bg-white">
      <CardContent className="p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ChartSkeleton() {
  return (
    <Card className="border border-slate-200 bg-white">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}