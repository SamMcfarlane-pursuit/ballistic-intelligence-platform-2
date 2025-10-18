/**
 * BrightData API Routes
 * 
 * Provides API endpoints for BrightData proxy, web unlocker, and dataset services
 * with comprehensive rate limiting, error handling, and logging.
 */

import { NextRequest, NextResponse } from 'next/server'
import { brightDataService } from '@/services/brightdata-service'
import type {
  ProxyRequest,
  DatasetRequest,
  WebUnlockerRequest,
  CompanyDataEnrichment
} from '@/services/brightdata-service'

// ============================================================================
// Rate Limiting Middleware
// ============================================================================

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(identifier: string, limit: number = 60): boolean {
  const now = Date.now()
  const userLimit = rateLimitMap.get(identifier)

  if (!userLimit || now > userLimit.resetAt) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + 60000 // Reset after 1 minute
    })
    return true
  }

  if (userLimit.count >= limit) {
    return false
  }

  userLimit.count++
  return true
}

function getRateLimitHeaders(identifier: string) {
  const userLimit = rateLimitMap.get(identifier)
  if (!userLimit) {
    return {
      'X-RateLimit-Limit': '60',
      'X-RateLimit-Remaining': '60',
      'X-RateLimit-Reset': String(Date.now() + 60000)
    }
  }

  return {
    'X-RateLimit-Limit': '60',
    'X-RateLimit-Remaining': String(Math.max(0, 60 - userLimit.count)),
    'X-RateLimit-Reset': String(userLimit.resetAt)
  }
}

// ============================================================================
// Logging Utility
// ============================================================================

function logRequest(action: string, params: any, result: any, duration: number) {
  const log = {
    timestamp: new Date().toISOString(),
    action,
    params: JSON.stringify(params).substring(0, 200),
    success: result.success || false,
    duration,
    error: result.error || null
  }

  console.log('[BrightData API]', log)
}

// ============================================================================
// GET Handler - Multiple Actions
// ============================================================================

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action') || 'health'
  
  // Get client identifier for rate limiting
  const clientIp = request.headers.get('x-forwarded-for') || 'unknown'
  
  // Check rate limit
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Rate limit exceeded. Please try again later.',
        rateLimitInfo: getRateLimitHeaders(clientIp)
      },
      { 
        status: 429,
        headers: getRateLimitHeaders(clientIp)
      }
    )
  }

  try {
    let result: any

    switch (action) {
      case 'health':
        result = await handleHealthCheck()
        break

      case 'proxy':
        result = await handleProxyRequest(searchParams)
        break

      case 'unlocker':
        result = await handleWebUnlocker(searchParams)
        break

      case 'dataset':
        result = await handleDatasetCollection(searchParams)
        break

      case 'enrich':
        result = await handleCompanyEnrichment(searchParams)
        break

      case 'cybersecurity-intel':
        result = await handleCybersecurityIntel(searchParams)
        break

      case 'funding-monitor':
        result = await handleFundingMonitor(searchParams)
        break

      case 'metrics':
        result = await handleGetMetrics()
        break

      case 'rate-limit-info':
        result = await handleRateLimitInfo(searchParams)
        break

      default:
        result = {
          success: false,
          error: `Unknown action: ${action}`,
          availableActions: [
            'health', 'proxy', 'unlocker', 'dataset', 'enrich',
            'cybersecurity-intel', 'funding-monitor', 'metrics', 'rate-limit-info'
          ]
        }
    }

    const duration = Date.now() - startTime
    logRequest(action, Object.fromEntries(searchParams), result, duration)

    return NextResponse.json(
      {
        ...result,
        timestamp: new Date().toISOString(),
        processingTime: duration
      },
      {
        headers: getRateLimitHeaders(clientIp)
      }
    )

  } catch (error) {
    const duration = Date.now() - startTime
    const errorResult = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }

    logRequest(action, Object.fromEntries(searchParams), errorResult, duration)

    return NextResponse.json(
      {
        ...errorResult,
        timestamp: new Date().toISOString(),
        processingTime: duration
      },
      { 
        status: 500,
        headers: getRateLimitHeaders(clientIp)
      }
    )
  }
}

