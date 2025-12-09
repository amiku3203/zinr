import { createContext, useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      checkSubscriptionStatus();
    }
  }, [user]);

  const checkSubscriptionStatus = async () => {
    try {
      // First check if user has subscription data from auth/me
      if (user?.subscription && user.subscription.status === "active") {
        // User has active subscription from API
        setSubscription({
          status: "active",
          plan: user.subscription.plan?.name || "Premium",
          expiresAt: user.subscription.endDate
            ? new Date(user.subscription.endDate)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          features: [
            "Full Dashboard Access",
            "Order Management",
            "Analytics",
            "Live Dashboard",
          ],
        });

        // Save to localStorage for persistence
        if (user.subscription._id) {
          localStorage.setItem("user_subscription_id", user.subscription._id);
          localStorage.setItem("zinr_subscription_status", "active");
        }

        setLoading(false);
        return;
      }

      // Fallback: Check for subscription ID in localStorage
      const realSubscriptionId = localStorage.getItem("user_subscription_id");

      if (realSubscriptionId) {
        // Real subscription exists - set it as active
        setSubscription({
          status: "active",
          plan: "Premium",
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          features: [
            "Full Dashboard Access",
            "Order Management",
            "Analytics",
            "Live Dashboard",
          ],
        });
        setLoading(false);
        return;
      }

      // Fallback to demo subscription check
      const hasDemoSubscription =
        localStorage.getItem("zinr_subscription_status") === "active";

      if (hasDemoSubscription) {
        setSubscription({
          status: "active",
          plan: "Demo Premium",
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          features: [
            "Full Dashboard Access",
            "Order Management",
            "Analytics",
            "Live Dashboard",
          ],
        });
      } else {
        setSubscription({
          status: "inactive",
          plan: null,
          expiresAt: null,
          features: ["Basic Dashboard View", "Subscription Page Access"],
        });
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
      setSubscription({
        status: "inactive",
        plan: null,
        expiresAt: null,
        features: ["Basic Dashboard View", "Subscription Page Access"],
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to update subscription with real data
  const updateSubscriptionWithRealData = (subscriptionData) => {
    if (subscriptionData && subscriptionData.status === "active") {
      setSubscription({
        status: "active",
        plan: subscriptionData.plan?.name || "Premium",
        expiresAt: subscriptionData.endDate
          ? new Date(subscriptionData.endDate)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        features: [
          "Full Dashboard Access",
          "Order Management",
          "Analytics",
          "Live Dashboard",
        ],
      });
    }
  };

  // Function to reset subscription state
  const resetSubscription = () => {
    setSubscription({
      status: "inactive",
      plan: null,
      expiresAt: null,
      features: ["Basic Dashboard View", "Subscription Page Access"],
    });
    setLoading(false);
  };

  const hasActiveSubscription = () => {
    return subscription?.status === "active";
  };

  const canAccessFeature = (feature) => {
    if (!subscription) return false;

    const restrictedFeatures = [
      "create-restaurant",
      "create-category",
      "create-menu-item",
      "order-management",
      "analytics",
      "restaurant-dashboard",
    ];

    if (restrictedFeatures.includes(feature)) {
      return hasActiveSubscription();
    }

    return true; // Basic features like dashboard overview and subscription page
  };

  const value = {
    subscription,
    loading,
    hasActiveSubscription,
    canAccessFeature,
    checkSubscriptionStatus,
    updateSubscriptionWithRealData,
    resetSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
