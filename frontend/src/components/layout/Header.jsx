 import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-black text-white px-6 py-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="bg-yellow-400 text-black font-extrabold text-lg px-3 py-1 rounded-lg group-hover:rotate-3 transition-transform">
            Z
          </div>
          <span className="text-2xl font-bold tracking-wide group-hover:text-yellow-400 transition-colors">
            Zin<span className="text-yellow-400">R</span>
          </span>
        </Link>

        

        {/* CTA Buttons */}
        <div className="flex items-center space-x-4">
          <Link 
            to="/dashboard" 
            className="hidden sm:inline-block px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            to="/get-started" 
            className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg shadow-md hover:bg-yellow-300 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
