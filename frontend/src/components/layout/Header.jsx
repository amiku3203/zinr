import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white shadow-2xl sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-extrabold text-xl px-4 py-2 rounded-xl group-hover:scale-110 group-hover:rotate-2 transition-all duration-300 shadow-lg">
              Z
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold tracking-wide group-hover:text-yellow-400 transition-colors">
                Zin<span className="text-yellow-400">R</span>
              </span>
              <span className="text-xs text-gray-400 -mt-1">Restaurant Solutions</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-yellow-400 transition-colors font-medium relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            <div className="relative group">
              <button 
                className="flex items-center text-gray-300 hover:text-yellow-400 transition-colors font-medium"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                Features
                <ChevronDown className="ml-1 w-4 h-4 group-hover:rotate-180 transition-transform" />
              </button>
              
              {/* Dropdown Menu */}
              <div 
                className={`absolute top-full left-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2`}
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <div className="p-4 space-y-3">
                  <Link to="/what-we-offer" className="block p-3 rounded-lg hover:bg-gray-800 transition-colors">
                    <div className="font-medium text-white">What We Offer</div>
                    <div className="text-sm text-gray-400">Discover our solutions</div>
                  </Link>
                  <Link to="/pricing" className="block p-3 rounded-lg hover:bg-gray-800 transition-colors">
                    <div className="font-medium text-white">Pricing Plans</div>
                    <div className="text-sm text-gray-400">Choose your plan</div>
                  </Link>
                  <Link to="/demo" className="block p-3 rounded-lg hover:bg-gray-800 transition-colors">
                    <div className="font-medium text-white">Live Demo</div>
                    <div className="text-sm text-gray-400">See it in action</div>
                  </Link>
                </div>
              </div>
            </div>

            <Link 
              to="/about" 
              className="text-gray-300 hover:text-yellow-400 transition-colors font-medium relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            <Link 
              to="/contact" 
              className="text-gray-300 hover:text-yellow-400 transition-colors font-medium relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link 
              to="/login" 
              className="px-6 py-2.5 text-gray-300 hover:text-white border border-gray-600 hover:border-yellow-400 rounded-lg transition-all duration-300 font-medium"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-800 py-4">
            <nav className="space-y-4">
              <Link 
                to="/" 
                className="block py-2 text-gray-300 hover:text-yellow-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/what-we-offer" 
                className="block py-2 text-gray-300 hover:text-yellow-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                What We Offer
              </Link>
              <Link 
                to="/pricing" 
                className="block py-2 text-gray-300 hover:text-yellow-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/about" 
                className="block py-2 text-gray-300 hover:text-yellow-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="block py-2 text-gray-300 hover:text-yellow-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
            
            <div className="pt-4 space-y-3">
              <Link 
                to="/login" 
                className="block w-full text-center py-2.5 text-gray-300 border border-gray-600 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="block w-full text-center py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
