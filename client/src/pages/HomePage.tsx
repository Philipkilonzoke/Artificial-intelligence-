import { useState } from "react";
import Header from "@/components/Header";
import BreakingNewsBanner from "@/components/BreakingNewsBanner";
import FeaturedArticle from "@/components/FeaturedArticle";
import ArticleGrid from "@/components/ArticleGrid";
import TrendingSidebar from "@/components/TrendingSidebar";
import NewsletterSignup from "@/components/NewsletterSignup";
import WeatherWidget from "@/components/WeatherWidget";
import SocialLinks from "@/components/SocialLinks";
import Footer from "@/components/Footer";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { Button } from "@/components/ui/button";
import { useNews } from "@/hooks/useNews";

const categories = [
  { id: 'all', name: 'All News', active: true },
  { id: 'breaking', name: 'Breaking' },
  { id: 'world', name: 'World' },
  { id: 'kenya', name: 'Kenya' },
  { id: 'sports', name: 'Sports' },
  { id: 'technology', name: 'Technology' },
  { id: 'health', name: 'Health' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'lifestyle', name: 'Lifestyle' },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  
  const { 
    data: articlesData, 
    isLoading, 
    error, 
    refetch 
  } = useNews(selectedCategory);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleRefresh = () => {
    refetch();
  };

  const articles = articlesData?.articles || [];
  const featuredArticle = articles[0];

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <BreakingNewsBanner />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorState 
            message="Failed to load news articles. Please check your connection and try again."
            onRetry={handleRefresh}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BreakingNewsBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Category Filter */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  {selectedCategory === 'all' ? 'Latest News' : 
                   categories.find(c => c.id === selectedCategory)?.name || 'News'}
                </h2>
                <div className="flex items-center space-x-4">
                  <Button onClick={handleRefresh} className="bg-news-primary hover:bg-blue-700">
                    <i className="fas fa-sync-alt mr-2"></i>
                    Refresh
                  </Button>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-news-primary"
                  >
                    <option value="latest">Latest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="shared">Most Shared</option>
                  </select>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-news-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {isLoading && <LoadingState />}

            {/* Content */}
            {!isLoading && !error && (
              <>
                {/* Featured Article */}
                {featuredArticle && <FeaturedArticle article={featuredArticle} />}

                {/* Article Grid */}
                <ArticleGrid articles={articles.slice(1)} />

                {/* Load More Button */}
                <div className="text-center mt-12">
                  <Button 
                    className="px-8 py-3 bg-news-primary text-white hover:bg-blue-700 font-medium"
                    onClick={() => {/* TODO: Implement load more */}}
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Load More Articles
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <TrendingSidebar />
            <NewsletterSignup />
            <WeatherWidget />
            <SocialLinks />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
