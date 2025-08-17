import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navigationItems = [
  { href: "/breaking", label: "Breaking", icon: "fas fa-exclamation-triangle", color: "text-red-600" },
  { href: "/world", label: "World", icon: "fas fa-globe" },
  { href: "/kenya", label: "Kenya", icon: "fas fa-map-marker-alt" },
  { href: "/sports", label: "Sports", icon: "fas fa-futbol" },
  { href: "/technology", label: "Technology", icon: "fas fa-microchip" },
  { href: "/health", label: "Health", icon: "fas fa-heartbeat" },
  { href: "/entertainment", label: "Entertainment", icon: "fas fa-film" },
  { href: "/lifestyle", label: "Lifestyle", icon: "fas fa-spa" },
];

export default function Header() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-news-primary hover:text-blue-700 transition-colors">
                <i className="fas fa-newspaper mr-2"></i>
                Philip Kilonzo News
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={`transition-colors font-medium ${
                    location === item.href
                      ? item.color || "text-news-primary"
                      : "text-news-gray hover:text-news-primary"
                  } ${item.href === "/breaking" ? "font-semibold" : ""}`}
                >
                  <i className={`${item.icon} mr-1`}></i>
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <form onSubmit={handleSearch}>
                <Input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 border border-gray-300 focus:ring-2 focus:ring-news-primary focus:border-transparent"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </form>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-news-gray hover:text-news-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <i className="fas fa-bars text-xl"></i>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-gray-50">
          <div className="px-4 py-3 space-y-2">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={`block py-2 transition-colors ${
                    location === item.href
                      ? item.color || "text-news-primary font-semibold"
                      : "text-news-gray hover:text-news-primary"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className={`${item.icon} mr-2`}></i>
                  {item.label}
                </a>
              </Link>
            ))}
            
            {/* Mobile Search */}
            <div className="pt-2">
              <form onSubmit={handleSearch}>
                <Input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
