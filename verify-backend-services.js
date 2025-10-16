#!/usr/bin/env node

/**
 * Backend Services Verification Script
 * Verifies all backend services, database connections, and API endpoints
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

class BackendVerifier {
  constructor() {
    this.baseUrl = 'http://localhost:4000';
    this.results = {
      environment: { passed: 0, failed: 0, tests: [] },
      database: { passed: 0, failed: 0, tests: [] },
      apiEndpoints: { passed: 0, failed: 0, tests: [] },
      frontend: { passed: 0, failed: 0, tests: [] }
    };
  }

  async runAllTests() {
    console.log('🔍 BALLISTIC INTELLIGENCE PLATFORM - Backend Verification\n');
    console.log('=' .repeat(70));
    
    await this.verifyEnvironment();
    await this.verifyDatabase();
    await this.verifyAPIEndpoints();
    await this.verifyFrontendBackendIntegration();
    
    this.printSummary();
  }

  async verifyEnvironment() {
    console.log('\n📋 PHASE 1: Environment Configuration');
    console.log('-' .repeat(70));
    
    // Check .env file
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      this.logTest('environment', '✅ .env file exists', true);
      
      const envContent = fs.readFileSync(envPath, 'utf8');
      const requiredVars = ['DATABASE_URL', 'NEXT_PUBLIC_API_URL', 'PORT'];
      
      requiredVars.forEach(varName => {
        const hasVar = envContent.includes(varName);
        this.logTest('environment', `${hasVar ? '✅' : '❌'} ${varName} configured`, hasVar);
      });
    } else {
      this.logTest('environment', '❌ .env file missing', false);
    }
    
    // Check database file
    const dbPath = path.join(__dirname, 'db', 'custom.db');
    const dbExists = fs.existsSync(dbPath);
    this.logTest('environment', `${dbExists ? '✅' : '❌'} Database file exists (${dbPath})`, dbExists);
    
    if (dbExists) {
      const stats = fs.statSync(dbPath);
      const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
      this.logTest('environment', `✅ Database size: ${sizeMB} MB`, true);
    }
    
    // Check Prisma client
    const prismaPath = path.join(__dirname, 'node_modules', '.prisma', 'client');
    const prismaExists = fs.existsSync(prismaPath);
    this.logTest('environment', `${prismaExists ? '✅' : '⚠️'} Prisma client ${prismaExists ? 'generated' : 'needs generation'}`, prismaExists);
  }

  async verifyDatabase() {
    console.log('\n💾 PHASE 2: Database Connectivity');
    console.log('-' .repeat(70));
    
    try {
      const healthData = await this.testEndpoint('/api/health');
      
      if (healthData.success && healthData.data.database) {
        const db = healthData.data.database;
        this.logTest('database', `✅ Database connected (${db.responseTime})`, true);
        this.logTest('database', `✅ Database status: ${db.status}`, db.status === 'healthy');
        
        if (db.records) {
          this.logTest('database', `✅ Companies in database: ${db.records.companies}`, true);
          this.logTest('database', `✅ Portfolio companies: ${db.records.portfolio}`, true);
        }
      } else {
        this.logTest('database', '❌ Database health check failed', false);
      }
    } catch (error) {
      this.logTest('database', `❌ Database connection error: ${error.message}`, false);
    }
  }

  async verifyAPIEndpoints() {
    console.log('\n🔌 PHASE 3: API Endpoints Verification');
    console.log('-' .repeat(70));
    
    const endpoints = [
      { path: '/api/health', name: 'Health Check API', critical: true },
      { path: '/api/dashboard', name: 'Dashboard API', critical: true },
      { path: '/api/ballistic-portfolio?action=stats', name: 'Portfolio API', critical: true },
      { path: '/api/companies', name: 'Companies API', critical: false },
      { path: '/api/conventions', name: 'Conventions API', critical: false },
      { path: '/api/data-sources', name: 'Data Sources API', critical: false },
      { path: '/api/analytics', name: 'Analytics API', critical: false },
      { path: '/api/analysis', name: 'Analysis API', critical: false }
    ];
    
    for (const endpoint of endpoints) {
      try {
        const data = await this.testEndpoint(endpoint.path);
        const success = data && (data.success !== false);
        const icon = success ? '✅' : (endpoint.critical ? '❌' : '⚠️');
        this.logTest('apiEndpoints', `${icon} ${endpoint.name}: ${success ? 'OPERATIONAL' : 'OFFLINE'}`, success);
      } catch (error) {
        const icon = endpoint.critical ? '❌' : '⚠️';
        this.logTest('apiEndpoints', `${icon} ${endpoint.name}: ERROR (${error.message})`, false);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  async verifyFrontendBackendIntegration() {
    console.log('\n🌐 PHASE 4: Frontend-Backend Integration');
    console.log('-' .repeat(70));
    
    const pages = [
      { path: '/executive-dashboard', name: 'Executive Dashboard' },
      { path: '/ballistic-portfolio-new', name: 'Portfolio Intelligence' }
    ];
    
    for (const page of pages) {
      try {
        const response = await this.testPage(page.path);
        const success = response.statusCode === 200;
        this.logTest('frontend', `${success ? '✅' : '❌'} ${page.name}: ${success ? 'ACCESSIBLE' : 'ERROR'}`, success);
      } catch (error) {
        this.logTest('frontend', `❌ ${page.name}: ${error.message}`, false);
      }
    }
  }

  testEndpoint(path) {
    return new Promise((resolve, reject) => {
      const url = `${this.baseUrl}${path}`;
      const req = http.get(url, (res) => {
        let data = '';
        
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (e) {
            resolve({ success: res.statusCode === 200 });
          }
        });
      });
      
      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Timeout'));
      });
    });
  }

  testPage(path) {
    return new Promise((resolve, reject) => {
      const url = `${this.baseUrl}${path}`;
      const req = http.get(url, (res) => {
        resolve({ statusCode: res.statusCode });
        res.resume(); // Drain the response
      });
      
      req.on('error', reject);
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Timeout'));
      });
    });
  }

  logTest(category, message, passed) {
    this.results[category].tests.push({ message, passed });
    if (passed) {
      this.results[category].passed++;
    } else {
      this.results[category].failed++;
    }
    console.log(message);
  }

  printSummary() {
    console.log('\n' + '=' .repeat(70));
    console.log('📊 VERIFICATION SUMMARY');
    console.log('=' .repeat(70));
    
    let totalPassed = 0;
    let totalFailed = 0;
    
    Object.entries(this.results).forEach(([category, result]) => {
      const total = result.passed + result.failed;
      const percentage = total > 0 ? Math.round((result.passed / total) * 100) : 0;
      const status = percentage === 100 ? '🟢' : percentage >= 80 ? '🟡' : '🔴';
      
      console.log(`\n${status} ${category.toUpperCase()}: ${result.passed}/${total} passed (${percentage}%)`);
      
      totalPassed += result.passed;
      totalFailed += result.failed;
    });
    
    const totalTests = totalPassed + totalFailed;
    const overallPercentage = Math.round((totalPassed / totalTests) * 100);
    
    console.log('\n' + '=' .repeat(70));
    console.log(`🎯 OVERALL: ${totalPassed}/${totalTests} tests passed (${overallPercentage}%)`);
    
    if (overallPercentage === 100) {
      console.log('🎉 ALL SYSTEMS OPERATIONAL - READY FOR PRODUCTION!');
    } else if (overallPercentage >= 90) {
      console.log('✅ SYSTEM MOSTLY OPERATIONAL - Minor issues detected');
    } else if (overallPercentage >= 75) {
      console.log('⚠️  SYSTEM PARTIALLY OPERATIONAL - Some services need attention');
    } else {
      console.log('❌ SYSTEM ISSUES DETECTED - Please review failed tests');
    }
    
    console.log('=' .repeat(70));
    console.log('\n💡 Quick Actions:');
    console.log('   • View Application: http://localhost:4000');
    console.log('   • Executive Dashboard: http://localhost:4000/executive-dashboard');
    console.log('   • Portfolio Intelligence: http://localhost:4000/ballistic-portfolio-new');
    console.log('   • API Health: http://localhost:4000/api/health');
    console.log('   • API Dashboard: http://localhost:4000/api/dashboard');
    console.log('\n');
  }
}

// Run verification
const verifier = new BackendVerifier();
verifier.runAllTests().catch(console.error);
