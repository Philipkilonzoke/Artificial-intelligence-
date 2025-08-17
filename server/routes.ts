import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { newsService } from "./services/newsService";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get articles with optional category filtering
  app.get("/api/articles", async (req, res) => {
    try {
      const category = req.query.category as string;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const refresh = req.query.refresh === 'true';

      let articles;
      
      if (refresh) {
        // Fetch fresh articles from external sources
        articles = await newsService.fetchAndStoreNews(category);
      } else {
        // Get from storage first
        articles = await storage.getArticles(category, limit, offset);
        
        // If no articles in storage, fetch from external sources
        if (articles.length === 0) {
          articles = await newsService.fetchAndStoreNews(category);
        }
      }

      res.json({
        articles: articles.slice(offset, offset + limit),
        total: articles.length,
        hasMore: articles.length > offset + limit
      });
    } catch (error) {
      console.error('Error fetching articles:', error);
      res.status(500).json({ 
        message: "Failed to fetch articles. Please try again later.",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get a specific article by ID
  app.get("/api/articles/:id", async (req, res) => {
    try {
      const article = await storage.getArticleById(req.params.id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error('Error fetching article:', error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  // Get breaking news
  app.get("/api/breaking-news", async (req, res) => {
    try {
      const breakingNews = await newsService.getBreakingNews();
      res.json(breakingNews);
    } catch (error) {
      console.error('Error fetching breaking news:', error);
      res.status(500).json({ 
        message: "Failed to fetch breaking news",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get trending articles
  app.get("/api/trending", async (req, res) => {
    try {
      const trending = await newsService.getTrendingNews();
      res.json(trending);
    } catch (error) {
      console.error('Error fetching trending news:', error);
      res.status(500).json({ 
        message: "Failed to fetch trending news",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Search articles
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      const category = req.query.category as string;

      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }

      const articles = await storage.searchArticles(query, category);
      res.json(articles);
    } catch (error) {
      console.error('Error searching articles:', error);
      res.status(500).json({ message: "Search failed. Please try again." });
    }
  });

  // Refresh news for a specific category
  app.post("/api/refresh", async (req, res) => {
    try {
      const { category } = req.body;
      const articles = await newsService.fetchAndStoreNews(category);
      res.json({ message: "News refreshed successfully", count: articles.length });
    } catch (error) {
      console.error('Error refreshing news:', error);
      res.status(500).json({ 
        message: "Failed to refresh news",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // TODO: Implement newsletter subscription logic
      // For now, just return success
      res.json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      res.status(500).json({ message: "Failed to subscribe. Please try again." });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
