'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  TrendingUp, 
  FileText,
  Calendar,
  BarChart3,
  ArrowRight,
  Rocket,
  Zap,
  Globe,
  Users
} from 'lucide-react'

interface AnimatedCounterProps {
  end: number
  duration?: number
  suffix?: string
}

function AnimatedCounter({ end, duration = 2000, suffix = '' }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration])

  return <span>{count.toLocaleString()}{suffix}</span>
}

export function HeroSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 px-4 py-2">
            <Zap className="w-4 h-4 mr-2" />
            World's Most Comprehensive Intelligence Platform
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Quadruple Intelligence
            </span>
            <br />
            <span className="text-gray-900">Ecosystem</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            The ultimate cybersecurity intelligence platform combining{' '}
            <strong className="text-green-600">Investment</strong>,{' '}
            <strong className="text-red-600">Threat</strong>,{' '}
            <strong className="text-purple-600">Patent</strong>,{' '}
            <strong className="text-blue-600">Market</strong>, and{' '}
            <strong className="text-orange-600">Conference</strong>{' '}
            intelligence for unparalleled strategic insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4 h-auto">
                <Rocket className="mr-2 h-5 w-5" />
                Launch Platform
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-gray-300 text-lg px-8 py-4 h-auto hover:bg-gray-50">
              <FileText className="mr-2 h-5 w-5" />
              View Documentation
            </Button>
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-16">
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
              <AnimatedCounter end={33} />
            </div>
            <div className="text-sm md:text-base text-gray-600 font-medium">Data Sources</div>
          </div>
          
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
              <AnimatedCounter end={1247} />
            </div>
            <div className="text-sm md:text-base text-gray-600 font-medium">Companies</div>
          </div>
          
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
            <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
              <AnimatedCounter end={15} />
              <span className="text-2xl">K+</span>
            </div>
            <div className="text-sm md:text-base text-gray-600 font-medium">Threats</div>
          </div>
          
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
              <AnimatedCounter end={8950} />
            </div>
            <div className="text-sm md:text-base text-gray-600 font-medium">Patents</div>
          </div>
          
          <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg col-span-2 md:col-span-1">
            <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
              <AnimatedCounter end={8} />
            </div>
            <div className="text-sm md:text-base text-gray-600 font-medium">Conferences</div>
          </div>
        </div>

        {/* Intelligence Domain Icons */}
        <div className="flex flex-wrap justify-center items-center gap-8 mb-16">
          <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 shadow-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-gray-800">Investment</span>
          </div>
          
          <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 shadow-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-full">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-gray-800">Threat</span>
          </div>
          
          <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 shadow-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-gray-800">Patent</span>
          </div>
          
          <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 shadow-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-gray-800">Market</span>
          </div>
          
          <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 shadow-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-gray-800">Conference</span>
          </div>
        </div>

        {/* Key Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/20">
            <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Coverage</h3>
            <p className="text-gray-600 text-sm">Worldwide intelligence from US, Europe, and Asia-Pacific</p>
          </div>
          
          <div className="text-center p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/20">
            <Zap className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Updates</h3>
            <p className="text-gray-600 text-sm">Live synchronization from 33 authoritative sources</p>
          </div>
          
          <div className="text-center p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/20">
            <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Role Support</h3>
            <p className="text-gray-600 text-sm">Customized views for investors, analysts, and executives</p>
          </div>
        </div>
      </div>
    </section>
  )
}