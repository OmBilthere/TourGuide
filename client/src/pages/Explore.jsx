import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CityCard from "../components/CityCard.jsx";

const Explore = () => {
  
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [cities, setCities] = useState([]);

  
  useEffect(() => {
    const controller = new AbortController();
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    const fetchCities = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/cities`, { signal: controller.signal });
        const data = res.data;
        const mapped = (data.cities || []).map((c) => ({
          city: c.city,
          famousPlaceName: c.famous_place_name || "",
          description: c.place_description || "",
          coverImage: c.cover_image || "",
          totalGuides: c.total_guides ?? 0,
        }));

        setCities(mapped);
      } catch (err) {
        const isCanceled = err.name === "CanceledError" || axios.isCancel?.(err);
        if (!isCanceled) console.error("Error fetching cities:", err);
      }
    };

    fetchCities();

    return () => controller.abort();
  }, []);


  const rankedCities = useMemo(() => {
    const list = [...cities];
    return list.sort((a, b) => b.totalGuides - a.totalGuides);
  }, [cities]);

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      navigate(`/Explore/${searchTerm.trim()}`);
    }
  };

  const filteredCities = rankedCities.filter((city) =>
    city.city.toLowerCase().includes(searchTerm.toLowerCase( ))
  );
 
  

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="px-4 sm:px-20 xl:px-32 py-16 sm:py-20 min-h-[45vh] flex flex-col justify-center items-center">
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-slate-900 leading-tight mb-4">
            Explore Amazing <span className="text-sky-500">Destinations</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mb-10">
            Search and discover incredible cities. Find local guides ready to show you authentic experiences.
          </p>

          {/* Premium Search Bar */}
          <div className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto w-full">
            <input
              type="text"
              placeholder="Search for cities, landmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              className="flex-1 px-6 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition w-full"
            />
            <button
              onClick={handleSearchSubmit}
              className="px-8 py-3 bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-600 active:scale-95 transition cursor-pointer w-full sm:w-auto"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Search Results Section */}
      {searchTerm.trim() && (
        <div className="px-4 sm:px-20 xl:px-32 py-16 bg-gradient-to-b from-sky-50 to-white">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold text-slate-900 mb-3">Search Results</h2>
            <p className="text-slate-600">
              {filteredCities.length > 0 
                ? `Found ${filteredCities.length} ${filteredCities.length === 1 ? 'city' : 'cities'} matching your search`
                : 'No cities found matching your search'}
            </p>
          </div>

          {filteredCities.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCities.map((city, index) => (
                <CityCard key={`search-${city.city}-${index}`} city={city} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-500 text-lg">Try searching with different keywords</p>
            </div>
          )}
        </div>
      )}

      {/* Top Cities Section */}
      <div className={`px-4 sm:px-20 xl:px-32 py-20 ${searchTerm.trim() ? 'bg-white' : ''}`}>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold text-slate-900 mb-3">Top Cities</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Discover our most popular destinations with the highest-rated local guides ready to share their expertise.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rankedCities.slice(0, 10).map((city, index) => (
            <CityCard key={`top-${city.city}-${index}`} city={city} index={index} showRank={true} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
