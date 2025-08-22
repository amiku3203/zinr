 // src/pages/Dashboard.jsx
import { useSubscription } from "../../context/SubscriptionContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { motion } from "framer-motion";
import SEO from "../../components/SEO";
import { useGetMyRestaurantQuery } from "../../store/features/restorent/restoApi";
import { Crown, Lock, CheckCircle, ArrowRight, Star, Zap, Shield, Users, Play, QrCode, Download, Printer, Link, Minus, PlusCircle, Layers, UtensilsCrossed, ShoppingCart, BarChart3, Monitor } from "lucide-react";
import { showSuccess, showError } from "../../utils/toast";

export default function Dashboard() {
  const { subscription, hasActiveSubscription, checkSubscriptionStatus } = useSubscription();
  const navigate = useNavigate();
  
  // Get restaurant data for QR code display
  const { data: restaurantData } = useGetMyRestaurantQuery();

  // SEO structured data for Dashboard
  const dashboardStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ZinR Dashboard",
    "description": "Restaurant management dashboard for creating menus, managing orders, and tracking business performance.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "url": "https://zinr.com/dashboard",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR",
      "description": "Free trial available"
    }
  };

  // Demo subscription activation
  const activateDemoSubscription = () => {
    localStorage.setItem('zinr_subscription_status', 'active');
    checkSubscriptionStatus();
    showSuccess('Demo subscription activated! You now have access to all premium features.');
  };

  if (!hasActiveSubscription()) {
    return (
      <DashboardLayout>
        <SEO 
          title="Dashboard - Restaurant Management"
          description="Get started with ZinR dashboard. Upgrade to premium or try demo mode to explore all restaurant management features."
          keywords={[
            "restaurant dashboard",
            "restaurant management",
            "demo mode",
            "premium features",
            "restaurant software"
          ]}
          structuredData={dashboardStructuredData}
        />
        <div className="space-y-8">
          {/* Page Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Dashboard</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Get started by upgrading to premium or try our demo mode to explore all features
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mt-6"></div>
          </div>

          {/* Demo Subscription Button - Easy Access */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 border border-blue-500/30 rounded-2xl p-8 text-center shadow-2xl"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Play className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-blue-400">Quick Demo Access</h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-3xl mx-auto text-lg leading-relaxed">
              Want to explore all premium features right now? Click the button below to activate demo mode 
              and unlock the full dashboard experience instantly!
            </p>
            <button
              onClick={activateDemoSubscription}
              className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 flex items-center gap-3 mx-auto text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Play className="w-6 h-6" />
              Activate Demo Now
            </button>
            <p className="text-sm text-gray-400 mt-4">
              This is for demonstration purposes. In production, users would pay for subscriptions.
            </p>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-700/50 rounded-2xl p-8 shadow-xl"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-3">What You'll Get with Premium</h3>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: <PlusCircle className="w-8 h-8" />, title: "Restaurant Management", desc: "Create and manage your restaurant profile" },
                { icon: <Layers className="w-8 h-8" />, title: "Menu Categories", desc: "Organize your menu with categories" },
                { icon: <UtensilsCrossed className="w-8 h-8" />, title: "Menu Items", desc: "Add and manage your dishes" },
                { icon: <ShoppingCart className="w-8 h-8" />, title: "Order Processing", desc: "Handle customer orders efficiently" },
                { icon: <BarChart3 className="w-8 h-8" />, title: "Analytics", desc: "Track your business performance" },
                { icon: <Monitor className="w-8 h-8" />, title: "Live Dashboard", desc: "Real-time order monitoring" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-gradient-to-br from-gray-700/50 to-gray-600/50 border border-gray-600/30 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <div className="text-yellow-400">
                      {feature.icon}
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SEO 
        title="Dashboard - Restaurant Management"
        description="Manage your restaurant, track orders, and grow your business with our comprehensive tools."
        keywords={[
          "restaurant dashboard",
          "restaurant management",
          "restaurant software",
          "order tracking",
          "business analytics"
        ]}
        structuredData={dashboardStructuredData}
      />
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Dashboard</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Manage your restaurant, track orders, and grow your business with our comprehensive tools
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mt-6"></div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { icon: <Star className="w-6 h-6" />, title: "Subscription", value: "Active", color: "from-green-500 to-emerald-600" },
            { icon: <CheckCircle className="w-6 h-6" />, title: "Status", value: "Premium", color: "from-blue-500 to-indigo-600" },
            { icon: <Zap className="w-6 h-6" />, title: "Features", value: "Unlocked", color: "from-yellow-500 to-orange-600" },
            { icon: <Shield className="w-6 h-6" />, title: "Support", value: "24/7", color: "from-purple-500 to-pink-600" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-700/50 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                <div className="text-white">
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">{stat.title}</h3>
              <p className="text-xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Content Separator */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          <div className="px-6 py-3 bg-gray-800/50 border border-gray-700/50 rounded-full">
            <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Minus size={16} />
              Restaurant Management
              <Minus size={16} />
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
        </div>

        {/* QR Code Section - Show when user has restaurant */}
        {restaurantData?.data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 border border-green-500/30 rounded-2xl p-8 shadow-2xl"
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <QrCode className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-3xl font-bold text-green-400">
                  📱 Your Restaurant QR Code
                </h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
                Display this QR code for customers to scan and order from your digital menu. 
                Print it, display it on tables, or share it digitally!
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
              {/* QR Code Display */}
              <div className="text-center">
                <div className="bg-white p-6 rounded-2xl shadow-2xl inline-block">
                  <img 
                    src={restaurantData.data.qrCode} 
                    alt="Restaurant QR Code" 
                    className="w-40 h-40 object-contain"
                  />
                </div>
                <p className="text-sm text-gray-400 mt-3 font-medium">
                  Scan with any QR code app
                </p>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = restaurantData.data.qrCode;
                    link.download = `${restaurantData.data.name}-QR-Code.png`;
                    link.click();
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-3 text-base shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Download className="w-5 h-5" />
                  Download QR Code
                </button>
                
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-3 text-base shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Printer className="w-5 h-5" />
                  Print QR Code
                </button>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${process.env.REACT_APP_FRONTEND_URL || 'http://localhost:5173'}/menu/${restaurantData.data._id}`);
                    showSuccess('Menu link copied to clipboard!');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-3 text-base shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Link className="w-5 h-5" />
                  Copy Menu Link
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-700/50 rounded-2xl p-8 shadow-xl"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-3">Quick Actions</h3>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { route: "/create-restaurant", icon: <PlusCircle className="w-8 h-8" />, title: "Create Restaurant", desc: "Set up your restaurant profile", color: "from-blue-500 to-indigo-600" },
              { route: "/create-category", icon: <Layers className="w-8 h-8" />, title: "Add Categories", desc: "Organize your menu structure", color: "from-green-500 to-emerald-600" },
              { route: "/create-menu-item", icon: <UtensilsCrossed className="w-8 h-8" />, title: "Add Menu Items", desc: "Create your dish catalog", color: "from-yellow-500 to-orange-600" },
              { route: "/order-management", icon: <ShoppingCart className="w-8 h-8" />, title: "Manage Orders", desc: "Handle customer orders", color: "from-purple-500 to-pink-600" },
              { route: "/analytics", icon: <BarChart3 className="w-8 h-8" />, title: "View Analytics", desc: "Track your performance", color: "from-red-500 to-pink-600" },
              { route: "/restaurant-dashboard", icon: <Monitor className="w-8 h-8" />, title: "Live Dashboard", desc: "Real-time monitoring", color: "from-indigo-500 to-purple-600" }
            ].map((action, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => navigate(action.route)}
                className="bg-gradient-to-br from-gray-700/50 to-gray-600/50 border border-gray-600/30 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {action.icon}
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{action.title}</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{action.desc}</p>
                <div className="mt-4 flex items-center justify-center gap-2 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium">Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Demo Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-6 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Play className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-blue-400">Demo Controls</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                localStorage.removeItem('zinr_subscription_status');
                checkSubscriptionStatus();
                showSuccess('Demo subscription deactivated! You now have limited access.');
              }}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Deactivate Demo
            </button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
