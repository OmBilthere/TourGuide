import React from "react";
import Hero from "../components/Hero.jsx";
import Plan from "../components/Plan.jsx";
import Testimonial from "../components/Testimonial.jsx";
import WhyChooseUs from "../components/WhyChooseUs.jsx";

const Home = () => {
  return (
    <>
    
      <Hero />
      <WhyChooseUs/>
      <Testimonial />
      <Plan />
    
    </>
  );
};

export default Home;