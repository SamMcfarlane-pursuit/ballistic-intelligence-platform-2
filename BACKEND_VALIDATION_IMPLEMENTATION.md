# Backend Validation Implementation Plan
## Enterprise-Grade Data Quality & Security Framework

---

## Overview

This document outlines the implementation of a comprehensive backend validation system using industry-standard tools and frameworks to ensure data quality, security, and compliance for the Ballistic Intelligence Platform.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Data Ingestion Layer                      │
│  (Crunchbase API, BrightData API, Google Sheets)            │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │  Apache NiFi       │
                    │  Data Pipeline     │
                    │  Orchestration     │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │ Great Expectations │
                    │ Data Validation    │
                    │ (Completeness,     │
                    │  Uniqueness,       │
                    │  Consistency)      │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │ Cross-Source       │
                    │ Verification       │
                    │ (Compare sources)  │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │ OWASP ZAP          │
                    │ Security Scan      │
                    │ (XSS, Injection)   │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │ Databricks Delta   │
                    │ Lake (ACID)        │
                    │ Data Storage       │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │ Monte Carlo        │
                    │ Data Observability │
                    │ (Monitoring)       │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │ Pandas Profiling   │
                    │ Anomaly Detection  │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │   API Layer        │
                    │   (Next.js)        │
                    └────────────────────┘
```

---

## 1. Great Expectations - Data Quality Validation

### Purpose
Validate data completeness, uniqueness, and consistency against defined business rules.

### Installation
```bash
pip install great-expectations
```

### Implementation Structure
```
backend/
├── great_expectations/
│   ├── expectations/
│   │   ├── company_data_suite.json
│   │   ├── funding_data_suite.json
│   │   └── leadership_data_suite.json
│   ├── checkpoints/
│   │   └── data_validation_checkpoint.yml
│   └── great_expectations.yml
└── validation/
    └── ge_validator.py
```


### Great Expectations Configuration

**File: `backend/validation/ge_validator.py`**
```python
import great_expectations as ge
from great_expectations.core.batch import RuntimeBatchRequest
from great_expectations.data_context import DataContext

class DataValidator:
    def __init__(self):
        self.context = DataContext()
        
    def validate_company_data(self, df):
        """Validate company data against expectations"""
        
        # Create expectation suite
        suite = self.context.create_expectation_suite(
            expectation_suite_name="company_data_suite",
            overwrite_existing=True
        )
        
        # Define expectations
        expectations = [
            # Completeness checks
            {
                "expectation_type": "expect_column_values_to_not_be_null",
                "kwargs": {"column": "name"}
            },
            {
                "expectation_type": "expect_column_values_to_not_be_null",
                "kwargs": {"column": "sector"}
            },
            {
                "expectation_type": "expect_column_values_to_not_be_null",
                "kwargs": {"column": "totalFunding"}
            },
            
            # Uniqueness checks
            {
                "expectation_type": "expect_column_values_to_be_unique",
                "kwargs": {"column": "id"}
            },
            
            # Consistency checks
            {
                "expectation_type": "expect_column_values_to_be_in_set",
                "kwargs": {
                    "column": "sector",
                    "value_set": [
                        "Cloud Security",
                        "Identity Management",
                        "Data Protection",
                        "Network Security",
                        "Application Security",
                        "Threat Intelligence",
                        "Endpoint Security"
                    ]
                }
            },
            
            # Range checks
            {
                "expectation_type": "expect_column_values_to_be_between",
                "kwargs": {
                    "column": "totalFunding",
                    "min_value": 0,
                    "max_value": 10000000000  # $10B max
                }
            },
            {
                "expectation_type": "expect_column_values_to_be_between",
                "kwargs": {
                    "column": "founded",
                    "min_value": 1990,
                    "max_value": 2025
                }
            },
            
            # Business logic checks
            {
                "expectation_type": "expect_column_pair_values_A_to_be_greater_than_B",
                "kwargs": {
                    "column_A": "totalFunding",
                    "column_B": "lastRoundAmount"
                }
            }
        ]
        
        # Add expectations to suite
        for exp in expectations:
            suite.add_expectation(**exp)
        
        # Validate data
        batch_request = RuntimeBatchRequest(
            datasource_name="pandas_datasource",
            data_connector_name="default_runtime_data_connector",
            data_asset_name="company_data",
            runtime_parameters={"batch_data": df},
            batch_identifiers={"default_identifier_name": "default_identifier"}
        )
        
        checkpoint_result = self.context.run_checkpoint(
            checkpoint_name="company_data_checkpoint",
            batch_request=batch_request
        )
        
        return checkpoint_result
