// Company Profiling Agent - Build comprehensive company profiles
// Mission: Build comprehensive company profiles with firmographic and team data
// Execution: Triggered automatically when Funding Agent discovers new company

interface CompanyProfile {
  name: string
  website: string
  foundedYear: number
  employeeRange: string
  location: string
  description: string
  teamMembers: TeamMember[]
  crunchbaseUrl?: string
  angelListUrl?: string
}

interface TeamMember {
  name: string
  title: string
  linkedinUrl?: string
  source: 'crunchbase' | 'angellist' | 'website' | 'manual'
}

interface VerificationTask {
  taskType: 'missing_founders' | 'verify_employee_count' | 'verify_location'
  companyName: string
  description: string
  linkedinUrl?: string
  priority: 'high' | 'medium' | 'low'
}

export class CompanyProfilingAgent {
  private verificationTasks: VerificationTask[] = []

  // Triggered when Funding Agent discovers new company
  async profileCompany(companyName: string): Promise<CompanyProfile | null> {
    console.log(`🏢 Starting company profiling for: ${companyName}`)
    
    try {
      // Tier 1: Structured Databases (Automated)
      let profile = await this.tier1StructuredDatabases(companyName)
      
      // Tier 2: Broader Web Search (if Tier 1 incomplete)
      if (!this.isProfileComplete(profile)) {
        profile = await this.tier2WebSearch(companyName, profile)
      }
      
      // Tier 3: Manual Fallback (if critical data still missing)
      if (!this.isProfileComplete(profile)) {
        await this.tier3ManualFallback(companyName, profile)
      }
      
      console.log(`✅ Company profiling completed for ${companyName}`)
      return profile
      
    } catch (error) {
      console.error(`❌ Company profiling failed for ${companyName}:`, error)
      return null
    }
  }

  // Tier 1: Structured Databases (Automated)
  private async tier1StructuredDatabases(companyName: string): Promise<CompanyProfile> {
    console.log(`📊 Tier 1: Searching structured databases for ${companyName}`)
    
    const profile: CompanyProfile = {
      name: companyName,
      website: '',
      foundedYear: 0,
      employeeRange: '',
      location: '',
      description: '',
      teamMembers: []
    }

    try {
      // Search Crunchbase public company page
      const crunchbaseData = await this.searchCrunchbase(companyName)
      if (crunchbaseData) {
        profile.website = crunchbaseData.website || ''
        profile.foundedYear = crunchbaseData.foundedYear || 0
        profile.employeeRange = crunchbaseData.employeeRange || ''
        profile.location = crunchbaseData.location || ''
        profile.description = crunchbaseData.description || ''
        profile.crunchbaseUrl = crunchbaseData.url
        
        // Parse team members from "People" section
        if (crunchbaseData.teamMembers) {
          profile.teamMembers.push(...crunchbaseData.teamMembers.map(member => ({
            ...member,
            source: 'crunchbase' as const
          })))
        }
      }

      // Search AngelList public profile
      const angelListData = await this.searchAngelList(companyName)
      if (angelListData) {
        // Cross-verify and enrich data from Crunchbase
        if (!profile.description && angelListData.description) {
          profile.description = angelListData.description
        }
        profile.angelListUrl = angelListData.url
        
        // Add team members from AngelList
        if (angelListData.teamMembers) {
          profile.teamMembers.push(...angelListData.teamMembers.map(member => ({
            ...member,
            source: 'angellist' as const
          })))
        }
      }

      console.log(`✅ Tier 1 completed: Found ${profile.teamMembers.length} team members`)
      return profile
      
    } catch (error) {
      console.error('❌ Tier 1 search failed:', error)
      return profile
    }
  }

  // Tier 2: Broader Web Search (Automated)
  private async tier2WebSearch(companyName: string, profile: CompanyProfile): Promise<CompanyProfile> {
    console.log(`🔍 Tier 2: Broader web search for ${companyName}`)
    
    try {
      // Strategic searches if Tier 1 is incomplete
      if (profile.teamMembers.length === 0) {
        const founderSearch = await this.searchFounders(companyName)
        if (founderSearch.length > 0) {
          profile.teamMembers.push(...founderSearch)
        }
      }

      // Search for funding announcement articles
      const fundingArticles = await this.searchFundingArticles(companyName)
      if (fundingArticles.length > 0) {
        // Extract additional company info from articles
        const articleData = await this.extractCompanyInfoFromArticles(fundingArticles)
        if (articleData.description && !profile.description) {
          profile.description = articleData.description
        }
      }

      // Parse company website if available
      if (profile.website) {
        const websiteData = await this.parseCompanyWebsite(profile.website)
        if (websiteData) {
          // Extract team members from "Team" or "Leadership" sections
          if (websiteData.teamMembers && websiteData.teamMembers.length > 0) {
            profile.teamMembers.push(...websiteData.teamMembers.map(member => ({
              ...member,
              source: 'website' as const
            })))
          }
          
          // Enrich description if missing
          if (!profile.description && websiteData.description) {
            profile.description = websiteData.description
          }
        }
      }

      console.log(`✅ Tier 2 completed: Total ${profile.teamMembers.length} team members`)
      return profile
      
    } catch (error) {
      console.error('❌ Tier 2 search failed:', error)
      return profile
    }
  }

