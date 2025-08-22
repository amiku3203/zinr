import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Play, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Video,
  Smartphone,
  QrCode,
  BarChart3,
  Zap,
  Shield
} from "lucide-react";

export default function Demo() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    restaurantType: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle demo booking
    console.log("Demo booked:", { selectedDate, selectedTime, ...formData });
  };

  const demoFeatures = [
    {
      icon: <QrCode className="w-8 h-8" />,
      title: "QR Code Menus",
      description: "See how easy it is to create and manage digital menus"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile Ordering",
      description: "Experience the customer ordering flow firsthand"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Real-time Dashboard",
      description: "Watch orders come in live and manage them efficiently"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Queue Management",
      description: "See how smart queue management eliminates waiting"
    }
  ];

  const benefits = [
    "Personalized 30-minute demo",
    "See your specific use case",
    "Ask questions in real-time",
    "Get pricing information",
    "No sales pressure",
    "Free consultation"
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              See ZinR in
              <span className="block text-yellow-400">Action</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Book a personalized demo and see how ZinR can transform your restaurant. 
              No sales pressure, just pure value demonstration.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg rounded-2xl shadow-2xl hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Watch Video Demo</span>
            </button>
            <button className="px-8 py-4 border-2 border-gray-600 text-white font-semibold text-lg rounded-2xl hover:border-yellow-400 transition-all duration-300 flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Book Live Demo</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Watch Our
              <span className="block text-yellow-400">Product Demo</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get a quick overview of ZinR's key features and see how easy it is to use.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 md:p-12">
              <div className="aspect-video bg-gray-900 rounded-2xl flex items-center justify-center mb-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-12 h-12 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Product Demo Video</h3>
                  <p className="text-gray-300">Click to watch our comprehensive demo</p>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-400 mb-6">
                  Duration: 5 minutes • No registration required
                </p>
                <button className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105">
                  Play Demo Video
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Features Section */}
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
              What You'll See in
              <span className="block text-yellow-400">Our Demo</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our personalized demo covers all the features that matter most to restaurant owners.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {demoFeatures.map((feature, index) => (
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

      {/* Demo Booking Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Demo Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Book Your
                <span className="block text-yellow-400">Personalized Demo</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Schedule a 30-minute demo tailored to your restaurant's specific needs. 
                Our experts will show you exactly how ZinR can solve your challenges.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-center space-x-4">
                  <Calendar className="w-6 h-6 text-yellow-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Flexible Scheduling</h3>
                    <p className="text-gray-300">Choose a time that works for you</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Clock className="w-6 h-6 text-yellow-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">30 Minutes</h3>
                    <p className="text-gray-300">Focused, value-packed session</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Users className="w-6 h-6 text-yellow-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Expert Team</h3>
                    <p className="text-gray-300">Learn from restaurant technology experts</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Demo Benefits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Booking Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Schedule Your Demo</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Preferred Time
                      </label>
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                        required
                      >
                        <option value="">Select time</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Company/Restaurant
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="Enter company name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Restaurant Type
                    </label>
                    <select
                      name="restaurantType"
                      value={formData.restaurantType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                    >
                      <option value="">Select restaurant type</option>
                      <option value="fine-dining">Fine Dining</option>
                      <option value="casual-dining">Casual Dining</option>
                      <option value="fast-casual">Fast Casual</option>
                      <option value="quick-service">Quick Service</option>
                      <option value="cafe">Café</option>
                      <option value="food-truck">Food Truck</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white placeholder-gray-400 resize-none"
                      placeholder="Tell us about your specific needs or challenges..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <span>Schedule Demo</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
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
              Ready to See
              <span className="block text-yellow-400">ZinR in Action?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Book your personalized demo today and discover how ZinR can transform 
              your restaurant operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-10 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg rounded-2xl shadow-2xl hover:shadow-yellow-400/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                <span>Book Demo Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-10 py-4 border-2 border-gray-600 text-white font-semibold text-lg rounded-2xl hover:border-yellow-400 transition-all duration-300 flex items-center space-x-2">
                <span>Contact Sales</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
