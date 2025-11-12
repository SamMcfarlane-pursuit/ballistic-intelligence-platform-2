# Crunchbase API Integration

## Overview

The Ballistic Intelligence Platform integrates with Crunchbase to provide comprehensive company intelligence, funding data, and investor information for cybersecurity companies.

## Features

- **Company Search**: Search for cybersecurity companies by name or keywords
- **Company Details**: Get detailed information about specific companies
- **Funding Rounds**: Track funding history and investment rounds
- **Investor Data**: Identify key investors and their portfolios
- **Market Analysis**: Analyze funding trends and market dynamics
- **Company Monitoring**: Track multiple companies for funding activity

## API Endpoints

### Base URL
```
http://localhost:4000/api/crunchbase
```

### 1. Health Check
Check the status of the Crunchbase integration.

```bash
GET /api/crunchbase?action=health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "lastSync": "2024-11-12T08:00:00Z",
    "totalOrganizations": 15642,
    "errorRate": 0.01,
    "apiCalls": 1250
  }
}
```

### 2. Search Companies
Search for cybersecurity companies.

```bash
GET /api/crunchbase?action=search&query=CrowdStrike&limit=10&page=1
```

**Parameters:**
- `query` (optional): Search term (company name, keywords)
- `limit` (optional): Number of results (default: 50)
- `page` (optional): Page number (default: 1)

**Response:**
```json
{
  "success": true,
  "data": {
    "organizations": [
      {
        "uuid": "crowdstrike",
        "name": "CrowdStrike",
        "website": "https://www.crowdstrike.com",
        "description": "Cloud-native endpoint protection platform",
        "founded_on": "2011-01-01",
        "total_funding_usd": 481000000,
        "employee_count": {
          "value": 8500
        },
        "location_identifiers": [
          {
            "name": "Austin, Texas"
          }
        ],
        "categories": [
          {
            "name": "Endpoint Security"
          }
        ]
      }
    ],
    "total_count": 1,
    "page": 1,
    "per_page": 10
  }
}
```

### 3. Get Organization Details
Get detailed information about a specific company.

```bash
GET /api/crunchbase?action=organization&uuid=crowdstrike
```

**Parameters:**
- `uuid` (required): Company UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "uuid": "crowdstrike",
    "name": "CrowdStrike",
    "website": "https://www.crowdstrike.com",
    "description": "CrowdStrike is a global cybersecurity leader...",
    "founded_on": "2011-01-01",
    "total_funding_usd": 481000000,
    "employee_count": {
      "value": 8500,
      "start": 8000,
      "end": 9000
    }
  }
}
```

### 4. Get Funding Rounds
Get funding history for a company.

```bash
GET /api/crunchbase?action=funding&uuid=crowdstrike
```

**Parameters:**
- `uuid` (required): Company UUID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "uuid": "round-1",
      "announced_on": "2024-01-15",
      "money_raised_usd": 25000000,
      "series": "B",
      "lead_investors": [
        {
          "name": "Andreessen Horowitz"
        }
      ]
    }
  ]
}
```

### 5. Get Investors
Get investor information for a company.

```bash
GET /api/crunchbase?action=investors&uuid=crowdstrike
```

**Parameters:**
- `uuid` (required): Company UUID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "uuid": "inv-1",
      "name": "Andreessen Horowitz",
      "type": "venture_capital",
      "investments_count": 250,
      "total_funding_usd": 5000000000
    }
  ]
}
```

### 6. Funding Analysis
Get comprehensive funding analysis for the cybersecurity sector.

```bash
GET /api/crunchbase?action=analysis&timeframe=6m
```

**Parameters:**
- `timeframe` (optional): Analysis period (1m, 3m, 6m, 1y, all) (default: 6m)

**Response:**
```json
{
  "success": true,
  "data": {
    "total_funding": 8680000000,
    "total_deals": 372,
    "average_deal_size": 23333333,
    "top_sectors": [
      {
        "sector": "Cloud Security",
        "funding": 3200000000,
        "deals": 156
      }
    ],
    "top_investors": [
      {
        "investor": "Andreessen Horowitz",
        "investments": 45,
        "total_funding": 1200000000
      }
    ]
  }
}
```

### 7. Monitor Companies
Track funding activity for multiple companies.

```bash
GET /api/crunchbase?action=monitor&companies=CrowdStrike,Snyk,Wiz
```

**Parameters:**
- `companies` (required): Comma-separated list of company names

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "uuid": "round-1",
      "organization_uuid": "crowdstrike",
      "announced_on": "2024-01-15",
      "money_raised_usd": 25000000,
      "series": "B"
    }
  ]
}
```

