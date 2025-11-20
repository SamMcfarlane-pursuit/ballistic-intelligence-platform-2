# Implementation Plan

- [ ] 1. Create CSV Export Utility
  - Implement core CSV generation logic with proper escaping and formatting
  - Add support for customizable column selection
  - Implement browser download trigger functionality
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 1.1 Implement CSVExporter class
  - Create `src/utils/csv-exporter.ts` with CSVExporter class
  - Implement `exportCompanies()` method with ExportOptions interface
  - Implement `generateCSV()` private method for CSV string generation
  - Implement `escapeCSV()` method to handle special characters (commas, quotes, newlines)
  - Implement `downloadCSV()` method to trigger browser download using Blob and URL.createObjectURL
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 1.2 Add column selection and data validation
  - Implement logic to filter columns based on ExportOptions.selectedColumns
  - Add conditional inclusion of intelligence metrics based on includeIntelligence flag
  - Add conditional inclusion of leadership data based on includeLeadership flag
  - Integrate with existing Data Validation System to ensure no null values in export
  - Add default value substitution for missing data fields
  - _Requirements: 1.4, 1.5, 7.1, 7.2, 7.3_

- [ ]* 1.3 Write unit tests for CSV exporter
  - Create `src/utils/csv-exporter.test.ts` test file
  - Test CSV generation with various data types and special characters
  - Test column selection options and filtering
  - Test empty data and edge case handling
  - Test data validation integration
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 2. Create Export Button Component
  - Build UI component with dropdown menu for export options
  - Implement export triggering with visual feedback
  - Add success/error notifications
  - _Requirements: 1.1, 1.5, 7.4, 7.5_

- [ ] 2.1 Implement ExportButton component
  - Create `src/components/dashboard/ExportButton.tsx` component
  - Add dropdown menu using shadcn/ui DropdownMenu component
  - Implement export options UI (include intelligence, include leadership, column selection)
  - Add loading state during export operation
  - Add disabled state when no companies available
  - _Requirements: 1.1, 7.1, 7.2, 7.3_

- [ ] 2.2 Add export notifications and error handling
  - Implement success toast notification showing number of companies exported
  - Implement error toast notification with specific error messages
  - Add error recovery options (retry button)
  - Preserve filter state after export operation
  - _Requirements: 1.5, 7.5, 6.3_

- [ ] 2.3 Integrate ExportButton into dashboard
  - Add ExportButton to executive dashboard page header
  - Pass filtered companies data to ExportButton
  - Wire up export options to CSVExporter utility
  - Test export with various filter combinations
  - _Requirements: 1.1, 1.5_

- [ ] 3. Implement Intelligence API Service
  - Create centralized API service with caching layer
  - Implement BrightData API integration
  - Implement Crunchbase API integration
  - Add cache management with 5-minute expiration
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 5.1, 5.2, 5.3, 5.4_

- [ ] 3.1 Create IntelligenceAPI service class
  - Create `src/services/intelligence-api.ts` file
  - Implement IntelligenceAPI class with static methods
  - Add in-memory cache using Map with timestamp tracking
  - Implement `isCacheValid()`, `setCache()`, `getCache()` private methods
  - Implement `clearExpiredCache()` method for cache cleanup
  - Define TypeScript interfaces for APIResponse, BrightDataIntelligence, CrunchbaseCompanyData
  - _Requirements: 2.3, 5.1, 5.2, 5.3_

- [ ] 3.2 Implement BrightData API integration
  - Implement `fetchBrightData()` method to call `/api/brightdata` endpoint
  - Add cache check before making API request
  - Implement error handling with fallback to cached data
  - Add loading indicator support during fetch
  - Return APIResponse with success status, data, cached flag, and timestamp
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.7_

