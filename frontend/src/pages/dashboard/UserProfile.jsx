import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Package,
  Crown,
  ArrowLeft,
  Clock,
  CreditCard,
  Shield,
  Zap,
} from "lucide-react";

export default function UserProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDaysRemaining = () => {
    if (!user?.subscription?.endDate) return null;
    const now = new Date();
    const endDate = new Date(user.subscription.endDate);
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4 lg:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/30 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              {user?.name || "User Profile"}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* User Information Card */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-yellow-400" />
              Personal Information
            </h2>

            <div className="space-y-4">
              {/* Name */}
              <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-400 uppercase tracking-wider">
                    Full Name
                  </span>
                </div>
                <p className="text-lg font-semibold text-white">
                  {user?.name || "N/A"}
                </p>
              </div>

              {/* Email */}
              <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-400 uppercase tracking-wider">
                    Email Address
                  </span>
                </div>
                <p className="text-base font-medium text-white break-all">
                  {user?.email || "N/A"}
                </p>
              </div>

              {/* Member Since */}
              <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-400 uppercase tracking-wider">
                    Member Since
                  </span>
                </div>
                <p className="text-base font-medium text-white">
                  {formatDate(user?.createdAt)}
                </p>
              </div>

              {/* Email Verification Status */}
              <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-400 uppercase tracking-wider">
                    Verification Status
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {user?.isVerified ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-base font-semibold text-green-400">
                        Verified
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-400" />
                      <span className="text-base font-semibold text-red-400">
                        Not Verified
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Details Card */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-yellow-400" />
              Subscription Details
            </h2>

            {user?.subscription ? (
              <div className="space-y-6">
                {/* Status Banner */}
                <div
                  className={`p-6 rounded-xl border-2 ${
                    user.subscription.status === "active"
                      ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30"
                      : "bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-xl ${
                          user.subscription.status === "active"
                            ? "bg-green-500/20"
                            : "bg-red-500/20"
                        }`}
                      >
                        <Crown
                          className={`w-6 h-6 ${
                            user.subscription.status === "active"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {user.subscription.plan?.name || "Subscription Plan"}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {user.subscription.status === "active" ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span
                            className={`text-sm font-semibold uppercase ${
                              user.subscription.status === "active"
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {user.subscription.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    {daysRemaining !== null &&
                      user.subscription.status === "active" && (
                        <div className="text-right">
                          <div className="text-3xl font-bold text-white">
                            {daysRemaining}
                          </div>
                          <div className="text-sm text-gray-400">
                            days remaining
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {/* Subscription Details Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Price */}
                  <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-400 uppercase tracking-wider">
                        Price
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      ₹{user.subscription.plan?.price || 0}
                      <span className="text-sm text-gray-400 font-normal ml-2">
                        / {user.subscription.plan?.duration || 30} days
                      </span>
                    </p>
                  </div>

                  {/* Payment Status */}
                  <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-400 uppercase tracking-wider">
                        Payment Status
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.subscription.paymentStatus === "completed" ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-lg font-semibold text-green-400 capitalize">
                            {user.subscription.paymentStatus}
                          </span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-5 h-5 text-yellow-400" />
                          <span className="text-lg font-semibold text-yellow-400 capitalize">
                            {user.subscription.paymentStatus}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Start Date */}
                  <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-400 uppercase tracking-wider">
                        Start Date
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-white">
                      {formatDate(user.subscription.startDate)}
                    </p>
                  </div>

                  {/* End Date */}
                  <div className="p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-400 uppercase tracking-wider">
                        End Date
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-white">
                      {formatDate(user.subscription.endDate)}
                    </p>
                  </div>
                </div>

                {/* Features Section */}
                {user.subscription.plan?.features &&
                  user.subscription.plan.features.length > 0 && (
                    <div className="p-6 bg-gray-700/20 rounded-xl border border-gray-600/30">
                      <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <h3 className="text-lg font-bold text-white">
                          Plan Features
                        </h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        {user.subscription.plan.features.map(
                          (feature, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg"
                            >
                              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                              <span className="text-sm text-gray-200">
                                {feature}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={() => navigate("/subscription")}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Manage Subscription
                  </button>
                  {user.subscription.status !== "active" && (
                    <button
                      onClick={() => navigate("/subscription")}
                      className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Renew Subscription
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* No Subscription */
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  No Active Subscription
                </h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  You don't have an active subscription yet. Subscribe now to
                  unlock all premium features and take your restaurant
                  management to the next level.
                </p>
                <button
                  onClick={() => navigate("/subscription")}
                  className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  View Subscription Plans
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
