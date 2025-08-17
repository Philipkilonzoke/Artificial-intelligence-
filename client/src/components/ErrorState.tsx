import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  showCachedOption?: boolean;
}

export default function ErrorState({ message, onRetry, showCachedOption }: ErrorStateProps) {
  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <i className="fas fa-exclamation-triangle text-6xl text-news-secondary mb-4"></i>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load News</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="space-y-3">
          <Button onClick={onRetry} className="w-full bg-news-primary hover:bg-blue-700">
            <i className="fas fa-redo mr-2"></i>
            Try Again
          </Button>
          
          {showCachedOption && (
            <Button
              variant="outline"
              onClick={() => {
                // TODO: Load cached articles from localStorage
                console.log("Loading cached articles...");
              }}
              className="w-full"
            >
              <i className="fas fa-archive mr-2"></i>
              Load Cached Articles
            </Button>
          )}
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>If the problem persists, contact 
            <a href="mailto:support@philipkilonzo.com" className="text-news-primary hover:underline ml-1">
              support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
