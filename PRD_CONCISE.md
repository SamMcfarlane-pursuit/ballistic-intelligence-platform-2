# **PRD: Ballistic Intelligence Platform**

**Author:** Sam McFarlane  
**Date:** November 13, 2024  
**Status:** Approved  
**Version:** 1.0

---

### 1. Overview

Ballistic Intelligence Platform is a real-time cybersecurity market intelligence dashboard that enables VC investors to analyze 200+ companies across 7 sectors in 10 minutes instead of 10 hours, reducing research time by 85% through unified data aggregation from Crunchbase, BrightData, and Google Sheets.

---

### 2. Problem Statement

**Current Problem:**  
VC investors waste 15-20 hours per week manually researching cybersecurity companies across fragmented sources (Crunchbase, LinkedIn, news sites, spreadsheets), resulting in missed opportunities, incomplete data, and delayed decisions.

**Impact:**  
- 60% of time spent on research vs. deal-making
- Opportunities identified 2-3 months too late
- Inaccurate investment memos from incomplete leadership data
- Analysis paralysis from 200+ companies across multiple tools

**Desired Future State:**  
VCs access complete, verified, real-time intelligence on the entire cybersecurity market in a single dashboard, making faster decisions with 98%+ data accuracy.

---

### 3. Goals & Objectives

- **Goal 1:** Reduce VC research time from 15-20 hours/week to 2-3 hours/week by Q1 2025
- **Goal 2:** Achieve 80% weekly active usage among 50 invited cybersecurity VCs by December 31, 2024
- **Goal 3:** Deliver 98% data accuracy with verified CEO/CTO names for all 200+ companies by launch date
- **Goal 4:** Enable average of 3+ CSV exports per user per week for investment presentations by Q1 2025

---

### 4. User Personas

**VC Partner (Primary)**  
- Role: Makes $5M-$50M investment decisions
- Needs: Quick sector trends, momentum scores, verified data
- Pain: Information overload, time pressure
- Success: Identify opportunities 2-3 months earlier

**VC Analyst (Primary)**  
- Role: Prepares investment memos and due diligence
- Needs: Complete company profiles, leadership verification, export tools
- Pain: Hours on LinkedIn/Crunchbase research
- Success: Accurate memos in 1/4 the time

**Investment Associate (Primary)**  
- Role: Tracks market trends and monitors portfolio
- Needs: Filtering, search, real-time updates
- Pain: Fragmented data sources
- Success: Spot emerging companies first

---

### 5. User Stories & Requirements

**User Stories:**

- As a **VC Partner**, I want to **view sectors ranked by momentum score**, so that I can **allocate capital to high-growth markets**.
- As a **VC Analyst**, I want to **see verified CEO/CTO names**, so that I can **prepare accurate investment memos**.
- As an **Investment Associate**, I want to **filter companies by sector/region/stage**, so that I can **find companies matching our thesis**.
- As a **VC Partner**, I want to **export company data to CSV**, so that I can **share analysis with investment committee**.

**Functional Requirements:**

- Display 7 cybersecurity sectors with momentum scores (0-100), company counts, and total funding
- Show 200+ company profiles with verified leadership (CEO, CTO, Head), funding data, and AI-enriched intelligence
- Provide filtering by sector, region (5 options), funding stage (5 options), and investor
- Enable real-time search with autocomplete across all companies
- Support CSV export with 35+ enhanced fields (momentum, innovation index, risk assessment)
- Display 100+ patents with novelty scores and innovation potential ratings
- Show 6 companies per page with pagination (3 columns × 2 rows)
- Provide grid/list view toggle

**Non-Functional Requirements:**

- **Performance:** Page load < 3 seconds, search results < 500ms
- **Security:** PII masking, data redaction, role-based access, audit logging
- **Reliability:** 99.5% uptime with graceful API fallbacks
- **Data Quality:** 98%+ accuracy, zero null values, verified leadership

---

### 6. User Journey

**Journey: Partner Identifying Investment**

