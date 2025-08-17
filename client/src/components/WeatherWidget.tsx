import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function WeatherWidget() {
  // TODO: Integrate with actual weather API
  const { data: weather } = useQuery({
    queryKey: ['/api/weather'],
    queryFn: async () => {
      // Mock weather data for now
      return {
        temperature: 23,
        condition: "Partly Cloudy",
        high: 26,
        low: 18,
        location: "Nairobi",
      };
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <i className="fas fa-cloud-sun text-yellow-500 mr-2"></i>
          Weather in {weather?.location || "Nairobi"}
        </h3>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {weather?.temperature || "--"}°C
          </div>
          <div className="text-gray-600 mb-4">
            {weather?.condition || "Loading..."}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-500">High</div>
              <div className="font-semibold">
                {weather?.high || "--"}°C
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-500">Low</div>
              <div className="font-semibold">
                {weather?.low || "--"}°C
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
