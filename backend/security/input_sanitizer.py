"""
Security validation and input sanitization
"""
import re
from typing import Dict, List, Any
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SecurityValidator:
    """Validates input data for security vulnerabilities"""
    
    def __init__(self):
        self.dangerous_patterns = [
            r'<script[^>]*>.*?</script>',  # Script tags
            r'javascript:',                 # JavaScript protocol
            r'onerror\s*=',                # Event handlers
            r'onload\s*=',
            r'onclick\s*=',
            r'<iframe[^>]*>',              # Iframes
            r'eval\s*\(',                  # Eval function
            r'document\.cookie',           # Cookie access
            r'DROP\s+TABLE',               # SQL injection
            r'SELECT\s+\*\s+FROM',
            r'UNION\s+SELECT',
            r'\.\./|\.\.\\\\',             # Path traversal
            r'exec\s*\(',                  # Code execution
            r'system\s*\(',
        ]
        
        self.compiled_patterns = [
            re.compile(pattern, re.IGNORECASE) 
            for pattern in self.dangerous_patterns
        ]
    
    def validate_input_data(self, data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Validate input data for security vulnerabilities
        
        Args:
            data: List of company dictionaries
            
        Returns:
            Validation results with vulnerabilities found
        """
        vulnerabilities = []
        
        for idx, record in enumerate(data):
            record_vulns = self._scan_record(record, idx)
            vulnerabilities.extend(record_vulns)
        
        return {
            'is_safe': len(vulnerabilities) == 0,
            'vulnerabilities_found': len(vulnerabilities),
            'vulnerabilities': vulnerabilities
        }
    
    def _scan_record(self, record: Dict[str, Any], record_idx: int) -> List[Dict[str, Any]]:
        """Scan a single record for vulnerabilities"""
        vulnerabilities = []
        
        for key, value in record.items():
            if isinstance(value, str):
                for pattern in self.compiled_patterns:
                    if pattern.search(value):
                        vulnerabilities.append({
                            'record_index': record_idx,
                            'field': key,
                            'pattern_matched': pattern.pattern,
                            'value_preview': value[:100],
                            'severity': 'high'
                        })
        
        return vulnerabilities
    
    def sanitize_data(self, data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Sanitize input data by removing dangerous content
        
        Args:
            data: List of company dictionaries
            
        Returns:
            Sanitized data
        """
        sanitized = []
        
        for record in data:
            sanitized_record = {}
            for key, value in record.items():
                if isinstance(value, str):
                    sanitized_record[key] = self._sanitize_string(value)
                else:
                    sanitized_record[key] = value
            sanitized.append(sanitized_record)
        
        return sanitized
    
    def _sanitize_string(self, value: str) -> str:
        """Sanitize a string value"""
        # Remove HTML tags
        value = re.sub(r'<[^>]+>', '', value)
        
        # Remove JavaScript
        value = re.sub(r'javascript:', '', value, flags=re.IGNORECASE)
        
        # Remove event handlers
        value = re.sub(r'on\w+\s*=', '', value, flags=re.IGNORECASE)
        
        # Trim whitespace
        value = value.strip()
        
        return value
