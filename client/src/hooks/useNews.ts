import { useQuery } from "@tanstack/react-query";

export function useNews(category: string = 'all', options: { refresh?: boolean } = {}) {
  return useQuery({
    queryKey: ['/api/articles', category, options.refresh],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category && category !== 'all') {
        params.append('category', category);
      }
      if (options.refresh) {
        params.append('refresh', 'true');
      }
      
      const url = `/api/articles${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.statusText}`);
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Retry up to 3 times, with exponential backoff
      if (failureCount >= 3) return false;
      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useBreakingNews() {
  return useQuery({
    queryKey: ['/api/breaking-news'],
    staleTime: 2 * 60 * 1000, // 2 minutes for breaking news
    refetchInterval: 2 * 60 * 1000, // Auto-refresh every 2 minutes
  });
}

export function useTrendingNews() {
  return useQuery({
    queryKey: ['/api/trending'],
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useSearchNews(query: string, category?: string) {
  return useQuery({
    queryKey: ['/api/search', query, category],
    queryFn: async () => {
      if (!query.trim()) return [];
      
      const params = new URLSearchParams({ q: query });
      if (category && category !== 'all') {
        params.append('category', category);
      }
      
      const response = await fetch(`/api/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      return response.json();
    },
    enabled: !!query.trim(),
    staleTime: 5 * 60 * 1000,
  });
}
