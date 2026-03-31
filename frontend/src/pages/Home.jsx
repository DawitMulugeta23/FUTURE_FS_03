import { Link } from "react-router-dom";
import { Coffee, Heart, Award, Truck, ArrowRight } from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Coffee,
      title: "Premium Coffee",
      description: "Sourced from the finest Ethiopian beans, roasted to perfection"
    },
    {
      icon: Heart,
      title: "Fresh Pastries",
      description: "Baked daily with love and authentic recipes"
    },
    {
      icon: Award,
      title: "Quality Guaranteed",
      description: "We ensure the highest quality in every cup and bite"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick and reliable delivery right to your doorstep"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative h-screen bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=2078&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-5xl md:text-7xl text-white font-serif font-bold mb-4">
            Authentic Flavors,{" "}
            <span className="text-amber-400">Local Heart.</span>
          </h1>
          <p className="text-gray-200 text-lg md:text-xl mb-8 max-w-2xl">
            Experience the finest coffee and pastries in Debre Berhan. 
            Order online and have your favorites ready for pickup!
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link
              to="/menu"
              className="bg-amber-500 text-black px-8 py-3 rounded-full font-bold hover:bg-amber-400 transition text-lg flex items-center gap-2"
            >
              View Menu <ArrowRight size={20} />
            </Link>
            <Link
              to="/about"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-black transition text-lg"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-amber-900 dark:text-amber-400 mb-12">
            Why Choose Yesekela?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="inline-flex p-3 bg-amber-100 dark:bg-amber-900 rounded-full mb-4">
                  <feature.icon className="text-amber-600 dark:text-amber-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Special Offers */}
      <div className="py-16 bg-amber-100 dark:bg-amber-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-4">
            Special Offers
          </h2>
          <p className="text-lg text-amber-800 dark:text-amber-200 mb-8">
            Get 20% off on your first order! Use code: WELCOME20
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 bg-amber-600 text-white px-8 py-3 rounded-full font-bold hover:bg-amber-700 transition"
          >
            Order Now <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;