- [ ] 3.3 Implement Crunchbase API integration
  - Implement `fetchCrunchbase()` method to call `/api/crunchbase` endpoint
  - Add cache check before making API request
  - Implement error handling with fallback to cached data
  - Parse and normalize Crunchbase response data
  - Return APIResponse with success status, data, cached flag, and timestamp
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 3.4 Implement combined intelligence fetching
  - Implement `fetchCombinedIntelligence()` method
  - Use Promise.all to fetch BrightData and Crunchbase data in parallel
  - Merge data from both sources into single Company object
  - Prioritize API data over spreadsheet data for accuracy
  - Integrate with Data Validation System to ensure completeness
  - _Requirements: 2.1, 2.2, 2.5, 4.5_

- [ ]* 3.5 Write unit tests for API service
  - Create `src/services/intelligence-api.test.ts` test file
  - Mock external API calls using jest.mock
  - Test cache hit and miss scenarios
  - Test API failure handling and fallback to cache
  - Test data merging logic for combined intelligence
  - Test concurrent request handling
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 4. Enhance Company Dialog with Real API Integration
  - Update EnhancedCompanyDialog to use IntelligenceAPI service
  - Replace mock data loading with real API calls
  - Implement proper loading states for each section
  - Add error handling and fallback UI
  - _Requirements: 2.6, 3.1, 3.2, 3.3, 3.4, 3.6, 3.7, 6.4_

- [ ] 4.1 Update dialog to use IntelligenceAPI
  - Import IntelligenceAPI service into EnhancedCompanyDialog component
  - Replace mock setTimeout with actual `fetchCombinedIntelligence()` call
  - Update state management to handle APIResponse structure
  - Add cached data indicator when using cached intelligence
  - Display timestamp of last data update
  - _Requirements: 2.2, 2.6, 3.1, 3.2_

- [ ] 4.2 Implement section-based loading states
  - Add loading indicators for Intelligence Insights section
  - Keep Company Overview and Funding Details visible immediately
  - Show skeleton loaders for intelligence metrics while fetching
  - Implement progressive enhancement (show data as it arrives)
  - _Requirements: 2.6, 3.6_

- [ ] 4.3 Add error handling and fallback UI
  - Implement error state for failed API requests
  - Show cached data with warning banner when API fails
  - Add retry button for failed requests
  - Display user-friendly error messages
  - Ensure basic company info always displays even if intelligence fails
  - _Requirements: 2.4, 3.4, 6.1, 6.2, 6.4_

- [ ] 4.4 Add export from dialog feature
  - Add export button to dialog header
  - Implement single company export functionality
  - Use CSVExporter to export current company data
  - Show success notification after export
  - _Requirements: 1.1, 1.2, 1.3_

- [ ]* 4.5 Write integration tests for dialog
  - Create integration test file for EnhancedCompanyDialog
  - Test dialog opening and closing behavior
  - Test data loading with mocked API responses
  - Test error states and fallback UI
  - Test export functionality from dialog
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6_

- [ ] 5. Implement Data Validation and Quality Assurance
  - Enhance existing null-prevention utilities
  - Add validation for API responses
  - Implement default value substitution
  - Add data completeness checks for exports
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 5.1 Enhance data validation utilities
  - Update `src/utils/null-prevention.ts` with new validation functions
  - Add `validateAPIResponse()` function for API data validation
  - Add `validateExportData()` function for CSV export validation
  - Implement `substituteDefaults()` function for missing data
  - Add validation error reporting with detailed error messages
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 5.2 Integrate validation into API service
  - Add validation calls in IntelligenceAPI after fetching data
  - Validate BrightData responses before caching
  - Validate Crunchbase responses before caching
  - Log validation errors for monitoring
  - Substitute safe defaults for invalid data
  - _Requirements: 2.5, 4.1, 4.2, 4.5_

- [ ] 5.3 Integrate validation into CSV export
  - Add validation check before generating CSV
  - Ensure all required fields are present
  - Replace null/undefined values with "N/A" in CSV output
  - Add validation summary to export success message
  - _Requirements: 1.4, 4.3, 4.4_

