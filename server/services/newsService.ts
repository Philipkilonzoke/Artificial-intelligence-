import fetch from 'node-fetch';
import { Parser } from 'rss-parser';
import { storage } from '../storage';
import { type InsertArticle, type Article } from '@shared/schema';

interface NewsSource {
  name: string;
  type: 'api' | 'rss';
  url: string;
  category?: string;
  apiKey?: string;
  country?: string;
}

export class NewsService {
  private parser: Parser;
  private sources: NewsSource[];
  private cache: Map<string, { articles: Article[], timestamp: number }>;
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

  constructor() {
    this.parser = new Parser();
    this.cache = new Map();
    this.sources = [
      // NewsAPI sources
      {
        name: 'NewsAPI-General',
        type: 'api',
        url: 'https://newsapi.org/v2/top-headlines',
        apiKey: process.env.NEWS_API_KEY || process.env.VITE_NEWS_API_KEY,
        country: 'us'
      },
      {
        name: 'NewsAPI-Kenya',
        type: 'api',
        url: 'https://newsapi.org/v2/everything',
        apiKey: process.env.NEWS_API_KEY || process.env.VITE_NEWS_API_KEY,
        category: 'kenya'
      },
      
      // RSS Feed sources
      {
        name: 'BBC News',
        type: 'rss',
        url: 'http://feeds.bbci.co.uk/news/rss.xml'
      },
      {
        name: 'CNN',
        type: 'rss',
        url: 'http://rss.cnn.com/rss/edition.rss'
      },
      {
        name: 'Reuters',
        type: 'rss',
        url: 'https://www.reuters.com/rssFeed/worldNews'
      },
      {
        name: 'Daily Nation Kenya',
        type: 'rss',
        url: 'https://www.nation.co.ke/kenya/news/-/1056/1056.xml',
        category: 'kenya'
      },
      {
        name: 'The Standard Kenya',
        type: 'rss',
        url: 'https://www.standardmedia.co.ke/rss/headlines.xml',
        category: 'kenya'
      },
      
      // Category specific RSS feeds
      {
        name: 'ESPN Sports',
        type: 'rss',
        url: 'https://www.espn.com/espn/rss/news',
        category: 'sports'
      },
      {
        name: 'TechCrunch',
        type: 'rss',
        url: 'http://feeds.feedburner.com/TechCrunch/',
        category: 'technology'
      },
      {
        name: 'Variety Entertainment',
        type: 'rss',
        url: 'https://variety.com/feed/',
        category: 'entertainment'
      },
      {
        name: 'Health News',
        type: 'rss',
        url: 'https://www.medicalnewstoday.com/rss',
        category: 'health'
      }
    ];
  }

  async fetchNewsFromAPI(source: NewsSource, category?: string): Promise<Article[]> {
    try {
      let url = source.url;
      const params = new URLSearchParams();
      
      if (source.apiKey) {
        params.append('apiKey', source.apiKey);
      }
      
      if (category && category !== 'all') {
        if (category === 'kenya') {
          params.append('q', 'Kenya');
          params.append('sortBy', 'publishedAt');
        } else if (category === 'breaking') {
          params.append('category', 'general');
          params.append('sortBy', 'publishedAt');
        } else {
          params.append('category', category);
        }
      } else if (source.country) {
        params.append('country', source.country);
      }
      
      params.append('pageSize', '50');
      url += '?' + params.toString();

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json() as any;
      
      if (data.status === 'error') {
        throw new Error(data.message);
      }

      return this.transformNewsApiArticles(data.articles, source, category);
    } catch (error) {
      console.error(`Error fetching from ${source.name}:`, error);
      return [];
    }
  }

  async fetchNewsFromRSS(source: NewsSource, category?: string): Promise<Article[]> {
    try {
      const feed = await this.parser.parseURL(source.url);
      return this.transformRSSArticles(feed.items, source, category);
    } catch (error) {
      console.error(`Error fetching RSS from ${source.name}:`, error);
      return [];
    }
  }

  private transformNewsApiArticles(articles: any[], source: NewsSource, category?: string): Article[] {
    return articles
      .filter(article => article.title && article.title !== '[Removed]')
      .map(article => ({
        title: article.title,
        description: article.description || '',
        content: article.content || article.description || '',
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: new Date(article.publishedAt),
        source: article.source?.name || source.name,
        author: article.author || 'Unknown',
        category: category || source.category || this.categorizeArticle(article.title + ' ' + (article.description || '')),
        country: source.country || 'global',
        language: 'en',
        isBreaking: this.isBreakingNews(article.title),
        readTime: this.calculateReadTime(article.content || article.description || ''),
      }));
  }

