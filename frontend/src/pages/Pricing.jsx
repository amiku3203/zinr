import { motion } from "framer-motion";
import SEO from "../components/SEO";
import { 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Zap, 
  Shield, 
  Users, 
  Globe,
  Headphones,
  Building,
  Target
} from "lucide-react";

export default function Pricing() {
  // SEO structured data for Pricing page
  const pricingStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "ZinR Restaurant Management Platform",
    "description": "Complete digital restaurant management solution with pricing plans for every business size.",
    "offers": [
      {
        "@type": "Offer",
        "name": "Starter Plan",
        "price": "4999",
        "priceCurrency": "INR",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "4999",
          "priceCurrency": "INR",
          "billingIncrement": "P1M"
        },
        "description": "Perfect for small restaurants getting started"
      },
      {
        "@type": "Offer",
        "name": "Professional Plan",
        "price": "7999",
        "priceCurrency": "INR",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "7999",
          "priceCurrency": "INR",
          "billingIncrement": "P1M"
        },
        "description": "Ideal for growing restaurants"
      },
      {
        "@type": "Offer",
        "name": "Enterprise Plan",
        "price": "14999",
        "priceCurrency": "INR",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "14999",
          "priceCurrency": "INR",
          "billingIncrement": "P1M"
        },
        "description": "For large restaurant chains"
      }
    ],
    "brand": {
      "@type": "Brand",
      "name": "ZinR"
    }
  };

  const plans = [
    {
      name: "Starter",
      price: "₹4,999",
      period: "/month",
      description: "Perfect for small restaurants getting started",
      popular: false,
      features: [
        "Digital QR menus",
        "Basic ordering system",
        "Queue management",
        "Email support",
        "Basic analytics",
        "Up to 100 orders/month"
      ],
      cta: "Start Free Trial"
    },
    {
      name: "Professional",
      price: "₹7,999",
      period: "/month",
      description: "Ideal for growing restaurants",
      popular: true,
      features: [
        "Everything in Starter",
        "Advanced analytics",
        "Payment processing",
        "Multi-location support",
        "Priority support",
        "Marketing tools",
        "Unlimited orders",
        "Custom branding"
      ],
      cta: "Start Free Trial"
    },
    {
      name: "Enterprise",
      price: "₹14,999",
      period: "/month",
      description: "For large restaurant chains",
      popular: false,
      features: [
        "Everything in Professional",
        "Custom integrations",
        "Dedicated account manager",
        "Advanced reporting",
        "API access",
        "24/7 phone support",
        "White-label options",
        "Multi-currency support"
      ],
      cta: "Contact Sales"
    }
  ];

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Built for speed and performance"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Bank-level Security",
      description: "Your data is protected with enterprise-grade security"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Infrastructure",
      description: "Hosted on reliable cloud infrastructure"
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      <SEO
        title="Pricing - ZinR Restaurant Management Platform"
        description="Choose the perfect plan for your restaurant. All plans include a 14-day free trial with no credit card required. Scale up or down anytime."
        structuredData={pricingStructuredData}
      />
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Simple,
              <span className="block text-yellow-400">Transparent Pricing</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Choose the perfect plan for your restaurant. All plans include a 14-day free trial 
              with no credit card required. Scale up or down anytime.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center items-center gap-4 text-gray-400"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Cancel anytime</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-gray-800/50 backdrop-blur-sm border rounded-2xl p-8 ${
                  plan.popular 
                    ? 'border-yellow-400 shadow-2xl shadow-yellow-400/25 scale-105' 
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
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:shadow-lg hover:shadow-yellow-400/25'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <p className="text-gray-400 mb-6">
              Need a custom plan? We can create a tailored solution for your specific needs.
            </p>
            <button className="inline-flex items-center space-x-2 px-8 py-4 border-2 border-yellow-400 text-yellow-400 font-semibold rounded-2xl hover:bg-yellow-400 hover:text-black transition-all duration-300">
              <span>Contact Sales</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
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
              Why Choose
              <span className="block text-yellow-400">ZinR?</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform is built with restaurant owners in mind, providing everything 
              you need to succeed in the digital age.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center group"
              >
                <div className="text-yellow-400 mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto w-20 h-20 bg-gray-800/50 rounded-2xl flex items-center justify-center">
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

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Frequently Asked
              <span className="block text-yellow-400">Questions</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get answers to common questions about our pricing and services.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-300">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect 
                immediately, and we'll prorate your billing accordingly.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">
                What's included in the free trial?
              </h3>
              <p className="text-gray-300">
                The free trial includes all features of the Professional plan for 14 days. 
                No credit card required, and you can cancel anytime during the trial period.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">
                Do you offer discounts for annual billing?
              </h3>
              <p className="text-gray-300">
                Yes! We offer a 20% discount when you choose annual billing. This helps 
                you save money while committing to your restaurant's digital transformation.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">
                Is there a setup fee?
              </h3>
              <p className="text-gray-300">
                No setup fees! We believe in making it easy for restaurants to get started. 
                Simply sign up and start using our platform immediately.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-900/30">
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
              <button className="px-10 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg rounded-2xl shadow-2xl hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-10 py-4 border-2 border-gray-600 text-white font-semibold text-lg rounded-2xl hover:border-yellow-400 transition-all duration-300 flex items-center space-x-2">
                <span>Schedule Demo</span>
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
  );
}
