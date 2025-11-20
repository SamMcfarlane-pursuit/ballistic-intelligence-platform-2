#!/usr/bin/env python3
"""
Quick connection test for validation system
"""
import sys
import os

print("Backend Validation System - Connection Test")
print("=" * 60)

# Check Python version
print(f"✅ Python version: {sys.version}")

# Check if modules can be imported
try:
    import json
    print("✅ json module available")
except ImportError:
    print("❌ json module not available")

try:
    import asyncio
    print("✅ asyncio module available")
except ImportError:
    print("❌ asyncio module not available")

# Check if validation modules exist
validation_path = os.path.join(os.path.dirname(__file__), 'validation')
if os.path.exists(validation_path):
    print(f"✅ Validation directory exists: {validation_path}")
else:
    print(f"❌ Validation directory not found: {validation_path}")

# Check if key files exist
files_to_check = [
    'validation/data_validator.py',
    'validation/validation_pipeline.py',
    'security/input_sanitizer.py',
    'requirements.txt'
]

for file in files_to_check:
    file_path = os.path.join(os.path.dirname(__file__), file)
    if os.path.exists(file_path):
        print(f"✅ {file} exists")
    else:
        print(f"❌ {file} not found")

print("\n" + "=" * 60)
print("Connection test complete!")
print("\nNext steps:")
print("1. Run: cd backend && ./setup.sh")
print("2. Test: python3 test_validation.py")
print("3. API: curl http://localhost:4000/api/validation/test")
