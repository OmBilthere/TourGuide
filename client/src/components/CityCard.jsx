import React from "react";
import { Link } from "react-router-dom";

const CityCard = ({ city, index, showRank = false }) => {
  return (
    <Link to={`/Explore/${city.city}`}>
      <div className="rounded-2xl overflow-hidden shadow-lg border hover:shadow-xl transition cursor-pointer">
        <img
          src={city.coverImage}
          alt={city.city}
          className="h-56 w-full object-cover"
        />

        <div className="p-5">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-slate-800">
              {showRank ? `#${index + 1} ` : ""}
              {city.city}
            </h2>

            <span className="text-sm bg-slate-100 px-3 py-1 rounded-full">
              {city.totalGuides} Guides
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-3">
            Famous Spot: {city.famousPlaceName}
          </p>

          <p className="text-gray-500 mt-3 leading-6">
            {city.description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CityCard;