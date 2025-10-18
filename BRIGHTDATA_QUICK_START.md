# BrightData Integration - Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will help you set up and start using the BrightData integration immediately.

---

## Step 1: Get BrightData Credentials (2 minutes)

1. **Sign up** for BrightData:
   - Visit: https://brightdata.com/cp/zones
   - Create a free account

2. **Create a Proxy Zone**:
   - Click "Create Zone"
   - Select "Residential Proxies" or "Datacenter Proxies"
   - Give it a name (e.g., "Ballistic Intelligence")

3. **Get Your Credentials**:
   - Copy the **Zone Username**
   - Copy the **Zone Password**  
   - Note the **Proxy Host** (usually `brd.superproxy.io`)
   - Note the **Proxy Port** (usually `33335`)

4. **Get API Key** (optional for advanced features):
   - Go to Settings → API Tokens
   - Generate new token
   - Copy the API key

---

## Step 2: Configure Environment (1 minute)

1. **Open** `.env` file in your project root

2. **Add** BrightData credentials:

```bash
# BrightData Configuration
BRIGHTDATA_API_KEY=your_api_key_here
BRIGHTDATA_PROXY_HOST=brd.superproxy.io
BRIGHTDATA_PROXY_PORT=33335
BRIGHTDATA_PROXY_USERNAME=your_zone_username_here
BRIGHTDATA_PROXY_PASSWORD=your_zone_password_here



3. **Save** the file

---

## Step 3: Start the Platform (1 minute)

```bash
# Install dependencies (if not already done)
npm install
# or
pnpm install

# Start the development server
npm run dev
# or
pnpm dev
```

Server will start at: **http://localhost:4000**

---

## Step 4: Test the Integration (1 minute)

### Option A: Use the Dashboard

1. Open: http://localhost:4000/executive-dashboard
2. Click the **"Data Intelligence"** tab
3. You'll see:
   - ✅ Health status (should show "operational")
   - 📊 Real-time metrics
   - 📈 Request statistics
   - 🎯 Top endpoints

### Option B: Test via API

```bash
# Test health check
curl http://localhost:4000/api/brightdata?action=health

# Test proxy request
curl "http://localhost:4000/api/brightdata?action=proxy&url=https://httpbin.org/get"

# Test web unlocker
curl "http://localhost:4000/api/brightdata?action=unlocker&url=https://example.com&renderJs=true"
```

---

## Step 5: Start Using! (∞ possibilities)

### Example 1: Scrape a Website

```typescript
const response = await fetch(
  '/api/brightdata?action=proxy&url=https://secureai.com&renderJs=true'
)
const data = await response.json()

if (data.success) {
  console.log('Website HTML:', data.html)
  console.log('Response time:', data.responseTime + 'ms')
}
```

### Example 2: Enrich Company Data

```typescript
const response = await fetch(
  '/api/brightdata?action=enrich&company=SecureAI&sources=crunchbase,linkedin,news'
)
const data = await response.json()

if (data.success) {
  console.log('Company funding:', data.data.funding)
  console.log('Social presence:', data.data.social)
  console.log('Recent news:', data.data.news)
}
```

### Example 3: Collect Cybersecurity Intelligence

```typescript
const response = await fetch(
  '/api/brightdata?action=cybersecurity-intel&company=CloudGuard'
)
const data = await response.json()

if (data.success) {
  console.log('Crunchbase data:', data.data.crunchbase)
  console.log('Patents:', data.data.patents)
  console.log('News mentions:', data.data.news)
}
```

### Example 4: Monitor Funding Announcements

```typescript
const companies = ['SecureAI', 'CloudGuard', 'ZeroTrust Networks']
const response = await fetch(
  `/api/brightdata?action=funding-monitor&companies=${companies.join(',')}`
)
const data = await response.json()

