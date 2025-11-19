import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  CheckCircle,
  XCircle,
  ArrowRight,
  Shield,
  Zap,
} from "lucide-react";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState("");

  // Get token from URL params
  const token = searchParams.get("token");
const base_url= import.meta.env.VITE_API_URL;
  useEffect(() => {
    if (!token) {
      setVerificationStatus("error");
      setMessage(
        "Invalid verification link. Please check your email or request a new verification link."
      );
      return;
    }

    // Verify email with backend
    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (verificationToken) => {
    try {
      const response = await fetch(
        `https://zinr-b.ryzenwebsoution.in/api/v1/auth/verify-email?token=${verificationToken}`
      );
      const data = await response.json();

      if (data.success) {
        setVerificationStatus("success");
        setMessage(data.message || "Email verified successfully!");

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setVerificationStatus("error");
        setMessage(
          data.message || "Email verification failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationStatus("error");
      setMessage(
        "Verification failed. Please check your internet connection and try again."
      );
    }
  };

  const handleResendVerification = () => {
    // TODO: Implement resend verification functionality
    setMessage("Resend functionality will be implemented soon.");
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4 py-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Hero Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white space-y-8"
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-extrabold text-2xl px-4 py-3 rounded-xl shadow-lg">
                Z
              </div>
              <div>
                <h1 className="text-5xl font-extrabold tracking-wide">
                  Zin<span className="text-yellow-400">R</span>
                </h1>
                <p className="text-xl text-gray-300">Restaurant Solutions</p>
              </div>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Verify Your
              <span className="block text-yellow-400">Email Address</span>
            </h2>

            <p className="text-xl text-gray-300 leading-relaxed">
              Complete your account setup by verifying your email address. This
              helps us ensure the security of your restaurant management
              account.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-gray-300">Secure account verification</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-gray-300">Instant access to dashboard</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-gray-300">Full platform features</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-gray-300">24/7 customer support</span>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center space-x-6 pt-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-400">Bank-level security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-400">Lightning fast</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Verification Status */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="w-full max-w-md">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8">
              {/* Status Icon and Message */}
              <div className="text-center mb-8">
                {verificationStatus === "verifying" && (
                  <>
                    <div className="w-20 h-20 mx-auto mb-4 bg-yellow-400/20 rounded-full flex items-center justify-center">
                      <div className="w-10 h-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Verifying Email
                    </h3>
                    <p className="text-gray-300">
                      Please wait while we verify your email address...
                    </p>
                  </>
                )}

                {verificationStatus === "success" && (
                  <>
                    <div className="w-20 h-20 mx-auto mb-4 bg-green-400/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-12 h-12 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Email Verified!
                    </h3>
                    <p className="text-gray-300">
                      Your account has been successfully verified.
                    </p>
                  </>
                )}

                {verificationStatus === "error" && (
                  <>
                    <div className="w-20 h-20 mx-auto mb-4 bg-red-400/20 rounded-full flex items-center justify-center">
                      <XCircle className="w-12 h-12 text-red-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Verification Failed
                    </h3>
                    <p className="text-gray-300">
                      We couldn't verify your email address.
                    </p>
                  </>
                )}
              </div>

              {/* Status Message */}
              {message && (
                <div
                  className={`p-4 rounded-xl mb-6 ${
                    verificationStatus === "success"
                      ? "bg-green-500/20 border border-green-500/30"
                      : verificationStatus === "error"
                      ? "bg-red-500/20 border border-red-500/30"
                      : "bg-yellow-500/20 border border-yellow-500/30"
                  }`}
                >
                  <p
                    className={`text-sm text-center ${
                      verificationStatus === "success"
                        ? "text-green-400"
                        : verificationStatus === "error"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {message}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                {verificationStatus === "success" && (
                  <button
                    onClick={handleGoToLogin}
                    className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <span>Continue to Login</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}

                {verificationStatus === "error" && (
                  <>
                    <button
                      onClick={handleResendVerification}
                      className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                      <Mail className="w-5 h-5" />
                      <span>Resend Verification</span>
                    </button>

                    <button
                      onClick={handleGoToLogin}
                      className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <span>Go to Login</span>
                    </button>
                  </>
                )}
              </div>

              {/* Help Text */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-400">
                  Need help?{" "}
                  <a
                    href="/contact"
                    className="text-yellow-400 hover:text-yellow-300 underline"
                  >
                    Contact Support
                  </a>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