```


---

## 2. Pandas Profiling - Automated Anomaly Detection

### Purpose
Generate automated reports to detect anomalies, missing values, and distribution skews.

### Installation
```bash
pip install pandas-profiling ydata-profiling
```

### Implementation

**File: `backend/validation/profiling.py`**
```python
from ydata_profiling import ProfileReport
import pandas as pd
from datetime import datetime

class DataProfiler:
    def __init__(self, output_dir="./reports"):
        self.output_dir = output_dir
        
    def generate_profile(self, df, dataset_name):
        """Generate comprehensive data profile report"""
        
        profile = ProfileReport(
            df,
            title=f"{dataset_name} Data Quality Report",
            explorative=True,
            config_file={
                "correlations": {
                    "pearson": {"calculate": True},
                    "spearman": {"calculate": True},
                    "kendall": {"calculate": False}
                },
                "missing_diagrams": {
                    "bar": True,
                    "matrix": True,
                    "heatmap": True
                },
                "duplicates": {
                    "head": 10
                }
            }
        )
        
        # Save report
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{self.output_dir}/{dataset_name}_profile_{timestamp}.html"
        profile.to_file(filename)
        
        # Extract key metrics
        metrics = {
            "total_rows": len(df),
            "total_columns": len(df.columns),
            "missing_cells": df.isnull().sum().sum(),
            "missing_percentage": (df.isnull().sum().sum() / (len(df) * len(df.columns))) * 100,
            "duplicate_rows": df.duplicated().sum(),
            "memory_usage": df.memory_usage(deep=True).sum() / 1024**2  # MB
        }
        
        return profile, metrics
    
    def detect_anomalies(self, df, column, threshold=3):
        """Detect anomalies using Z-score method"""
        
        if df[column].dtype in ['int64', 'float64']:
            mean = df[column].mean()
            std = df[column].std()
            z_scores = (df[column] - mean) / std
            anomalies = df[abs(z_scores) > threshold]
            
            return {
                "column": column,
                "anomaly_count": len(anomalies),
                "anomaly_percentage": (len(anomalies) / len(df)) * 100,
                "anomalies": anomalies.to_dict('records')
            }
        
        return None
```


---

## 3. Monte Carlo - Data Observability & Monitoring

### Purpose
Monitor data pipeline health and alert on drift/quality degradation.

### Installation
```bash
pip install monte-carlo-data
```

### Implementation

**File: `backend/monitoring/monte_carlo_monitor.py`**
```python
from monte_carlo_data import MonteCarloClient
import os

class DataObservabilityMonitor:
    def __init__(self):
        self.client = MonteCarloClient(
            api_key_id=os.getenv('MONTE_CARLO_API_KEY_ID'),
            api_key_secret=os.getenv('MONTE_CARLO_API_KEY_SECRET')
        )
        
    def create_monitor(self, table_name, monitor_type="freshness"):
        """Create data quality monitor"""
        
        monitors = {
            "freshness": {
                "type": "freshness",
                "threshold": "24 hours",
                "alert_condition": "no_data_received"
            },
            "volume": {
                "type": "volume",
                "threshold": "10%",
                "alert_condition": "volume_change_exceeds_threshold"
            },
            "schema": {
                "type": "schema",
                "alert_condition": "schema_change_detected"
            },
            "field_quality": {
                "type": "field_quality",
                "field": "totalFunding",
                "rule": "not_null",
                "threshold": "95%"
            }
        }
        
        monitor_config = monitors.get(monitor_type)
        
        response = self.client.create_monitor(
            table=table_name,
            **monitor_config
        )
        
        return response
    
    def check_data_drift(self, table_name, baseline_date, current_date):
        """Check for data drift between two time periods"""
        
        drift_report = self.client.get_drift_report(
            table=table_name,
            baseline_date=baseline_date,
            current_date=current_date
        )
        
        return {
            "has_drift": drift_report.get("drift_detected", False),
            "drift_score": drift_report.get("drift_score", 0),
            "affected_columns": drift_report.get("affected_columns", []),
            "recommendations": drift_report.get("recommendations", [])
        }
