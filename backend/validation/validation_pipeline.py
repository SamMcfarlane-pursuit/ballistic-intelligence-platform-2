"""
Complete validation pipeline orchestrator
"""
import asyncio
from typing import Dict, List, Any
from datetime import datetime
import logging
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from validation.data_validator import DataValidator
from security.input_sanitizer import SecurityValidator
from validation.cross_source_verifier import CrossSourceVerifier

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ValidationPipeline:
    """Orchestrates the complete validation pipeline"""
    
    def __init__(self):
        self.data_validator = DataValidator()
        self.security_validator = SecurityValidator()
        self.cross_verifier = CrossSourceVerifier()
    
    async def validate_and_process(self, data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Run complete validation pipeline
        
        Args:
            data: List of company dictionaries
            
        Returns:
            Complete validation results
        """
        pipeline_start = datetime.now()
        
        results = {
            'timestamp': pipeline_start.isoformat(),
            'total_records': len(data),
            'stages': {},
            'overall_status': 'pending'
        }
        
        try:
            # Stage 1: Security Validation
            logger.info("Stage 1: Security validation")
            security_results = self.security_validator.validate_input_data(data)
            
            results['stages']['security'] = {
                'status': 'passed' if security_results['is_safe'] else 'failed',
                'vulnerabilities_found': security_results['vulnerabilities_found'],
                'details': security_results.get('vulnerabilities', [])[:10]  # First 10
            }
            
            if not security_results['is_safe']:
                results['overall_status'] = 'failed'
                results['failure_reason'] = 'Security vulnerabilities detected'
                return results
            
            # Stage 2: Data Quality Validation
            logger.info("Stage 2: Data quality validation")
            quality_results = self.data_validator.validate_company_data(data)
            
            results['stages']['data_quality'] = {
                'status': 'passed' if quality_results['success'] else 'failed',
                'total_validations': len(quality_results.get('validations', {})),
                'errors': quality_results.get('errors', []),
                'warnings': quality_results.get('warnings', [])
            }
            
            if not quality_results['success']:
                results['overall_status'] = 'failed'
                results['failure_reason'] = 'Data quality checks failed'
                return results
            
            # Stage 3: Cross-Source Verification
            logger.info("Stage 3: Cross-source verification")
            verification_results = await self.cross_verifier.verify_companies(data)
            
            results['stages']['cross_source_verification'] = {
                'status': 'passed' if verification_results['match_rate'] > 90 else 'warning',
                'companies_checked': verification_results['companies_checked'],
                'match_rate': verification_results['match_rate'],
                'discrepancies_found': verification_results['discrepancies_found'],
                'details': verification_results.get('discrepancies', [])[:5]  # First 5
            }
            
            # All stages completed
            results['overall_status'] = 'success'
            results['processing_time_seconds'] = (datetime.now() - pipeline_start).total_seconds()
            
            logger.info(f"Validation pipeline completed successfully in {results['processing_time_seconds']:.2f}s")
            
        except Exception as e:
            logger.error(f"Pipeline error: {str(e)}")
            results['overall_status'] = 'error'
            results['error'] = str(e)
        
        return results

async def main():
    """Main entry point for CLI usage"""
    import json
    
    # Read input from stdin or file
    if len(sys.argv) > 1:
        input_data = json.loads(sys.argv[1])
    else:
        input_data = json.load(sys.stdin)
    
    # Run validation
    pipeline = ValidationPipeline()
    results = await pipeline.validate_and_process(input_data)
    
    # Output results
    print(json.dumps(results, indent=2))

if __name__ == '__main__':
    asyncio.run(main())
