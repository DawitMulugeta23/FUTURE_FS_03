// frontend/src/pages/About.jsx
import { Award, Coffee, Heart, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const teamValues = [
    {
      icon: Heart,
      title: "Our Passion",
      description:
        "We're passionate about serving authentic Ethiopian coffee and creating memorable experiences for every guest.",
    },
    {
      icon: Users,
      title: "Community First",
      description:
        "Located near DBU, we're proud to be a gathering place for students, families, and coffee lovers.",
    },
    {
      icon: Award,
      title: "Quality Promise",
      description:
        "From bean to cup, we ensure every ingredient meets our high standards of freshness and flavor.",
    },
  ];

  const milestones = [
    { year: "2021", event: "Yesekela Café founded in Debre Berhan" },
    { year: "2022", event: "Expanded menu with authentic Ethiopian meals" },
    { year: "2023", event: "Launched online ordering platform" },
    { year: "2024", event: "Reached 5,000+ happy customers" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="relative bg-amber-900 text-white py-20">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-4 text-center">
          <Coffee size={48} className="mx-auto mb-4 text-amber-400" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Story</h1>
          <p className="text-xl max-w-2xl mx-auto text-amber-100">
            From a small coffee cart to Debre Berhan's favorite café — journey
            with us
          </p>
        </div>
      </section>

      {/* Main Story */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold text-amber-900 mb-4">
              Welcome to Yesekela Café
            </h2>
            <div className="w-20 h-1 bg-amber-500 mb-6" />
            <p className="text-gray-700 mb-4 leading-relaxed">
              Nestled in the heart of{" "}
              <strong className="text-amber-800">Debre Berhan</strong>, Yesekela
              Café was born from a simple idea: create a warm, welcoming space
              where everyone can enjoy exceptional coffee and delicious food.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Our name <strong className="text-amber-800">"Yesekela"</strong>{" "}
              means "thank you" — a word we live by every day. We're grateful to
              our community, our dedicated team, and every customer who walks
              through our doors or orders online.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Whether you're a student needing a study spot, a professional
              grabbing coffee before work, or a family enjoying a weekend treat
              — we're here to make your day a little brighter, one cup at a
              time.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=2070&auto=format"
              alt="Yesekela Café interior"
              className="w-full h-96 object-cover hover:scale-105 transition duration-500"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">
              What Makes Us Special
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              More than just a café — we're a community hub built on these core
              values
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamValues.map((value, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-amber-50 hover:shadow-lg transition"
              >
                <div className="inline-flex p-3 bg-amber-200 rounded-full mb-4">
                  <value.icon size={32} className="text-amber-700" />
                </div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-16 bg-amber-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-amber-200">
              Milestones that shaped Yesekela Café
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-amber-400 mb-2">
                  {milestone.year}
                </div>
                <p className="text-amber-100">{milestone.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-amber-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600">
            Loved by students, families, and coffee enthusiasts
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              name: "Biruk T.",
              text: "Best coffee in Debre Berhan! The atmosphere is perfect for studying.",
              rating: 5,
            },
            {
              name: "Meron A.",
              text: "Their pastries are fresh daily and the staff is incredibly friendly.",
              rating: 5,
            },
            {
              name: "Dawit S.",
              text: "Online ordering is smooth and delivery is always on time.",
              rating: 5,
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg border border-amber-100"
            >
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill="#f59e0b"
                    className="text-amber-500"
                  />
                ))}
              </div>
              <p className="text-gray-700 italic mb-4">"{testimonial.text}"</p>
              <p className="font-bold text-amber-900">— {testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-800 to-amber-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience Yesekela Today</h2>
          <p className="text-amber-100 mb-8">
            Visit us in Debre Berhan or order online for pickup/delivery
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/menu"
              className="bg-amber-500 text-amber-900 px-8 py-3 rounded-full font-bold hover:bg-amber-400 transition"
            >
              View Menu
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-amber-900 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