```


---

## 4. Apache NiFi - Cross-Source Verification

### Purpose
Build workflows to auto-compare data across Crunchbase, BrightData, and SEC filings.

### Installation
```bash
# Docker installation
docker pull apache/nifi:latest
docker run -d -p 8080:8080 --name nifi apache/nifi:latest
```

### NiFi Flow Configuration

**File: `backend/nifi/cross_source_verification_flow.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<template>
  <description>Cross-source data verification workflow</description>
  <groupId>cross-source-verification</groupId>
  <name>Company Data Verification</name>
  
  <processors>
    <!-- Fetch from Crunchbase -->
    <processor>
      <id>fetch-crunchbase</id>
      <name>Fetch Crunchbase Data</name>
      <type>InvokeHTTP</type>
      <config>
        <url>https://api.crunchbase.com/v4/entities/organizations/${company_name}</url>
        <method>GET</method>
        <headers>X-cb-user-key: ${crunchbase_api_key}</headers>
      </config>
    </processor>
    
    <!-- Fetch from BrightData -->
    <processor>
      <id>fetch-brightdata</id>
      <name>Fetch BrightData Intelligence</name>
      <type>InvokeHTTP</type>
      <config>
        <url>https://api.brightdata.com/enrich?company=${company_name}</url>
        <method>GET</method>
        <headers>Authorization: Bearer ${brightdata_api_key}</headers>
      </config>
    </processor>
    
    <!-- Compare Data -->
    <processor>
      <id>compare-sources</id>
      <name>Compare Data Sources</name>
      <type>ExecuteScript</type>
      <config>
        <script-engine>python</script-engine>
        <script-body>
          import json
          
          crunchbase_data = json.loads(flowFile.getAttribute('crunchbase_data'))
          brightdata_data = json.loads(flowFile.getAttribute('brightdata_data'))
          
          discrepancies = []
          
          # Compare funding amounts
          cb_funding = crunchbase_data.get('total_funding_usd', 0)
          bd_funding = brightdata_data.get('funding', 0)
          
          if abs(cb_funding - bd_funding) / cb_funding > 0.05:  # >5% difference
              discrepancies.append({
                  'field': 'total_funding',
                  'crunchbase': cb_funding,
                  'brightdata': bd_funding,
                  'difference_pct': ((bd_funding - cb_funding) / cb_funding) * 100
              })
          
          flowFile = session.putAttribute(flowFile, 'discrepancies', json.dumps(discrepancies))
        </script-body>
      </config>
    </processor>
    
    <!-- Alert on Discrepancies -->
    <processor>
      <id>alert-discrepancies</id>
      <name>Alert on Data Discrepancies</name>
      <type>RouteOnAttribute</type>
      <config>
        <property name="has_discrepancies">
          ${discrepancies:isEmpty():not()}
        </property>
      </config>
    </processor>
  </processors>
</template>
```

### Python Alternative (Simpler Implementation)

**File: `backend/validation/cross_source_verifier.py`**
```python
import asyncio
import aiohttp
from typing import Dict, List
import logging

