import React from 'react';
import Hero from './Hero';
import FeaturedMenu from './FeaturedMenu';
import Testimonials from './Testimonials';
import Newsletter from './Newsletter';

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedMenu />
      <Testimonials />
      <Newsletter />
    </div>
  );
};

export default Home;