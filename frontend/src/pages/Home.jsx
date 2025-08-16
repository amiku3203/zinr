 import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen bg-black flex items-center justify-center">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-4xl text-center px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white mb-6">
          Revolutionize Your Restaurant with{" "}
          <span className="text-gray-400">ZinR</span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          ZinR helps you eliminate waiting queues, boost efficiency, and
          improve your customers’ dining experience — all in one seamless
          platform.
        </p>
        <button
          onClick={() => navigate("/what-we-offer")}
          className="bg-white text-black px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-105"
        >
          Get Started
        </button>
      </motion.div>
    </div>
  );
}