## Available Companies

The integration includes data for the following cybersecurity companies:

1. **CrowdStrike** - Cloud-native endpoint protection
2. **SentinelOne** - Autonomous AI-powered cybersecurity
3. **CyberArk** - Identity security and privileged access management
4. **Zscaler** - Cloud security and zero trust platform
5. **Okta** - Identity and access management
6. **Palo Alto Networks** - Next-generation firewall and cloud security
7. **Snyk** - Developer-first security platform
8. **Wiz** - Cloud security platform

## Testing

Run the comprehensive test suite:

```bash
node scripts/test-crunchbase.js
```

This will test all endpoints and verify data aggregation for specific companies.

## Usage Examples

### JavaScript/TypeScript

```typescript
// Search for a company
const response = await fetch('/api/crunchbase?action=search&query=CrowdStrike')
const data = await response.json()

if (data.success) {
  const company = data.data.organizations[0]
  console.log(`${company.name} - Founded: ${company.founded_on}`)
  console.log(`Funding: $${company.total_funding_usd / 1000000}M`)
}

// Get company details
const orgResponse = await fetch('/api/crunchbase?action=organization&uuid=crowdstrike')
const orgData = await orgResponse.json()

if (orgData.success) {
  console.log(orgData.data.description)
}

// Monitor multiple companies
const monitorResponse = await fetch('/api/crunchbase?action=monitor&companies=CrowdStrike,Snyk,Wiz')
const monitorData = await monitorResponse.json()

if (monitorData.success) {
  console.log(`Found ${monitorData.data.length} funding rounds`)
}
```

### cURL

```bash
# Search for companies
curl "http://localhost:4000/api/crunchbase?action=search&query=cloud&limit=5"

# Get company details
curl "http://localhost:4000/api/crunchbase?action=organization&uuid=wiz"

# Get funding analysis
curl "http://localhost:4000/api/crunchbase?action=analysis&timeframe=6m"
```

## Data Fields

### Organization
- `uuid`: Unique identifier
- `name`: Company name
- `website`: Company website
- `description`: Detailed description
- `short_description`: Brief description
- `founded_on`: Founding date
- `total_funding_usd`: Total funding raised
- `employee_count`: Employee count range
- `location_identifiers`: Location information
- `categories`: Industry categories

### Funding Round
- `uuid`: Unique identifier
- `announced_on`: Announcement date
- `money_raised_usd`: Amount raised
- `series`: Funding series (Seed, A, B, C, etc.)
- `lead_investors`: Lead investors
- `investors`: All investors
- `pre_money_valuation_usd`: Pre-money valuation
- `post_money_valuation_usd`: Post-money valuation

### Investor
- `uuid`: Unique identifier
- `name`: Investor name
- `type`: Investor type (venture_capital, angel, etc.)
- `investments_count`: Number of investments
- `portfolio_size`: Portfolio size
- `total_funding_usd`: Total funding deployed

## Error Handling

All endpoints return a consistent error format:

```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2024-11-12T08:00:00Z"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad request (missing parameters)
- `404`: Not found
- `500`: Internal server error

## Performance

- Average response time: 300-800ms
- Rate limiting: Not currently implemented
- Caching: Not currently implemented (future enhancement)

## Future Enhancements

1. Real-time Crunchbase API integration
2. Webhook support for funding alerts
3. Advanced filtering and sorting
4. Data caching for improved performance
5. Rate limiting and quota management
6. Historical data tracking
7. Competitive analysis features
8. Export to CSV/Excel

## Support

For issues or questions about the Crunchbase integration, please refer to the main project documentation or contact the development team.