  private transformRSSArticles(items: any[], source: NewsSource, category?: string): Article[] {
    return items.map(item => ({
      title: item.title || 'No Title',
      description: item.contentSnippet || item.summary || '',
      content: item.content || item.contentSnippet || item.summary || '',
      url: item.link || '',
      urlToImage: item.enclosure?.url || null,
      publishedAt: new Date(item.pubDate || item.isoDate || Date.now()),
      source: source.name,
      author: item.creator || item.author || 'Unknown',
      category: category || source.category || this.categorizeArticle((item.title || '') + ' ' + (item.contentSnippet || '')),
      country: 'global',
      language: 'en',
      isBreaking: this.isBreakingNews(item.title || ''),
      readTime: this.calculateReadTime(item.content || item.contentSnippet || ''),
    }));
  }

  private categorizeArticle(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('sport') || lowerText.includes('football') || lowerText.includes('soccer') || lowerText.includes('basketball')) {
      return 'sports';
    }
    if (lowerText.includes('tech') || lowerText.includes('digital') || lowerText.includes('ai') || lowerText.includes('computer')) {
      return 'technology';
    }
    if (lowerText.includes('health') || lowerText.includes('medical') || lowerText.includes('hospital') || lowerText.includes('doctor')) {
      return 'health';
    }
    if (lowerText.includes('entertainment') || lowerText.includes('celebrity') || lowerText.includes('movie') || lowerText.includes('music')) {
      return 'entertainment';
    }
    if (lowerText.includes('lifestyle') || lowerText.includes('fashion') || lowerText.includes('travel') || lowerText.includes('food')) {
      return 'lifestyle';
    }
    if (lowerText.includes('kenya') || lowerText.includes('nairobi') || lowerText.includes('mombasa')) {
      return 'kenya';
    }
    if (lowerText.includes('breaking') || lowerText.includes('urgent') || lowerText.includes('alert')) {
      return 'breaking';
    }
    
    return 'world';
  }

  private isBreakingNews(title: string): boolean {
    const lowerTitle = title.toLowerCase();
    const breakingKeywords = ['breaking', 'urgent', 'alert', 'just in', 'developing'];
    return breakingKeywords.some(keyword => lowerTitle.includes(keyword));
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  async fetchAndStoreNews(category?: string): Promise<Article[]> {
    const cacheKey = category || 'all';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.articles;
    }

    const allArticles: Article[] = [];
    const promises: Promise<Article[]>[] = [];

    // Filter sources by category if specified
    const relevantSources = this.sources.filter(source => {
      if (!category || category === 'all') return true;
      return !source.category || source.category === category;
    });

    for (const source of relevantSources) {
      if (source.type === 'api') {
        promises.push(this.fetchNewsFromAPI(source, category));
      } else {
        promises.push(this.fetchNewsFromRSS(source, category));
      }
    }

    try {
      const results = await Promise.allSettled(promises);
      
      for (const result of results) {
        if (result.status === 'fulfilled') {
          allArticles.push(...result.value);
        }
      }

      // Remove duplicates based on title similarity
      const uniqueArticles = this.removeDuplicates(allArticles);
      
      // Store in database
      for (const article of uniqueArticles) {
        try {
          await storage.createArticle(article);
        } catch (error) {
          // Article might already exist, continue
        }
      }

      // Cache the results
      this.cache.set(cacheKey, {
        articles: uniqueArticles,
        timestamp: Date.now()
      });

      return uniqueArticles;
    } catch (error) {
      console.error('Error fetching news:', error);
      // Return cached articles if available, even if expired
      if (cached) {
        return cached.articles;
      }
      throw error;
    }
  }

  private removeDuplicates(articles: Article[]): Article[] {
    const seen = new Set<string>();
    return articles.filter(article => {
      const key = article.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  async getBreakingNews(): Promise<Article[]> {
    const articles = await this.fetchAndStoreNews('breaking');
    return articles.filter(article => article.isBreaking).slice(0, 5);
  }

  async getTrendingNews(): Promise<Article[]> {
    const articles = await storage.getTrendingArticles(5);
    if (articles.length === 0) {
      // Fallback to recent articles from all categories
      const recentArticles = await this.fetchAndStoreNews();
      return recentArticles.slice(0, 5);
    }
    return articles;
  }
}

export const newsService = new NewsService();
