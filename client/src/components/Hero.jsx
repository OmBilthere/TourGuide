import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center  min-h-screen">
      
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2] text-slate-900">
          Discover hidden places <br />
          with <span className="text-sky-500">local guides</span>
        </h1>

        <p className="mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto max-sm:text-xs text-slate-600">
          Explore authentic local experiences, book verified guides,
          and make every journey unforgettable.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs">
        <button
          onClick={() => navigate("/explore")}
          className="bg-sky-400 text-white px-10 py-3 rounded-lg
          hover:scale-105 active:scale-95 transition cursor-pointer"
        >
          Get Started
        </button>

        <button
          onClick={() => navigate("/about")}
          className="bg-white px-10 py-3 rounded-lg border
          border-slate-300 hover:scale-105 active:scale-95 transition
          cursor-pointer"
        >
          Learn More
        </button>
      </div>

     
    </div>
  );
};

export default Hero;