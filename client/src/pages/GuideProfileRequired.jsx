import React from "react";
import { useNavigate } from "react-router-dom";

const GuideProfileRequired = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 sm:px-20 xl:px-32 py-20">
      <div className="max-w-3xl mx-auto bg-white border border-amber-200 rounded-2xl p-8 text-center shadow-sm">
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-800">
          Guide details required
        </h1>
        <p className="mt-4 text-gray-600 leading-7">
          To access the dashboard, you must complete your guide profile. Please fill in your
          city, speciality, pricing, languages, and available slots to continue.
        </p>

        <button
          onClick={() => navigate("/guide/onboarding")}
          className="mt-8 px-7 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition cursor-pointer"
        >
          Complete Profile Now
        </button>
      </div>
    </div>
  );
};

export default GuideProfileRequired;
