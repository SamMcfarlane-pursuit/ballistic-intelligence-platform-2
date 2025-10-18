// Test to verify environment variables are loaded correctly
console.log('Testing Environment Variables...');
console.log('BRIGHTDATA_API_KEY:', process.env.BRIGHTDATA_API_KEY ? 'SET' : 'NOT SET');
console.log('BRIGHTDATA_PROXY_USERNAME:', process.env.BRIGHTDATA_PROXY_USERNAME ? 'SET' : 'NOT SET');
console.log('BRIGHTDATA_PROXY_PASSWORD:', process.env.BRIGHTDATA_PROXY_PASSWORD ? 'SET' : 'NOT SET');
console.log('ENABLE_BRIGHTDATA:', process.env.ENABLE_BRIGHTDATA);

// Test BrightData service configuration
const { brightDataService } = require('./src/services/brightdata-service');

// Access private config through a hack (for testing only)
const config = brightDataService['_config'] || brightDataService['config'];
if (config) {
  console.log('\nBrightData Service Configuration:');
  console.log('API Key:', config.apiKey ? `${config.apiKey.substring(0, 10)}...` : 'NOT SET');
  console.log('Proxy Host:', config.proxyHost);
  console.log('Proxy Port:', config.proxyPort);
  console.log('Proxy Username:', config.proxyUsername ? 'SET' : 'NOT SET');
  console.log('Proxy Password:', config.proxyPassword ? 'SET' : 'NOT SET');
} else {
  console.log('Could not access service configuration');
}