// Simple test to check if environment variables are accessible
console.log('BRIGHTDATA_API_KEY:', process.env.BRIGHTDATA_API_KEY ? 'SET' : 'NOT SET');
console.log('BRIGHTDATA_PROXY_USERNAME:', process.env.BRIGHTDATA_PROXY_USERNAME ? 'SET' : 'NOT SET');
console.log('BRIGHTDATA_PROXY_PASSWORD:', process.env.BRIGHTDATA_PROXY_PASSWORD ? 'SET' : 'NOT SET');
console.log('ENABLE_BRIGHTDATA:', process.env.ENABLE_BRIGHTDATA);