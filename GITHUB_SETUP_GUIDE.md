# 📦 GitHub Repository Setup Guide

## 🎯 Repository Information

- **Name**: `ballistic-intelligence-platform-2`
- **Owner**: `SamMcfarlane-pursuit` (or `pursuit` organization)
- **URL**: `https://github.com/SamMcfarlane-pursuit/ballistic-intelligence-platform-2`
- **Visibility**: Public or Private (your choice)

---

## 🚀 Quick Start - Automated Push

### **Option 1: Using the Automated Script** (Recommended)

```bash
# Make the script executable
chmod +x push-to-github.sh

# Run the script
./push-to-github.sh
```

The script will automatically:
1. ✅ Initialize git (if needed)
2. ✅ Stage all changes
3. ✅ Create a comprehensive commit
4. ✅ Add GitHub remote
5. ✅ Push to repository

---

## 📋 Manual Setup - Step by Step

### **Step 1: Create Repository on GitHub**

1. Go to: https://github.com/new
2. Fill in details:
   - **Repository name**: `ballistic-intelligence-platform-2`
   - **Description**: "Ballistic Intelligence Platform - Executive Dashboard with Crunchbase Integration"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we have these)
3. Click "Create repository"

### **Step 2: Prepare Local Repository**

```bash
# Navigate to project directory
cd /Users/samuelmcfarlane/ballistic-intelligence-platform-1

# Initialize git (if not already done)
git init

# Add all files
git add .

# Check status
git status
```

### **Step 3: Create Commit**

```bash
git commit -m "feat: Complete Executive Dashboard with Crunchbase Integration

- Executive Dashboard with 3 views (Trending Sectors, Market Intelligence, Patent Deep Dive)
- Crunchbase API integration for real-time company data
- Funding intelligence and market analysis
- TypeScript type safety throughout
- Responsive design
- Comprehensive documentation

Status: Production Ready 🚀"
```

### **Step 4: Add Remote and Push**

```bash
# Add remote repository
git remote add origin https://github.com/SamMcfarlane-pursuit/ballistic-intelligence-platform-2.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main --force
```

---

## 🔐 Authentication Options

