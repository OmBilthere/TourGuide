import React, { useState } from "react";
import Hero from "../components/Hero.jsx";
import Plan from "../components/Plan.jsx";
import Testimonial from "../components/Testimonial.jsx";
import WhyChooseUs from "../components/WhyChooseUs.jsx";
import GuideHero from "../components/GuideHero.jsx";
import GuideWhyChooseUs from "../components/GuideWhyChooseUs.jsx";
import GuideTestimonial from "../components/GuideTestimonial.jsx";
import GuidePlan from "../components/GuidePlan.jsx";

const Home = () => {
  const [role, setRole] = useState(() => localStorage.getItem("tg_user_role") || "tourist");

  if (role === "guide") {
    return (
      <>
        <GuideHero />
        <GuideWhyChooseUs />
        <GuideTestimonial />
        <GuidePlan />
      </>
    );
  }

  return (
    <>
      <Hero />
      <WhyChooseUs />
      <Testimonial />
      <Plan />
    </>
  );
};

export default Home;