// ============================================================================
// POST Handler - Complex Operations
// ============================================================================

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const clientIp = request.headers.get('x-forwarded-for') || 'unknown'

  // Check rate limit
  if (!checkRateLimit(clientIp, 30)) { // Lower limit for POST requests
    return NextResponse.json(
      {
        success: false,
        error: 'Rate limit exceeded. Please try again later.',
        rateLimitInfo: getRateLimitHeaders(clientIp)
      },
      { 
        status: 429,
        headers: getRateLimitHeaders(clientIp)
      }
    )
  }

  try {
    const body = await request.json()
    const { action } = body
    let result: any

    switch (action) {
      case 'proxy':
        result = await handleProxyRequestPost(body)
        break

      case 'dataset':
        result = await handleDatasetCollectionPost(body)
        break

      case 'enrich':
        result = await handleCompanyEnrichmentPost(body)
        break

      case 'batch-enrich':
        result = await handleBatchEnrichment(body)
        break

      default:
        result = {
          success: false,
          error: `Unknown action: ${action}`,
          availableActions: ['proxy', 'dataset', 'enrich', 'batch-enrich']
        }
    }

    const duration = Date.now() - startTime
    logRequest(action, body, result, duration)

    return NextResponse.json(
      {
        ...result,
        timestamp: new Date().toISOString(),
        processingTime: duration
      },
      {
        headers: getRateLimitHeaders(clientIp)
      }
    )

  } catch (error) {
    const duration = Date.now() - startTime
    const errorResult = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }

    logRequest('POST', {}, errorResult, duration)

    return NextResponse.json(
      {
        ...errorResult,
        timestamp: new Date().toISOString(),
        processingTime: duration
      },
      { 
        status: 500,
        headers: getRateLimitHeaders(clientIp)
      }
    )
  }
}

// ============================================================================
// Action Handlers - GET
// ============================================================================

async function handleHealthCheck() {
  const health = await brightDataService.healthCheck()
  return {
    success: health.healthy,
    status: health.healthy ? 'operational' : 'degraded',
    message: health.message,
    metrics: health.metrics
  }
}

async function handleProxyRequest(searchParams: URLSearchParams) {
  const url = searchParams.get('url')
  if (!url) {
    return { success: false, error: 'URL parameter is required' }
  }

  const proxyRequest: ProxyRequest = {
    url,
    method: (searchParams.get('method') as any) || 'GET',
    timeout: parseInt(searchParams.get('timeout') || '30000'),
    useUnlocker: searchParams.get('useUnlocker') === 'true',
    renderJs: searchParams.get('renderJs') === 'true'
  }

  return await brightDataService.proxyRequest(proxyRequest)
}

async function handleWebUnlocker(searchParams: URLSearchParams) {
  const url = searchParams.get('url')
  if (!url) {
    return { success: false, error: 'URL parameter is required' }
  }

  const unlockerRequest: WebUnlockerRequest = {
    url,
    renderJs: searchParams.get('renderJs') === 'true',
    waitTime: parseInt(searchParams.get('waitTime') || '0')
  }

  return await brightDataService.webUnlocker(unlockerRequest)
}

async function handleDatasetCollection(searchParams: URLSearchParams) {
  const type = searchParams.get('type') as any
  const query = searchParams.get('query')

  if (!type || !query) {
    return { success: false, error: 'Type and query parameters are required' }
  }

  const datasetRequest: DatasetRequest = {
    type,
    query,
    limit: parseInt(searchParams.get('limit') || '50'),
    format: (searchParams.get('format') as any) || 'json',
    includeMetadata: searchParams.get('includeMetadata') === 'true'
  }

  return await brightDataService.collectDataset(datasetRequest)
}

async function handleCompanyEnrichment(searchParams: URLSearchParams) {
  const companyName = searchParams.get('company')
  const website = searchParams.get('website')

  if (!companyName) {
    return { success: false, error: 'Company name is required' }
  }

  const sourcesParam = searchParams.get('sources') || 'crunchbase,linkedin,news'
  const sources = sourcesParam.split(',') as any[]

  const enrichmentRequest: CompanyDataEnrichment = {
    companyName,
    website: website || '',
    enrichmentSources: sources,
    depth: (searchParams.get('depth') as any) || 'standard'
  }

  const enrichedData = await brightDataService.enrichCompanyData(enrichmentRequest)

  return {
    success: !!enrichedData,
    data: enrichedData,
    error: enrichedData ? undefined : 'Failed to enrich company data'
  }
}

