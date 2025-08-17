# Overview

This project is a full-stack news aggregation platform called "Brightlens News" built as a modern web application. The system aggregates real-time news articles from multiple sources across various categories including breaking news, world news, Kenya-specific news, sports, technology, health, entertainment, and more. The application features both a static frontend (GitHub Pages deployment) and a dynamic full-stack implementation with React frontend and Express backend.

The platform provides a comprehensive news experience with features like PWA support, live TV streaming, weather dashboard, cryptocurrency tracking, and AI-powered enhancements. It's designed to be fast, mobile-first, and accessible with support for multiple themes and languages.

## Recent Fixes (August 2025)
- ✅ Fixed critical "unable to load News" error across all 8 category pages
- ✅ Resolved script loading dependency issues that prevented NewsAPI initialization
- ✅ Implemented proper script loading order and initialization timing
- ✅ Added retry logic and error handling for robust news loading
- ✅ Applied consistent fixes across sports, breaking, health, lifestyle, technology, entertainment, world, and kenya pages

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The system implements a dual frontend approach:

**Static Site (GitHub Pages)**
- Pure HTML/CSS/JavaScript implementation optimized for GitHub Pages
- Progressive Web App (PWA) with offline caching via service worker
- Category-specific pages for different news topics
- Theme system with 12+ color variations
- AI-powered features including reading time estimation and text-to-speech

**React SPA (Full-stack version)**
- React 18 with TypeScript for the dynamic client application
- Wouter for lightweight routing instead of React Router
- Vite as the build tool and development server
- Tailwind CSS with shadcn/ui component library
- TanStack Query for data fetching and caching

## Backend Architecture

**Express.js API Server**
- RESTful API built with Express and TypeScript
- News aggregation service that fetches from multiple RSS feeds and news APIs
- In-memory storage with interface for easy database migration
- CORS-enabled for cross-origin requests
- Error handling middleware with structured error responses

**Data Management**
- Drizzle ORM with PostgreSQL schema definitions
- User management with basic authentication structure
- Article storage with rich metadata (category, source, reading time, etc.)
- Configurable news sources with priority and region settings

## Design Patterns

**Component Architecture**
- Shared schema definitions between frontend and backend
- Repository pattern for data access with swappable storage implementations
- Service layer for news aggregation and processing
- Configuration-driven news source management

**Performance Optimizations**
- Lazy loading for images and components
- Critical CSS inlining for faster first paint
- Preconnect hints for external resources
- Service worker caching for offline functionality
- Debounced search and infinite scroll pagination

## External Dependencies

**News Data Sources**
- RSS feeds from major news outlets (BBC, CNN, Reuters, etc.)
- Category-specific news APIs for specialized content
- Multiple source aggregation with duplicate removal

**UI and Styling**
- Radix UI primitives for accessible component foundation
- Tailwind CSS for utility-first styling
- Google Fonts (Inter) for consistent typography
- Font Awesome for icons across the static site

**Development and Build Tools**
- Vite for fast development and optimized builds
- TypeScript for type safety across the stack
- ESBuild for backend bundling
- PostCSS with Autoprefixer for CSS processing

**External Services**
- Neon Database for PostgreSQL hosting (configured but not actively used in current implementation)
- OneSignal for push notifications
- YouTube/Pluto TV APIs for live streaming content
- Open-Meteo API for weather data

**PWA and Performance**
- Service Worker for offline caching and background sync
- Web App Manifest for installable app experience
- Intersection Observer API for lazy loading
- Web Speech API for text-to-speech features

**Deployment**
- GitHub Pages for static site hosting
- Replit/Vercel compatible configuration for full-stack deployment
- Environment-based configuration for different deployment targets