class CrossSourceVerifier:
    def __init__(self, crunchbase_key, brightdata_key):
        self.crunchbase_key = crunchbase_key
        self.brightdata_key = brightdata_key
        self.logger = logging.getLogger(__name__)
        
    async def fetch_crunchbase(self, company_name):
        """Fetch data from Crunchbase API"""
        url = f"https://api.crunchbase.com/v4/entities/organizations/{company_name}"
        headers = {"X-cb-user-key": self.crunchbase_key}
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers) as response:
                return await response.json()
    
    async def fetch_brightdata(self, company_name):
        """Fetch data from BrightData API"""
        url = f"https://api.brightdata.com/enrich?company={company_name}"
        headers = {"Authorization": f"Bearer {self.brightdata_key}"}
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers) as response:
                return await response.json()
    
    async def verify_company(self, company_name) -> Dict:
        """Verify company data across sources"""
        
        # Fetch from both sources in parallel
        crunchbase_data, brightdata_data = await asyncio.gather(
            self.fetch_crunchbase(company_name),
            self.fetch_brightdata(company_name)
        )
        
        discrepancies = []
        
        # Compare funding amounts
        cb_funding = crunchbase_data.get('properties', {}).get('total_funding_usd', 0)
        bd_funding = brightdata_data.get('funding', 0)
        
        if cb_funding > 0 and abs(cb_funding - bd_funding) / cb_funding > 0.05:
            discrepancies.append({
                'field': 'total_funding',
                'crunchbase': cb_funding,
                'brightdata': bd_funding,
                'difference_pct': ((bd_funding - cb_funding) / cb_funding) * 100,
                'severity': 'high' if abs((bd_funding - cb_funding) / cb_funding) > 0.20 else 'medium'
            })
        
        # Compare location
        cb_location = crunchbase_data.get('properties', {}).get('location_identifiers', [{}])[0].get('value', '')
        bd_location = brightdata_data.get('location', '')
        
        if cb_location.lower() != bd_location.lower():
            discrepancies.append({
                'field': 'location',
                'crunchbase': cb_location,
                'brightdata': bd_location,
                'severity': 'low'
            })
        
        return {
            'company': company_name,
            'verified': len(discrepancies) == 0,
            'discrepancies': discrepancies,
            'crunchbase_data': crunchbase_data,
            'brightdata_data': brightdata_data
        }
```


---

## 5. Databricks Delta Lake - ACID Transactions

### Purpose
Use ACID transactions to validate data integrity during merges from multiple sources.

### Installation
```bash
pip install delta-spark pyspark
```

### Implementation

**File: `backend/storage/delta_lake_manager.py`**
```python
from delta import *
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, when, lit
import logging

class DeltaLakeManager:
    def __init__(self, warehouse_path="./delta_warehouse"):
        self.warehouse_path = warehouse_path
        
        # Initialize Spark with Delta Lake
        builder = SparkSession.builder \
            .appName("BallisticIntelligence") \
            .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \
            .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \
            .config("spark.sql.warehouse.dir", warehouse_path)
        
        self.spark = configure_spark_with_delta_pip(builder).getOrCreate()
        self.logger = logging.getLogger(__name__)
    
    def merge_company_data(self, source_df, target_table="companies"):
        """Merge company data with ACID guarantees"""
        
        target_path = f"{self.warehouse_path}/{target_table}"
        
        # Create Delta table if doesn't exist
        if not DeltaTable.isDeltaTable(self.spark, target_path):
            source_df.write.format("delta").save(target_path)
            self.logger.info(f"Created new Delta table: {target_table}")
            return
        
        # Load existing Delta table
        delta_table = DeltaTable.forPath(self.spark, target_path)
        
        # Perform UPSERT (merge) operation
        delta_table.alias("target").merge(
            source_df.alias("source"),
            "target.id = source.id"
        ).whenMatchedUpdate(
            condition = "source.lastUpdated > target.lastUpdated",
            set = {
                "name": "source.name",
                "sector": "source.sector",
                "totalFunding": "source.totalFunding",
                "lastRound": "source.lastRound",
                "lastRoundAmount": "source.lastRoundAmount",
                "latestDateOfFunding": "source.latestDateOfFunding",
                "website": "source.website",
                "dataSource": "source.dataSource",
                "lastUpdated": "source.lastUpdated"
            }
        ).whenNotMatchedInsert(
            values = {
                "id": "source.id",
                "name": "source.name",
                "sector": "source.sector",
                "totalFunding": "source.totalFunding",
                "lastRound": "source.lastRound",
                "lastRoundAmount": "source.lastRoundAmount",
                "latestDateOfFunding": "source.latestDateOfFunding",
                "website": "source.website",
                "dataSource": "source.dataSource",
                "lastUpdated": "source.lastUpdated"
            }
        ).execute()
        
        self.logger.info(f"Merged data into {target_table}")
    
    def validate_data_integrity(self, table_name="companies"):
        """Validate data integrity using Delta Lake features"""
        
        target_path = f"{self.warehouse_path}/{table_name}"
        df = self.spark.read.format("delta").load(target_path)
        
        # Check for duplicates
        duplicate_count = df.groupBy("id").count().filter(col("count") > 1).count()
        
        # Check for null values in critical fields
        null_checks = {
            "name": df.filter(col("name").isNull()).count(),
            "sector": df.filter(col("sector").isNull()).count(),
            "totalFunding": df.filter(col("totalFunding").isNull()).count()
        }
        
        # Check for invalid values
        invalid_funding = df.filter(col("totalFunding") < 0).count()
        invalid_founded = df.filter((col("founded") < 1990) | (col("founded") > 2025)).count()
        
        return {
            "table": table_name,
            "total_rows": df.count(),
            "duplicates": duplicate_count,
            "null_values": null_checks,
            "invalid_funding": invalid_funding,
            "invalid_founded": invalid_founded,
            "is_valid": duplicate_count == 0 and sum(null_checks.values()) == 0 and invalid_funding == 0
        }
    
    def time_travel_query(self, table_name, version=None, timestamp=None):
        """Query historical versions of data"""
        
        target_path = f"{self.warehouse_path}/{table_name}"
        
        if version is not None:
            df = self.spark.read.format("delta").option("versionAsOf", version).load(target_path)
        elif timestamp is not None:
            df = self.spark.read.format("delta").option("timestampAsOf", timestamp).load(target_path)
        else:
            df = self.spark.read.format("delta").load(target_path)
        
        return df