### **Option A: Personal Access Token** (Recommended for HTTPS)

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name: "Ballistic Intelligence Platform"
4. Select scopes: `repo` (all sub-scopes)
5. Click "Generate token"
6. Copy the token (you won't see it again!)
7. When pushing, use token as password:
   ```bash
   Username: SamMcfarlane-pursuit
   Password: <your-token-here>
   ```

### **Option B: SSH Key** (Recommended for ease of use)

1. Check for existing SSH key:
   ```bash
   ls -al ~/.ssh
   ```

2. If no key exists, generate one:
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

3. Add SSH key to GitHub:
   - Copy public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste and save

4. Change remote to SSH:
   ```bash
   git remote set-url origin git@github.com:SamMcfarlane-pursuit/ballistic-intelligence-platform-2.git
   ```

5. Push:
   ```bash
   git push -u origin main
   ```

---

## 📊 What Will Be Pushed

### **Code Files** (~3,500+ lines)
- ✅ Executive Dashboard (`src/app/executive-dashboard/page.tsx` - 1,453 lines)
- ✅ Crunchbase Integration (`src/components/dashboard/CrunchbaseIntegration.tsx` - 591 lines)
- ✅ Crunchbase API (`src/app/api/crunchbase/route.ts` - 285 lines)
- ✅ Crunchbase Service (`src/services/crunchbase-service.ts` - 697 lines)
- ✅ Crunchbase Page (`src/app/crunchbase-data/page.tsx` - 27 lines)

### **Documentation** (~3,200+ lines)
- ✅ `EXECUTIVE_DASHBOARD_INTEGRATION.md` (609 lines)
- ✅ `EXECUTIVE_DASHBOARD_SUMMARY.md` (477 lines)
- ✅ `PATENT_DEEP_DIVE_IMPLEMENTATION.md` (587 lines)
- ✅ `PATENT_DEEP_DIVE_SUMMARY.md` (532 lines)
- ✅ `CRUNCHBASE_INTEGRATION.md` (669 lines)
- ✅ `CRUNCHBASE_QUICK_START.md` (304 lines)

### **Configuration & Setup**
- ✅ Package configuration files
- ✅ TypeScript configs
- ✅ Environment templates
- ✅ Git configuration

---

## 🎨 Repository Features

### **Executive Dashboard**
- 3 main views: Trending Sectors, Market Intelligence, Patent Deep Dive
- Real-time data visualization
- Advanced search and filtering
- Responsive design (mobile, tablet, desktop)
- TypeScript type safety

### **Crunchbase Integration**
- Company search functionality
- Real-time funding alerts
- Market analysis dashboard
- Organization details
- Investor tracking

### **API Endpoints**
- `/api/trending-factors` - Sector and company trending data
- `/api/crunchbase` - Company and funding intelligence

---

## 🔍 Verifying the Push

After pushing, verify your repository:

1. Visit: https://github.com/SamMcfarlane-pursuit/ballistic-intelligence-platform-2
2. Check that all files are present
3. Review the commit message
4. Verify file count and structure

### **Expected Structure:**
```
ballistic-intelligence-platform-2/
├── src/
│   ├── app/
│   │   ├── executive-dashboard/
│   │   │   └── page.tsx
│   │   ├── crunchbase-data/
│   │   │   └── page.tsx
│   │   └── api/
│   │       ├── crunchbase/
│   │       │   └── route.ts
│   │       └── trending-factors/
│   │           └── route.ts
│   ├── components/
│   │   └── dashboard/
│   │       └── CrunchbaseIntegration.tsx
│   └── services/
│       └── crunchbase-service.ts
├── Documentation/
│   ├── EXECUTIVE_DASHBOARD_INTEGRATION.md
│   ├── EXECUTIVE_DASHBOARD_SUMMARY.md
│   ├── PATENT_DEEP_DIVE_IMPLEMENTATION.md
│   ├── PATENT_DEEP_DIVE_SUMMARY.md
│   ├── CRUNCHBASE_INTEGRATION.md
│   └── CRUNCHBASE_QUICK_START.md
└── README.md
```

---

## 🛠️ Troubleshooting

### **Problem: Authentication Failed**
**Solution:**
```bash
# Use personal access token
git config --global credential.helper cache
git push -u origin main
# Enter username and token when prompted
```

### **Problem: Repository Already Exists**
**Solution:**
```bash
# Force push to overwrite
git push -u origin main --force
```

### **Problem: Large File Warning**
**Solution:**
```bash
# Check file sizes
du -sh * | sort -h

# If needed, use Git LFS for large files
git lfs install
git lfs track "*.large"
```

### **Problem: Permission Denied**
**Solution:**
1. Verify repository ownership
2. Check GitHub permissions
3. Ensure SSH key is added (if using SSH)
4. Use HTTPS with token if SSH fails

---

## 📝 Post-Push Checklist

- [ ] Repository created on GitHub
- [ ] All files pushed successfully
- [ ] Commit message is clear and descriptive
- [ ] Documentation is accessible
- [ ] README displays correctly
- [ ] No sensitive data (API keys, passwords) committed
- [ ] `.gitignore` working properly
- [ ] Repository visibility set correctly (public/private)

---

## 🔄 Updating the Repository

For future updates:

```bash
# Stage changes
git add .

# Commit changes
git commit -m "feat: Add new feature"

# Push to GitHub
git push origin main
```

---

## 📚 Additional Resources

- **GitHub Docs**: https://docs.github.com
- **Git Basics**: https://git-scm.com/book/en/v2
- **Authentication**: https://docs.github.com/en/authentication
- **SSH Keys**: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

## 🎉 Success Criteria

✅ Repository exists at: `https://github.com/SamMcfarlane-pursuit/ballistic-intelligence-platform-2`  
✅ All code files are present  
✅ Documentation is complete  
✅ Commit history is clean  
✅ No errors or warnings  
✅ README displays properly  
✅ Repository is accessible  

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review GitHub's documentation
3. Verify your authentication setup
4. Check repository permissions

---

**Ready to push?** Run: `./push-to-github.sh`

**Status**: 🚀 Ready for deployment!
