#!/bin/bash

echo "🚀 Testing BrightData Integration..."
echo

echo "1. Testing Health Check..."
curl -s "http://localhost:4000/api/brightdata?action=health" | grep -o '"status":"[^"]*"' | head -1
curl -s "http://localhost:4000/api/brightdata?action=health" | grep -o '"message":"[^"]*"' | head -1

echo
echo "2. Testing Proxy Request..."
curl -s "http://localhost:4000/api/brightdata?action=proxy&url=https://httpbin.org/get" | grep -o '"success":true\|"success":false' | head -1
curl -s "http://localhost:4000/api/brightdata?action=proxy&url=https://httpbin.org/get" | grep -o '"statusCode":[0-9]*' | head -1

echo
echo "3. Testing Metrics..."
curl -s "http://localhost:4000/api/brightdata?action=metrics" | grep -o '"totalRequests":[0-9]*' | head -1
curl -s "http://localhost:4000/api/brightdata?action=metrics" | grep -o '"successfulRequests":[0-9]*' | head -1

echo
echo "🎉 BrightData Integration Tests Complete!"
echo
echo "📊 Next Steps:"
echo "   1. Visit http://localhost:4000/executive-dashboard"
echo "   2. Click on the 'Data Intelligence' tab (4th tab with globe icon)"
echo "   3. View real-time metrics and monitoring"
echo "   4. Start using BrightData-powered features!"