  // Tier 3: Manual Fallback (Human-in-the-Loop)
  private async tier3ManualFallback(companyName: string, profile: CompanyProfile): Promise<void> {
    console.log(`👤 Tier 3: Creating manual verification tasks for ${companyName}`)
    
    // Check what critical data is still missing
    if (profile.teamMembers.length === 0) {
      this.createVerificationTask({
        taskType: 'missing_founders',
        companyName: companyName,
        description: `Please verify founders on LinkedIn: https://linkedin.com/company/${companyName.toLowerCase().replace(/\s+/g, '-')}`,
        linkedinUrl: `https://linkedin.com/company/${companyName.toLowerCase().replace(/\s+/g, '-')}`,
        priority: 'high'
      })
    }

    if (!profile.employeeRange) {
      this.createVerificationTask({
        taskType: 'verify_employee_count',
        companyName: companyName,
        description: `Please verify employee count from LinkedIn or company website`,
        priority: 'medium'
      })
    }

    if (!profile.location) {
      this.createVerificationTask({
        taskType: 'verify_location',
        companyName: companyName,
        description: `Please verify company headquarters location`,
        priority: 'medium'
      })
    }

    console.log(`✅ Created ${this.verificationTasks.length} verification tasks`)
  }

  // Helper methods (mock implementations for demo)
  private async searchCrunchbase(companyName: string): Promise<any> {
    // Mock Crunchbase search - in production, use Crunchbase API
    return {
      website: `www.${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      foundedYear: 2018,
      employeeRange: '51-100',
      location: 'San Francisco, CA',
      description: `${companyName} is a cybersecurity company focused on innovative security solutions.`,
      url: `https://crunchbase.com/organization/${companyName.toLowerCase().replace(/\s+/g, '-')}`,
      teamMembers: [
        { name: 'John Doe', title: 'CEO & Co-Founder' },
        { name: 'Jane Smith', title: 'CTO & Co-Founder' }
      ]
    }
  }

  private async searchAngelList(companyName: string): Promise<any> {
    // Mock AngelList search - in production, use AngelList API
    return {
      description: `Enhanced description from AngelList for ${companyName}`,
      url: `https://angel.co/company/${companyName.toLowerCase().replace(/\s+/g, '-')}`,
      teamMembers: [
        { name: 'Mike Johnson', title: 'VP Engineering' }
      ]
    }
  }

  private async searchFounders(companyName: string): Promise<TeamMember[]> {
    // Mock founder search - in production, use Google Search API
    return [
      { name: 'Alex Wilson', title: 'Founder', source: 'manual' }
    ]
  }

  private async searchFundingArticles(companyName: string): Promise<string[]> {
    // Mock funding article search
    return [`${companyName} raises Series A funding...`]
  }

  private async extractCompanyInfoFromArticles(articles: string[]): Promise<any> {
    // Mock article extraction
    return {
      description: 'Company description extracted from funding articles'
    }
  }

  private async parseCompanyWebsite(website: string): Promise<any> {
    // Mock website parsing - in production, scrape About Us and Team pages
    return {
      description: 'Company description from website',
      teamMembers: [
        { name: 'Sarah Davis', title: 'VP Marketing' }
      ]
    }
  }

  private isProfileComplete(profile: CompanyProfile): boolean {
    return !!(
      profile.website &&
      profile.foundedYear &&
      profile.employeeRange &&
      profile.location &&
      profile.description &&
      profile.teamMembers.length > 0
    )
  }

  private createVerificationTask(task: VerificationTask): void {
    this.verificationTasks.push(task)
    console.log(`📝 Created verification task: ${task.taskType} for ${task.companyName}`)
  }

  // Get pending verification tasks
  getVerificationTasks(): VerificationTask[] {
    return this.verificationTasks
  }

  // Get agent status
  getAgentStatus() {
    return {
      name: 'Company Profiling Agent',
      status: 'operational',
      pendingTasks: this.verificationTasks.length,
      capabilities: [
        'Crunchbase data extraction',
        'AngelList profile search',
        'Website content parsing',
        'Team member identification',
        'Manual verification task creation'
      ],
      workflow: [
        'Tier 1: Structured Databases (Crunchbase, AngelList)',
        'Tier 2: Broader Web Search (Google, company website)',
        'Tier 3: Manual Fallback (Human verification tasks)'
      ]
    }
  }
}