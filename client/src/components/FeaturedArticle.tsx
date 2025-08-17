import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Article } from "@shared/schema";

interface FeaturedArticleProps {
  article: Article;
}

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
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

  return (
    <div className="mb-8">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          {article.urlToImage ? (
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-64 md:h-80 object-cover"
              loading="eager"
            />
          ) : (
            <div className="w-full h-64 md:h-80 bg-gradient-to-r from-news-primary to-blue-600 flex items-center justify-center">
              <i className="fas fa-newspaper text-white text-6xl opacity-50"></i>
            </div>
          )}
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-center mb-3">
            <Badge className={`${getCategoryStyle(article.category)} mr-3`}>
              {article.category.toUpperCase()}
            </Badge>
            <span className="text-sm text-gray-500">
              {formatTimeAgo(article.publishedAt)}
            </span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>
          
          <p className="text-gray-600 text-lg mb-4 line-clamp-3">
            {article.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">
                <i className="fas fa-newspaper mr-1"></i>
                {article.source}
              </span>
              {article.author && (
                <span className="text-sm text-gray-500">
                  <i className="fas fa-user mr-1"></i>
                  {article.author}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-news-primary">
                <i className="fas fa-share"></i>
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                <i className="far fa-heart"></i>
              </Button>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <Button className="bg-news-primary hover:bg-blue-700">
                  Read More
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
