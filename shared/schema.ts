import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  url: text("url").notNull(),
  urlToImage: text("url_to_image"),
  publishedAt: timestamp("published_at").notNull(),
  source: text("source").notNull(),
  author: text("author"),
  category: text("category").notNull(),
  country: text("country"),
  language: text("language").default("en"),
  isBreaking: boolean("is_breaking").default(false),
  readTime: integer("read_time"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;

// News API response schemas
export const newsApiResponseSchema = z.object({
  status: z.string(),
  totalResults: z.number(),
  articles: z.array(z.object({
    source: z.object({
      id: z.string().nullable(),
      name: z.string(),
    }),
    author: z.string().nullable(),
    title: z.string(),
    description: z.string().nullable(),
    url: z.string(),
    urlToImage: z.string().nullable(),
    publishedAt: z.string(),
    content: z.string().nullable(),
  })),
});

export type NewsApiResponse = z.infer<typeof newsApiResponseSchema>;
