#!/bin/bash

# Automated GitHub Repository Setup Script
# This script uses GitHub CLI to create and push to a repository

echo "🚀 Ballistic Intelligence Platform - Automated GitHub Setup"
echo "==========================================================="

# Set up GitHub CLI path
GH_CLI="$HOME/gh_2.40.1_linux_amd64/bin/gh"

# Check if GitHub CLI is available
if [ ! -f "$GH_CLI" ]; then
    echo "❌ GitHub CLI not found. Please run the setup first."
    exit 1
fi

echo "✅ GitHub CLI found: $GH_CLI"

# Check if already authenticated
if $GH_CLI auth status >/dev/null 2>&1; then
    echo "✅ Already authenticated with GitHub"
    GITHUB_USER=$($GH_CLI api user --jq '.login')
    echo "👤 Logged in as: $GITHUB_USER"
else
    echo "🔐 GitHub authentication required"
    echo ""
    echo "To authenticate with GitHub, you need a Personal Access Token:"
    echo ""
    echo "1. Go to: https://github.com/settings/tokens"
    echo "2. Click 'Generate new token' → 'Generate new token (classic)'"
    echo "3. Set token description: 'Ballistic Intelligence Platform Setup'"
    echo "4. Select scopes:"
    echo "   - ✅ repo (Full control of private repositories)"
    echo "   - ✅ workflow (Update GitHub Action workflows)"
    echo "   - ✅ write:packages (Upload packages to GitHub Package Registry)"
    echo "5. Click 'Generate token'"
    echo "6. Copy the token (it will only be shown once)"
    echo ""
    
    # Prompt for token
    read -p "Enter your GitHub Personal Access Token: " GITHUB_TOKEN
    
    if [ -z "$GITHUB_TOKEN" ]; then
        echo "❌ Token is required for authentication."
        exit 1
    fi
    
    # Authenticate with token
    echo "🔑 Authenticating with GitHub..."
    echo "$GITHUB_TOKEN" | $GH_CLI auth login --with-token
    
    if [ $? -eq 0 ]; then
        echo "✅ Authentication successful!"
        GITHUB_USER=$($GH_CLI api user --jq '.login')
        echo "👤 Logged in as: $GITHUB_USER"
    else
        echo "❌ Authentication failed. Please check your token."
        exit 1
    fi
fi

# Get repository name
REPO_NAME="ballistic-intelligence-platform"
read -p "Enter repository name [$REPO_NAME]: " input_repo_name
if [ ! -z "$input_repo_name" ]; then
    REPO_NAME="$input_repo_name"
fi

# Ask if repository should be private
read -p "Make repository private? (y/N): " private_choice
if [[ $private_choice =~ ^[Yy]$ ]]; then
    PRIVATE_FLAG="--private"
    echo "🔒 Repository will be private"
else
    PRIVATE_FLAG="--public"
    echo "🌐 Repository will be public"
fi

# Check if repository already exists
echo "🔍 Checking if repository exists..."
if $GH_CLI repo view "$GITHUB_USER/$REPO_NAME" >/dev/null 2>&1; then
    echo "⚠️  Repository '$GITHUB_USER/$REPO_NAME' already exists"
    read -p "Use existing repository? (Y/n): " use_existing
    if [[ $use_existing =~ ^[Nn]$ ]]; then
        echo "❌ Please choose a different repository name."
        exit 1
    fi
    echo "✅ Using existing repository"
else
    # Create new repository
    echo "🏗️  Creating repository: $REPO_NAME"
    $GH_CLI repo create "$REPO_NAME" $PRIVATE_FLAG --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo "✅ Repository created successfully!"
    else
        echo "❌ Failed to create repository."
        exit 1
    fi
fi

# Set up remote and push
echo "🔗 Setting up remote repository..."
git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"

echo "📤 Pushing code to GitHub..."
git push -u origin master

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Your code has been pushed to GitHub!"
    echo "📍 Repository URL: https://github.com/$GITHUB_USER/$REPO_NAME"
    echo ""
    echo "📋 Repository Details:"
    echo "   Name: $REPO_NAME"
    echo "   Owner: $GITHUB_USER"
    echo "   URL: https://github.com/$GITHUB_USER/$REPO_NAME"
    echo ""
    echo "🚀 Next Steps:"
    echo "1. Visit your repository: https://github.com/$GITHUB_USER/$REPO_NAME"
    echo "2. Verify all files are present"
    echo "3. Configure repository settings if needed"
    echo "4. Add collaborators if desired"
    echo ""
    echo "🔧 GitHub CLI Commands for future use:"
    echo "   View repository: $GH_CLI repo view"
    echo "   Create issues: $GH_CLI issue create"
    echo "   Create releases: $GH_CLI release create"
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "1. Your GitHub authentication"
    echo "2. Repository permissions"
    echo "3. Network connection"
    echo ""
    echo "💡 Try manual push:"
    echo "   git push origin master"
fi