```


---

## 6. OWASP ZAP - Security Validation

### Purpose
Scan for XSS vulnerabilities and security issues in data ingestion pipelines.

### Installation
```bash
# Docker installation
docker pull owasp/zap2docker-stable
```

### Implementation

**File: `backend/security/owasp_scanner.py`**
```python
from zapv2 import ZAPv2
import time
import logging

class SecurityScanner:
    def __init__(self, zap_proxy='http://localhost:8080'):
        self.zap = ZAPv2(proxies={'http': zap_proxy, 'https': zap_proxy})
        self.logger = logging.getLogger(__name__)
    
    def scan_api_endpoint(self, target_url):
        """Scan API endpoint for vulnerabilities"""
        
        self.logger.info(f"Starting security scan for: {target_url}")
        
        # Spider the target
        scan_id = self.zap.spider.scan(target_url)
        while int(self.zap.spider.status(scan_id)) < 100:
            time.sleep(2)
        
        self.logger.info("Spider scan completed")
        
        # Active scan
        scan_id = self.zap.ascan.scan(target_url)
        while int(self.zap.ascan.status(scan_id)) < 100:
            time.sleep(5)
        
        self.logger.info("Active scan completed")
        
        # Get alerts
        alerts = self.zap.core.alerts(baseurl=target_url)
        
        # Categorize by risk
        categorized = {
            'high': [],
            'medium': [],
            'low': [],
            'informational': []
        }
        
        for alert in alerts:
            risk = alert.get('risk', '').lower()
            categorized[risk].append({
                'name': alert.get('alert'),
                'description': alert.get('description'),
                'solution': alert.get('solution'),
                'url': alert.get('url'),
                'param': alert.get('param')
            })
        
        return {
            'target': target_url,
            'total_alerts': len(alerts),
            'high_risk': len(categorized['high']),
            'medium_risk': len(categorized['medium']),
            'low_risk': len(categorized['low']),
            'alerts': categorized
        }
    
    def validate_input_data(self, data):
        """Validate input data for XSS and injection attacks"""
        
        dangerous_patterns = [
            '<script',
            'javascript:',
            'onerror=',
            'onload=',
            '<iframe',
            'eval(',
            'document.cookie',
            'DROP TABLE',
            'SELECT * FROM',
            'UNION SELECT',
            '../',
            '..\\',
        ]
        
        vulnerabilities = []
        
        for key, value in data.items():
            if isinstance(value, str):
                for pattern in dangerous_patterns:
                    if pattern.lower() in value.lower():
                        vulnerabilities.append({
                            'field': key,
                            'pattern': pattern,
                            'value': value[:100],  # First 100 chars
                            'severity': 'high'
                        })
        
        return {
            'is_safe': len(vulnerabilities) == 0,
            'vulnerabilities': vulnerabilities
        }
```


---

## 7. Integrated Validation Pipeline

### Complete Implementation

**File: `backend/validation/validation_pipeline.py`**
```python
import asyncio
import logging
from datetime import datetime
from typing import Dict, List
import pandas as pd