async function handleCybersecurityIntel(searchParams: URLSearchParams) {
  const companyName = searchParams.get('company')

  if (!companyName) {
    return { success: false, error: 'Company name is required' }
  }

  const intelligence = await brightDataService.scrapeCybersecurityIntelligence(companyName)

  return {
    success: true,
    data: intelligence
  }
}

async function handleFundingMonitor(searchParams: URLSearchParams) {
  const companiesParam = searchParams.get('companies')

  if (!companiesParam) {
    return { success: false, error: 'Companies parameter is required (comma-separated)' }
  }

  const companies = companiesParam.split(',').map(c => c.trim())
  const alerts = await brightDataService.monitorFundingAnnouncements(companies)

  return {
    success: true,
    data: alerts,
    totalAlerts: alerts.reduce((sum, a) => sum + a.alerts.length, 0)
  }
}

async function handleGetMetrics() {
  const metrics = brightDataService.getMetrics()

  return {
    success: true,
    data: metrics
  }
}

async function handleRateLimitInfo(searchParams: URLSearchParams) {
  const endpoint = searchParams.get('endpoint') || 'proxy'
  const info = brightDataService.getRateLimitInfo(endpoint)

  return {
    success: true,
    data: info
  }
}

// ============================================================================
// Action Handlers - POST
// ============================================================================

async function handleProxyRequestPost(body: any) {
  const { url, method, headers, data, timeout, useUnlocker, renderJs } = body

  if (!url) {
    return { success: false, error: 'URL is required' }
  }

  const proxyRequest: ProxyRequest = {
    url,
    method: method || 'POST',
    headers,
    body: data,
    timeout: timeout || 30000,
    useUnlocker,
    renderJs
  }

  return await brightDataService.proxyRequest(proxyRequest)
}

async function handleDatasetCollectionPost(body: any) {
  const { type, query, filters, limit, format, includeMetadata } = body

  if (!type || !query) {
    return { success: false, error: 'Type and query are required' }
  }

  const datasetRequest: DatasetRequest = {
    type,
    query,
    filters,
    limit: limit || 50,
    format: format || 'json',
    includeMetadata: includeMetadata || false
  }

  return await brightDataService.collectDataset(datasetRequest)
}

async function handleCompanyEnrichmentPost(body: any) {
  const { companyName, website, enrichmentSources, depth } = body

  if (!companyName) {
    return { success: false, error: 'Company name is required' }
  }

  const enrichmentRequest: CompanyDataEnrichment = {
    companyName,
    website: website || '',
    enrichmentSources: enrichmentSources || ['crunchbase', 'linkedin', 'news'],
    depth: depth || 'standard'
  }

  const enrichedData = await brightDataService.enrichCompanyData(enrichmentRequest)

  return {
    success: !!enrichedData,
    data: enrichedData,
    error: enrichedData ? undefined : 'Failed to enrich company data'
  }
}

async function handleBatchEnrichment(body: any) {
  const { companies } = body

  if (!companies || !Array.isArray(companies)) {
    return { success: false, error: 'Companies array is required' }
  }

  const enrichmentTasks = companies.map(company =>
    brightDataService.enrichCompanyData({
      companyName: company.name,
      website: company.website || '',
      enrichmentSources: ['crunchbase', 'linkedin', 'news'],
      depth: 'standard'
    })
  )

  const results = await Promise.allSettled(enrichmentTasks)
  const enrichedCompanies = results
    .filter(r => r.status === 'fulfilled')
    .map(r => (r as PromiseFulfilledResult<any>).value)

  return {
    success: true,
    data: enrichedCompanies,
    totalProcessed: companies.length,
    successfulEnrichments: enrichedCompanies.length,
    failedEnrichments: companies.length - enrichedCompanies.length
  }
}