if (data.success) {
  data.data.forEach(company => {
    console.log(`${company.company}: ${company.alerts.length} funding alerts`)
  })
}
```

---

## 📋 Available API Actions

### GET Actions

| Action | Description | Example |
|--------|-------------|---------|
| `health` | Check service health | `?action=health` |
| `proxy` | Make proxy request | `?action=proxy&url=https://example.com` |
| `unlocker` | Use web unlocker | `?action=unlocker&url=https://site.com&renderJs=true` |
| `dataset` | Collect dataset | `?action=dataset&type=crunchbase&query=cybersecurity` |
| `enrich` | Enrich company data | `?action=enrich&company=SecureAI&sources=crunchbase` |
| `cybersecurity-intel` | Get cyber intelligence | `?action=cybersecurity-intel&company=CloudGuard` |
| `funding-monitor` | Monitor funding | `?action=funding-monitor&companies=SecureAI,CloudGuard` |
| `metrics` | Get usage metrics | `?action=metrics` |
| `rate-limit-info` | Check rate limits | `?action=rate-limit-info&endpoint=proxy` |

### POST Actions

| Action | Description | Body Example |
|--------|-------------|--------------|
| `proxy` | Advanced proxy request | `{"action":"proxy","url":"...","method":"POST","data":{...}}` |
| `dataset` | Advanced dataset collection | `{"action":"dataset","type":"crunchbase","filters":{...}}` |
| `enrich` | Advanced enrichment | `{"action":"enrich","companyName":"...","enrichmentSources":[...]}` |
| `batch-enrich` | Batch enrichment | `{"action":"batch-enrich","companies":[{...},{...}]}` |

---

## 🎯 Common Use Cases

### 1. Real-Time Company Intelligence

```typescript
async function getCompanyIntelligence(companyName: string) {
  const response = await fetch(
    `/api/brightdata?action=cybersecurity-intel&company=${companyName}`
  )
  const { data } = await response.json()
  
  return {
    funding: data.crunchbase?.data?.totalRecords || 0,
    newsCount: data.news?.data?.length || 0,
    patents: data.patents?.totalRecords || 0,
    socialPresence: data.social
  }
}

const intel = await getCompanyIntelligence('SecureAI')
console.log('Intelligence Report:', intel)
```

### 2. Market Research

```typescript
async function researchCybersecurityMarket() {
  const response = await fetch(
    '/api/brightdata?action=dataset&type=crunchbase&query=cybersecurity&limit=100'
  )
  const { data } = await response.json()
  
  const companies = data.data
  const totalFunding = companies.reduce((sum: number, c: any) => 
    sum + (c.totalFunding || 0), 0
  )
  
  return {
    totalCompanies: companies.length,
    totalFunding,
    averageFunding: totalFunding / companies.length,
    topCompanies: companies.slice(0, 10)
  }
}
```

### 3. Competitive Intelligence

```typescript
async function trackCompetitors(competitors: string[]) {
  const enrichmentPromises = competitors.map(company =>
    fetch(
      `/api/brightdata?action=enrich&company=${company}&sources=crunchbase,news,social`
    ).then(r => r.json())
  )
  
  const results = await Promise.all(enrichmentPromises)
  
  return results.map((result, index) => ({
    company: competitors[index],
    funding: result.data?.funding,
    recentNews: result.data?.news,
    socialMetrics: result.data?.social
  }))
}

const competitors = ['SecureAI', 'CloudGuard', 'ZeroTrust Networks']
const intelligence = await trackCompetitors(competitors)
```

---

## 🔍 Monitoring & Debugging

### Check Current Status

```bash
# Service health
curl http://localhost:4000/api/brightdata?action=health

# Current metrics
curl http://localhost:4000/api/brightdata?action=metrics

# Rate limit status
curl http://localhost:4000/api/brightdata?action=rate-limit-info&endpoint=proxy
```

### View in Dashboard

1. Go to: http://localhost:4000/executive-dashboard
2. Click **"Data Intelligence"** tab
3. View real-time metrics:
   - Total requests
   - Success rate
   - Average response time
   - Cost estimate
   - Top endpoints
   - Error breakdown

### Enable Auto-Refresh

