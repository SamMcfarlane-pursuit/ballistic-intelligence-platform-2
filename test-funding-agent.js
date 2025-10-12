// Test the Funding Agent API endpoints
console.log('🧪 Testing Funding Agent API...')

const testEndpoints = [
  'http://localhost:3000/api/funding-agent',
  'http://localhost:3000/api/funding-agent?action=demo',
  'http://localhost:3000/api/funding-agent?action=status'
]

async function testFundingAgent() {
  for (const endpoint of testEndpoints) {
    try {
      console.log(`\n📡 Testing: ${endpoint}`)
      const response = await fetch(endpoint)
      const data = await response.json()
      
      if (data.success) {
        console.log('✅ Success:', data.success)
        if (data.data) {
          console.log('📊 Data keys:', Object.keys(data.data))
        }
      } else {
        console.log('❌ Failed:', data.error)
      }
    } catch (error) {
      console.log('❌ Error:', error.message)
    }
  }
}

testFundingAgent()