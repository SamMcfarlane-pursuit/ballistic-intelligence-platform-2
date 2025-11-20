#!/usr/bin/env python3
"""
Test script for validation pipeline
"""
import asyncio
import json
import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from validation.validation_pipeline import ValidationPipeline

async def test_validation():
    """Test the validation pipeline with sample data"""
    
    # Sample test data
    test_data = [
        {
            'id': '1',
            'name': 'CrowdStrike',
            'sector': 'Cloud Security',
            'totalFunding': 500000000,
            'lastRoundAmount': 100000000,
            'founded': 2011,
            'location': 'Austin, TX, USA'
        },
        {
            'id': '2',
            'name': 'SentinelOne',
            'sector': 'Endpoint Security',
            'totalFunding': 700000000,
            'lastRoundAmount': 200000000,
            'founded': 2013,
            'location': 'Mountain View, CA, USA'
        },
        {
            'id': '3',
            'name': 'Invalid Company',
            'sector': 'Invalid Sector',  # This should fail
            'totalFunding': -1000,  # This should fail
            'lastRoundAmount': 500000000,
            'founded': 1800,  # This should fail
            'location': 'Unknown'
        }
    ]
    
    print("Testing Validation Pipeline")
    print("=" * 60)
    
    pipeline = ValidationPipeline()
    results = await pipeline.validate_and_process(test_data)
    
    print(json.dumps(results, indent=2))
    print("\n" + "=" * 60)
    print(f"Overall Status: {results['overall_status']}")
    print(f"Total Records: {results['total_records']}")
    print(f"Processing Time: {results.get('processing_time_seconds', 0):.2f}s")
    
    return results

if __name__ == '__main__':
    asyncio.run(test_validation())
