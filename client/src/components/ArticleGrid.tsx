import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Article } from "@shared/schema";

interface ArticleGridProps {
  articles: Article[];
}

export default function ArticleGrid({ articles }: ArticleGridProps) {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    }
  };

  const getCategoryStyle = (category: string) => {
    const styles = {
      breaking: 'category-breaking',
      world: 'category-world',
      kenya: 'category-kenya',
      sports: 'category-sports',
      technology: 'category-technology',
      health: 'category-health',
      entertainment: 'category-entertainment',
      lifestyle: 'category-lifestyle',
    };
    return styles[category as keyof typeof styles] || 'bg-gray-500 text-white';
  };

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-newspaper text-6xl text-gray-300 mb-4"></i>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Articles Available</h3>
        <p className="text-gray-500">Check back later for new content.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {articles.map((article) => (
        <Card key={article.id} className="overflow-hidden hover:shadow-lg hover-lift transition-all duration-300">
          <div className="relative">
            {article.urlToImage ? (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                <i className="fas fa-image text-gray-400 text-3xl"></i>
              </div>
            )}
          </div>
          
          <CardContent className="p-6">
            <div className="flex items-center mb-3">
              <Badge className={`${getCategoryStyle(article.category)} mr-2 text-xs`}>
                {article.category.toUpperCase()}
              </Badge>
              <span className="text-sm text-gray-500">
                {formatTimeAgo(article.publishedAt)}
              </span>
            </div>
            
            <h2 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">
              {article.title}
            </h2>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {article.description}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className="truncate">
                {article.source}
              </span>
              <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                {article.readTime && (
                  <span className="flex items-center">
                    <i className="fas fa-clock mr-1"></i>
                    {article.readTime} min read
                  </span>
                )}
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500 p-1">
                  <i className="far fa-bookmark"></i>
                </Button>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-news-primary p-1">
                    <i className="fas fa-external-link-alt"></i>
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
