'use client'

import { ExecutiveNavigation } from '@/components/navigation/ExecutiveNavigation'

interface ExecutiveLayoutProps {
  children: React.ReactNode
}

export function ExecutiveLayout({ children }: ExecutiveLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ExecutiveNavigation />
      <main className="flex-1 lg:ml-64">
        {children}
      </main>
    </div>
  )
}