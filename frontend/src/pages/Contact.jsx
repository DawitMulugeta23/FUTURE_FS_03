// frontend/src/pages/Contact.jsx
import axios from "axios";
import {
    Clock,
    Coffee,
    Globe,
    Heart,
    Mail,
    MapPin,
    Phone,
    Send,
    Share2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import MapComponent from "../components/MapComponent";

const Contact = () => {
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
      await axios.post("http://localhost:5000/api/contact", formData);
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Contact form error:", error);
    } finally {
      setSending(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["Main Road, Near DBU Entrance", "Debre Berhan, Ethiopia"],
      color: "bg-red-100 text-red-600",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+251-911-123456", "+251-912-789012"],
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@yesekelacafe.com", "orders@yesekelacafe.com"],
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Clock,
      title: "Opening Hours",
      details: [
        "Monday - Friday: 7:00 AM - 9:00 PM",
        "Saturday - Sunday: 8:00 AM - 8:00 PM",
      ],
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="bg-amber-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have questions, feedback, or
            just want to say hello.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <Coffee size={28} className="text-amber-600" />
              <h2 className="text-2xl font-bold text-amber-900">
                Send Us a Message
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  placeholder="hello@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
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
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-amber-900 mb-6">
                Contact Information
              </h2>
              <div className="grid gap-5">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${info.color}`}>
                      <info.icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{info.title}</h3>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-gray-600 text-sm">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="p-6 pb-0">
                <h2 className="text-2xl font-bold text-amber-900 mb-2">
                  Find Us Here
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  Located in the heart of Debre Berhan, near DBU
                </p>
              </div>
              <MapComponent />
            </div>

            {/* Social Links - Using Heart and Share2 instead of specific social icons */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h3 className="font-bold text-gray-800 mb-4 text-center">
                Connect With Us
              </h3>
              <div className="flex justify-center gap-6">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                >
                  <Share2 size={20} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition"
                >
                  <Heart size={20} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition"
                >
                  <Globe size={20} />
                </a>
              </div>
              <p className="text-center text-gray-500 text-sm mt-4">
                Follow us @yesekelacafe
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-amber-900 text-center mb-8">
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
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition"
              >
                <h4 className="font-bold text-amber-900 mb-2">{faq.q}</h4>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