from .ge_validator import DataValidator
from .profiling import DataProfiler
from .cross_source_verifier import CrossSourceVerifier
from .delta_lake_manager import DeltaLakeManager
from .owasp_scanner import SecurityScanner

class ValidationPipeline:
    def __init__(self, config):
        self.config = config
        self.logger = logging.getLogger(__name__)
        
        # Initialize validators
        self.ge_validator = DataValidator()
        self.profiler = DataProfiler()
        self.cross_verifier = CrossSourceVerifier(
            crunchbase_key=config['CRUNCHBASE_API_KEY'],
            brightdata_key=config['BRIGHTDATA_API_KEY']
        )
        self.delta_manager = DeltaLakeManager()
        self.security_scanner = SecurityScanner()
        
    async def validate_and_ingest(self, raw_data: List[Dict]) -> Dict:
        """Complete validation and ingestion pipeline"""
        
        pipeline_start = datetime.now()
        results = {
            'timestamp': pipeline_start.isoformat(),
            'stages': {},
            'overall_status': 'pending'
        }
        
        try:
            # Stage 1: Security Validation
            self.logger.info("Stage 1: Security validation")
            security_results = []
            for record in raw_data:
                sec_check = self.security_scanner.validate_input_data(record)
                if not sec_check['is_safe']:
                    security_results.append({
                        'record_id': record.get('id'),
                        'vulnerabilities': sec_check['vulnerabilities']
                    })
            
            results['stages']['security'] = {
                'status': 'passed' if len(security_results) == 0 else 'failed',
                'vulnerabilities_found': len(security_results),
                'details': security_results
            }
            
            if len(security_results) > 0:
                results['overall_status'] = 'failed'
                return results
            
            # Stage 2: Data Quality Validation (Great Expectations)
            self.logger.info("Stage 2: Data quality validation")
            df = pd.DataFrame(raw_data)
            ge_results = self.ge_validator.validate_company_data(df)
            
            results['stages']['data_quality'] = {
                'status': 'passed' if ge_results.success else 'failed',
                'expectations_met': ge_results.statistics['successful_expectations'],
                'expectations_failed': ge_results.statistics['unsuccessful_expectations'],
                'details': ge_results.to_json_dict()
            }
            
            if not ge_results.success:
                results['overall_status'] = 'failed'
                return results
            
            # Stage 3: Anomaly Detection (Pandas Profiling)
            self.logger.info("Stage 3: Anomaly detection")
            profile, metrics = self.profiler.generate_profile(df, "company_data")
            
            anomalies = []
            for column in ['totalFunding', 'founded', 'lastRoundAmount']:
                if column in df.columns:
                    anomaly_result = self.profiler.detect_anomalies(df, column)
                    if anomaly_result and anomaly_result['anomaly_count'] > 0:
                        anomalies.append(anomaly_result)
            
            results['stages']['anomaly_detection'] = {
                'status': 'passed' if len(anomalies) == 0 else 'warning',
                'anomalies_found': len(anomalies),
                'metrics': metrics,
                'details': anomalies
            }
            
            # Stage 4: Cross-Source Verification
            self.logger.info("Stage 4: Cross-source verification")
            verification_tasks = [
                self.cross_verifier.verify_company(record['name'])
                for record in raw_data[:10]  # Verify first 10 for performance
            ]
            verification_results = await asyncio.gather(*verification_tasks)
            
            discrepancies = [v for v in verification_results if not v['verified']]
            
            results['stages']['cross_source_verification'] = {
                'status': 'passed' if len(discrepancies) == 0 else 'warning',
                'companies_verified': len(verification_results),
                'discrepancies_found': len(discrepancies),
                'details': discrepancies
            }
            
            # Stage 5: ACID Transaction (Delta Lake)
            self.logger.info("Stage 5: ACID transaction")
            spark_df = self.delta_manager.spark.createDataFrame(df)
            self.delta_manager.merge_company_data(spark_df)
            
            integrity_check = self.delta_manager.validate_data_integrity()
            
            results['stages']['acid_transaction'] = {
                'status': 'passed' if integrity_check['is_valid'] else 'failed',
                'details': integrity_check
            }
            
            if not integrity_check['is_valid']:
                results['overall_status'] = 'failed'
                return results
            
            # All stages passed
            results['overall_status'] = 'success'
            results['records_processed'] = len(raw_data)
            results['processing_time_seconds'] = (datetime.now() - pipeline_start).total_seconds()
            
        except Exception as e:
            self.logger.error(f"Pipeline error: {str(e)}")
            results['overall_status'] = 'error'
            results['error'] = str(e)
        
        return results
