import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CityCard from "../components/CityCard.jsx";
import { citiesData } from "../assets/assets.js";

const Explore = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const rankedCities = useMemo(() => {
    const grouped = Object.values(
      citiesData.reduce((acc, city) => {
        if (!acc[city.city]) {
          acc[city.city] = {
            city: city.city,
            totalGuides: 0,
            coverImage: city.famousPlaceImages[0],
            famousPlaceName: city.famousPlaceName,
            description: city.placeDescription,
          };
        }

        acc[city.city].totalGuides += 1;
        return acc;
      }, {})
    );

    return grouped.sort((a, b) => b.totalGuides - a.totalGuides);
  }, []);

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      navigate(`/Explore/${searchTerm.trim()}`);
    }
  };

  const filteredCities = rankedCities.filter((city) =>
    city.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  

  return (
    <div className="px-4 sm:px-20 xl:px-32 py-20">
      <div>
        <h1 className="text-4xl font-semibold text-slate-800">
          Search Your City
        </h1>
        <p className="text-gray-500 mt-3">
          Find the city you want to explore.
        </p>

        <div className="mt-8">
          <input
            type="text"
            placeholder="Search city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
            className="w-full border rounded-xl px-4 py-3 outline-none"
          />

            {searchTerm.trim() && (
        <div className="mt-16">
          <h2 className="text-3xl font-semibold text-slate-800">
            Search Results
          </h2>
          <p className="text-gray-500 mt-2">
            Cities matching your search.
          </p>

          {filteredCities.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {filteredCities.map((city, index) => (
                <CityCard key={`search-${city.city}-${index}`} city={city} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-6">No city found.</p>
          )}
        </div>
      )}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-semibold text-slate-800">Top Cities</h2>
        <p className="text-gray-500 mt-2">Top 5 cities based on available guides.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {rankedCities.slice(0, 5).map((city, index) => (
            <CityCard key={`top-${city.city}-${index}`} city={city} index={index} showRank={true} />
          ))}
        </div>
      </div>

    
    </div>
  );
};

export default Explore;
