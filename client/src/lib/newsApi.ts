// Utility functions for news API integration

export interface NewsApiConfig {
  baseUrl: string;
  apiKey?: string;
  timeout: number;
}

export const newsApiConfig: NewsApiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || '/api',
  apiKey: import.meta.env.VITE_NEWS_API_KEY,
  timeout: 10000, // 10 seconds
};

export class NewsApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'NewsApiError';
  }
}

export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = newsApiConfig.timeout
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new NewsApiError(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new NewsApiError('Request timeout', 408, 'TIMEOUT');
    }
    
    throw error;
  }
}

export function getCategoryDisplayName(category: string): string {
  const categoryNames: Record<string, string> = {
    breaking: 'Breaking News',
    world: 'World News',
    kenya: 'Kenyan News',
    sports: 'Sports',
    technology: 'Technology',
    health: 'Health',
    entertainment: 'Entertainment',
    lifestyle: 'Lifestyle',
  };
  
  return categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

export function formatPublishedDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
}

export function validateImageUrl(url: string | null): string | null {
  if (!url) return null;
  
  try {
    new URL(url);
    return url;
  } catch {
    return null;
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

// Cache utility for offline functionality
export class NewsCache {
  private static readonly STORAGE_KEY = 'brightlens_news_cache';
  private static readonly MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

  static save(key: string, data: any): void {
    try {
      const cacheData = {
        timestamp: Date.now(),
        data,
      };
      localStorage.setItem(`${this.STORAGE_KEY}_${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save to cache:', error);
    }
  }

  static load(key: string): any | null {
    try {
      const cached = localStorage.getItem(`${this.STORAGE_KEY}_${key}`);
      if (!cached) return null;

      const { timestamp, data } = JSON.parse(cached);
      
      // Check if cache is expired
      if (Date.now() - timestamp > this.MAX_AGE) {
        localStorage.removeItem(`${this.STORAGE_KEY}_${key}`);
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Failed to load from cache:', error);
      return null;
    }
  }

  static clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys
        .filter(key => key.startsWith(this.STORAGE_KEY))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }
}