```


---

## 8. Next.js API Integration

### API Route Implementation

**File: `src/app/api/validation/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Call Python validation pipeline
    const validationResult = await runValidationPipeline(data)
    
    if (validationResult.overall_status === 'success') {
      return NextResponse.json({
        success: true,
        message: 'Data validated and ingested successfully',
        details: validationResult
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        details: validationResult
      }, { status: 400 })
    }
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function runValidationPipeline(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const python = spawn('python3', [
      'backend/validation/run_pipeline.py',
      JSON.stringify(data)
    ])
    
    let output = ''
    let error = ''
    
    python.stdout.on('data', (data) => {
      output += data.toString()
    })
    
    python.stderr.on('data', (data) => {
      error += data.toString()
    })
    
    python.on('close', (code) => {
      if (code === 0) {
        try {
          resolve(JSON.parse(output))
        } catch (e) {
          reject(new Error('Failed to parse validation results'))
        }
      } else {
        reject(new Error(error || 'Validation pipeline failed'))
      }
    })
  })
}
```

**File: `backend/validation/run_pipeline.py`**
```python
#!/usr/bin/env python3
import sys
import json
import asyncio
from validation_pipeline import ValidationPipeline

async def main():
    # Read input data
    input_data = json.loads(sys.argv[1])
    
    # Load configuration
    config = {
        'CRUNCHBASE_API_KEY': os.getenv('CRUNCHBASE_API_KEY'),
        'BRIGHTDATA_API_KEY': os.getenv('BRIGHTDATA_API_KEY')
    }
    
    # Run validation pipeline
    pipeline = ValidationPipeline(config)
    results = await pipeline.validate_and_ingest(input_data)
    
    # Output results
    print(json.dumps(results))

if __name__ == '__main__':
    asyncio.run(main())
```

---

## 9. Monitoring Dashboard

### Real-Time Validation Monitoring

**File: `src/app/validation-dashboard/page.tsx`**
```typescript
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertTriangle, Activity } from 'lucide-react'

