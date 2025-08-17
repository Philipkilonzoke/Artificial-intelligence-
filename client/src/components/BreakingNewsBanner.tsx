import { useQuery } from "@tanstack/react-query";

export default function BreakingNewsBanner() {
  const { data: breakingNews } = useQuery({
    queryKey: ['/api/breaking-news'],
    staleTime: 2 * 60 * 1000, // 2 minutes for breaking news
  });

  const breakingNewsText = breakingNews?.length > 0 
    ? breakingNews.map((article: any) => article.title).join(' • ')
    : "Stay tuned for the latest breaking news updates";

  return (
    <div className="bg-news-secondary text-white py-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <span className="bg-white text-news-secondary px-3 py-1 rounded text-xs font-bold mr-4 flex-shrink-0">
            BREAKING
          </span>
          <div className="overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              <span>{breakingNewsText}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
