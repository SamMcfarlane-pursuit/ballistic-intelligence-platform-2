# 🔧 CS Intelligence Platform - Troubleshooting Guide

## **Current Issue: Server Not Loading**

The system is properly configured but the development server isn't starting or responding. Here are the solutions:

---

## 🚀 **Quick Solutions (Try in Order)**

### **Solution 1: Simple Restart**
```bash
# Kill any existing processes
lsof -ti:3000 | xargs kill -9

# Start fresh
npm run dev
```

### **Solution 2: Clear Cache and Restart**
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild and start
npm run build
npm run dev
```

### **Solution 3: Complete Reset**
```bash
# Use the comprehensive fix script
node fix-and-start.js
```

### **Solution 4: Manual Step-by-Step**
```bash
# 1. Kill processes
lsof -ti:3000 | xargs kill -9

# 2. Clear caches
rm -rf .next
npm cache clean --force

# 3. Reinstall dependencies
rm -rf node_modules
npm install

# 4. Build project
npm run build

# 5. Start development server
npm run dev
```

---

## 🔍 **Diagnostic Tools**

### **Check System Health**
```bash
node test-minimal.js      # Basic setup check
node test-port.js         # Port availability test
node diagnose-system.js   # Comprehensive diagnostics
```

### **Debug Server Startup**
```bash
node debug-server.js      # Detailed startup logging
```

---

## 🎯 **Common Issues & Fixes**

### **Issue: Port 3000 in Use**
```bash
# Find and kill process
lsof -ti:3000
kill -9 <PID>
```

### **Issue: Build Errors**
```bash
# Check for TypeScript errors
npm run build

# Fix common issues
rm -rf .next node_modules
npm install
```

### **Issue: Module Not Found**
```bash
# Reinstall dependencies
npm install

# Or clean install
npm ci
```

### **Issue: Cache Problems**
```bash
# Clear all caches
rm -rf .next
npm cache clean --force
```

---

## 📊 **Expected Behavior**

### **When Server Starts Successfully**
You should see:
```
✓ Ready in 2.3s
○ Local:        http://localhost:3000
○ Network:      http://192.168.x.x:3000
```

### **When Health Check Passes**
```bash
curl http://localhost:3000/api/health
# Should return: {"message":"Good!"}
```

### **When System is Ready**
All these should work:
- http://localhost:3000 (Home page)
- http://localhost:3000/data-management (Enhanced with batch processing)
- http://localhost:3000/intelligence-center (Command center)
- http://localhost:3000/executive-dashboard (Executive view)

---

## 🛠️ **Advanced Troubleshooting**

### **Check Node.js Version**
```bash
node --version  # Should be 18+ 
npm --version   # Should be 8+
```

### **Check Dependencies**
```bash
npm ls | grep -E "(MISSING|UNMET)"
```

### **Check File Permissions**
```bash
ls -la src/app/layout.tsx
ls -la package.json
```

### **Check Disk Space**
```bash
df -h
```

---

## 🎉 **Success Indicators**

### **✅ Server Started Successfully**
- Terminal shows "Ready" message
- No error messages in console
- Port 3000 is accessible

### **✅ Health Check Passes**
```bash
node test-system-health.js
# Should show all green checkmarks
```

### **✅ Enhanced Features Working**
- Batch processing tab in Data Management
- Enhanced AI extraction API responding
- All hydration errors resolved

---

## 💡 **If All Else Fails**

### **Nuclear Option: Complete Reinstall**
```bash
# Backup any custom changes first!
rm -rf node_modules .next
npm cache clean --force
npm install
npm run build
npm run dev
```

### **Alternative: Use Different Port**
```bash
# Edit package.json dev script to use port 3001
npm run dev -- -p 3001
```

### **Check System Resources**
```bash
# Check memory usage
free -h

# Check CPU usage  
top

# Check if system is overloaded
uptime
```

---

## 🚀 **Most Likely Solution**

Based on the diagnostics, the most likely solution is:

```bash
node fix-and-start.js
```

This script will:
1. ✅ Kill any processes on port 3000
2. ✅ Clear Next.js cache
3. ✅ Reinstall dependencies
4. ✅ Build the project
5. ✅ Start the development server
6. ✅ Test server health
7. ✅ Provide access URLs

**🎯 This should resolve the loading issue and get your enhanced CS Intelligence Platform running!**