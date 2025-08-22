import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Clock, 
  UtensilsCrossed, 
  Smartphone, 
  QrCode, 
  BarChart3, 
 
  DollarSign, 
  Users, 
  Shield, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Star,
  TrendingUp,
  Globe,
  Headphones,
  Award,
  Target,
  Lightbulb
} from "lucide-react";

export default function WhatWeOffer() {
  const navigate = useNavigate();
  const isLoggedIn = false; // Replace with real auth check later

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/subscription");
    } else {
      navigate("/signup");
    }
  };

  const coreFeatures = [
    {
      icon: <QrCode className="w-8 h-8" />,
      title: "Digital QR Menus",
      description: "Create beautiful digital menus with QR codes that customers can scan to view your offerings.",
      benefits: ["No printing costs", "Easy menu updates", "Interactive content", "Mobile optimized"]
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile Ordering System",
      description: "Let customers order directly from their phones with our intuitive mobile interface.",
      benefits: ["Real-time ordering", "Customizable options", "Special instructions", "Order tracking"]
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Smart Queue Management",
      description: "Eliminate waiting chaos with intelligent queue management and customer notifications.",
      benefits: ["Digital waitlist", "SMS notifications", "Estimated wait times", "Priority queuing"]
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Real-time Analytics",
      description: "Track orders, sales, and customer preferences with comprehensive dashboards.",
      benefits: ["Sales insights", "Popular items", "Peak hour analysis", "Customer behavior"]
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Payment Processing",
      description: "Accept multiple payment methods including cards, UPI, and digital wallets.",
      benefits: ["Multiple gateways", "Secure transactions", "Split payments", "Digital receipts"]
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multi-location Support",
      description: "Manage multiple restaurant locations from a single dashboard.",
      benefits: ["Centralized control", "Location-specific menus", "Unified reporting", "Brand consistency"]
    }
  ];

  const advancedFeatures = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Customer Management",
      description: "Build customer relationships with loyalty programs and personalized experiences."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Marketing Tools",
      description: "Promote your restaurant with targeted campaigns and special offers."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Advanced Security",
      description: "Bank-level security with data encryption and secure payment processing."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Performance Optimization",
      description: "Lightning-fast system designed to handle high-volume restaurant operations."
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "₹4,999",
      period: "/month",
      description: "Perfect for small restaurants getting started",
      features: [
        "Digital QR menus",
        "Basic ordering system",
        "Queue management",
        "Email support",
        "Basic analytics"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "₹7,999",
      period: "/month",
      description: "Ideal for growing restaurants",
      features: [
        "Everything in Starter",
        "Advanced analytics",
        "Payment processing",
        "Multi-location support",
        "Priority support",
        "Marketing tools"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "₹14,999",
      period: "/month",
      description: "For large restaurant chains",
      features: [
        "Everything in Professional",
        "Custom integrations",
        "Dedicated account manager",
        "Advanced reporting",
        "API access",
        "24/7 phone support"
      ],
      popular: false
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              What We Offer at{" "}
              <span className="text-yellow-400">ZinR</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Transform your restaurant with our comprehensive suite of tools designed to 
              streamline operations, enhance customer experience, and boost your bottom line.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg rounded-2xl shadow-2xl hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/demo")}
              className="px-8 py-4 border-2 border-gray-600 text-white font-semibold text-lg rounded-2xl hover:border-yellow-400 transition-all duration-300 flex items-center space-x-2"
            >
              <span>Watch Demo</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Core Features That
              <span className="block text-yellow-400">Transform Your Business</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform provides everything you need to modernize your restaurant 
              and deliver exceptional customer experiences.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {coreFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-yellow-400/50 transition-all duration-300 group"
              >
                <div className="text-yellow-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Advanced Capabilities for
              <span className="block text-yellow-400">Growing Restaurants</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Take your restaurant to the next level with enterprise-grade features 
              designed for scalability and growth.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {advancedFeatures.map((feature, index) => (
              <div
                key={index}
                className="text-center group"
              >
                <div className="text-yellow-400 mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Choose Your
              <span className="block text-yellow-400">Growth Plan</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Flexible pricing plans designed to grow with your business. 
              Start small and scale up as you expand.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-gray-800/50 backdrop-blur-sm border rounded-2xl p-8 ${
                  plan.popular 
                    ? 'border-yellow-400 shadow-2xl shadow-yellow-400/25' 
                    : 'border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-4xl font-bold text-yellow-400">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                  <p className="text-gray-300 mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleGetStarted}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:shadow-lg hover:shadow-yellow-400/25'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {plan.popular ? 'Get Started' : 'Choose Plan'}
                </button>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-gray-400 mb-6">
              All plans include a 14-day free trial • No setup fees • Cancel anytime
            </p>
            <p className="text-sm text-gray-500">
              Need a custom plan? <button className="text-yellow-400 hover:text-yellow-300 underline">Contact our sales team</button>
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform
              <span className="block text-yellow-400">Your Restaurant?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join thousands of restaurants that have already revolutionized their business 
              with ZinR. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleGetStarted}
                className="px-10 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg rounded-2xl shadow-2xl hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="px-10 py-4 border-2 border-gray-600 text-white font-semibold text-lg rounded-2xl hover:border-yellow-400 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Schedule Demo</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