export default function ValidationDashboard() {
  const [metrics, setMetrics] = useState<any>(null)
  
  useEffect(() => {
    fetchValidationMetrics()
    const interval = setInterval(fetchValidationMetrics, 30000) // Every 30 seconds
    return () => clearInterval(interval)
  }, [])
  
  async function fetchValidationMetrics() {
    const response = await fetch('/api/validation/metrics')
    const data = await response.json()
    setMetrics(data)
  }
  
  if (!metrics) return <div>Loading...</div>
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Data Validation Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Data Quality Score"
          value={`${metrics.quality_score}%`}
          icon={<CheckCircle className="h-6 w-6 text-green-600" />}
          status="success"
        />
        
        <MetricCard
          title="Security Scans"
          value={metrics.security_scans_passed}
          subtitle={`${metrics.security_scans_total} total`}
          icon={<Activity className="h-6 w-6 text-blue-600" />}
          status="info"
        />
        
        <MetricCard
          title="Cross-Source Matches"
          value={`${metrics.cross_source_match_rate}%`}
          icon={<CheckCircle className="h-6 w-6 text-green-600" />}
          status="success"
        />
        
        <MetricCard
          title="Anomalies Detected"
          value={metrics.anomalies_detected}
          icon={<AlertTriangle className="h-6 w-6 text-yellow-600" />}
          status="warning"
        />
      </div>
      
      {/* Recent Validation Results */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Validation Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.recent_validations.map((validation: any, index: number) => (
              <ValidationResult key={index} validation={validation} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({ title, value, subtitle, icon, status }: any) {
  const statusColors = {
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  }
  
  return (
    <Card className={statusColors[status]}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}

function ValidationResult({ validation }: any) {
  const statusIcon = {
    success: <CheckCircle className="h-5 w-5 text-green-600" />,
    failed: <XCircle className="h-5 w-5 text-red-600" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-600" />
  }
  
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center space-x-4">
        {statusIcon[validation.status]}
        <div>
          <p className="font-medium">{validation.dataset_name}</p>
          <p className="text-sm text-gray-500">{validation.timestamp}</p>
        </div>
      </div>
      <Badge variant={validation.status === 'success' ? 'default' : 'destructive'}>
        {validation.records_processed} records
      </Badge>
    </div>
  )
}
```

---

## 10. Deployment & Configuration

### Environment Variables

**File: `.env.local`**
```bash
# API Keys
CRUNCHBASE_API_KEY=your_crunchbase_key
BRIGHTDATA_API_KEY=your_brightdata_key

# Monte Carlo
MONTE_CARLO_API_KEY_ID=your_monte_carlo_id
MONTE_CARLO_API_KEY_SECRET=your_monte_carlo_secret

# Delta Lake
DELTA_WAREHOUSE_PATH=./delta_warehouse

# OWASP ZAP
ZAP_PROXY_URL=http://localhost:8080

# Validation Settings
VALIDATION_ENABLED=true
VALIDATION_STRICT_MODE=true
CROSS_SOURCE_VERIFICATION_ENABLED=true
```

### Docker Compose Setup

**File: `docker-compose.yml`**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
    depends_on:
      - zap
      - nifi
  
  zap:
    image: owasp/zap2docker-stable
    ports:
      - "8080:8080"
    command: zap.sh -daemon -host 0.0.0.0 -port 8080 -config api.disablekey=true
  
  nifi:
    image: apache/nifi:latest
    ports:
      - "8443:8443"
    environment:
      - NIFI_WEB_HTTP_PORT=8443
  
  spark:
    image: bitnami/spark:latest
    ports:
      - "8081:8081"
    environment:
      - SPARK_MODE=master
```

---

## 11. Testing Strategy

### Unit Tests

**File: `backend/tests/test_validation.py`**
```python
import pytest
from validation.ge_validator import DataValidator
from validation.cross_source_verifier import CrossSourceVerifier
import pandas as pd

def test_great_expectations_validation():
    validator = DataValidator()
    
    # Valid data
    valid_df = pd.DataFrame([{
        'id': '1',
        'name': 'Test Company',
        'sector': 'Cloud Security',
        'totalFunding': 5000000,
        'founded': 2020
    }])
    
    result = validator.validate_company_data(valid_df)
    assert result.success == True
    
    # Invalid data
    invalid_df = pd.DataFrame([{
        'id': '1',
        'name': None,  # Should fail
        'sector': 'Invalid Sector',  # Should fail
        'totalFunding': -1000,  # Should fail
        'founded': 1800  # Should fail
    }])
    
    result = validator.validate_company_data(invalid_df)
    assert result.success == False

@pytest.mark.asyncio
async def test_cross_source_verification():
    verifier = CrossSourceVerifier('test_key', 'test_key')
    
    result = await verifier.verify_company('CrowdStrike')
    
    assert 'company' in result
    assert 'verified' in result
    assert 'discrepancies' in result
```

---

## Summary

This implementation provides:

✅ **Data Quality Validation** - Great Expectations ensures completeness, uniqueness, consistency  
✅ **Anomaly Detection** - Pandas Profiling identifies outliers and distribution issues  
✅ **Data Observability** - Monte Carlo monitors pipeline health and drift  
✅ **Cross-Source Verification** - Apache NiFi/Python compares data across sources  
✅ **ACID Transactions** - Delta Lake ensures data integrity during merges  
✅ **Security Scanning** - OWASP ZAP prevents XSS and injection attacks  
✅ **Real-Time Monitoring** - Dashboard tracks validation metrics  
✅ **Automated Pipeline** - End-to-end validation before data ingestion  

**Next Steps:**
1. Install dependencies: `pip install -r backend/requirements.txt`
2. Configure environment variables
3. Start Docker services: `docker-compose up -d`
4. Run validation pipeline: `python backend/validation/run_pipeline.py`
5. Monitor dashboard: `http://localhost:4000/validation-dashboard`

---

**Last Updated:** Current Session  
**Status:** Ready for Implementation  
**Estimated Setup Time:** 2-3 days
