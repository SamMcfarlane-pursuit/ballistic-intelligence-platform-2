# API Configuration Guide

## BrightData Integration

The Ballistic Intelligence Platform integrates with BrightData for enhanced web scraping and data collection capabilities.

### Setup Instructions

1. **Get BrightData API Credentials**
   - Sign up at [BrightData](https://brightdata.com)
   - Navigate to your dashboard and get your API key
   - Set up a proxy zone for web scraping

2. **Configure Environment Variables**
   Add the following to your `.env.local` file:
   ```
   BRIGHTDATA_API_KEY=your_actual_api_key_here
   BRIGHTDATA_PROXY_HOST=brd.superproxy.io
   BRIGHTDATA_PROXY_PORT=22225
   BRIGHTDATA_PROXY_USERNAME=your_username
   BRIGHTDATA_PROXY_PASSWORD=your_password
   ```

3. **Test the Connection**
   ```bash
   curl "http://localhost:3000/api/brightdata?action=health"
   ```

## Crunchbase Integration

The platform uses Crunchbase API for comprehensive company and funding data.

### Setup Instructions

1. **Get Crunchbase API Key**
   - Sign up at [Crunchbase API](https://data.crunchbase.com/docs)
   - Subscribe to an appropriate plan
   - Get your API key from the dashboard

2. **Configure Environment Variables**
   Add to your `.env.local` file:
   ```
   CRUNCHBASE_API_KEY=your_actual_api_key_here
   CRUNCHBASE_BASE_URL=https://api.crunchbase.com/api/v4
   ```

3. **Test the Connection**
   ```bash
   curl "http://localhost:3000/api/crunchbase?action=health"
   ```

## Fallback Behavior

When API keys are not configured or APIs are unavailable:

- ✅ **Dashboard continues to work** with comprehensive mock data
- ✅ **All features remain functional** including CSV export/import
- ✅ **Data quality indicators** show when using mock vs. real data
- ✅ **Health checks** report API status clearly

## API Endpoints

### BrightData API
- `GET /api/brightdata?action=health` - Health check
- `GET /api/brightdata?action=enrich&company=CompanyName` - Company enrichment
- `GET /api/brightdata?action=cybersecurity-intel&query=sectors` - Sector intelligence

### Crunchbase API  
- `GET /api/crunchbase?action=health` - Health check
- `GET /api/crunchbase?action=search&query=cybersecurity` - Company search
- `GET /api/crunchbase?action=funding-analysis&timeframe=6m` - Funding analysis

### Trending Factors API
- `GET /api/trending-factors?action=sectors` - Sector trends
- `GET /api/trending-factors?action=top&limit=50` - Top companies
- `GET /api/trending-factors?action=stats` - Statistics

## Error Handling

The platform includes robust error handling:

1. **API Unavailable**: Falls back to mock data automatically
2. **Rate Limiting**: Implements proper rate limiting and retry logic
3. **Invalid Responses**: Gracefully handles malformed JSON responses
4. **Network Issues**: Provides clear error messages and fallbacks

## Development Mode

For development without API keys:
- All features work with realistic mock data
- CSV exports include sample intelligence data
- Import functionality processes test data
- No API configuration required for basic development