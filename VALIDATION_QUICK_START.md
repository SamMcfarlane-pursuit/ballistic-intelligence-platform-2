# Backend Validation - Quick Start Guide

## 🚀 3-Step Setup

### Step 1: Install Dependencies (2 minutes)

```bash
cd backend
./setup.sh
```

### Step 2: Test Locally (30 seconds)

```bash
source backend/venv/bin/activate
python3 backend/test_validation.py
```

### Step 3: Test API (30 seconds)

```bash
# Make sure Next.js is running (npm run dev)
curl http://localhost:4000/api/validation/test
```

---

## ✅ What You Get

### 1. Data Quality Validation
- ✅ No null values in required fields
- ✅ No duplicate IDs
- ✅ Valid sectors only
- ✅ Funding amounts in valid range ($0-$10B)
- ✅ Founded years between 1990-2025
- ✅ Business logic (last round ≤ total funding)

### 2. Security Validation
- ✅ XSS attack prevention
- ✅ SQL injection detection
- ✅ Path traversal blocking
- ✅ Malicious code scanning

### 3. Cross-Source Verification
- ✅ Compare data across sources
- ✅ Flag discrepancies > 5%
- ✅ Async processing

---

## 📡 API Endpoints

### Validate Data
```bash
POST /api/validation
Content-Type: application/json

[
  {
    "id": "1",
    "name": "CrowdStrike",
    "sector": "Cloud Security",
    "totalFunding": 500000000,
    "founded": 2011
  }
]
```

### Test Endpoint
```bash
GET /api/validation/test
```

---

## 📊 Example Response

```json
{
  "success": true,
  "message": "Data validated successfully",
  "details": {
    "overall_status": "success",
    "total_records": 1,
    "stages": {
      "security": { "status": "passed" },
      "data_quality": { "status": "passed" },
      "cross_source_verification": { "status": "passed" }
    },
    "processing_time_seconds": 0.15
  }
}
```

---

## 🔧 Integration Example

```typescript
// In your Next.js component or API route
async function validateCompanyData(companies: Company[]) {
  const response = await fetch('/api/validation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(companies)
  })
  
  const result = await response.json()
  
  if (result.success) {
    console.log('✅ Data validated successfully')
    return companies
  } else {
    console.error('❌ Validation failed:', result.details)
    throw new Error('Data validation failed')
  }
}
```

---

## 📁 File Structure

```
backend/
├── validation/
│   ├── data_validator.py          ✅ Created
│   ├── cross_source_verifier.py   ✅ Created
│   └── validation_pipeline.py     ✅ Created
├── security/
│   └── input_sanitizer.py         ✅ Created
├── requirements.txt                ✅ Created
├── setup.sh                        ✅ Created
├── test_validation.py              ✅ Created
├── check_connection.py             ✅ Created
└── README.md                       ✅ Created

src/app/api/validation/
├── route.ts                        ✅ Created
└── test/
    └── route.ts                    ✅ Created
```

---

## ✨ Status

**System:** ✅ READY  
**Python:** ✅ 3.13.5 Installed  
**API Endpoints:** ✅ Connected  
**Tests:** ✅ Available  
**Documentation:** ✅ Complete  

---

## 🎯 Next Action

Run this command to get started:

```bash
cd backend && ./setup.sh && source venv/bin/activate && python3 test_validation.py
```

Then visit: http://localhost:4000/api/validation/test

---

**That's it! Your backend validation system is ready to use! 🎉**