Click the **"Auto-Refresh ON"** button in the dashboard to enable automatic updates every 30 seconds.

---

## ⚠️ Troubleshooting

### Issue: "Service unavailable"

**Check:**
```bash
# 1. Verify environment variables
cat .env | grep BRIGHTDATA

# 2. Check service health
curl http://localhost:4000/api/brightdata?action=health

# 3. Restart server
npm run dev
```

### Issue: "Rate limit exceeded"

**Solution:**
```bash
# Check current rate limit
curl http://localhost:4000/api/brightdata?action=rate-limit-info&endpoint=proxy

# Wait for reset (shown in response)
# Or reduce request frequency
```

### Issue: "Authentication failed"

**Fix:**
1. Verify credentials in `.env` are correct
2. Check BrightData dashboard for valid zone
3. Ensure credentials match your zone exactly

### Issue: Slow responses

**Optimize:**
- Disable `renderJs` if not needed
- Reduce `waitTime` parameter
- Use datacenter proxies for speed
- Check target website performance

---

## 💡 Pro Tips

### 1. Cache Frequently Accessed Data

```typescript
const cache = new Map()

async function getCachedCompanyData(company: string) {
  if (cache.has(company)) {
    return cache.get(company)
  }
  
  const response = await fetch(`/api/brightdata?action=enrich&company=${company}`)
  const data = await response.json()
  
  cache.set(company, data)
  return data
}
```

### 2. Batch Process for Efficiency

```typescript
// Instead of multiple individual requests
const companies = ['SecureAI', 'CloudGuard', 'ZeroTrust']
const response = await fetch('/api/brightdata', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'batch-enrich',
    companies: companies.map(name => ({ name, website: '' }))
  })
})
```

### 3. Monitor Costs

Check the dashboard regularly for cost estimates:
- Navigate to: http://localhost:4000/executive-dashboard
- Click "Data Intelligence"
- View "Est. Cost" metric

### 4. Use TypeScript for Type Safety

```typescript
import type { 
  ProxyResponse, 
  EnrichedCompanyData 
} from '@/services/brightdata-service'

const response: ProxyResponse = await brightDataService.proxyRequest({
  url: 'https://example.com',
  method: 'GET'
})

const enriched: EnrichedCompanyData | null = await brightDataService.enrichCompanyData({
  companyName: 'SecureAI',
  website: 'https://secureai.com',
  enrichmentSources: ['crunchbase', 'linkedin'],
  depth: 'standard'
})
```

---

## 📚 Next Steps

1. **Explore Full Documentation**: See `BRIGHTDATA_INTEGRATION.md` for comprehensive API reference

2. **Integrate into Your Workflows**: 
   - Enhance Crunchbase data collection
   - Add real-time patent monitoring
   - Automate market research

3. **Optimize Performance**:
   - Implement caching strategies
   - Use batch operations
   - Monitor and optimize costs

4. **Scale Up**:
   - Upgrade BrightData plan for higher limits
   - Implement distributed processing
   - Add more data sources

---

## ✅ Quick Reference Card

```bash
# Service Status
curl http://localhost:4000/api/brightdata?action=health

# Scrape Website
curl "http://localhost:4000/api/brightdata?action=proxy&url=https://example.com"

# Enrich Company
curl "http://localhost:4000/api/brightdata?action=enrich&company=SecureAI"

# Get Intelligence
curl "http://localhost:4000/api/brightdata?action=cybersecurity-intel&company=CloudGuard"

# Check Metrics
curl http://localhost:4000/api/brightdata?action=metrics

# Dashboard
http://localhost:4000/executive-dashboard → Click "Data Intelligence"
```

---

## 🎉 You're Ready!

You now have a fully functional BrightData integration. Start collecting web data, enriching company intelligence, and monitoring the cybersecurity market!

**Questions?** Check:
- Full Documentation: `BRIGHTDATA_INTEGRATION.md`
- BrightData Docs: https://docs.brightdata.com
- Platform README: `README.md`

**Happy Data Collecting!** 🚀
