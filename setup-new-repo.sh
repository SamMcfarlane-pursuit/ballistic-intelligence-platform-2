#!/bin/bash

echo "🚀 Setting Up New Repository: ballistic-intelligence-platform-2"
echo "================================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Show current remote
echo -e "${BLUE}📍 Current remote repository:${NC}"
git remote -v
echo ""

# Step 2: Remove old remote
echo -e "${YELLOW}🔧 Removing old remote...${NC}"
git remote remove origin

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Old remote removed${NC}"
else
    echo -e "${YELLOW}⚠️  No remote to remove or already removed${NC}"
fi

echo ""

# Step 3: Add new remote
NEW_REPO="https://github.com/SamMcfarlane-pursuit/ballistic-intelligence-platform-2.git"
echo -e "${BLUE}🔗 Adding new remote repository:${NC}"
echo "   $NEW_REPO"
git remote add origin "$NEW_REPO"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ New remote added${NC}"
else
    echo -e "${RED}❌ Failed to add remote${NC}"
    exit 1
fi

echo ""

# Step 4: Verify new remote
echo -e "${BLUE}✅ Verified new remote:${NC}"
git remote -v
echo ""

# Step 5: Stage all changes
echo -e "${BLUE}📦 Staging all files...${NC}"
git add .
echo -e "${GREEN}✅ All files staged${NC}"
echo ""

# Step 6: Create initial commit
COMMIT_MESSAGE="feat: Initial commit - Ballistic Intelligence Platform v2

Complete Trending Factors Pipeline Implementation

🎯 Core Features:
- Multi-factor trending algorithm (5 weighted factors)
- 7 RESTful API endpoints for trending analysis
- Interactive TrendingFactorsCard with prominent display
- Executive Dashboard with trending metrics
- Portfolio Intelligence page
- Database seeding with 20 cybersecurity companies

📊 Trending Factors Engine:
- Funding Momentum (25% weight)
- Growth Rate (20% weight)
- Market Interest (20% weight)
- Investor Activity (20% weight)
- Time Relevance (15% weight)

🔌 API Endpoints:
- GET /api/trending-factors?action=calculate
- GET /api/trending-factors?action=top&limit=N
- GET /api/trending-factors?action=category&category=X
- GET /api/trending-factors?action=sectors
- GET /api/trending-factors?action=company&id=X
- GET /api/trending-factors?action=stats
- POST /api/trending-factors {action: 'recalculate'}

🎨 UI Components:
- TrendingFactorsCard with 3 view modes (Companies/Sectors/Stats)
- Prominent company display (text-xl names, text-4xl scores)
- Two-section layout with professional styling
- Circular orange rank badges
- Color-coded trending indicators

💾 Database:
- 20 cybersecurity startups
- 11 funding rounds
- Complete company profiles
- SQLite at ./db/custom.db

📚 Documentation:
- TRENDING_FACTORS_VERIFICATION.md
- PIPELINE_SUMMARY.md
- VERIFICATION_COMPLETE.md
- TRENDING_CARD_UPDATE.md
- GITHUB_PUSH_GUIDE.md

🧪 Testing:
- Automated test suite (test_trending_pipeline.sh)
- All endpoints verified and operational
- Performance: <200ms response times

Tech Stack:
- Next.js 15.5.5
- React 19
- TypeScript
- Prisma ORM
- SQLite
- Tailwind CSS
- shadcn/ui

Status: ✅ Production Ready
Version: 2.0.0"

echo -e "${BLUE}💾 Creating initial commit...${NC}"
git commit -m "$COMMIT_MESSAGE"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Commit created successfully${NC}"
else
    echo ""
    echo -e "${YELLOW}⚠️  Commit failed or no changes to commit${NC}"
fi

echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}⚠️  IMPORTANT: Create the repository on GitHub first!${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📝 Steps to create repository on GitHub:${NC}"
echo ""
echo "   1. Go to: https://github.com/new"
echo "   2. Repository name: ballistic-intelligence-platform-2"
echo "   3. Description: Ballistic Intelligence Platform v2 - Advanced Trending Factors Analysis"
echo "   4. Visibility: Choose Public or Private"
echo "   5. DON'T initialize with README (we already have files)"
echo "   6. Click 'Create repository'"
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
read -p "Have you created the repository on GitHub? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo ""
    echo -e "${BLUE}🚀 Pushing to new repository...${NC}"
    git push -u origin master
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        echo "🎉 Your new repository is live at:"
        echo "   https://github.com/SamMcfarlane-pursuit/ballistic-intelligence-platform-2"
        echo ""
        echo "📊 Features included:"
        echo "   ✅ Trending Factors Pipeline"
        echo "   ✅ 7 API Endpoints"
        echo "   ✅ Enhanced UI Components"
        echo "   ✅ Complete Documentation"
        echo "   ✅ Database with 20 companies"
        echo "   ✅ Automated tests"
        echo ""
        echo "🚀 Next steps:"
        echo "   1. Visit your repository on GitHub"
        echo "   2. Add a repository description if needed"
        echo "   3. Set up GitHub Pages (optional)"
        echo "   4. Configure branch protection (optional)"
        echo ""
    else
        echo ""
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${RED}❌ Push failed${NC}"
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        echo "Possible reasons:"
        echo "   1. Repository doesn't exist on GitHub yet"
        echo "   2. Authentication failed (check credentials)"
        echo "   3. Network connection issue"
        echo ""
        echo "To try again:"
        echo "   git push -u origin master"
        echo ""
        exit 1
    fi
else
    echo ""
    echo -e "${YELLOW}⏸️  Push cancelled${NC}"
    echo ""
    echo "After creating the repository on GitHub, run:"
    echo "   git push -u origin master"
    echo ""
fi

echo -e "${GREEN}✅ Setup complete!${NC}"
