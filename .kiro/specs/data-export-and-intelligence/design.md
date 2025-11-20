# Design Document

## Overview

This design document outlines the architecture and implementation approach for three interconnected features:

1. **CSV Export System** - Client-side data export with customizable column selection
2. **Real-time API Integration** - Backend services for BrightData and Crunchbase with intelligent caching
3. **Enhanced Company Dialog** - Rich UI component for displaying comprehensive company intelligence

The design follows a modular architecture where each feature can function independently while sharing common utilities for data validation, caching, and error handling.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Executive Dashboard                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Company Cards│  │ Export Button│  │ Filter Panel │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
        ┌───────▼────────┐       ┌───────▼────────┐
        │ Enhanced Dialog│       │  CSV Exporter  │
        │   Component    │       │    Utility     │
        └───────┬────────┘       └───────┬────────┘
                │                        │
        ┌───────▼────────┐       ┌───────▼────────┐
        │ API Integration│       │ Data Validator │
        │     Layer      │       │    Utility     │
        └───────┬────────┘       └────────────────┘
                │
        ┌───────┴────────┐
        │                │
┌───────▼────────┐ ┌─────▼──────────┐
│  BrightData    │ │   Crunchbase   │
│     API        │ │      API       │
└────────────────┘ └────────────────┘
```

### Component Hierarchy

```
ExecutiveDashboard (page.tsx)
├── CompanyIntelligenceCard (displays company summary)
│   └── onClick → Opens EnhancedCompanyDialog
├── EnhancedCompanyDialog (modal with full intelligence)
│   ├── Company Overview Section
│   ├── Funding Details Section
│   ├── Intelligence Insights Section (BrightData)
│   └── Leadership Team Section
├── ExportButton (triggers CSV export)
│   └── onClick → CSVExporter.exportCompanies()
└── FilterPanel (controls data visibility)
```

## Components and Interfaces

### 1. CSV Export System

#### CSVExporter Utility

**Location:** `src/utils/csv-exporter.ts`

**Purpose:** Convert company data to CSV format and trigger browser download

**Interface:**

```typescript
interface ExportOptions {
  includeIntelligence?: boolean
  includeLeadership?: boolean
  includeFinancials?: boolean
  selectedColumns?: string[]
  filename?: string
}

interface ExportResult {
  success: boolean
  filename: string
  rowCount: number
  error?: string
}

class CSVExporter {
  /**
   * Export companies to CSV format
   * @param companies - Array of company data to export
   * @param options - Export customization options
   * @returns Export result with success status
   */
  static exportCompanies(
    companies: Company[], 
    options?: ExportOptions
  ): ExportResult

  /**
   * Generate CSV content from company data
   * @param companies - Array of company data
   * @param options - Export options
   * @returns CSV string content
   */
  private static generateCSV(
    companies: Company[], 
    options: ExportOptions
  ): string

  /**
   * Trigger browser download of CSV file
   * @param content - CSV content string
   * @param filename - Name for downloaded file
   */
  private static downloadCSV(
    content: string, 
    filename: string
  ): void

  /**
   * Escape CSV special characters
   * @param value - Value to escape
   * @returns Escaped string safe for CSV
   */
  private static escapeCSV(value: any): string
}
```

**Key Design Decisions:**

- **Client-side generation**: CSV generation happens in the browser to avoid server load and enable instant downloads
- **Flexible column selection**: Users can customize which data fields to include
- **Proper escaping**: All values are escaped to handle commas, quotes, and newlines correctly
- **Type safety**: TypeScript interfaces ensure data consistency

#### Export Button Component

**Location:** `src/components/dashboard/ExportButton.tsx`

**Purpose:** UI component for triggering exports with options

**Interface:**

```typescript
interface ExportButtonProps {
  companies: Company[]
  filteredCompanies: Company[]
  disabled?: boolean
}

export default function ExportButton({
  companies,
  filteredCompanies,
  disabled
}: ExportButtonProps): JSX.Element
```

**Features:**
- Dropdown menu for export options
- Visual feedback during export
- Success/error notifications
- Disabled state when no data available

### 2. Real-time API Integration

#### API Service Layer

**Location:** `src/services/intelligence-api.ts`

**Purpose:** Centralized service for fetching and caching API data

**Interface:**

```typescript
interface APIResponse<T> {
  success: boolean
  data?: T
  cached: boolean
  timestamp: string
  error?: string
}

