import { Card, CardContent } from "@/components/ui/card";

export default function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="animate-pulse">
            <div className="h-48 bg-gray-300"></div>
            <CardContent className="p-6">
              <div className="h-4 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/6"></div>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
}
