"""
Data Validation Module using Great Expectations
"""
import pandas as pd
from typing import Dict, List, Any
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataValidator:
    """Validates company data against business rules"""
    
    def __init__(self):
        self.validation_rules = {
            'required_fields': ['name', 'sector', 'totalFunding', 'founded'],
            'valid_sectors': [
                'Cloud Security',
                'Identity Management',
                'Data Protection',
                'Network Security',
                'Application Security',
                'Threat Intelligence',
                'Endpoint Security',
                'Email Security',
                'Encryption'
            ],
            'funding_range': (0, 10_000_000_000),  # $0 to $10B
            'founded_range': (1990, 2025)
        }
    
    def validate_company_data(self, data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Validate company data against defined rules
        
        Args:
            data: List of company dictionaries
            
        Returns:
            Validation results with success status and details
        """
        try:
            df = pd.DataFrame(data)
            
            results = {
                'success': True,
                'total_records': len(df),
                'validations': {
                    'completeness': self._check_completeness(df),
                    'uniqueness': self._check_uniqueness(df),
                    'consistency': self._check_consistency(df),
                    'range_checks': self._check_ranges(df),
                    'business_logic': self._check_business_logic(df)
                },
                'errors': [],
                'warnings': []
            }
            
            # Aggregate results
            for validation_type, validation_result in results['validations'].items():
                if not validation_result['passed']:
                    results['success'] = False
                    results['errors'].extend(validation_result.get('errors', []))
                results['warnings'].extend(validation_result.get('warnings', []))
            
            logger.info(f"Validation completed: {results['success']}")
            return results
            
        except Exception as e:
            logger.error(f"Validation error: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'total_records': 0
            }
    
    def _check_completeness(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Check for null values in required fields"""
        errors = []
        warnings = []
        
        for field in self.validation_rules['required_fields']:
            if field in df.columns:
                null_count = df[field].isnull().sum()
                if null_count > 0:
                    errors.append(f"Field '{field}' has {null_count} null values")
            else:
                errors.append(f"Required field '{field}' is missing")
        
        return {
            'passed': len(errors) == 0,
            'errors': errors,
            'warnings': warnings
        }
    
    def _check_uniqueness(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Check for duplicate IDs"""
        errors = []
        warnings = []
        
        if 'id' in df.columns:
            duplicate_count = df['id'].duplicated().sum()
            if duplicate_count > 0:
                errors.append(f"Found {duplicate_count} duplicate IDs")
        
        return {
            'passed': len(errors) == 0,
            'errors': errors,
            'warnings': warnings
        }
    
    def _check_consistency(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Check data consistency"""
        errors = []
        warnings = []
        
        if 'sector' in df.columns:
            invalid_sectors = df[~df['sector'].isin(self.validation_rules['valid_sectors'])]
            if len(invalid_sectors) > 0:
                errors.append(f"Found {len(invalid_sectors)} records with invalid sectors")
        
        return {
            'passed': len(errors) == 0,
            'errors': errors,
            'warnings': warnings
        }
    
    def _check_ranges(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Check value ranges"""
        errors = []
        warnings = []
        
        # Check funding range
        if 'totalFunding' in df.columns:
            min_funding, max_funding = self.validation_rules['funding_range']
            invalid_funding = df[
                (df['totalFunding'] < min_funding) | 
                (df['totalFunding'] > max_funding)
            ]
            if len(invalid_funding) > 0:
                errors.append(f"Found {len(invalid_funding)} records with invalid funding amounts")
        
        # Check founded year range
        if 'founded' in df.columns:
            min_year, max_year = self.validation_rules['founded_range']
            invalid_years = df[
                (df['founded'] < min_year) | 
                (df['founded'] > max_year)
            ]
            if len(invalid_years) > 0:
                errors.append(f"Found {len(invalid_years)} records with invalid founding years")
        
        return {
            'passed': len(errors) == 0,
            'errors': errors,
            'warnings': warnings
        }
    
    def _check_business_logic(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Check business logic rules"""
        errors = []
        warnings = []
        
        # Check if lastRoundAmount <= totalFunding
        if 'totalFunding' in df.columns and 'lastRoundAmount' in df.columns:
            invalid_logic = df[df['lastRoundAmount'] > df['totalFunding']]
            if len(invalid_logic) > 0:
                errors.append(
                    f"Found {len(invalid_logic)} records where last round amount exceeds total funding"
                )
        
        return {
            'passed': len(errors) == 0,
            'errors': errors,
            'warnings': warnings
        }