1. Opens dashboard → Views Trending Sectors
2. Sees Cloud Security #1 (Momentum: 28, $3.2B funding)
3. Clicks sector → Reviews key players and trends
4. Switches to Market Intelligence tab
5. Filters: "Cloud Security" + "Series A" + "North America"
6. Views 12 matching companies in grid
7. Clicks company → Reviews profile with verified CEO/CTO
8. Exports to CSV for investment committee
9. **Result:** 3 potential investments identified in 10 minutes

---

### 7. Design & UX

**Visual Design:**
- Blue/gray professional color scheme (#0066FF, #1A3766)
- Shadcn/UI component library with Tailwind CSS
- Desktop-first (1920×1080 primary), responsive for tablet/mobile

**Key Components:**
- CompanyIntelligenceCard: Blue header, white body, leadership section
- SectorIntelligenceCard: Momentum visualization, key metrics
- PatentIntelligenceCard: Novelty score, innovation rating
- EnhancedCompanyDialog: Full-screen company profile

**Wireframes:** See `src/components/dashboard/` for implemented components

---

### 8. Scope

**In Scope:**

- Trending Sectors with 7+ sectors and momentum scores
- Market Intelligence with 200+ companies and verified leadership
- Patent Deep Dive with 100+ patents and innovation metrics
- CSV export for companies, sectors, and patents
- Advanced filtering (sector, region, stage, investor, time period)
- Real-time search with autocomplete
- Grid/List view toggle
- Data validation and null prevention
- PII protection and access control

**Out of Scope (for this release):**

- CRM or deal management features
- Financial modeling or valuation tools
- Email notifications or alerts
- Native mobile app (responsive web only)
- Team collaboration features
- Historical trends beyond 180 days
- Salesforce or CRM integrations
- Custom dashboard builder

---

### 9. Assumptions & Dependencies

**Assumptions:**

- VCs use desktop computers with modern browsers
- Users comfortable with data-driven tools and CSV exports
- Crunchbase data sufficiently accurate for funding information
- 50-100 cybersecurity VCs is sufficient initial market
- Users will use platform weekly for market monitoring

**Dependencies:**

- **Crunchbase API:** Company funding data (fallback: manual updates)
- **BrightData API:** Market intelligence (fallback: basic data)
- **Google Sheets API:** Real-time import (fallback: CSV upload)
- **Vercel:** Hosting and deployment
- **Next.js 14:** Framework for SSR and performance
- **Shadcn/UI:** Component library

---

### 10. Success Metrics

**Engagement:**
- Weekly Active Users (WAU): >80% of invited VCs
- Feature Adoption: >60% use all 3 tabs
- Session Duration: 15-20 minutes average

**Efficiency:**
- Research Time: <5 minutes per company (vs. 30+ min baseline)
- Time Saved: 85% reduction (15-20 hours → 2-3 hours/week)

**Quality:**
- Data Accuracy: <2% error reports
- Leadership Verification: 100% verified CEO/CTO
- Data Completeness: 98%+ fields populated

**Usage:**
- CSV Exports: >3 per user per week
- Search Usage: >50% of sessions
- Filter Usage: >70% of sessions

**Business:**
- User Retention: >90% monthly
- Deal Flow: Opportunities identified 2-3 months earlier
- NPS Score: >50

---

### 11. Open Questions

1. **Data Refresh:** Daily, weekly, or on-demand updates? (Impact: API costs vs. freshness)
2. **Export Limits:** Cap at 10 exports/day to prevent scraping?
3. **User Roles:** Need Admin/Analyst/Viewer roles or single role for MVP?
4. **Pricing:** Freemium vs. paid-only? Per-seat or per-firm?
5. **GDPR:** Required for EU-based VCs?
6. **Mobile:** Native app priority for V2?
7. **Integrations:** Salesforce, Slack, or email for V2?
8. **Historical Data:** How far back for momentum trends? (Currently 180 days)

---

**Status:** ✅ Approved & Production Ready  
**Launch Target:** December 15, 2024  
**Next Steps:** User testing with 5 VCs, final QA, launch prep
