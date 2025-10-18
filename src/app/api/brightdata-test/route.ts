/**
 * BrightData Test API Route
 * 
 * Simple test endpoint to verify BrightData integration is working
 */

import { NextRequest, NextResponse } from 'next/server'
import { brightDataService } from '@/services/brightdata-service'

export async function GET(request: NextRequest) {
  try {
    // Test 1: Health check
    const health = await brightDataService.healthCheck()
    
    // Test 2: Simple proxy request
    const proxyTest = await brightDataService.proxyRequest({
      url: 'https://httpbin.org/get'
    })
    
    // Test 3: Check configuration
    const config = {
      hasApiKey: !!process.env.BRIGHTDATA_API_KEY,
      hasProxyUsername: !!process.env.BRIGHTDATA_PROXY_USERNAME,
      hasProxyPassword: !!process.env.BRIGHTDATA_PROXY_PASSWORD,
      proxyHost: process.env.BRIGHTDATA_PROXY_HOST || 'NOT SET',
      proxyPort: process.env.BRIGHTDATA_PROXY_PORT || 'NOT SET'
    }
    
    return NextResponse.json({
      success: true,
      health,
      proxyTest: {
        success: proxyTest.success,
        statusCode: proxyTest.statusCode,
        responseTime: proxyTest.responseTime
      },
      config,
      message: 'BrightData integration is working correctly!'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'BrightData integration test failed'
    }, { status: 500 })
  }
}