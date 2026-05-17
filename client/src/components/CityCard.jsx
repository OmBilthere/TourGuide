import React from "react";
import { Link } from "react-router-dom";

const CityCard = ({ city, index, showRank = false }) => {
  return (
    <Link to={`/Explore/${city.city}`}>
      <div className="group rounded-3xl overflow-hidden bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
        {/* Image Container */}
        <div className="relative overflow-hidden h-64 bg-gradient-to-br from-slate-200 to-slate-300">
          <img
            src={city.coverImage}
            alt={city.city}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {showRank && (
            <div className="absolute top-4 left-4 bg-sky-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
              #{index + 1}
            </div>
          )}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full font-semibold text-sky-600 shadow-lg">
            {city.totalGuides} Guides
          </div>
        </div>

        {/* Content Container */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition">
            {city.city}
          </h2>

          <p className="text-sm font-medium text-sky-600 mb-3">
            📍 {city.famousPlaceName}
          </p>

          <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
            {city.description}
          </p>

          <div className="mt-4 flex items-center text-sky-500 font-medium group-hover:translate-x-1 transition">
            Explore →
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CityCard;