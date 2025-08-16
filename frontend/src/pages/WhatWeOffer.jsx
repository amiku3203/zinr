import { useNavigate } from "react-router-dom";
import { FaClock, FaUtensils, FaMobileAlt } from "react-icons/fa";

export default function WhatWeOffer() {
  const navigate = useNavigate();
  const isLoggedIn = false; // Replace with real auth check later

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/payment");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-16 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          What We Offer at <span className="text-yellow-400">ZinR</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          ZinR helps restaurants streamline queue management, improve customer satisfaction, 
          and maximize table turnover with an easy-to-use system.
        </p>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Feature 1 */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-yellow-400/20 transition">
          <FaClock className="text-yellow-400 text-4xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Queue Management</h3>
          <p className="text-gray-400 text-sm">
            No more waiting chaos — let customers reserve their spot digitally and get notified when it’s their turn.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-yellow-400/20 transition">
          <FaUtensils className="text-yellow-400 text-4xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Digital Menu & Ordering</h3>
          <p className="text-gray-400 text-sm">
            Customers scan a QR code to view your menu, place orders, and pay — all from their phone.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-yellow-400/20 transition">
          <FaMobileAlt className="text-yellow-400 text-4xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Mobile-Friendly</h3>
          <p className="text-gray-400 text-sm">
            Our system works seamlessly on any device — no extra downloads required.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gray-900 py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Only ₹7999 / Month</h2>
        <p className="text-gray-400 max-w-lg mx-auto mb-6">
          All features included. No hidden fees. Cancel anytime.
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-lg transition"
        >
          Get Started
        </button>
      </section>
    </div>
  );
}
