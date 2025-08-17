import { type User, type InsertUser, type Article, type InsertArticle } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Article methods
  getArticles(category?: string, limit?: number, offset?: number): Promise<Article[]>;
  getArticleById(id: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;
  getBreakingNews(limit?: number): Promise<Article[]>;
  getTrendingArticles(limit?: number): Promise<Article[]>;
  searchArticles(query: string, category?: string): Promise<Article[]>;
  getArticlesByCategory(category: string, limit?: number): Promise<Article[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private articles: Map<string, Article>;

  constructor() {
    this.users = new Map();
    this.articles = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getArticles(category?: string, limit = 20, offset = 0): Promise<Article[]> {
    let articles = Array.from(this.articles.values());
    
    if (category && category !== 'all') {
      articles = articles.filter(article => article.category === category);
    }
    
    // Sort by publication date, newest first
    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    return articles.slice(offset, offset + limit);
  }

  async getArticleById(id: string): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = randomUUID();
    const article: Article = {
      ...insertArticle,
      id,
      createdAt: new Date(),
    };
    this.articles.set(id, article);
    return article;
  }

  async updateArticle(id: string, updateData: Partial<InsertArticle>): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (!article) return undefined;
    
    const updatedArticle = { ...article, ...updateData };
    this.articles.set(id, updatedArticle);
    return updatedArticle;
  }

  async deleteArticle(id: string): Promise<boolean> {
    return this.articles.delete(id);
  }

  async getBreakingNews(limit = 5): Promise<Article[]> {
    const breakingNews = Array.from(this.articles.values())
      .filter(article => article.isBreaking)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    return breakingNews.slice(0, limit);
  }

  async getTrendingArticles(limit = 5): Promise<Article[]> {
    // For now, return the most recent articles as trending
    const articles = Array.from(this.articles.values())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    return articles.slice(0, limit);
  }

  async searchArticles(query: string, category?: string): Promise<Article[]> {
    const articles = Array.from(this.articles.values());
    const searchTerm = query.toLowerCase();
    
    return articles.filter(article => {
      const matchesQuery = 
        article.title.toLowerCase().includes(searchTerm) ||
        article.description?.toLowerCase().includes(searchTerm) ||
        article.content?.toLowerCase().includes(searchTerm);
      
      const matchesCategory = !category || category === 'all' || article.category === category;
      
      return matchesQuery && matchesCategory;
    });
  }

  async getArticlesByCategory(category: string, limit = 20): Promise<Article[]> {
    return this.getArticles(category, limit, 0);
  }
}

export const storage = new MemStorage();
