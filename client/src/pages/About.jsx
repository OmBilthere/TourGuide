import React from "react";
import { useNavigate } from "react-router-dom";

const Feature = ({ icon, title, text }) => (
  <div className="bg-white/60 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 shadow-sm">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl text-lg">{icon}</div>
      <div>
        <h4 className="font-semibold text-slate-800">{title}</h4>
        <p className="text-sm text-slate-600 mt-1">{text}</p>
      </div>
    </div>
  </div>
);

const Stat = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl font-bold text-slate-800">{value}</div>
    <div className="text-sm text-slate-500">{label}</div>
  </div>
);

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="py-20 px-6 sm:px-20 xl:px-32">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-slate-900 leading-tight">Discover cities like a local</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">We connect curious travelers with verified local guides for authentic, unforgettable experiences — hand-crafted, trustworthy, and easy to book.</p>
        </div>
      </header>

      <main className="px-6 sm:px-20 xl:px-32 -mt-8">
        <section className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Feature icon="🌍" title="Authentic Experiences" text="Curated local walks, food trails, and hidden gems — not cookie-cutter tours." />
          <Feature icon="🛡️" title="Verified Guides" text="Every guide is background-checked and reviewed by travelers like you." />
          <Feature icon="⚡" title="Hassle-free Booking" text="Secure payments, flexible cancellations, and instant confirmations." />
        </section>

        <section className="max-w-5xl mx-auto mt-12 bg-white rounded-3xl p-8 shadow-md border border-gray-100">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900">Our mission</h2>
              <p className="mt-4 text-slate-600">We believe travel is best experienced through local eyes. Our platform empowers local experts to earn fairly while helping travelers discover cities off the beaten path.</p>

              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <li className="text-sm text-slate-700">• Support local micro-entrepreneurs</li>
                <li className="text-sm text-slate-700">• Ensure safety and transparency</li>
                <li className="text-sm text-slate-700">• Celebrate culture and community</li>
                <li className="text-sm text-slate-700">• Build sustainable tourism</li>
              </ul>
            </div>

            <div className="w-full lg:w-80">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-semibold">Travel Moments</div>
                <div className="p-4 bg-white">
                  <p className="text-sm text-slate-600">Stories from guides and travelers — real reviews, photos, and memories that bring each city to life.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Stat value="1200+" label="Guides" />
          <Stat value="350k+" label="Trips Completed" />
          <Stat value="99%" label="Satisfaction" />
        </section>

        <section className="max-w-5xl mx-auto mt-12 text-center">
          <h3 className="text-xl font-semibold text-slate-900">Want to create unforgettable city days?</h3>
          <p className="text-slate-600 mt-2">Start exploring or join our community of guides — we make it simple.</p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <button onClick={() => navigate("/Explore")} className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition">Explore Cities</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;