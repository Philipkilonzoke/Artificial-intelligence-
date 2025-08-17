import { BrowserRouter, Routes, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import HomePage from "@/pages/HomePage";
import CategoryPage from "@/pages/CategoryPage";
import NotFoundPage from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background font-inter">
        <Routes>
          <Route path="/" component={HomePage} />
          <Route path="/category/:category" component={CategoryPage} />
          <Route path="/breaking" component={() => <CategoryPage category="breaking" />} />
          <Route path="/world" component={() => <CategoryPage category="world" />} />
          <Route path="/kenya" component={() => <CategoryPage category="kenya" />} />
          <Route path="/sports" component={() => <CategoryPage category="sports" />} />
          <Route path="/technology" component={() => <CategoryPage category="technology" />} />
          <Route path="/health" component={() => <CategoryPage category="health" />} />
          <Route path="/entertainment" component={() => <CategoryPage category="entertainment" />} />
          <Route path="/lifestyle" component={() => <CategoryPage category="lifestyle" />} />
          <Route component={NotFoundPage} />
        </Routes>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