interface BrightDataIntelligence {
  newsSentiment: 'positive' | 'neutral' | 'negative'
  sentimentConfidence: number
  recentMentions: number
  patents: number
  competitors: string[]
  marketPosition: string
  growthIndicators: {
    hiring: number
    funding: number
    news: number
  }
}

interface CrunchbaseCompanyData {
  name: string
  description: string
  totalFunding: number
  lastFundingType: string
  lastFundingAmount: number
  lastFundingDate: string
  founded: number
  location: string
  website: string
  employees: string
}

class IntelligenceAPI {
  private static cache: Map<string, CacheEntry>
  private static CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  /**
   * Fetch BrightData intelligence for a company
   * @param companyName - Name of company to fetch
   * @returns Intelligence data with cache status
   */
  static async fetchBrightData(
    companyName: string
  ): Promise<APIResponse<BrightDataIntelligence>>

  /**
   * Fetch Crunchbase company data
   * @param companyName - Name of company to fetch
   * @returns Company data with cache status
   */
  static async fetchCrunchbase(
    companyName: string
  ): Promise<APIResponse<CrunchbaseCompanyData>>

  /**
   * Fetch combined intelligence from all sources
   * @param companyName - Name of company to fetch
   * @returns Merged intelligence data
   */
  static async fetchCombinedIntelligence(
    companyName: string
  ): Promise<APIResponse<Company>>

  /**
   * Check if cached data exists and is valid
   * @param key - Cache key
   * @returns True if valid cache exists
   */
  private static isCacheValid(key: string): boolean

  /**
   * Store data in cache
   * @param key - Cache key
   * @param data - Data to cache
   */
  private static setCache(key: string, data: any): void

  /**
   * Retrieve data from cache
   * @param key - Cache key
   * @returns Cached data or null
   */
  private static getCache(key: string): any | null

  /**
   * Clear expired cache entries
   */
  static clearExpiredCache(): void
}
```

**Key Design Decisions:**

- **In-memory caching**: Fast access with automatic expiration
- **Graceful degradation**: Returns cached data if API fails
- **Parallel requests**: Can fetch from multiple APIs simultaneously
- **Type-safe responses**: All API responses are strongly typed

#### API Route Handlers

**Existing Routes:**
- `/api/brightdata` - Already implemented
- `/api/crunchbase` - Already implemented
- `/api/spreadsheet` - Already implemented

**Enhancement:** Add health check and status endpoints

```typescript
// GET /api/health
{
  brightdata: { status: 'healthy' | 'degraded' | 'down', latency: number },
  crunchbase: { status: 'healthy' | 'degraded' | 'down', latency: number },
  spreadsheet: { status: 'healthy' | 'degraded' | 'down', latency: number }
}
```

### 3. Enhanced Company Dialog

#### Component Structure

**Location:** `src/components/dashboard/EnhancedCompanyDialog.tsx` (already exists, needs enhancements)

**Current State:** Basic implementation with mock data loading

**Enhancements Needed:**

1. **Real API Integration**: Replace mock data with actual API calls
2. **Loading States**: Better loading indicators for each section
3. **Error Handling**: Graceful fallbacks when data unavailable
4. **Performance**: Lazy load intelligence data only when dialog opens

**Enhanced Interface:**

```typescript
interface EnhancedCompanyDialogProps {
  company: Company | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onExport?: (company: Company) => void // New: Export single company
}

interface DialogState {
  loading: boolean
  intelligence: BrightDataIntelligence | null
  crunchbaseData: CrunchbaseCompanyData | null
  error: string | null
}
```

**Section Components:**

```typescript
// Internal components for better organization
function CompanyOverviewSection({ company }: { company: Company })
function FundingDetailsSection({ company }: { company: Company })
function IntelligenceInsightsSection({ 
  intelligence, 
  loading 
}: { 
  intelligence: BrightDataIntelligence | null
  loading: boolean 
})
function LeadershipTeamSection({ team }: { team: Company['team'] })
```

**Key Design Decisions:**

- **Lazy loading**: Intelligence data fetched only when dialog opens
- **Sectioned layout**: Clear visual separation of information types
- **Responsive design**: Works on desktop and tablet devices
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Data Models

### Company Data Model (Enhanced)

```typescript
interface Company {
  // Core identification
  id: string
  name: string
  description: string
  
