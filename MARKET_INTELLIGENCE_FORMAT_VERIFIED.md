# Market Intelligence Card Format - Verified ✅

## Card Design (Matching Screenshot)

### Visual Structure
```
┌─────────────────────────────────────────┐
│ 🏢 [Blue Gradient Header]              │
│    Company Name                [Badge]  │
│    Sector                               │
│    Description text...                  │
├─────────────────────────────────────────┤
│ [White Body Section]                    │
│                                         │
│ Location:          📍 San Francisco     │
│ Founded:           📅 2020              │
│ Funding From:      👥 Investor Name     │
│ Total Funding:     $17.5M               │
│ Last Round:        Series A - $10.5M    │
│ Latest Funding:    Oct 14, 2025         │
│                                         │
│ ─────────────────────────────────────── │
│ 🌐 Company Links                        │
│ [Light Blue Box] Website: mondoo.com    │
│ [Light Blue Box] LinkedIn: mondoo       │
│                                         │
│ ─────────────────────────────────────── │
│ 👥 Leadership Team                      │
│ [Gray Box] CEO: Name (CEO & Founder)    │
│ [Gray Box] CTO: Name (CTO & Co-Founder) │
│ [Gray Box] Head: Name (VP of Eng)       │
└─────────────────────────────────────────┘
```

## Implementation Details

### ✅ Card Component
- **File**: `src/components/dashboard/CompanyIntelligenceCard.tsx`
- **Status**: No errors, properly formatted
- **Features**:
  - Blue gradient header (from-blue-600 via-blue-700 to-blue-900)
  - White body section with gray text labels
  - Light blue backgrounds (bg-blue-50) for Company Links
  - Light gray backgrounds (bg-gray-50) for Leadership Team
  - Proper icon colors (blue-600 for icons)
  - Clickable card with onClick handler
  - Links stop propagation to prevent card click

### ✅ Grid Layout
- **Configuration**: `grid grid-cols-1 md:grid-cols-3 gap-6 w-full`
- **Responsive**:
  - Mobile (< 768px): 1 column (stacked)
  - Tablet & Desktop (≥ 768px): **3 columns** (3 cards per row)
- **Layout**: **3 cards on top row × 3 cards on bottom row = 6 total per page**
- **Gap**: 6 units (1.5rem / 24px)

### ✅ Pagination
- **Items per page**: 6 cards
- **Layout**: 3 columns × 2 rows = 6 cards per page
- **Total pages**: Dynamically calculated based on filtered companies
- **Controls**: Previous, numbered pages, Next buttons
- **Active state**: Dark background for current page

### ✅ Data Structure
All companies now include:
- ✅ Basic info (name, description, sector, location, founded)
- ✅ Funding details (totalFunding, lastRound, lastRoundAmount, latestDateOfFunding)
- ✅ Investor info (fundingFrom)
- ✅ Links (website, linkedin)
- ✅ **Leadership team** (ceo, cto, head) - **ADDED**
- ✅ BrightData insights (newsSentiment, recentMentions, patents, etc.)

### Companies with Team Data
1. ✅ realCompanies (8 companies) - All have team data
2. ✅ mockCompanies (33 companies) - Team data added to:
   - ShieldTech (#1)
   - CryptoGuard (#2)
   - ThreatVision (#3)
   - SecureCloud (#4) - Already had it
   - IdentityLock (#5) - Already had it
   - DataVault Pro (#6)
   - CyberShield MENA (#7)
   - And more...

## Color Scheme

### Header (Blue Gradient)
- Background: `from-blue-600 via-blue-700 to-blue-900`
- Text: White (`text-white`)
- Icon background: `bg-white/20` with `backdrop-blur-sm`
- Badge: Green (`bg-green-500`) for positive sentiment

### Body (White)
- Background: `bg-white`
- Labels: Gray 600 (`text-gray-600`)
- Values: Gray 900 (`text-gray-900`)
- Icons: Blue 600 (`text-blue-600`)
- Links: Blue 600 (`text-blue-600`)

### Sections
- Company Links: `bg-blue-50 border-blue-200`
- Leadership Team: `bg-gray-50 border-gray-200`
- Section headers: `text-blue-900`
- Dividers: `border-gray-200`

## Typography

- **Company Name**: `text-lg font-bold`
- **Sector**: `text-sm`
- **Description**: `text-sm line-clamp-2`
- **Labels**: `text-sm text-gray-600`
- **Values**: `text-sm font-medium` or `font-bold`
- **Section Headers**: `text-sm font-semibold`

## Spacing

- Card padding: `p-0` (no padding on CardContent)
- Header padding: `p-5`
- Body padding: `p-5`
- Section spacing: `mb-5` between sections
- Item spacing: `space-y-2` for lists
- Border spacing: `pt-4` after borders

## Status: ✅ COMPLETE

All cards are properly formatted and displaying according to the screenshot reference. The Market Intelligence section shows 6 cards per page with clean pagination controls and proper visual hierarchy.
