import { Link } from "react-router-dom";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Clock,
  ArrowRight,
  Star
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-extrabold text-xl px-3 py-2 rounded-xl">
                Z
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">
                  Zin<span className="text-yellow-400">R</span>
                </h2>
                <p className="text-sm text-gray-400">Restaurant Solutions</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Transform your restaurant with our smart queue management and digital ordering system. 
              Enhance customer experience and boost your business efficiency.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-yellow-400" />
                <span>hello@zinr.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-yellow-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="w-4 h-4 text-yellow-400" />
                <span>123 Business Ave, Tech City</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6 flex items-center">
              Quick Links
              <ArrowRight className="w-4 h-4 ml-2 text-yellow-400" />
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="hover:text-yellow-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/what-we-offer" className="hover:text-yellow-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  What We Offer
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-yellow-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link to="/demo" className="hover:text-yellow-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Live Demo
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-yellow-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Resources */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6 flex items-center">
              Support
              <Star className="w-4 h-4 ml-2 text-yellow-400" />
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="hover:text-yellow-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-yellow-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-yellow-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/api-docs" className="hover:text-yellow-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  API Documentation
                </Link>
              </li>
              <li>
                <Link to="/status" className="hover:text-yellow-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  System Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6 flex items-center">
              Company
              <MapPin className="w-4 h-4 ml-2 text-yellow-400" />
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="hover:text-yellow-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  About ZinR
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-yellow-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-yellow-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Blog & News
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-yellow-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-yellow-400 transition-colors duration-300 flex items-center group">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="text-center">
            <h3 className="text-white text-xl font-semibold mb-3">Stay Updated</h3>
            <p className="text-gray-400 mb-6">Get the latest updates, tips, and exclusive offers delivered to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white placeholder-gray-400"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} ZinR. All rights reserved. | Made with ❤️ for restaurants worldwide
            </div>
            
            {/* Social Media Links */}
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 p-2 hover:bg-gray-800 rounded-lg">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 p-2 hover:bg-gray-800 rounded-lg">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 p-2 hover:bg-gray-800 rounded-lg">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 p-2 hover:bg-gray-800 rounded-lg">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
