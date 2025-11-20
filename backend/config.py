"""
Configuration for backend validation system
"""
import os
from typing import Dict, Any

class ValidationConfig:
    """Configuration settings for validation system"""
    
    # API Keys
    CRUNCHBASE_API_KEY = os.getenv('CRUNCHBASE_API_KEY', '')
    BRIGHTDATA_API_KEY = os.getenv('BRIGHTDATA_API_KEY', '')
    
    # Validation Settings
    VALIDATION_ENABLED = os.getenv('VALIDATION_ENABLED', 'true').lower() == 'true'
    STRICT_MODE = os.getenv('VALIDATION_STRICT_MODE', 'true').lower() == 'true'
    CROSS_SOURCE_ENABLED = os.getenv('CROSS_SOURCE_VERIFICATION_ENABLED', 'true').lower() == 'true'
    
    # Tolerance Settings
    FUNDING_TOLERANCE = float(os.getenv('FUNDING_TOLERANCE', '0.05'))  # 5%
    
    # Performance Settings
    MAX_CONCURRENT_VERIFICATIONS = int(os.getenv('MAX_CONCURRENT_VERIFICATIONS', '5'))
    VALIDATION_TIMEOUT = int(os.getenv('VALIDATION_TIMEOUT', '30'))  # seconds
    
    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_TO_FILE = os.getenv('LOG_TO_FILE', 'false').lower() == 'true'
    LOG_FILE_PATH = os.getenv('LOG_FILE_PATH', './logs/validation.log')
    
    @classmethod
    def to_dict(cls) -> Dict[str, Any]:
        """Convert config to dictionary"""
        return {
            'validation_enabled': cls.VALIDATION_ENABLED,
            'strict_mode': cls.STRICT_MODE,
            'cross_source_enabled': cls.CROSS_SOURCE_ENABLED,
            'funding_tolerance': cls.FUNDING_TOLERANCE,
            'max_concurrent_verifications': cls.MAX_CONCURRENT_VERIFICATIONS,
            'validation_timeout': cls.VALIDATION_TIMEOUT,
            'log_level': cls.LOG_LEVEL
        }
