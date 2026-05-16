import React from "react";
import { useNavigate } from "react-router-dom";

const GuideHero = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2] text-slate-900">
          Grow your tours <br />
          with your <span className="text-emerald-500">guide workspace</span>
        </h1>

        <p className="mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto max-sm:text-xs text-slate-600">
          Manage bookings, update your profile, and keep your availability ready for new traveler requests.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs">
        <button
          onClick={() => navigate("/guide/dashboard")}
          className="bg-emerald-500 text-white px-10 py-3 rounded-lg hover:scale-105 active:scale-95 transition cursor-pointer"
        >
          Open Dashboard
        </button>

        <button
          onClick={() => navigate("/guide/profile/edit")}
          className="bg-white px-10 py-3 rounded-lg border border-slate-300 hover:scale-105 active:scale-95 transition cursor-pointer"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default GuideHero;
