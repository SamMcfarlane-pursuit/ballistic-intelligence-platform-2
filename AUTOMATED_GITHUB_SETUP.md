# 🚀 Automated GitHub Repository Setup

This guide will help you set up GitHub CLI and automatically create/push your repository.

## Step 1: Get GitHub Personal Access Token

1. **Go to GitHub Tokens**: https://github.com/settings/tokens
2. **Click "Generate new token" → "Generate new token (classic)"**
3. **Token Settings**:
   - **Note**: `Ballistic Intelligence Platform Setup`
   - **Expiration**: Choose your preferred expiration (90 days recommended)
   - **Scopes** (Check these boxes):
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)
     - ✅ `write:packages` (Upload packages to GitHub Package Registry)
4. **Click "Generate token"**
5. **Copy the token immediately** (it won't be shown again)

## Step 2: Run the Setup Commands

Copy and paste these commands in your terminal:

```bash
# Set up GitHub CLI path
export PATH="$HOME/gh_2.40.1_linux_amd64/bin:$PATH"

# Authenticate with your token (replace YOUR_TOKEN_HERE)
echo "YOUR_TOKEN_HERE" | ~/gh_2.40.1_linux_amd64/bin/gh auth login --with-token

# Verify authentication
~/gh_2.40.1_linux_amd64/bin/gh auth status

# Create and push to repository
~/gh_2.40.1_linux_amd64/bin/gh repo create ballistic-intelligence-platform --public --source=. --remote=origin --push
```

## Step 3: Alternative Manual Setup

If the automated approach doesn't work, use these manual commands:

```bash
# Set up GitHub CLI path
export PATH="$HOME/gh_2.40.1_linux_amd64/bin:$PATH"

# Authenticate
echo "YOUR_TOKEN_HERE" | ~/gh_2.40.1_linux_amd64/bin/gh auth login --with-token

# Create repository manually
~/gh_2.40.1_linux_amd64/bin/gh repo create ballistic-intelligence-platform --public

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/ballistic-intelligence-platform.git
git push -u origin master
```

## Step 4: Private Repository Option

If you prefer a private repository:

```bash
# Create private repository
~/gh_2.40.1_linux_amd64/bin/gh repo create ballistic-intelligence-platform --private --source=. --remote=origin --push
```

## Troubleshooting

### Authentication Issues
```bash
# Check authentication status
~/gh_2.40.1_linux_amd64/bin/gh auth status

# Logout and re-authenticate
~/gh_2.40.1_linux_amd64/bin/gh auth logout
echo "YOUR_NEW_TOKEN" | ~/gh_2.40.1_linux_amd64/bin/gh auth login --with-token
```

### Repository Already Exists
```bash
# Check if repository exists
~/gh_2.40.1_linux_amd64/bin/gh repo view YOUR_USERNAME/ballistic-intelligence-platform

# If it exists, just add remote and push
git remote add origin https://github.com/YOUR_USERNAME/ballistic-intelligence-platform.git
git push -u origin master
```

### Push Issues
```bash
# Force push (use carefully)
git push -f origin master

# Or pull first then push
git pull origin master --rebase
git push origin master
```

## What You'll Get

After successful setup, you'll have:

✅ **GitHub Repository**: `https://github.com/YOUR_USERNAME/ballistic-intelligence-platform`
✅ **Complete Codebase**: All your Next.js project files
✅ **Documentation**: README and setup guides
✅ **Git History**: All your commits preserved
✅ **Remote Origin**: Configured for future pushes

## GitHub CLI Quick Reference

```bash
# View repository info
~/gh_2.40.1_linux_amd64/bin/gh repo view

# Create issues
~/gh_2.40.1_linux_amd64/bin/gh issue create --title "Bug Report" --body "Description here"

# Create releases
~/gh_2.40.1_linux_amd64/bin/gh release create v1.0.0 --title "Version 1.0.0"

# View repository statistics
~/gh_2.40.1_linux_amd64/bin/gh repo view --json name,description,createdAt,stargazerCount
```

## Success Checklist

After running the setup, verify:

- [ ] Repository created at `https://github.com/YOUR_USERNAME/ballistic-intelligence-platform`
- [ ] All files are present in the repository
- [ ] README.md displays correctly
- [ ] Git history shows all your commits
- [ ] You can push new changes with `git push origin master`

---

**🎯 Ready to deploy your Ballistic Intelligence Platform to GitHub!**