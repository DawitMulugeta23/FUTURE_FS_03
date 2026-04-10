// frontend/src/pages/Contact.jsx
import axios from "axios";
import {
  Clock,
  Coffee,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import MapComponent from "../components/MapComponent";
import { useTheme } from "../context/useTheme";

const Contact = () => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      await axios.post(
        "https://future-fs-03-db4a.onrender.com/api/contact",
        formData,
      );
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Error " ,error.message);
    } finally {
      setSending(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["Main Road, Near DBU Entrance", "Debre Berhan, Ethiopia"],
      color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["0968871794", "+251-96-887-1794"],
      color:
        "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      action: "tel:+251968871794",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["dawitmulugetas27@gmail.com"],
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      action: "mailto:dawitmulugetas27@gmail.com",
    },
    {
      icon: Clock,
      title: "Opening Hours",
      details: [
        "Monday - Friday: 7:00 AM - 9:00 PM",
        "Saturday - Sunday: 8:00 AM - 8:00 PM",
      ],
      color:
        "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      emoji: "📘",
      url: "https://www.facebook.com/profile.php?id=61553208464212",
      color: "bg-blue-600 hover:bg-blue-700",
      username: "Yesekela Cafe",
    },
    {
      name: "Instagram",
      emoji: "📸",
      url: "https://www.instagram.com/dawit_m23?igsh=dWt5cmFlZXZ2bGU4",
      color: "bg-pink-600 hover:bg-pink-700",
      username: "@dawit_m23",
    },
    {
      name: "Twitter/X",
      emoji: "🐦",
      url: "https://x.com/DawitMulug97962",
      color: "bg-sky-500 hover:bg-sky-600",
      username: "@DawitMulug97962",
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-amber-50 via-white to-orange-50"}`}
    >
      {/* Hero Section */}
      <section
        className={`transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-amber-900"} text-white py-16`}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p
            className={`text-xl transition-colors duration-300 ${darkMode ? "text-gray-300" : "text-amber-100"} max-w-2xl mx-auto`}
          >
            We'd love to hear from you! Whether you have questions, feedback, or
            just want to say hello.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div
            className={`rounded-3xl shadow-xl p-8 transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <div className="flex items-center gap-2 mb-6">
              <Coffee
                size={28}
                className="text-amber-600 dark:text-amber-500"
              />
              <h2
                className={`text-2xl font-bold transition-colors duration-300 ${darkMode ? "text-white" : "text-amber-900"}`}
              >
                Send Us a Message
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  className={`block text-sm font-medium mb-1 transition-colors duration-300 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-300 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  }`}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 transition-colors duration-300 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-300 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  }`}
                  placeholder="dawitmulugetas27@gmail.com"
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 transition-colors duration-300 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-300 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  }`}
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 transition-colors duration-300 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  Message *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-300 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  }`}
                  placeholder="Tell us what's on your mind..."
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-amber-600 text-white py-3 rounded-xl font-bold hover:bg-amber-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {sending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <Send size={18} />
                )}
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Information & Map */}
          <div className="space-y-6">
            {/* Contact Info Cards */}
            <div
              className={`rounded-3xl shadow-xl p-8 transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-white"}`}
            >
              <h2
                className={`text-2xl font-bold mb-6 transition-colors duration-300 ${darkMode ? "text-white" : "text-amber-900"}`}
              >
                Contact Information
              </h2>
              <div className="grid gap-5">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className={`p-3 rounded-full ${info.color}`}>
                      <info.icon size={20} />
                    </div>
                    <div>
                      <h3
                        className={`font-bold transition-colors duration-300 ${darkMode ? "text-gray-200" : "text-gray-800"}`}
                      >
                        {info.title}
                      </h3>
                      {info.details.map((detail, i) =>
                        info.action ? (
                          <a
                            key={i}
                            href={info.action}
                            className={`text-sm block transition-colors duration-300 ${darkMode ? "text-gray-400 hover:text-amber-400" : "text-gray-600 hover:text-amber-600"}`}
                          >
                            {detail}
                          </a>
                        ) : (
                          <p
                            key={i}
                            className={`text-sm transition-colors duration-300 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                          >
                            {detail}
                          </p>
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div
              className={`rounded-3xl shadow-xl overflow-hidden transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-white"}`}
            >
              <div className="p-6 pb-0">
                <h2
                  className={`text-2xl font-bold mb-2 transition-colors duration-300 ${darkMode ? "text-white" : "text-amber-900"}`}
                >
                  Find Us Here
                </h2>
                <p
                  className={`text-sm mb-4 transition-colors duration-300 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Located in the heart of Debre Berhan, near DBU
                </p>
              </div>
              <MapComponent />
              <div
                className={`p-4 transition-colors duration-300 ${darkMode ? "bg-gray-700" : "bg-amber-50"}`}
              >
                <p
                  className={`text-center text-sm transition-colors duration-300 ${darkMode ? "text-amber-400" : "text-amber-800"}`}
                >
                  📍 Main Road, Near DBU Entrance, Debre Berhan, Ethiopia
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div
              className={`rounded-3xl shadow-xl p-6 transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-white"}`}
            >
              <h3
                className={`font-bold mb-4 text-center transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-800"}`}
              >
                Connect With Us
              </h3>
              <div className="flex justify-center gap-6">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 ${social.color} text-white rounded-full transition transform hover:scale-110 text-xl`}
                    title={social.name}
                  >
                    {social.emoji}
                  </a>
                ))}
              </div>
              <div className="mt-4 text-center space-y-1">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm block transition-colors duration-300 ${darkMode ? "text-gray-400 hover:text-amber-400" : "text-gray-500 hover:text-amber-600"}`}
                  >
                    {social.username}
                  </a>
                ))}
              </div>
              <p
                className={`text-center text-sm mt-3 transition-colors duration-300 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
              >
                Follow us for updates, promotions, and more!
              </p>
            </div>

            {/* Quick Contact Card */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-3xl shadow-xl p-6 text-white">
              <h3 className="font-bold text-xl mb-3 text-center">
                Quick Contact
              </h3>
              <div className="space-y-3">
                <a
                  href="tel:+251968871794"
                  className="flex items-center justify-center gap-2 hover:text-amber-200 transition"
                >
                  <Phone size={18} /> 0968871794
                </a>
                <a
                  href="mailto:dawitmulugetas27@gmail.com"
                  className="flex items-center justify-center gap-2 hover:text-amber-200 transition"
                >
                  <Mail size={18} /> dawitmulugetas27@gmail.com
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61553208464212"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 hover:text-amber-200 transition"
                >
                  <span className="text-xl">📘</span> Facebook
                </a>
                <a
                  href="https://www.instagram.com/dawit_m23?igsh=dWt5cmFlZXZ2bGU4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 hover:text-amber-200 transition"
                >
                  <span className="text-xl">📸</span> Instagram
                </a>
                <a
                  href="https://x.com/DawitMulug97962"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 hover:text-amber-200 transition"
                >
                  <span className="text-xl">🐦</span> Twitter/X
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2
            className={`text-2xl font-bold text-center mb-8 transition-colors duration-300 ${darkMode ? "text-white" : "text-amber-900"}`}
          >
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: "Do you offer delivery?",
                a: "Yes! We deliver within Debre Berhan city limits. Delivery fee applies based on distance.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept Chapa payments (Telebirr, CBE Birr) and cash on pickup.",
              },
              {
                q: "Do you have vegan/vegetarian options?",
                a: "Yes, we offer several vegetarian and vegan-friendly items on our menu.",
              },
              {
                q: "Can I order for pickup?",
                a: "Absolutely! Select 'pickup' during checkout and we'll have your order ready.",
              },
              {
                q: "What are your delivery hours?",
                a: "Delivery available from 8:00 AM to 8:00 PM, 7 days a week.",
              },
              {
                q: "How can I contact support?",
                a: "Email us at dawitmulugetas27@gmail.com or call 0968871794.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className={`rounded-xl p-5 shadow-md hover:shadow-lg transition ${darkMode ? "bg-gray-800" : "bg-white"}`}
              >
                <h4
                  className={`font-bold mb-2 transition-colors duration-300 ${darkMode ? "text-amber-400" : "text-amber-900"}`}
                >
                  {faq.q}
                </h4>
                <p
                  className={`text-sm transition-colors duration-300 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Banner */}
        <div
          className={`mt-12 rounded-2xl p-6 text-center transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-amber-100"}`}
        >
          <MessageCircle
            size={32}
            className={`mx-auto mb-3 transition-colors duration-300 ${darkMode ? "text-amber-500" : "text-amber-600"}`}
          />
          <h3
            className={`text-xl font-bold mb-2 transition-colors duration-300 ${darkMode ? "text-white" : "text-amber-900"}`}
          >
            Need immediate assistance?
          </h3>
          <p
            className={`mb-4 transition-colors duration-300 ${darkMode ? "text-gray-400" : "text-amber-700"}`}
          >
            Call us directly for quick support
          </p>
          <a
            href="tel:+251968871794"
            className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-2 rounded-full hover:bg-amber-700 transition"
          >
            <Phone size={18} /> Call 0968871794
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
