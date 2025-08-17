import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SocialLinks() {
  const socialLinks = [
    { name: "Facebook", icon: "fab fa-facebook-f", url: "#", color: "bg-blue-600 hover:bg-blue-700" },
    { name: "Twitter", icon: "fab fa-twitter", url: "#", color: "bg-blue-400 hover:bg-blue-500" },
    { name: "YouTube", icon: "fab fa-youtube", url: "#", color: "bg-red-600 hover:bg-red-700" },
    { name: "Instagram", icon: "fab fa-instagram", url: "#", color: "bg-pink-500 hover:bg-pink-600" },
  ];

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900">Follow Us</h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {socialLinks.map((social) => (
            <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer">
              <Button className={`w-full text-white transition-colors ${social.color}`}>
                <i className={`${social.icon} mr-2`}></i>
                {social.name}
              </Button>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
