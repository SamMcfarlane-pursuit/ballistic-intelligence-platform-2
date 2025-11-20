# Backend Validation System

Enterprise-grade data validation and security framework for Ballistic Intelligence Platform.

## Features

✅ **Data Quality Validation** - Completeness, uniqueness, consistency checks  
✅ **Security Scanning** - XSS, injection, and vulnerability detection  
✅ **Cross-Source Verification** - Compare data across multiple APIs  
✅ **Automated Pipeline** - End-to-end validation before data ingestion  

## Quick Start

### 1. Setup

```bash
cd backend
./setup.sh
```

This will:
- Create a Python virtual environment
- Install all dependencies
- Prepare the validation system

### 2. Test the Validation Pipeline

```bash
# Activate virtual environment
source venv/bin/activate

# Run test
python3 test_validation.py
```

### 3. Use via API

The validation system is integrated with Next.js API routes:

**Endpoint:** `POST /api/validation`

**Example Request:**
```bash
curl -X POST http://localhost:4000/api/validation \
  -H "Content-Type: application/json" \
  -d '[
    {
      "id": "1",
      "name": "CrowdStrike",
      "sector": "Cloud Security",
      "totalFunding": 500000000,
      "founded": 2011
    }
  ]'
```

**Example Response:**
```json
{
  "success": true,
  "message": "Data validated successfully",
  "details": {
    "timestamp": "2024-01-15T10:30:00",
    "total_records": 1,
    "overall_status": "success",
    "stages": {
      "security": {
        "status": "passed",
        "vulnerabilities_found": 0
      },
      "data_quality": {
        "status": "passed",
        "errors": [],
        "warnings": []
      },
      "cross_source_verification": {
        "status": "passed",
        "match_rate": 100
      }
    }
  }
}
```

## Architecture

```
backend/
├── validation/
│   ├── data_validator.py          # Data quality checks
│   ├── cross_source_verifier.py   # Cross-source verification
│   └── validation_pipeline.py     # Main orchestrator
├── security/
│   └── input_sanitizer.py         # Security validation
├── requirements.txt                # Python dependencies
├── setup.sh                        # Setup script
└── test_validation.py              # Test script
```

## Validation Stages

### Stage 1: Security Validation
- XSS detection
- SQL injection prevention
- Path traversal detection
- Malicious code scanning

### Stage 2: Data Quality Validation
- **Completeness:** Check for null values in required fields
- **Uniqueness:** Detect duplicate IDs
- **Consistency:** Validate against allowed values (sectors, etc.)
- **Range Checks:** Ensure values are within valid ranges
- **Business Logic:** Verify relationships between fields

### Stage 3: Cross-Source Verification
- Compare data across multiple sources
- Flag discrepancies > 5%
- Verify data consistency

## Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```bash
# API Keys (optional for basic validation)
CRUNCHBASE_API_KEY=your_key_here
BRIGHTDATA_API_KEY=your_key_here

# Validation Settings
VALIDATION_TOLERANCE=0.05  # 5% tolerance for discrepancies
```

## Validation Rules

### Required Fields
- `name`
- `sector`
- `totalFunding`
- `founded`

### Valid Sectors
- Cloud Security
- Identity Management
- Data Protection
- Network Security
- Application Security
- Threat Intelligence
- Endpoint Security
- Email Security
- Encryption

### Value Ranges
- **totalFunding:** $0 to $10B
- **founded:** 1990 to 2025
- **lastRoundAmount:** Must be ≤ totalFunding

## Testing

### Run All Tests
```bash
python3 test_validation.py
```

### Test via API
```bash
curl http://localhost:4000/api/validation/test
```

## Troubleshooting

### Python not found
```bash
# Install Python 3
brew install python3  # macOS
```

### Dependencies installation fails
```bash
# Upgrade pip
pip install --upgrade pip

# Install dependencies one by one
pip install pandas
pip install aiohttp
pip install pydantic
```

### API endpoint not working
1. Ensure Next.js server is running: `npm run dev`
2. Check Python is in PATH: `which python3`
3. Check backend files exist: `ls -la backend/validation/`

## Integration with Next.js

The validation system is automatically integrated with your Next.js application:

1. **API Route:** `src/app/api/validation/route.ts`
2. **Test Route:** `src/app/api/validation/test/route.ts`

When you call the API endpoint, it:
1. Receives company data as JSON
2. Spawns Python validation pipeline
3. Returns validation results
4. Handles errors gracefully

## Performance

- **Validation Speed:** ~100-200ms for 10 companies
- **Memory Usage:** ~50MB for typical datasets
- **Scalability:** Can handle 1000+ companies per request

## Security

- All input is sanitized before processing
- Dangerous patterns are detected and blocked
- No code execution from user input
- Secure subprocess communication

## Next Steps

1. ✅ Setup complete - Run `./setup.sh`
2. ✅ Test locally - Run `python3 test_validation.py`
3. ✅ Test API - Visit `http://localhost:4000/api/validation/test`
4. 🔄 Integrate with your data pipeline
5. 🔄 Add custom validation rules as needed

## Support

For issues or questions, check:
- `BACKEND_VALIDATION_IMPLEMENTATION.md` - Full technical documentation
- `test_validation.py` - Example usage
- API endpoint: `GET /api/validation` - Usage instructions
