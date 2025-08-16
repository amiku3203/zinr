 import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../store/features/auth/authApi";
import { useDispatch } from "react-redux";
import {setToken, setUser } from "../store/features/auth/authSlice";
import { showSuccess } from "../utils/toast";
export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });

  // RTK Query login mutation hook
  const [login, { isLoading, isError, error }] = useLoginMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(formData).unwrap();
      dispatch(setToken(userData)); // Save token & user to Redux
      dispatch(setUser(userData));
      showSuccess("Login successful");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 px-4">
      <div className="backdrop-blur-lg bg-white/5 border border-gray-700 shadow-2xl rounded-2xl p-8 w-full max-w-md">
        
        {/* Brand */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-white tracking-wide">
            Zin<span className="text-yellow-400">R</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Login to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1 text-gray-300 text-sm font-medium">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-900/70 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-500 transition"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-1 text-gray-300 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-900/70 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-500 transition"
              placeholder="••••••••"
            />
          </div>

          {/* Error */}
          {isError && (
            <p className="text-red-400 text-sm">
              {error?.data?.message || "Invalid email or password"}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg shadow-lg transform transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        {/* Signup Link */}
        <p className="text-center text-gray-400 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-yellow-400 cursor-pointer hover:underline font-medium"
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}