- [ ]* 5.4 Write validation tests
  - Create test file for enhanced validation utilities
  - Test null value detection and substitution
  - Test API response validation
  - Test export data validation
  - Test edge cases (undefined, empty strings, invalid types)
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 6. Implement Error Handling and Resilience
  - Create error handling utilities
  - Implement error UI components
  - Add retry mechanisms
  - Implement graceful degradation
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 6.1 Create error handling utilities
  - Create `src/utils/error-handler.ts` file
  - Define ErrorType enum and AppError interface
  - Implement `handleAPIError()` function for API failures
  - Implement `handleExportError()` function for export failures
  - Implement `handleValidationError()` function for validation failures
  - Add error logging functionality
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 6.2 Create error UI components
  - Create `src/components/ui/error-toast.tsx` for transient errors
  - Create `src/components/ui/error-banner.tsx` for persistent issues
  - Create `src/components/ui/error-state.tsx` for inline error states
  - Implement retry functionality in error components
  - Add dismiss functionality for recoverable errors
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 6.3 Integrate error handling into components
  - Add error handling to ExportButton component
  - Add error handling to EnhancedCompanyDialog component
  - Add error handling to IntelligenceAPI service
  - Implement retry mechanisms with exponential backoff
  - Show appropriate error UI based on error type
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 6.4 Implement graceful degradation
  - Add offline detection in IntelligenceAPI
  - Show offline indicator when network unavailable
  - Use cached data exclusively in offline mode
  - Queue operations for retry when connection restored
  - Test functionality with simulated network failures
  - _Requirements: 6.4_

- [ ] 7. Performance Optimization and Caching
  - Implement cache cleanup mechanisms
  - Add performance monitoring
  - Optimize large dataset handling
  - Implement lazy loading for dialog
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 7.1 Implement cache management
  - Add automatic cache cleanup in IntelligenceAPI
  - Implement `clearExpiredCache()` to run periodically
  - Add cache size monitoring
  - Implement cache eviction for memory management
  - Add cache statistics tracking (hit rate, size, age)
  - _Requirements: 5.2, 5.3, 5.4_

- [ ] 7.2 Optimize dialog loading performance
  - Implement lazy loading of intelligence data (only when dialog opens)
  - Add prefetching on company card hover (optional enhancement)
  - Use React.memo for dialog sections to prevent unnecessary re-renders
  - Implement progressive data loading (show basic info first, then intelligence)
  - _Requirements: 5.1, 5.4_

- [ ] 7.3 Optimize CSV export for large datasets
  - Implement chunked CSV generation for 1000+ companies
  - Add progress indicator for large exports
  - Implement streaming export for very large datasets
  - Add export size warnings for 10MB+ files
  - Test performance with 5000+ company dataset
  - _Requirements: 5.1_

- [ ]* 7.4 Add performance monitoring
  - Implement performance tracking for API calls
  - Track CSV generation time
  - Track dialog open time
  - Log performance metrics to console in development
  - Add performance dashboard (future enhancement)
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 8. Final Integration and Testing
  - Integrate all components into dashboard
  - Perform end-to-end testing
  - Fix any integration issues
  - Update documentation
  - _Requirements: All_

- [ ] 8.1 Integrate all features into dashboard
  - Add ExportButton to dashboard header with proper positioning
  - Ensure EnhancedCompanyDialog works with all company cards
  - Verify IntelligenceAPI is used throughout the application
  - Test all features work together seamlessly
  - Verify data flows correctly from API to UI to export
  - _Requirements: All_

- [ ] 8.2 Perform end-to-end testing
  - Test complete workflow: view company → open dialog → view intelligence → export
  - Test export with various filter combinations
  - Test export with custom column selections
  - Test dialog with network failures and cache scenarios
  - Test concurrent operations (multiple dialogs, exports)
  - _Requirements: All_

- [ ] 8.3 Fix integration issues and polish
  - Address any bugs found during E2E testing
  - Improve error messages based on testing feedback
  - Optimize performance bottlenecks
  - Ensure consistent styling across all new components
  - Verify accessibility compliance (keyboard navigation, screen readers)
  - _Requirements: All_

- [ ]* 8.4 Update documentation
  - Add JSDoc comments to all new functions and components
  - Update README with new features
  - Create user guide for CSV export functionality
  - Document API integration setup and configuration
  - Add troubleshooting guide for common issues
  - _Requirements: All_