  // Classification
  sector: string
  region: string
  
  // Location details
  location: string // "San Francisco, CA, USA"
  
  // Founding information
  founded: number
  
  // Funding details
  fundingFrom: string
  totalFunding: number
  lastRound: string
  lastRoundAmount: number
  latestDateOfFunding: string
  
  // Online presence
  website?: string
  linkedin?: string
  
  // Leadership team
  team?: {
    ceo?: string
    cto?: string
    head?: string
  }
  
  // BrightData intelligence (optional, loaded on demand)
  brightData?: {
    newsSentiment?: 'positive' | 'neutral' | 'negative'
    sentimentConfidence?: number
    recentMentions?: number
    patents?: number
    competitors?: string[]
    marketPosition?: 'Emerging' | 'Growing' | 'Established' | 'Innovative'
    growthIndicators?: {
      hiring?: number
      funding?: number
      news?: number
    }
  }
  
  // Metadata
  dataSource: 'spreadsheet' | 'crunchbase' | 'combined'
  lastUpdated: string
  cached: boolean
}
```

### CSV Export Data Model

```typescript
interface CSVRow {
  // Basic info
  name: string
  sector: string
  location: string
  region: string
  founded: string
  
  // Funding
  'Total Funding': string
  'Last Round': string
  'Last Round Amount': string
  'Funding Date': string
  'Lead Investor': string
  
  // Intelligence (optional)
  'News Sentiment'?: string
  'Recent Mentions'?: string
  'Patents'?: string
  'Market Position'?: string
  
  // Leadership (optional)
  'CEO'?: string
  'CTO'?: string
  'Other Leadership'?: string
  
  // Links
  'Website'?: string
  'LinkedIn'?: string
}
```

## Error Handling

### Error Types

```typescript
enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  EXPORT_ERROR = 'EXPORT_ERROR',
  CACHE_ERROR = 'CACHE_ERROR'
}

interface AppError {
  type: ErrorType
  message: string
  details?: any
  timestamp: string
  recoverable: boolean
}
```

### Error Handling Strategy

1. **API Failures**
   - Try cache first
   - Show warning banner if using stale data
   - Log error for monitoring
   - Allow user to retry

2. **Export Failures**
   - Show specific error message
   - Offer to retry with different options
   - Log error details
   - Don't lose user's filter/selection state

3. **Validation Failures**
   - Substitute safe defaults
   - Log validation issues
   - Continue operation when possible
   - Show warning for critical issues

4. **Network Failures**
   - Use cached data exclusively
   - Show offline indicator
   - Queue operations for retry
   - Graceful degradation of features

### Error UI Components

```typescript
// Toast notifications for transient errors
function showErrorToast(error: AppError): void

// Banner for persistent issues
function ErrorBanner({ 
  error, 
  onRetry, 
  onDismiss 
}: ErrorBannerProps): JSX.Element

