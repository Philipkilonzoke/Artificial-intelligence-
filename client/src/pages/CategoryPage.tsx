import { Link } from "wouter";
import Header from "@/components/Header";
import BreakingNewsBanner from "@/components/BreakingNewsBanner";
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
import { Badge } from "@/components/ui/badge";

interface CategoryPageProps {
  category?: string;
}

const categoryInfo = {
  breaking: { name: 'Breaking News', icon: 'fas fa-exclamation-triangle', color: 'text-red-500' },
  world: { name: 'World News', icon: 'fas fa-globe', color: 'text-blue-500' },
  kenya: { name: 'Kenyan News', icon: 'fas fa-map-marker-alt', color: 'text-green-500' },
  sports: { name: 'Sports', icon: 'fas fa-futbol', color: 'text-orange-500' },
  technology: { name: 'Technology', icon: 'fas fa-microchip', color: 'text-purple-500' },
  health: { name: 'Health', icon: 'fas fa-heartbeat', color: 'text-teal-500' },
  entertainment: { name: 'Entertainment', icon: 'fas fa-film', color: 'text-pink-500' },
  lifestyle: { name: 'Lifestyle', icon: 'fas fa-spa', color: 'text-indigo-500' },
};

export default function CategoryPage({ category = 'world' }: CategoryPageProps) {
  const { 
    data: articlesData, 
    isLoading, 
    error, 
    refetch 
  } = useNews(category);

  const categoryMeta = categoryInfo[category as keyof typeof categoryInfo] || categoryInfo.world;
  const articles = articlesData?.articles || [];
  const totalResults = articlesData?.total || 0;

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BreakingNewsBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Category Header */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Link href="/" className="text-news-gray hover:text-news-primary mr-2">
                  <i className="fas fa-home"></i>
                </Link>
                <span className="text-news-gray mx-2">/</span>
                <span className="text-news-primary font-medium">{categoryMeta.name}</span>
              </div>
              
              <div className="flex flex-wrap items-center justify-between mb-6">
                <div className="flex items-center">
                  <i className={`${categoryMeta.icon} ${categoryMeta.color} mr-3 text-2xl`}></i>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{categoryMeta.name}</h2>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="outline">
                        {isLoading ? 'Loading...' : `${totalResults} articles`}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Last updated: {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button onClick={handleRefresh} className="bg-news-primary hover:bg-blue-700">
                    <i className="fas fa-sync-alt mr-2"></i>
                    Refresh
                  </Button>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-news-primary">
                    <option>Latest First</option>
                    <option>Most Popular</option>
                    <option>Most Shared</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="mb-8">
                <LoadingState />
                <div className="text-center text-gray-600 mt-4">
                  <p>Fetching {categoryMeta.name.toLowerCase()} from multiple sources...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <ErrorState 
                message={`Unable to load ${categoryMeta.name.toLowerCase()}. We're having trouble connecting to our news sources. Please check your internet connection and try again.`}
                onRetry={handleRefresh}
                showCachedOption={true}
              />
            )}

            {/* Articles Grid */}
            {!isLoading && !error && articles.length > 0 && (
              <>
                <ArticleGrid articles={articles} />
                
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

            {/* Empty State */}
            {!isLoading && !error && articles.length === 0 && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <i className={`${categoryMeta.icon} ${categoryMeta.color} text-6xl mb-4`}></i>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No {categoryMeta.name} Available
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any {categoryMeta.name.toLowerCase()} at the moment. 
                    Our sources might be updating or temporarily unavailable.
                  </p>
                  <div className="space-y-3">
                    <Button onClick={handleRefresh} className="w-full bg-news-primary hover:bg-blue-700">
                      <i className="fas fa-redo mr-2"></i>
                      Try Again
                    </Button>
                    <Link href="/">
                      <Button variant="outline" className="w-full">
                        <i className="fas fa-home mr-2"></i>
                        Back to Home
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
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
