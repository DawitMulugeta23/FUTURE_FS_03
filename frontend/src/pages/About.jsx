const About = () => (
  <div className="container mx-auto px-4 py-16 max-w-4xl">
    <h2 className="text-4xl font-bold text-amber-900 mb-6">Our Story</h2>
    <div className="grid md:grid-cols-2 gap-10 items-center">
      <p className="text-gray-700 leading-relaxed text-lg">
        Located in the heart of Debre Berhan, **Yesekela Café** has been a
        sanctuary for students and coffee lovers alike. We believe that a great
        day starts with a perfect roast and a warm community. Our platform was
        designed to bring our authentic flavors directly to your fingertips.
      </p>
      <div className="bg-amber-100 p-6 rounded-2xl border-2 border-dashed border-amber-300">
        <h4 className="font-bold text-amber-900 mb-2">Visit Us</h4>
        <p className="text-gray-600">Main Road, Near DBU Entrance</p>
        <p className="text-gray-600 italic">Open Daily: 7:00 AM - 9:00 PM</p>
      </div>
    </div>
  </div>
);

export default About;
