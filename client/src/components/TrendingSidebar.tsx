import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function TrendingSidebar() {
  const { data: trendingArticles = [] } = useQuery({
    queryKey: ['/api/trending'],
    staleTime: 5 * 60 * 1000,
  });

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <i className="fas fa-fire text-orange-500 mr-2"></i>
          Trending Now
        </h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trendingArticles.slice(0, 5).map((article: any, index: number) => (
            <div key={article.id} className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-news-accent text-white text-xs font-bold rounded-full flex items-center justify-center">
                {index + 1}
              </span>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 leading-tight mb-1 line-clamp-2">
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:text-news-primary transition-colors">
                    {article.title}
                  </a>
                </h4>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="truncate">{article.source}</span>
                  <span className="mx-1">•</span>
                  <span>{formatTimeAgo(article.publishedAt)}</span>
                </div>
              </div>
            </div>
          ))}
          
          {trendingArticles.length === 0 && (
            <div className="text-center py-4">
              <i className="fas fa-chart-line text-gray-300 text-3xl mb-2"></i>
              <p className="text-gray-500 text-sm">Loading trending articles...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
