import * as cheerio from 'cheerio'
import axios from 'axios'

export interface ScrapedFundingData {
  source: 'techcrunch' | 'venturebeat'
  url: string
  title: string
  content: string
  publishedDate: string
  companyName?: string
  fundingAmount?: string
  roundType?: string
  investors?: string[]
  rawText: string
}

export class TechCrunchScraper {
  private baseUrl = 'https://techcrunch.com'
  private headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }

  async scrapeFundingArticles(maxPages: number = 5): Promise<ScrapedFundingData[]> {
    const articles: ScrapedFundingData[] = []
    
    try {
      // Search for funding-related articles
      const searchTerms = ['funding', 'raises', 'series-a', 'series-b', 'seed-round', 'venture-capital']
      
      for (const term of searchTerms) {
        const searchUrl = `${this.baseUrl}/search/${term}/`
        
        for (let page = 1; page <= maxPages; page++) {
          try {
            const response = await axios.get(`${searchUrl}?page=${page}`, { 
              headers: this.headers,
              timeout: 10000 
            })
            
            const $ = cheerio.load(response.data)
            
            // Extract article links
            const articleLinks: string[] = []
            $('.post-block__title__link').each((_, element) => {
              const href = $(element).attr('href')
              if (href && this.isFundingRelated($(element).text())) {
                articleLinks.push(href.startsWith('http') ? href : `${this.baseUrl}${href}`)
              }
            })
            
            // Scrape individual articles
            for (const link of articleLinks.slice(0, 10)) { // Limit per page
              try {
                const articleData = await this.scrapeArticle(link)
                if (articleData) {
                  articles.push(articleData)
                }
                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000))
              } catch (error) {
                console.error(`Error scraping article ${link}:`, error)
              }
            }
            
            // Rate limiting between pages
            await new Promise(resolve => setTimeout(resolve, 2000))
          } catch (error) {
            console.error(`Error scraping page ${page} for term ${term}:`, error)
          }
        }
      }
    } catch (error) {
      console.error('Error in TechCrunch scraper:', error)
    }
    
    return articles
  }

  private async scrapeArticle(url: string): Promise<ScrapedFundingData | null> {
    try {
      const response = await axios.get(url, { 
        headers: this.headers,
        timeout: 15000 
      })
      
      const $ = cheerio.load(response.data)
      
      // Extract article data
      const title = $('.article__title, .entry-title, h1').first().text().trim()
      const content = $('.article-content, .entry-content, .post-content').first().text().trim()
      const publishedDate = $('time, .article__byline time, .entry-date').first().attr('datetime') || 
                           $('time, .article__byline time, .entry-date').first().text().trim()
      
      if (!title || !content) {
        return null
      }

      const rawText = `${title} ${content}`
      
      return {
        source: 'techcrunch',
        url,
        title,
        content,
        publishedDate: publishedDate || new Date().toISOString(),
        rawText
      }
    } catch (error) {
      console.error(`Error scraping article ${url}:`, error)
      return null
    }
  }

  private isFundingRelated(title: string): boolean {
    const fundingKeywords = [
      'raises', 'funding', 'series a', 'series b', 'series c', 'seed',
      'venture capital', 'investment', 'round', 'million', 'billion',
      'investors', 'valuation', 'startup', 'closes'
    ]
    
    const lowerTitle = title.toLowerCase()
    return fundingKeywords.some(keyword => lowerTitle.includes(keyword))
  }
}

export class VentureBeatScraper {
  private baseUrl = 'https://venturebeat.com'
  private headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }

  async scrapeFundingArticles(maxPages: number = 5): Promise<ScrapedFundingData[]> {
    const articles: ScrapedFundingData[] = []
    
    try {
      // VentureBeat funding section
      const fundingUrl = `${this.baseUrl}/category/funding/`
      
      for (let page = 1; page <= maxPages; page++) {
        try {
          const response = await axios.get(`${fundingUrl}page/${page}/`, { 
            headers: this.headers,
            timeout: 10000 
          })
          
          const $ = cheerio.load(response.data)
          
          // Extract article links
          const articleLinks: string[] = []
          $('.ArticleListing__title a, .post-title a, h2 a').each((_, element) => {
            const href = $(element).attr('href')
            if (href) {
              articleLinks.push(href.startsWith('http') ? href : `${this.baseUrl}${href}`)
            }
          })
          
          // Scrape individual articles
          for (const link of articleLinks.slice(0, 10)) {
            try {
              const articleData = await this.scrapeArticle(link)
              if (articleData) {
                articles.push(articleData)
              }
              // Rate limiting
              await new Promise(resolve => setTimeout(resolve, 1000))
            } catch (error) {
              console.error(`Error scraping VentureBeat article ${link}:`, error)
            }
          }
          
          // Rate limiting between pages
          await new Promise(resolve => setTimeout(resolve, 2000))
        } catch (error) {
          console.error(`Error scraping VentureBeat page ${page}:`, error)
        }
      }
    } catch (error) {
      console.error('Error in VentureBeat scraper:', error)
    }
    
    return articles
  }

  private async scrapeArticle(url: string): Promise<ScrapedFundingData | null> {
    try {
      const response = await axios.get(url, { 
        headers: this.headers,
        timeout: 15000 
      })
      
      const $ = cheerio.load(response.data)
      
      // Extract article data
      const title = $('.article-title, .entry-title, h1').first().text().trim()
      const content = $('.article-content, .entry-content, .the-content').first().text().trim()
      const publishedDate = $('time, .article-date time, .entry-date').first().attr('datetime') || 
                           $('time, .article-date time, .entry-date').first().text().trim()
      
      if (!title || !content) {
        return null
      }

      const rawText = `${title} ${content}`
      
      return {
        source: 'venturebeat',
        url,
        title,
        content,
        publishedDate: publishedDate || new Date().toISOString(),
        rawText
      }
    } catch (error) {
      console.error(`Error scraping VentureBeat article ${url}:`, error)
      return null
    }
  }
}