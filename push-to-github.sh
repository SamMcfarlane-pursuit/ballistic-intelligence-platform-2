#!/bin/bash

# ============================================================================
# Push Ballistic Intelligence Platform to GitHub
# Repository: pursuit/ballistic-intelligence-platform-2
# ============================================================================

set -e  # Exit on error

echo "🚀 Starting GitHub Push Process..."
echo "Repository: ballistic-intelligence-platform-2"
echo "Namespace: pursuit"
echo "============================================================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check if we're in a git repository
echo -e "\n${BLUE}Step 1: Checking git repository...${NC}"
if [ ! -d .git ]; then
    echo -e "${YELLOW}Initializing git repository...${NC}"
    git init
    echo -e "${GREEN}✓ Git repository initialized${NC}"
else
    echo -e "${GREEN}✓ Git repository found${NC}"
fi

# Step 2: Stage all changes
echo -e "\n${BLUE}Step 2: Staging all changes...${NC}"
git add .
echo -e "${GREEN}✓ All changes staged${NC}"

# Step 3: Show status
echo -e "\n${BLUE}Current git status:${NC}"
git status --short

# Step 4: Create commit
echo -e "\n${BLUE}Step 3: Creating commit...${NC}"
COMMIT_MESSAGE="feat: Complete Executive Dashboard with Crunchbase Integration

- ✅ Executive Dashboard with 3 views (Trending Sectors, Market Intelligence, Patent Deep Dive)
- ✅ Crunchbase API integration for real-time company data
- ✅ Funding intelligence and real-time alerts
- ✅ Market analysis dashboard
- ✅ TypeScript type safety throughout
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Advanced search and filtering
- ✅ Comprehensive documentation

New Features:
- Trending Sectors view with 6 sector cards and analytics charts
- Market Intelligence with company search and filtering
- Patent Deep Dive with novelty scores and innovation badges
- Crunchbase Intelligence for company and funding data
- Real-time funding alerts (last 30 days)
- Market analysis with top sectors and investors

API Endpoints:
- /api/trending-factors (sectors, companies, analysis)
- /api/crunchbase (search, funding, investors, alerts)

Components:
- Executive Dashboard (1,453 lines)
- Crunchbase Integration (591 lines)
- Complete UI/UX matching Figma designs

Documentation:
- EXECUTIVE_DASHBOARD_INTEGRATION.md
- EXECUTIVE_DASHBOARD_SUMMARY.md
- PATENT_DEEP_DIVE_IMPLEMENTATION.md
- PATENT_DEEP_DIVE_SUMMARY.md
- CRUNCHBASE_INTEGRATION.md
- CRUNCHBASE_QUICK_START.md

Status: Production Ready 🚀"

git commit -m "$COMMIT_MESSAGE"
echo -e "${GREEN}✓ Commit created${NC}"

# Step 5: Check for existing remote
echo -e "\n${BLUE}Step 4: Checking remote repository...${NC}"
REMOTE_URL="https://github.com/SamMcfarlane-pursuit/ballistic-intelligence-platform-2.git"

if git remote | grep -q "origin"; then
    echo -e "${YELLOW}Removing existing origin...${NC}"
    git remote remove origin
fi

echo -e "${YELLOW}Adding remote: ${REMOTE_URL}${NC}"
git remote add origin "$REMOTE_URL"
echo -e "${GREEN}✓ Remote added${NC}"

# Step 6: Check current branch
echo -e "\n${BLUE}Step 5: Checking branch...${NC}"
CURRENT_BRANCH=$(git branch --show-current)
if [ -z "$CURRENT_BRANCH" ]; then
    echo -e "${YELLOW}Creating main branch...${NC}"
    git branch -M main
    CURRENT_BRANCH="main"
fi
echo -e "${GREEN}✓ Branch: ${CURRENT_BRANCH}${NC}"

# Step 7: Push to GitHub
echo -e "\n${BLUE}Step 6: Pushing to GitHub...${NC}"
echo -e "${YELLOW}Target: ${REMOTE_URL}${NC}"
echo -e "${YELLOW}Branch: ${CURRENT_BRANCH}${NC}"

# Try to push
if git push -u origin "$CURRENT_BRANCH" --force; then
    echo -e "${GREEN}✓ Successfully pushed to GitHub!${NC}"
else
    echo -e "${RED}✗ Push failed. You may need to authenticate.${NC}"
    echo -e "${YELLOW}Please ensure you have:${NC}"
    echo "  1. Created the repository on GitHub"
    echo "  2. Set up authentication (SSH key or Personal Access Token)"
    echo "  3. Have push permissions"
    echo ""
    echo -e "${YELLOW}To retry manually, run:${NC}"
    echo "  git push -u origin ${CURRENT_BRANCH} --force"
    exit 1
fi

# Step 8: Success message
echo ""
echo "============================================================================"
echo -e "${GREEN}✅ SUCCESS! Your code has been pushed to GitHub${NC}"
echo "============================================================================"
echo ""
echo "📊 Repository Details:"
echo "  URL: https://github.com/SamMcfarlane-pursuit/ballistic-intelligence-platform-2"
echo "  Branch: ${CURRENT_BRANCH}"
echo ""
echo "📝 What was pushed:"
echo "  ✓ Executive Dashboard (3 views)"
echo "  ✓ Crunchbase Integration"
echo "  ✓ API endpoints"
echo "  ✓ Documentation (6 guides)"
echo "  ✓ TypeScript components"
echo ""
echo "🔗 View your repository:"
echo "  https://github.com/SamMcfarlane-pursuit/ballistic-intelligence-platform-2"
echo ""
echo "============================================================================"
