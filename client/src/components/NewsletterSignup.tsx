import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const subscribeToNewsletter = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        throw new Error('Subscription failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
      setEmail("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      subscribeToNewsletter.mutate(email);
    }
  };

  return (
    <Card className="bg-gradient-to-r from-news-primary to-blue-600 text-white border-0">
      <CardContent className="p-6 text-center">
        <i className="fas fa-envelope text-3xl mb-4"></i>
        <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
        <p className="text-blue-100 mb-6">Get the latest news delivered to your inbox daily</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-blue-300"
            required
          />
          <Button
            type="submit"
            disabled={subscribeToNewsletter.isPending}
            className="w-full bg-white text-news-primary hover:bg-gray-100 font-semibold"
          >
            {subscribeToNewsletter.isPending ? (
              <i className="fas fa-spinner fa-spin mr-2"></i>
            ) : (
              <i className="fas fa-paper-plane mr-2"></i>
            )}
            Subscribe
          </Button>
        </form>
        
        <p className="text-xs text-blue-100 mt-3">No spam, unsubscribe anytime</p>
      </CardContent>
    </Card>
  );
}
