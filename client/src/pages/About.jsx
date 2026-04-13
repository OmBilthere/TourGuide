import React from "react";
import logo from '../assets/logo.png'
const About = () => {
  return (
    <div className="px-4 sm:px-20 xl:px-32 py-20">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-slate-800">
          About Tour Guide
        </h1>
        <p className="text-gray-500 max-w-3xl mx-auto mt-4 leading-7">
          Tour Guide is a hyperlocal tourism platform that connects travelers
          with verified local guides for authentic and personalized city
          experiences. Whether you want to explore heritage sites, hidden food
          spots, adventure trails, or cultural landmarks, our platform helps
          you discover destinations through the eyes of locals.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mt-20 items-center">
        <div>
          <img
             src={logo}
            className="rounded-2xl shadow-lg"
          />
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-slate-800">
            Our Mission
          </h2>
          <p className="text-gray-500 mt-4 leading-7">
            Our mission is to make travel more personal, local, and memorable.
            Instead of generic tourist routes, we empower travelers to connect
            with trusted city experts who provide real stories, local culture,
            and customized itineraries.
          </p>

          <div className="mt-8 space-y-4">
            <div className="p-4 border rounded-xl">
              <h3 className="font-semibold text-slate-700">
                🌍 Authentic Experiences
              </h3>
              <p className="text-sm text-gray-500">
                Discover hidden gems and local stories beyond regular tourist
                spots.
              </p>
            </div>

            <div className="p-4 border rounded-xl">
              <h3 className="font-semibold text-slate-700">
                🛡️ Verified Guides
              </h3>
              <p className="text-sm text-gray-500">
                Every guide is reviewed and verified for trust and quality.
              </p>
            </div>

            <div className="p-4 border rounded-xl">
              <h3 className="font-semibold text-slate-700">
                ⚡ Easy Booking
              </h3>
              <p className="text-sm text-gray-500">
                Fast and simple guide booking with flexible tour options.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;