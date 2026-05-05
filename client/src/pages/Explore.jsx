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
          famousPlaceName: c.famous_place_name || c.famousPlaceName || "",
          description: c.place_description || c.description || "",
          coverImage: c.cover_image || c.coverImage || "",
          totalGuides: c.total_guides ?? c.totalGuides ?? 0,
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
        <p className="text-gray-500 mt-2">Top cities based on available guides.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {rankedCities.slice(0, 10).map((city, index) => (
            <CityCard key={`top-${city.city}-${index}`} city={city} index={index} showRank={true} />
          ))}
        </div>
      </div>

    
    </div>
  );
};

export default Explore;
