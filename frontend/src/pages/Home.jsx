import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "../components/SEO";
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  TrendingUp, 
  Zap, 
  Shield, 
  Smartphone,
  QrCode,
  BarChart3,
  Clock,
  DollarSign,
  Globe,
  Award,
  Headphones
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  // SEO structured data for the homepage
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ZinR",
    "url": "https://zinr.com",
    "description": "Transform your restaurant with ZinR - the complete digital menu, order management, and payment solution.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://zinr.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ZinR",
      "logo": {
        "@type": "ImageObject",
        "url": "https://zinr.com/logo.png"
      }
    }
  };

  const features = [
    {
      icon: <QrCode className="w-8 h-8" />,
      title: "Digital QR Menus",
      description: "Create beautiful digital menus with QR codes that customers can scan to view your offerings."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile Ordering",
      description: "Let customers order directly from their phones with our intuitive mobile interface."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Real-time Analytics",
      description: "Track orders, sales, and customer preferences with comprehensive dashboards."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Queue Management",
      description: "Eliminate waiting lines with smart queue management and order tracking."
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Payment Processing",
      description: "Accept multiple payment methods including cards, UPI, and digital wallets."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multi-location Support",
      description: "Manage multiple restaurant locations from a single dashboard."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Owner, The Urban Bistro",
      content: "ZinR transformed our restaurant operations. Orders are 40% faster and customer satisfaction is through the roof!",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Manager, Fusion Kitchen",
      content: "The real-time dashboard helps us manage peak hours efficiently. Our staff loves the streamlined workflow.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Chef, Taste of Italy",
      content: "QR menus are a game-changer. Customers love the convenience and we love the reduced printing costs.",
      rating: 5,
      avatar: "ER"
    }
  ];

  const stats = [
    { number: "2,500+", label: "Restaurants" },
    { number: "1M+", label: "Orders Processed" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <>
      <SEO 
        title="Digital Restaurant Management Platform"
        description="Transform your restaurant with ZinR - the complete digital menu, order management, and payment solution. Accept orders, manage menus, and grow your business digitally with QR codes and real-time analytics."
        keywords={[
          "restaurant management software",
          "digital menu QR code",
          "online food ordering system",
          "restaurant technology platform",
          "queue management system",
          "restaurant analytics dashboard",
          "mobile ordering app",
          "restaurant payment processing"
        ]}
        image="https://zinr.com/homepage-hero.jpg"
        url="https://zinr.com"
        type="website"
        structuredData={homeStructuredData}
      />
      <div className="relative w-full min-h-screen bg-black">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      
      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-extrabold text-3xl px-6 py-4 rounded-2xl shadow-2xl">
                Z
              </div>
              <div className="text-left">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
                  Zin<span className="text-yellow-400">R</span>
                </h1>
                <p className="text-xl text-gray-300">Restaurant Solutions</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-white mb-8">
              Revolutionize Your
              <span className="block text-yellow-400">Restaurant Business</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Transform your restaurant with smart queue management, digital ordering, 
              and real-time analytics. Boost efficiency and delight your customers.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg rounded-2xl shadow-2xl hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/what-we-offer")}
              className="px-8 py-4 border-2 border-gray-600 text-white font-semibold text-lg rounded-2xl hover:border-yellow-400 transition-all duration-300 flex items-center space-x-2"
            >
              <span>Learn More</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-400"
          >
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-yellow-400" />
              <span className="text-sm">Bank-level security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-sm">Lightning fast</span>
            </div>
            <div className="flex items-center space-x-2">
              <Headphones className="w-5 h-5 text-yellow-400" />
              <span className="text-sm">24/7 support</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need to
              <span className="block text-yellow-400">Succeed</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools your restaurant needs 
              to streamline operations and enhance customer experience.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
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
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Loved by
              <span className="block text-yellow-400">Restaurants Worldwide</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See what restaurant owners are saying about how ZinR has transformed their business.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4">
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
                onClick={() => navigate("/signup")}
                className="px-10 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg rounded-2xl shadow-2xl hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="px-10 py-4 border-2 border-gray-600 text-white font-semibold text-lg rounded-2xl hover:border-yellow-400 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Contact Sales</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
}
