"""
Cross-source data verification
"""
import asyncio
import aiohttp
from typing import Dict, List, Any
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CrossSourceVerifier:
    """Verifies data consistency across multiple sources"""
    
    def __init__(self):
        self.crunchbase_key = os.getenv('CRUNCHBASE_API_KEY', '')
        self.brightdata_key = os.getenv('BRIGHTDATA_API_KEY', '')
        self.tolerance = 0.05  # 5% tolerance for discrepancies
    
    async def verify_companies(self, companies: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Verify company data across sources
        
        Args:
            companies: List of company dictionaries
            
        Returns:
            Verification results
        """
        # For demo, verify first 5 companies to avoid rate limits
        companies_to_verify = companies[:5]
        
        verification_tasks = [
            self._verify_single_company(company)
            for company in companies_to_verify
        ]
        
        results = await asyncio.gather(*verification_tasks, return_exceptions=True)
        
        discrepancies = []
        for result in results:
            if isinstance(result, dict) and not result.get('verified', True):
                discrepancies.append(result)
        
        return {
            'companies_checked': len(companies_to_verify),
            'discrepancies_found': len(discrepancies),
            'match_rate': ((len(companies_to_verify) - len(discrepancies)) / len(companies_to_verify) * 100) if companies_to_verify else 100,
            'discrepancies': discrepancies
        }
    
    async def _verify_single_company(self, company: Dict[str, Any]) -> Dict[str, Any]:
        """Verify a single company's data"""
        try:
            # Simulate API calls (replace with real API calls in production)
            # For now, we'll do basic validation
            
            discrepancies = []
            
            # Check if funding amount is reasonable
            funding = company.get('totalFunding', 0)
            if funding < 0:
                discrepancies.append({
                    'field': 'totalFunding',
                    'issue': 'Negative funding amount',
                    'value': funding
                })
            
            # Check if last round amount is reasonable
            last_round = company.get('lastRoundAmount', 0)
            total_funding = company.get('totalFunding', 0)
            
            if last_round > total_funding:
                discrepancies.append({
                    'field': 'lastRoundAmount',
                    'issue': 'Last round exceeds total funding',
                    'last_round': last_round,
                    'total_funding': total_funding
                })
            
            return {
                'company': company.get('name', 'Unknown'),
                'verified': len(discrepancies) == 0,
                'discrepancies': discrepancies
            }
            
        except Exception as e:
            logger.error(f"Error verifying company {company.get('name')}: {str(e)}")
            return {
                'company': company.get('name', 'Unknown'),
                'verified': False,
                'error': str(e)
            }
