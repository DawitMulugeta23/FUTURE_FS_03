import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=2078&auto=format&fit=crop')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl md:text-700 text-white font-serif font-bold mb-4">
          Authentic Flavors,{" "}
          <span className="text-amber-400">Local Heart.</span>
        </h1>
        <p className="text-gray-200 text-lg mb-8 max-w-2xl">
          Experience the finest coffee and pastries in Debre Berhan. Order
          online and have your favorites ready for pickup!
        </p>
        <div className="flex gap-4">
          <Link
            to="/menu"
            className="bg-amber-500 text-black px-8 py-3 rounded-full font-bold hover:bg-amber-400 transition text-lg"
          >
            View Menu
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
  );
};
export default Home;