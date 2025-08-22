import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useResetPasswordMutation } from "../store/features/auth/authApi";
import { showSuccess, showError } from "../utils/toast";
import { motion } from "framer-motion";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle,
  ArrowRight,
  Shield,
  Zap
} from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({ 
    password: "", 
    confirmPassword: "" 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // RTK Query mutation hook
  const [resetPassword, { isLoading, isSuccess }] = useResetPasswordMutation();

  // Get token from URL params
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      showError("Invalid reset link. Please request a new password reset.");
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (isSuccess) {
      showSuccess("Password reset successfully! You can now login with your new password.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }, [isSuccess, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await resetPassword({ 
        token, 
        newPassword: formData.password 
      }).unwrap();
    } catch (err) {
      showError(err?.data?.message || "Failed to reset password. Please try again.");
    }
  };

  if (!token) {
    return null;
  }

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
              Reset Your
              <span className="block text-yellow-400">Password</span>
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed">
              Create a new secure password for your restaurant management account. 
              Make sure to choose something strong and memorable.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-gray-300">Secure password reset</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-gray-300">Instant access restoration</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-gray-300">Bank-level security</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="text-gray-300">24/7 account protection</span>
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

        {/* Right Side - Reset Password Form */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="w-full max-w-md">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8">
              
              {/* Form Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Create New Password</h3>
                <p className="text-gray-300">Enter your new password below</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-gray-300 text-sm font-medium">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={`w-full pl-10 pr-12 py-3 rounded-xl bg-gray-900/50 border transition-all duration-300 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                        errors.password ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-gray-300 text-sm font-medium">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className={`w-full pl-10 pr-12 py-3 rounded-xl bg-gray-900/50 border transition-all duration-300 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
                  <h4 className="text-white font-medium mb-2">Password Requirements:</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className={`w-4 h-4 ${formData.password.length >= 6 ? 'text-green-400' : 'text-gray-500'}`} />
                      <span>At least 6 characters long</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className={`w-4 h-4 ${formData.password === formData.confirmPassword && formData.confirmPassword ? 'text-green-400' : 'text-gray-500'}`} />
                      <span>Passwords match</span>
                    </li>
                  </ul>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <div className="text-center mt-6">
                <button
                  onClick={() => navigate("/login")}
                  className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors hover:underline"
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
