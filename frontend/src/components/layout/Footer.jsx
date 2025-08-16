import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Zin<span className="text-yellow-400">R</span>
          </h2>
          <p className="text-gray-400 text-sm">
            Smart restaurant queue & ordering system to improve customer experience.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link></li>
            <li><Link to="/what-we-offer" className="hover:text-yellow-400 transition-colors">What We Offer</Link></li>
            <li><Link to="/pricing" className="hover:text-yellow-400 transition-colors">Pricing</Link></li>
            <li><Link to="/contact" className="hover:text-yellow-400 transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            <li><Link to="/faq" className="hover:text-yellow-400 transition-colors">FAQ</Link></li>
            <li><Link to="/privacy" className="hover:text-yellow-400 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-yellow-400 transition-colors">Terms of Service</Link></li>
            <li><Link to="/help" className="hover:text-yellow-400 transition-colors">Help Center</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-white font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4 text-lg">
            <a href="#" className="hover:text-yellow-400 transition-colors"><FaFacebookF /></a>
            <a href="#" className="hover:text-yellow-400 transition-colors"><FaTwitter /></a>
            <a href="#" className="hover:text-yellow-400 transition-colors"><FaInstagram /></a>
            <a href="#" className="hover:text-yellow-400 transition-colors"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ZinR. All rights reserved.
      </div>
    </footer>
  );
}
