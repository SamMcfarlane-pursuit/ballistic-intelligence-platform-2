#!/bin/bash

# Ballistic Intelligence Platform - GitHub Setup Script
# This script will help you create a GitHub repository and push your code

echo "🚀 Ballistic Intelligence Platform - GitHub Setup"
echo "=================================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please run this script from the project root."
    exit 1
fi

# Get current directory name as repository name
REPO_NAME=$(basename "$(pwd)")
echo "📁 Repository name will be: $REPO_NAME"

# Instructions for manual GitHub repository creation
echo ""
echo "📋 Step 1: Create GitHub Repository"
echo "-----------------------------------"
echo "1. Go to https://github.com"
echo "2. Click the '+' icon and select 'New repository'"
echo "3. Enter repository name: $REPO_NAME"
echo "4. Choose Public or Private"
echo "5. Don't initialize with README (we already have one)"
echo "6. Click 'Create repository'"
echo ""

# Wait for user to create repository
read -p "Press Enter after you've created the GitHub repository..."

# Get GitHub repository URL
read -p "Enter your GitHub repository URL (e.g., https://github.com/username/$REPO_NAME.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ Repository URL is required."
    exit 1
fi

# Add remote repository
echo ""
echo "🔗 Setting up remote repository..."
git remote add origin "$REPO_URL"

# Check if remote was added successfully
if git remote get-url origin >/dev/null 2>&1; then
    echo "✅ Remote repository added successfully"
else
    echo "❌ Failed to add remote repository"
    exit 1
fi

# Push to GitHub
echo ""
echo "📤 Pushing code to GitHub..."
git push -u origin master

# Check if push was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Success! Your code has been pushed to GitHub!"
    echo "📍 Repository URL: $REPO_URL"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Visit your repository at: $REPO_URL"
    echo "2. Verify all files are present"
    echo "3. Set up GitHub Pages if needed for deployment"
    echo "4. Configure repository settings (branch protection, etc.)"
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "1. Your GitHub credentials"
    echo "2. Repository URL is correct"
    echo "3. You have push permissions"
    echo ""
    echo "💡 Troubleshooting:"
    echo "- Run: git remote -v (to check remote configuration)"
    echo "- Run: git status (to check local status)"
    echo "- Try: git push origin master (manual push)"
fi