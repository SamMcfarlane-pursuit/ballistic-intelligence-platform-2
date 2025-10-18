# BrightData Integration - Comprehensive Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Setup & Configuration](#setup--configuration)
5. [API Reference](#api-reference)
6. [Usage Examples](#usage-examples)
7. [Integration Points](#integration-points)
8. [Monitoring & Metrics](#monitoring--metrics)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The BrightData integration provides comprehensive web data collection and proxy services for the Ballistic Intelligence Platform. This enterprise-grade solution enables:

- **Reliable Data Scraping**: Access any website through BrightData's global proxy network
- **Anti-Bot Protection**: Bypass anti-scraping measures with Web Unlocker
- **Dataset Services**: Collect structured data from Crunchbase, LinkedIn, patents, and news sources
- **Real-time Processing**: Process and enrich data in real-time
- **Production-Ready**: Comprehensive error handling, rate limiting, and monitoring

### Key Benefits

- ✅ **99.9% Uptime**: Enterprise-grade proxy infrastructure
- ✅ **Global Coverage**: Access data from any geographic location
- ✅ **Automatic Scaling**: Handle thousands of concurrent requests
- ✅ **Cost-Effective**: Pay only for successful requests
- ✅ **Compliance Ready**: Built-in logging and audit trails

---

## 🏗️ Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                   Executive Dashboard                        │
│  ┌──────────┬──────────┬──────────┬────────────────────┐   │
│  │ Market   │ Trending │  Patent  │  BrightData        │   │
│  │ Intel    │ Sectors  │ Deep Dive│  Monitor           │   │
│  └────┬─────┴────┬─────┴────┬─────┴─────┬──────────────┘   │
└───────┼──────────┼──────────┼───────────┼──────────────────┘
        │          │          │           │
        ▼          ▼          ▼           ▼
┌─────────────────────────────────────────────────────────────┐
│              BrightData API Routes (/api/brightdata)         │
│  ┌──────┬──────┬────────┬────────┬──────────┬─────────┐    │
│  │Proxy │Unlock│Dataset │Enrich  │Monitoring│Metrics  │    │
│  └──┬───┴──┬───┴───┬────┴───┬────┴────┬─────┴────┬────┘    │
└─────┼──────┼───────┼────────┼─────────┼──────────┼─────────┘
      │      │       │        │         │          │
      ▼      ▼       ▼        ▼         ▼          ▼
┌─────────────────────────────────────────────────────────────┐
│            BrightData Service (Core Library)                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  • Proxy Network Management                           │  │
│  │  • Web Unlocker (Anti-Bot Bypass)                     │  │
│  │  • Dataset Collection Engine                          │  │
│  │  • Rate Limiting & Queue Management                   │  │
│  │  • Metrics & Health Monitoring                        │  │
│  │  • Error Handling & Retries                           │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  BrightData Cloud                            │
│  • Global Proxy Network (33M+ IPs)                          │
│  • Web Unlocker (CAPTCHA Solving)                           │
│  • Dataset Marketplace                                       │
│  • Real-time Data Processing                                │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Request Initiation**: Dashboard component triggers data request
2. **API Routing**: Next.js API route handles request with rate limiting
3. **Service Layer**: BrightData service processes request
4. **Proxy/Unlocker**: Routes through BrightData network
5. **Data Collection**: Scrapes and processes target data
6. **Response Processing**: Enriches and formats data
7. **Dashboard Update**: Real-time UI update with new data

---

## ✨ Features

### 1. Proxy Network

Access any website through BrightData's residential, datacenter, or mobile proxy network.

**Capabilities:**
- 33M+ residential IPs worldwide
- City-level targeting
- Session management
- Automatic IP rotation
- Custom headers support

### 2. Web Unlocker

Bypass anti-bot protection and CAPTCHA challenges automatically.

**Features:**
- JavaScript rendering
- CAPTCHA solving
- Fingerprint randomization
- Cookie management
- Custom wait times

### 3. Dataset Services

Collect structured data from multiple sources.

**Supported Sources:**
- **Crunchbase**: Company funding, investors, acquisitions
- **LinkedIn**: Company profiles, employee data
- **Patents**: USPTO, Google Patents
- **News**: Real-time news aggregation
- **Custom**: Any website with custom scraping logic

### 4. Company Data Enrichment

Multi-source enrichment for comprehensive company intelligence.

**Enrichment Sources:**
- Funding data (Crunchbase)
- Social presence (LinkedIn, Twitter)
- Technology stack
- Patent portfolio
- News sentiment
- Market positioning

### 5. Real-time Monitoring

Live dashboard for tracking BrightData usage and performance.

**Metrics:**
- Total requests
- Success rate
- Average response time
- Cost estimates
- Top endpoints
- Error breakdown

---

## ⚙️ Setup & Configuration

### 1. Environment Variables

Create or update `.env` file:

```bash
# BrightData API Configuration
BRIGHTDATA_API_KEY=your_api_key_here
BRIGHTDATA_PROXY_HOST=brd.superproxy.io
BRIGHTDATA_PROXY_PORT=33335
BRIGHTDATA_PROXY_USERNAME=your_username
BRIGHTDATA_PROXY_PASSWORD=your_password

# Feature Flags
ENABLE_BRIGHTDATA=true
BRIGHTDATA_RATE_LIMIT=60

# Logging
ENABLE_BRIGHTDATA_LOGGING=true
```

### 2. Get BrightData Credentials

1. **Sign up**: Visit [BrightData Control Panel](https://brightdata.com/cp/zones)
2. **Create Zone**: Create a new proxy zone
3. **Get Credentials**: Copy API key, username, and password
4. **Configure**: Add credentials to `.env` file

### 3. Install Dependencies

Dependencies are already included in `package.json`:

```bash
npm install
# or
pnpm install
```

Required packages:
- `axios` - HTTP client
- `next` - Next.js framework
- React components for UI

### 4. Verify Installation

Check BrightData health status:

```bash
curl http://localhost:4000/api/brightdata?action=health
```

Expected response:
```json
{
  "success": true,
  "status": "operational",
  "message": "BrightData service is operational",
  "metrics": { ... }
}
```

---

## 📡 API Reference

### Base URL

```
http://localhost:4000/api/brightdata
```

### Authentication

All requests use API key from environment variables. No additional authentication required for local development.

### GET Endpoints

#### 1. Health Check

```http
GET /api/brightdata?action=health
```

**Response:**
```json
{
  "success": true,
  "status": "operational",
  "message": "BrightData service is operational",
  "metrics": {
    "totalRequests": 150,
    "successfulRequests": 145,
    "failedRequests": 5,
    "averageResponseTime": 1250
  }
}
```

#### 2. Proxy Request

```http
GET /api/brightdata?action=proxy&url=https://example.com&method=GET&renderJs=true
```

**Parameters:**
- `url` (required): Target URL
- `method`: HTTP method (GET, POST, etc.)
- `renderJs`: Enable JavaScript rendering
- `timeout`: Request timeout in milliseconds

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "html": "<html>...</html>",
  "statusCode": 200,
  "responseTime": 1250,
  "proxyUsed": "brd.superproxy.io:33335"
}
```

#### 3. Web Unlocker

```http
GET /api/brightdata?action=unlocker&url=https://protected-site.com&renderJs=true&waitTime=2000
```

**Parameters:**
- `url` (required): Target URL
- `renderJs`: Render JavaScript
- `waitTime`: Wait time in milliseconds

**Response:**
```json
{
  "success": true,
  "html": "<html>...</html>",
  "statusCode": 200,
  "finalUrl": "https://protected-site.com",
  "loadTime": 3200,
  "blocked": false,
  "captchaSolved": true
}
```

#### 4. Dataset Collection

```http
GET /api/brightdata?action=dataset&type=crunchbase&query=cybersecurity&limit=50
```

**Parameters:**
- `type` (required): Dataset type (crunchbase, linkedin, patent, news, custom)
- `query` (required): Search query
- `limit`: Maximum results
- `includeMetadata`: Include source metadata

**Response:**
```json
{
  "success": true,
  "data": [...],
  "totalRecords": 50,
  "pagesScraped": 3,
  "executionTime": 5000,
  "dataQuality": {
    "completeness": 0.95,
    "accuracy": 0.95,
    "freshness": "2025-01-16T10:00:00Z"
  }
}
```

#### 5. Company Enrichment

```http
GET /api/brightdata?action=enrich&company=SecureAI&sources=crunchbase,linkedin,news&depth=standard
```

**Parameters:**
- `company` (required): Company name
- `website`: Company website
- `sources`: Comma-separated enrichment sources
- `depth`: Enrichment depth (basic, standard, comprehensive)

**Response:**
```json
{
  "success": true,
  "data": {
    "basic": { ... },
    "funding": { ... },
    "social": { ... },
    "technology": { ... },
    "news": { ... },
    "market": { ... }
  }
}
```

#### 6. Cybersecurity Intelligence

```http
GET /api/brightdata?action=cybersecurity-intel&company=CloudGuard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "company": "CloudGuard",
    "crunchbase": { ... },
    "news": { ... },
    "patents": { ... },
    "social": { ... },
    "scrapedAt": "2025-01-16T10:00:00Z"
  }
}
```

#### 7. Funding Monitor

```http
GET /api/brightdata?action=funding-monitor&companies=SecureAI,CloudGuard,ZeroTrust
```

**Parameters:**
- `companies` (required): Comma-separated company names

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "company": "SecureAI",
      "alerts": [...]
    }
  ],
  "totalAlerts": 5
}
```

#### 8. Metrics

```http
GET /api/brightdata?action=metrics
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRequests": 500,
    "successfulRequests": 475,
    "failedRequests": 25,
    "averageResponseTime": 1250,
    "bytesTransferred": 52428800,
    "costEstimate": 12.50,
    "topEndpoints": [...],
    "errorBreakdown": { ... }
  }
}
```

#### 9. Rate Limit Info

```http
GET /api/brightdata?action=rate-limit-info&endpoint=proxy
```

**Response:**
```json
{
  "success": true,
  "data": {
    "requestsThisMinute": 15,
    "requestsThisHour": 450,
    "requestsToday": 2500,
    "limitPerMinute": 60,
    "limitPerHour": 3600,
    "limitPerDay": 86400,
    "resetAt": "2025-01-16T10:01:00Z"
  }
}
```

### POST Endpoints

#### 1. Proxy Request (Advanced)

```http
POST /api/brightdata
Content-Type: application/json

{
  "action": "proxy",
  "url": "https://api.example.com/data",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer token"
  },
  "data": {
    "query": "search term"
  },
  "timeout": 30000,
  "useUnlocker": true,
  "renderJs": true
}
```

#### 2. Dataset Collection (Advanced)

```http
POST /api/brightdata
Content-Type: application/json

{
  "action": "dataset",
  "type": "crunchbase",
  "query": "cybersecurity startups",
  "filters": {
    "category": "cybersecurity",
    "fundingRange": "1M-10M",
    "location": "United States"
  },
  "limit": 100,
  "format": "json",
  "includeMetadata": true
}
```

#### 3. Company Enrichment (Advanced)

```http
POST /api/brightdata
Content-Type: application/json

{
  "action": "enrich",
  "companyName": "SecureAI",
  "website": "https://secureai.com",
  "enrichmentSources": ["crunchbase", "linkedin", "news", "patents", "social"],
  "depth": "comprehensive"
}
```

#### 4. Batch Enrichment

```http
POST /api/brightdata
Content-Type: application/json

{
  "action": "batch-enrich",
  "companies": [
    { "name": "SecureAI", "website": "https://secureai.com" },
    { "name": "CloudGuard", "website": "https://cloudguard.io" },
    { "name": "ZeroTrust Networks", "website": "https://zerotrust.net" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "totalProcessed": 3,
  "successfulEnrichments": 3,
  "failedEnrichments": 0
}
```

### Rate Limiting

All endpoints are rate-limited to protect the service:

- **GET requests**: 60 requests/minute
- **POST requests**: 30 requests/minute

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1642329600000
```

---

## 💡 Usage Examples

### Example 1: Scrape Company Website

```typescript
// Using the API directly
const response = await fetch('/api/brightdata?action=proxy&url=https://secureai.com&renderJs=true')
const data = await response.json()

if (data.success) {
  console.log('HTML:', data.html)
  console.log('Status:', data.statusCode)
  console.log('Response Time:', data.responseTime)
}
```

### Example 2: Enrich Company Data

```typescript
const enrichData = async (companyName: string) => {
  const response = await fetch(
    `/api/brightdata?action=enrich&company=${companyName}&sources=crunchbase,linkedin,news`
  )
  const data = await response.json()
  
  if (data.success) {
    return data.data
  }
  return null
}

const secureAIData = await enrichData('SecureAI')
console.log('Funding:', secureAIData.funding)
console.log('Social:', secureAIData.social)
```

### Example 3: Monitor Funding Announcements

```typescript
const monitorFunding = async (companies: string[]) => {
  const companiesParam = companies.join(',')
  const response = await fetch(
    `/api/brightdata?action=funding-monitor&companies=${companiesParam}`
  )
  const data = await response.json()
  
  if (data.success) {
    return data.data.filter(c => c.alerts.length > 0)
  }
  return []
}

const alerts = await monitorFunding(['SecureAI', 'CloudGuard'])
console.log(`Found ${alerts.length} companies with funding alerts`)
```

### Example 4: Collect Cybersecurity Intelligence

```typescript
const getCybersecurityIntel = async (company: string) => {
  const response = await fetch(
    `/api/brightdata?action=cybersecurity-intel&company=${company}`
  )
  const data = await response.json()
  
  if (data.success) {
    return {
      crunchbase: data.data.crunchbase,
      news: data.data.news,
      patents: data.data.patents,
      social: data.data.social
    }
  }
  return null
}
```

### Example 5: Using BrightData Service Directly

```typescript
import { brightDataService } from '@/services/brightdata-service'

// Proxy request
const proxyResponse = await brightDataService.proxyRequest({
  url: 'https://example.com',
  method: 'GET',
  renderJs: true
})

// Web unlocker
const unlockerResponse = await brightDataService.webUnlocker({
  url: 'https://protected-site.com',
  renderJs: true,
  waitTime: 2000
})

// Dataset collection
const datasetResponse = await brightDataService.collectDataset({
  type: 'crunchbase',
  query: 'cybersecurity',
  limit: 50
})

// Company enrichment
const enrichedData = await brightDataService.enrichCompanyData({
  companyName: 'SecureAI',
  website: 'https://secureai.com',
  enrichmentSources: ['crunchbase', 'linkedin', 'news'],
  depth: 'standard'
})
```

---

## 🔗 Integration Points

### 1. Executive Dashboard

The BrightData Monitor tab in the Executive Dashboard provides real-time visibility:

- Access at: `http://localhost:4000/executive-dashboard`
- Click **"Data Intelligence"** tab
- View live metrics, health status, and performance data

### 2. Crunchbase Service Enhancement

The Crunchbase service now uses BrightData for reliable data access:

**Location:** `/src/services/crunchbase-service.ts`

**Features:**
- Automatic fallback to BrightData if direct API fails
- Web unlocker for bypassing Crunchbase anti-bot measures
- Dataset collection for bulk company data

### 3. Patent Deep Dive

Enhanced patent research with BrightData scraping:

- Scrape patent databases (USPTO, Google Patents)
- Real-time patent monitoring
- Multi-source patent data collection

### 4. Market Intelligence

Real-time market data feeds powered by BrightData:

- News aggregation from multiple sources
- Social media sentiment analysis
- Competitive intelligence gathering

---

## 📊 Monitoring & Metrics

### Dashboard Metrics

The BrightData Monitor component displays:

1. **Request Statistics**
   - Total requests
   - Success rate percentage
   - Average response time
   - Estimated cost

2. **Top Endpoints**
   - Most frequently accessed URLs
   - Request counts per endpoint
   - Average response times

3. **Error Breakdown**
   - Error types and frequencies
   - Failed request analysis
   - Troubleshooting insights

4. **Real-time Updates**
   - Auto-refresh every 30 seconds (optional)
   - Manual refresh button
   - Last updated timestamp

### Health Monitoring

Monitor BrightData service health:

```bash
curl http://localhost:4000/api/brightdata?action=health
```

Health status indicators:
- ✅ **Operational**: All systems running normally
- ⚠️ **Degraded**: Service experiencing issues
- ❌ **Unavailable**: Service is down

### Logging

All BrightData operations are logged when `ENABLE_BRIGHTDATA_LOGGING=true`:

```
[BrightData API] {
  timestamp: "2025-01-16T10:00:00.000Z",
  action: "proxy",
  params: "{\"url\":\"https://example.com\"}",
  success: true,
  duration: 1250,
  error: null
}
```

---

## 🎯 Best Practices

### 1. Rate Limiting

- Stay within rate limits (60 req/min for GET, 30 req/min for POST)
- Implement exponential backoff for retries
- Use batch operations when possible

### 2. Error Handling

```typescript
try {
  const response = await fetch('/api/brightdata?action=proxy&url=...')
  const data = await response.json()
  
  if (!data.success) {
    console.error('BrightData error:', data.error)
    // Implement fallback logic
  }
} catch (error) {
  console.error('Network error:', error)
  // Handle network failures
}
```

### 3. Cost Optimization

- Cache frequently accessed data
- Use appropriate timeout values
- Implement request deduplication
- Monitor cost estimates in dashboard

### 4. Performance

- Enable parallel requests for batch operations
- Use memoization for repeated queries
- Implement request queuing for high-volume scenarios

### 5. Security

- Never expose API keys in client-side code
- Use environment variables for credentials
- Implement proper authentication for API routes
- Validate and sanitize all input parameters

---

## 🔧 Troubleshooting

### Issue: "Repository not found" error

**Solution:** Check that BrightData credentials are correctly configured in `.env`

### Issue: Rate limit exceeded

**Solution:** 
```typescript
// Check rate limit status
const response = await fetch('/api/brightdata?action=rate-limit-info&endpoint=proxy')
const { data } = await response.json()
console.log('Remaining requests:', data.requestsThisMinute)
```

### Issue: Slow response times

**Causes:**
- Target website is slow
- JavaScript rendering enabled unnecessarily
- Network latency

**Solutions:**
- Disable `renderJs` if not needed
- Reduce `waitTime` parameter
- Use datacenter proxies for speed

### Issue: Captcha blocking

**Solution:** Enable Web Unlocker:
```typescript
const response = await fetch(
  '/api/brightdata?action=unlocker&url=...&renderJs=true'
)
```

### Issue: Service unavailable

**Check:**
1. Environment variables are set correctly
2. BrightData credentials are valid
3. Network connectivity to BrightData
4. Check health endpoint: `/api/brightdata?action=health`

---

## 📞 Support

### Documentation
- BrightData Docs: https://docs.brightdata.com
- Platform Docs: `/README.md`

### Configuration Files
- Service: `/src/services/brightdata-service.ts`
- API Routes: `/src/app/api/brightdata/route.ts`
- Component: `/src/components/dashboard/BrightDataMonitor.tsx`
- Environment: `/.env.example`

### Common Questions

**Q: How much does BrightData cost?**
A: Pricing varies by plan. Check [BrightData Pricing](https://brightdata.com/pricing) for current rates.

**Q: Can I use BrightData in production?**
A: Yes! This integration is production-ready with comprehensive error handling and monitoring.

**Q: How do I get support?**
A: Contact BrightData support at https://brightdata.com/support or check platform documentation.

---

## 🚀 Quick Start Checklist

- [ ] Sign up for BrightData account
- [ ] Get API credentials from control panel
- [ ] Update `.env` file with credentials
- [ ] Restart development server
- [ ] Check health endpoint: `http://localhost:4000/api/brightdata?action=health`
- [ ] Open Executive Dashboard: `http://localhost:4000/executive-dashboard`
- [ ] Click "Data Intelligence" tab
- [ ] Monitor metrics and start using!

---

**Last Updated:** January 16, 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
