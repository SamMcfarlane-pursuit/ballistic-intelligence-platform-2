'use client'

import { ExecutiveLayout } from '@/components/layouts/ExecutiveLayout'
import DataSourcesManager from '@/components/data/DataSourcesManager'

export default function DataSourcesPage() {
  return (
    <ExecutiveLayout>
      <div className="container mx-auto px-4 py-8">
        <DataSourcesManager />
      </div>
    </ExecutiveLayout>
  )
}