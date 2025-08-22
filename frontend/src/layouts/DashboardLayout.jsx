 // src/layouts/DashboardLayout.jsx
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "../store/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../context/SubscriptionContext";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  PlusCircle,
  Layers,
  UtensilsCrossed,
  LogOut,
  ShoppingCart,
  Crown,
  BarChart3,
  Monitor,
  Lock,
  AlertCircle,
  Play,
  ChevronRight,
  Minus,
} from "lucide-react";
import { showSuccess } from "../utils/toast";
import { useState } from "react";

export default function DashboardLayout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    subscription,
    loading,
    canAccessFeature,
    hasActiveSubscription,
    checkSubscriptionStatus,
  } = useSubscription();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    dispatch(clearAuth());
    showSuccess("Logged out successfully");
    navigate("/login");
  };

  const handleNavigation = (route, feature) => {
    if (canAccessFeature(feature)) {
      navigate(route);
      setShowMobileMenu(false); // Close mobile menu after navigation
    } else {
      navigate("/subscription");
      setShowMobileMenu(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderNavigationButton = (
    route,
    feature,
    icon,
    label,
    description = null
  ) => {
    const hasAccess = canAccessFeature(feature);
    const isRestricted = !hasAccess;

    return (
      <div key={route} className="relative group">
        <button
          onClick={() => handleNavigation(route, feature)}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
            isRestricted
              ? "bg-gray-800/80 hover:bg-gray-700/80 opacity-60 cursor-not-allowed border border-gray-700/50"
              : "bg-gray-800/60 hover:bg-gray-700/80 border border-gray-700/50 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10"
          } ${sidebarCollapsed ? "justify-center" : ""}`}
          disabled={isRestricted}
          title={sidebarCollapsed ? label : undefined}
        >
          <div className={`p-2 rounded-lg transition-all duration-300 ${
            isRestricted 
              ? "text-gray-500" 
              : "text-yellow-400 group-hover:bg-yellow-400/20 group-hover:scale-110"
          }`}>
            {icon}
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">{label}</span>
                {isRestricted && <Lock size={16} className="text-yellow-400" />}
              </div>
              {description && (
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{description}</p>
              )}
            </div>
          )}
          {!sidebarCollapsed && !isRestricted && (
            <ChevronRight size={16} className="text-gray-500 group-hover:text-yellow-400 transition-colors" />
          )}
        </button>
      </div>
    );
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-lg font-medium text-gray-300">Loading dashboard...</p>
          <div className="mt-4 w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-b from-gray-800 to-gray-900 flex flex-col shadow-2xl h-screen transition-all duration-300 relative border-r border-gray-700/50 ${
          sidebarCollapsed ? "w-20" : "w-72"
        } lg:block hidden`}
      >
        {/* Brand */}
        <div className="p-6 flex items-center justify-between mb-8 flex-shrink-0 border-b border-gray-700/50">
          <h1
            className={`font-extrabold cursor-pointer transition-all duration-300 ${
              sidebarCollapsed ? "text-xl" : "text-2xl"
            }`}
            onClick={() => navigate("/dashboard")}
          >
            {sidebarCollapsed ? (
              <span className="text-yellow-400">Z</span>
            ) : (
              <>
                Zin<span className="text-yellow-400">R</span>
              </>
            )}
          </h1>

          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-400 hover:text-yellow-400 transition-colors rounded-lg hover:bg-gray-700/50"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Subscription Banner */}
        {!hasActiveSubscription() && !sidebarCollapsed && (
          <div className="px-6 mb-6 flex-shrink-0">
            <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <AlertCircle size={16} className="text-yellow-400" />
                </div>
                <span className="text-sm font-semibold text-yellow-400">
                  Free Plan
                </span>
              </div>
              <p className="text-xs text-gray-300 mb-3 leading-relaxed">
                Upgrade to access all premium features and unlock your restaurant's full potential
              </p>
              <button
                onClick={() => navigate("/subscription")}
                className="w-full py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black text-sm font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        {/* Navigation - Scrollable area with dynamic height */}
        <div className="overflow-hidden flex-1" style={{ 
          height: hasActiveSubscription() 
            ? "calc(100vh - 320px)" 
            : "calc(100vh - 440px)" 
        }}>
          <nav 
            className="px-6 space-y-4 h-full overflow-y-auto pb-6" 
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style jsx>{`
              nav::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {/* Navigation Section Header */}
            {!sidebarCollapsed && (
              <div className="pt-2 pb-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <Minus size={12} />
                  Navigation
                  <Minus size={12} />
                </div>
              </div>
            )}

            {renderNavigationButton(
              "/dashboard",
              "dashboard",
              <Home size={20} />,
              "Dashboard",
              sidebarCollapsed ? null : "Overview & Statistics"
            )}
            {renderNavigationButton(
              "/create-restaurant",
              "create-restaurant",
              <PlusCircle size={20} />,
              "Create Restaurant",
              sidebarCollapsed ? null : "Set up your restaurant"
            )}
            {renderNavigationButton(
              "/create-category",
              "create-category",
              <Layers size={20} />,
              "Create Category",
              sidebarCollapsed ? null : "Organize your menu"
            )}
            {renderNavigationButton(
              "/create-menu-item",
              "create-menu-item",
              <UtensilsCrossed size={20} />,
              "Create Menu Item",
              sidebarCollapsed ? null : "Add dishes to your menu"
            )}
            {renderNavigationButton(
              "/order-management",
              "order-management",
              <ShoppingCart size={20} />,
              "Order Management",
              sidebarCollapsed ? null : "Handle customer orders"
            )}
            {renderNavigationButton(
              "/analytics",
              "analytics",
              <BarChart3 size={20} />,
              "Analytics",
              sidebarCollapsed ? null : "Business insights"
            )}
            {renderNavigationButton(
              "/restaurant-dashboard",
              "restaurant-dashboard",
              <Monitor size={20} />,
              "Live Dashboard",
              sidebarCollapsed ? null : "Real-time updates"
            )}
          </nav>
        </div>

        {/* Footer - User Info & Logout - Always visible at bottom */}
        <div className="p-6 border-t border-gray-700/50 bg-gray-800/80 flex-shrink-0">
          {!sidebarCollapsed && (
            <div className="mb-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600/30">
              <p className="text-xs text-gray-400 mb-1">Logged in as</p>
              <p className="font-semibold text-white text-sm">{user?.name || "User"}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center cursor-pointer gap-2 justify-center w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            title={sidebarCollapsed ? "Logout" : undefined}
          >
            <LogOut size={18} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className="flex-1 overflow-y-auto h-screen"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style jsx>{`
          main::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="p-4 lg:p-8">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl border border-gray-700/50 shadow-lg">
            <h1 className="text-xl font-bold">
              Zin<span className="text-yellow-400">R</span>
            </h1>
            <div className="flex items-center gap-3">
              {/* Mobile Menu */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 text-gray-300 hover:text-yellow-400 transition-colors rounded-lg hover:bg-gray-700/50"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              {/* Logout Mobile */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {showMobileMenu && (
            <div className="lg:hidden mb-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl border border-gray-700/50 shadow-lg relative">
              {/* Scrollable navigation area */}
              <div className="p-4 space-y-3 max-h-96 overflow-y-auto pb-20" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                
                {/* Mobile Navigation Header */}
                <div className="pb-3 border-b border-gray-600/30">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    <Minus size={12} />
                    Navigation
                    <Minus size={12} />
                  </div>
                </div>

                {renderNavigationButton(
                  "/dashboard",
                  "dashboard",
                  <Home size={18} />,
                  "Dashboard",
                  "Overview & Statistics"
                )}
                {renderNavigationButton(
                  "/create-restaurant",
                  "create-restaurant",
                  <PlusCircle size={18} />,
                  "Create Restaurant",
                  "Set up your restaurant"
                )}
                {renderNavigationButton(
                  "/create-category",
                  "create-category",
                  <Layers size={18} />,
                  "Create Category",
                  "Organize your menu"
                )}
                {renderNavigationButton(
                  "/create-menu-item",
                  "create-menu-item",
                  <UtensilsCrossed size={18} />,
                  "Create Menu Item",
                  "Add dishes to your menu"
                )}
                {renderNavigationButton(
                  "/order-management",
                  "order-management",
                  <ShoppingCart size={18} />,
                  "Order Management",
                  "Handle customer orders"
                )}
                {renderNavigationButton(
                  "/analytics",
                  "analytics",
                  <BarChart3 size={18} />,
                  "Analytics",
                  "Business insights"
                )}
                {renderNavigationButton(
                  "/restaurant-dashboard",
                  "restaurant-dashboard",
                  <Monitor size={18} />,
                  "Live Dashboard",
                  "Real-time updates"
                )}
              </div>
              {/* Fixed Logout in Mobile Nav */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-600/30 bg-gray-800/80">
                <button
                  onClick={handleLogout}
                  className="flex items-center cursor-pointer gap-2 justify-center w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-medium transition-all duration-300 shadow-lg"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </div>
          )}

          {/* Header with subscription */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
              <div className="flex-1">
                <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                  Welcome back,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                    {user?.name || "User"}
                  </span> 🎉
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
              </div>
              
              {/* User Profile with Subscription Status */}
              <div className="flex items-center gap-4">
                {hasActiveSubscription() && subscription && (
                  <div className="flex items-center gap-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl px-4 py-3 shadow-lg">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Crown className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-green-400">
                        {subscription.plan?.name || 'Premium Plan'}
                      </span>
                      <p className="text-xs text-green-300">Active Subscription</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3 bg-gradient-to-r from-gray-700/50 to-gray-600/50 border border-gray-600/30 rounded-xl px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full flex items-center justify-center">
                    <span className="text-yellow-400 font-bold text-lg">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-semibold text-white">{user?.name || 'User'}</div>
                    <div className="text-xs text-gray-300">{user?.email}</div>
                  </div>
                </div>
              </div>
            </div>

            {!hasActiveSubscription() && (
              <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 border border-yellow-500/30 rounded-xl p-6 shadow-xl">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                  <div className="p-3 bg-yellow-500/20 rounded-xl">
                    <Crown className="w-7 h-7 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">
                      Upgrade to Premium for Full Access
                    </h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      Unlock all dashboard features including restaurant management, 
                      order processing, analytics, and real-time monitoring with 
                      our premium subscription plans.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => navigate("/subscription")}
                        className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        View Plans
                      </button>
                      <button
                        onClick={() => {
                          localStorage.setItem(
                            "zinr_subscription_status",
                            "active"
                          );
                          checkSubscriptionStatus();
                          showSuccess(
                            "Demo subscription activated! You now have access to all premium features."
                          );
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Quick Demo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Content Separator */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
              <div className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-full">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Content</span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
