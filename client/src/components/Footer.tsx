import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const categories = [
    { href: "/breaking", label: "Breaking News", icon: "fas fa-bolt" },
    { href: "/world", label: "World News", icon: "fas fa-globe" },
    { href: "/kenya", label: "Kenyan News", icon: "fas fa-map-marker-alt" },
    { href: "/sports", label: "Sports", icon: "fas fa-futbol" },
    { href: "/technology", label: "Technology", icon: "fas fa-microchip" },
    { href: "/health", label: "Health", icon: "fas fa-heartbeat" },
    { href: "/entertainment", label: "Entertainment", icon: "fas fa-film" },
    { href: "/lifestyle", label: "Lifestyle", icon: "fas fa-spa" },
  ];

  return (
    <footer className="bg-news-dark text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <i className="fas fa-newspaper mr-2"></i>
              Philip Kilonzo News
            </h3>
            <p className="text-gray-300 mb-4">
              Your trusted source for real-time news from Kenya and around the world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-300">
              {categories.map((category) => (
                <li key={category.href}>
                  <Link href={category.href}>
                    <a className="hover:text-white transition-colors flex items-center">
                      <i className={`${category.icon} mr-2 w-4`}></i>
                      {category.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Advertise</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">RSS Feeds</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center">
                <i className="fas fa-envelope mr-3"></i>
                <span>news@philipkilonzo.com</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-phone mr-3"></i>
                <span>+254 700 000 000</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-map-marker-alt mr-3"></i>
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} Philip Kilonzo News. All rights reserved. | Powered by real-time news APIs</p>
        </div>
      </div>
    </footer>
  );
}
