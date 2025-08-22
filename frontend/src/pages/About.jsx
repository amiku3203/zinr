import { motion } from "framer-motion";
import SEO from "../components/SEO";
import { 
  Users, 
  Target, 
  Award, 
  Globe, 
  Heart, 
  Zap, 
  Shield, 
  CheckCircle,
  Star,
  TrendingUp,
  Lightbulb,
  ArrowRight
} from "lucide-react";

export default function About() {
  // SEO structured data for About page
  const aboutStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About ZinR",
    "description": "Learn about ZinR's mission to revolutionize restaurant management with innovative technology solutions.",
    "mainEntity": {
      "@type": "Organization",
      "name": "ZinR",
      "foundingDate": "2020",
      "description": "Digital Restaurant Management Platform",
      "url": "https://zinr.com",
      "sameAs": [
        "https://twitter.com/zinr",
        "https://facebook.com/zinr",
        "https://linkedin.com/company/zinr"
      ],
      "employee": [
        {
          "@type": "Person",
          "name": "Alex Johnson",
          "jobTitle": "CEO & Founder",
          "description": "Former restaurant owner with 15+ years in hospitality tech"
        },
        {
          "@type": "Person",
          "name": "Sarah Chen",
          "jobTitle": "CTO",
          "description": "Tech veteran with experience at leading SaaS companies"
        }
      ]
    }
  };

  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "CEO & Founder",
      bio: "Former restaurant owner with 15+ years in hospitality tech",
      avatar: "AJ",
      expertise: ["Strategy", "Product Vision", "Customer Success"]
    },
    {
      name: "Sarah Chen",
      role: "CTO",
      bio: "Tech veteran with experience at leading SaaS companies",
      avatar: "SC",
      expertise: ["Engineering", "Architecture", "Innovation"]
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Product",
      bio: "Product leader passionate about user experience and growth",
      avatar: "MR",
      expertise: ["UX Design", "Product Strategy", "Analytics"]
    },
    {
      name: "Emily Watson",
      role: "Head of Customer Success",
      bio: "Dedicated to ensuring every restaurant succeeds with ZinR",
      avatar: "EW",
      expertise: ["Customer Support", "Training", "Success"]
    }
  ];

  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description: "ZinR was born from a simple idea: make restaurant management easier"
    },
    {
      year: "2021",
      title: "First 100 Restaurants",
      description: "Reached our first milestone with restaurants across India"
    },
    {
      year: "2022",
      title: "Series A Funding",
      description: "Secured $5M to scale our platform and team"
    },
    {
      year: "2023",
      title: "10,000+ Orders Daily",
      description: "Processing over 10,000 orders daily across our network"
    },
    {
      year: "2024",
      title: "International Expansion",
      description: "Expanding to serve restaurants globally"
    }
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Customer First",
      description: "Every decision we make is guided by what's best for our restaurant partners"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Innovation",
      description: "Constantly pushing boundaries to deliver cutting-edge solutions"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Trust & Security",
      description: "Building a platform that restaurants can rely on completely"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community",
      description: "Fostering a network of successful restaurant entrepreneurs"
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      <SEO
        title="About ZinR - Revolutionizing Restaurant Management"
        description="Learn about ZinR's mission to democratize restaurant technology and empower every restaurant owner with the tools they need to succeed in the digital age."
        structuredData={aboutStructuredData}
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
              About
              <span className="block text-yellow-400">ZinR</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              We're on a mission to revolutionize the restaurant industry by making 
              technology accessible, affordable, and powerful for every restaurant owner.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                To democratize restaurant technology and empower every restaurant owner 
                with the tools they need to succeed in the digital age.
              </p>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                We believe that great food deserves great technology. That's why we've 
                built a platform that's not just powerful, but also intuitive, affordable, 
                and designed specifically for the unique challenges of running a restaurant.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-gray-300">Making tech accessible to all restaurants</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-gray-300">Eliminating operational inefficiencies</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-gray-300">Enhancing customer experiences</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-3xl p-8 border border-yellow-400/30">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="w-12 h-12 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
                  <p className="text-gray-300 leading-relaxed">
                    A world where every restaurant, regardless of size, has access to 
                    enterprise-grade technology that helps them thrive and grow.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              Our Core
              <span className="block text-yellow-400">Values</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              These principles guide everything we do, from product development to customer support.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center group"
              >
                <div className="text-yellow-400 mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto w-20 h-20 bg-gray-800/50 rounded-2xl flex items-center justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
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
              Meet Our
              <span className="block text-yellow-400">Leadership Team</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The passionate individuals behind ZinR who are committed to transforming 
              the restaurant industry.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-yellow-400/50 transition-all duration-300 group"
              >
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    {member.avatar}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-yellow-400 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-300 text-sm mb-4">
                    {member.bio}
                  </p>
                </div>
                <div className="space-y-2">
                  {member.expertise.map((skill, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-gray-400">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Milestones Section */}
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
              Our Journey
              <span className="block text-yellow-400">So Far</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From humble beginnings to serving thousands of restaurants worldwide.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-yellow-400 to-orange-500"></div>
              
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center mb-12 ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-yellow-400/50 transition-all duration-300">
                      <div className="text-2xl font-bold text-yellow-400 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-300">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full border-4 border-black"></div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">
                2,500+
              </div>
              <div className="text-gray-400 font-medium">
                Restaurants
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">
                1M+
              </div>
              <div className="text-gray-400 font-medium">
                Orders Processed
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">
                98%
              </div>
              <div className="text-gray-400 font-medium">
                Customer Satisfaction
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">
                24/7
              </div>
              <div className="text-gray-400 font-medium">
                Support
              </div>
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
              Join Us in
              <span className="block text-yellow-400">Transforming Restaurants</span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Be part of the revolution that's changing how restaurants operate 
              and serve their customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-10 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg rounded-2xl shadow-2xl hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-10 py-4 border-2 border-gray-600 text-white font-semibold text-lg rounded-2xl hover:border-yellow-400 transition-all duration-300 flex items-center space-x-2">
                <span>Contact Us</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