// Inline error states
function ErrorState({ 
  error, 
  onRetry 
}: ErrorStateProps): JSX.Element
```

## Testing Strategy

### Unit Tests

**CSV Exporter Tests** (`csv-exporter.test.ts`)
- Test CSV generation with various data types
- Test special character escaping
- Test column selection options
- Test empty data handling
- Test large dataset performance

**API Service Tests** (`intelligence-api.test.ts`)
- Test cache hit/miss scenarios
- Test API failure handling
- Test data merging logic
- Test concurrent requests
- Mock external API calls

**Data Validation Tests** (`null-prevention.test.ts`)
- Test null value detection
- Test default value substitution
- Test validation error reporting
- Test edge cases (undefined, empty strings, etc.)

### Integration Tests

**Export Flow Tests**
- Test full export workflow from button click to download
- Test export with filters applied
- Test export with custom column selection
- Test export error scenarios

**API Integration Tests**
- Test BrightData API integration
- Test Crunchbase API integration
- Test combined data fetching
- Test cache behavior across requests

**Dialog Tests**
- Test dialog opening/closing
- Test data loading in dialog
- Test error states in dialog
- Test export from dialog

### E2E Tests

**User Workflows**
1. View company → Open dialog → View intelligence → Export single company
2. Filter companies → Export filtered list → Verify CSV content
3. Open dialog with network failure → Verify cached data shown
4. Export with custom columns → Verify only selected columns in CSV

### Performance Tests

**Metrics to Track:**
- CSV generation time for 1000 companies: < 500ms
- Dialog open time: < 300ms
- API response time (cached): < 100ms
- API response time (fresh): < 2000ms
- Export file size for 1000 companies: < 1MB

**Load Testing:**
- Test with 5000+ companies
- Test concurrent API requests
- Test cache memory usage
- Test export of large datasets

## Security Considerations

### Data Protection

1. **PII Masking**: Use existing `data-protection.ts` utilities
   - Mask financial amounts in logs
   - Protect leadership information
   - Sanitize user inputs

2. **API Key Security**
   - Store API keys in environment variables
   - Never expose keys in client-side code
   - Rotate keys regularly

3. **CSV Export Security**
   - Sanitize all exported data
   - Prevent CSV injection attacks
   - Validate file size limits

### Access Control

1. **API Rate Limiting**
   - Implement rate limits on API routes
   - Track requests per user/session
   - Return 429 status when exceeded

2. **Data Access Logging**
   - Log all API requests
   - Log export operations
   - Track data access patterns

## Performance Optimization

### Caching Strategy

**Multi-Level Cache:**

1. **Browser Memory Cache** (IntelligenceAPI)
   - Duration: 5 minutes
   - Scope: Current session
   - Size: Unlimited (cleared on page refresh)

2. **API Route Cache** (Next.js)
   - Duration: 5 minutes
   - Scope: All users
   - Size: Limited by server memory

3. **CDN Cache** (Future enhancement)
   - Duration: 1 hour
   - Scope: Global
   - Size: Unlimited

### Data Loading Optimization

1. **Lazy Loading**
   - Load intelligence data only when dialog opens
   - Don't fetch data for off-screen companies
   - Prefetch on hover (optional enhancement)

2. **Batch Requests**
   - Combine multiple API calls when possible
   - Use Promise.all for parallel requests
   - Implement request deduplication

3. **Progressive Enhancement**
   - Show basic data immediately
   - Load intelligence data progressively
   - Update UI as data arrives

### Export Optimization

1. **Streaming for Large Datasets**
   - Generate CSV in chunks for 1000+ companies
   - Use Web Workers for generation (future enhancement)
   - Show progress indicator

2. **Compression**
   - Offer gzip compressed exports for large files
   - Automatic compression for 10MB+ files

## Deployment Considerations

### Environment Variables

```bash
# Required for API integration
BRIGHTDATA_API_KEY=xxx
CRUNCHBASE_API_KEY=xxx
GOOGLE_SHEETS_API_KEY=xxx

# Optional configuration
CACHE_DURATION_MS=300000
API_TIMEOUT_MS=10000
MAX_EXPORT_ROWS=10000
```

### Monitoring

**Metrics to Track:**
- API success/failure rates
- Cache hit rates
- Export operation counts
- Average response times
- Error rates by type

**Alerts:**
- API failure rate > 10%
- Cache hit rate < 70%
- Average response time > 3s
- Export failures > 5%

### Rollout Plan

**Phase 1: CSV Export** (Week 1)
- Implement CSV exporter utility
- Add export button to dashboard
- Basic column selection
- Testing and bug fixes

**Phase 2: API Integration** (Week 2)
- Implement IntelligenceAPI service
- Add caching layer
- Update Enhanced Dialog to use real APIs
- Testing and performance optimization

**Phase 3: Polish and Optimization** (Week 3)
- Advanced export options
- Performance improvements
- Error handling refinement
- Documentation and training

## Future Enhancements

### Export Enhancements
- Excel (.xlsx) format support
- JSON export option
- Scheduled exports
- Email delivery of exports

### API Enhancements
- WebSocket for real-time updates
- Predictive prefetching
- Offline mode with service workers
- GraphQL API for flexible queries

### Dialog Enhancements
- Comparison mode (compare 2-3 companies)
- Historical data charts
- News feed integration
- Social media sentiment

### Analytics
- Track which companies are viewed most
- Export usage analytics
- API performance dashboards
- User behavior insights
