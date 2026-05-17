import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
const CityDetails = () => {

  const { cityName } = useParams();
  const navigate = useNavigate();
  const [cityGuides, setCityGuides] = useState([]);
  const [cityInfo, setCityInfo] = useState(null);
  const [loading, setLoading] = useState(true);
    
  useEffect(() => {
    
    const controller = new AbortController();
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    const fetchGuides = async () => {
      try {
        setLoading(true);

        const guidesRes = await axios.get(`${API_BASE}/api/guides`, {
          params: { city: cityName },
          signal: controller.signal,
        });

        const guidesData = guidesRes.data?.guides || [];
        const mappedGuides = guidesData.map((g) => ({
          id: g.id,
          name: g.name,
          image: g.image,
          rating: g.rating ?? 0,
          languages: Array.isArray(g.languages) ? g.languages : (g.languages || []),
          speciality: g.speciality || "General",
          price: g.price ?? "",
        }));

        setCityGuides(mappedGuides);

        const citiesRes = await axios.get(`${API_BASE}/api/cities/${encodeURIComponent(cityName)}`, { signal: controller.signal });

        const found = citiesRes.data?.city || null;
        if (found) {
          let imgs = [];
          try {
            if (found.images) {
              if (Array.isArray(found.images)) imgs = found.images;
              else if (typeof found.images === "string") imgs = JSON.parse(found.images);
            }
          } catch (e) {
            console.error("Failed to parse images for city", e);
          }

          if (!imgs || imgs.length === 0) {
            imgs = found.cover_image ? [found.cover_image] : [];
          }

          setCityInfo({
            description: found.place_description || "",
            images: imgs,
          });
        } else {
          setCityInfo(null);
        }
      } catch (err) {
        const isCanceled = err.name === "CanceledError" || axios.isCancel?.(err);
        if (!isCanceled) console.error("Error fetching cities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();

    return () => controller.abort();
  }, [cityName]);

 

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600">Loading guides...</p>
      </div>
    </div>
  );

  const allImages = cityInfo?.images || [];
  const cityDescription = cityInfo?.description || "";

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="px-4 sm:px-20 xl:px-32 pt-10 pb-4">
        <div className="w-full max-w-7xl mx-auto rounded-3xl bg-gradient-to-br from-sky-50 to-purple-50 px-6 py-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-semibold text-slate-900 mb-6">
              Explore <span className="text-sky-500">{cityName}</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              {cityDescription || "Discover authentic experiences with verified local guides. Book your perfect tour today."}
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      {allImages.length > 0 && (
        <div className="px-4 sm:px-20 xl:px-32 pt-4 pb-4">
          <div className="w-full max-w-7xl mx-auto rounded-3xl bg-white px-6 py-12">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-semibold text-slate-900 mb-3">Gallery</h2>
            <p className="text-slate-600 text-lg">Stunning views and attractions in {cityName}</p>
          </div>

          <div className="flex w-full flex-wrap justify-center gap-6">
            {allImages.map((img, index) => (
              <div
                key={index}
                className="group w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <img
                  src={img}
                  alt={`${cityName} ${index + 1}`}
                  className="h-72 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
          </div>
        </div>
      )}

      {/* Guides Section */}
      <div className="px-4 sm:px-20 xl:px-32 pt-4 pb-10">
        <div className="w-full max-w-7xl mx-auto rounded-3xl bg-white px-6 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-semibold text-slate-900 mb-3">
            Available Guides {cityGuides.length > 0 && <span className="text-sky-500">({cityGuides.length})</span>}
          </h2>
          <p className="text-slate-600">Meet our verified guides ready to share their expertise</p>
        </div>

        {cityGuides.length > 0 ? (
          <div className="grid w-full md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cityGuides.map((guide) => (
              <div
                key={guide.id}
                onClick={() => navigate(`/Explore/${cityName}/guide/${guide.id}`)}
                className="group bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              >
                {/* Guide Image */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
                  <img
                    src={guide.image}
                    alt={guide.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {guide.rating > 0 && (
                    <div className="absolute top-3 right-3 bg-amber-400 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xl font-bold text-sm">
                      <span>★</span>
                      <span>{guide.rating}</span>
                    </div>
                  )}
                </div>

                {/* Guide Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-sky-600 transition">
                    {guide.name}
                  </h3>
                  
                  <div className="bg-sky-50 px-3 py-1 rounded-full inline-block mb-4">
                    <p className="text-sm font-semibold text-sky-700">{guide.speciality}</p>
                  </div>

                  <div className="space-y-3 mt-4">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold">🗣️ Languages:</span> {Array.isArray(guide.languages) ? guide.languages.join(", ") : guide.languages}
                    </p>
                    {guide.price && (
                      <p className="text-sm text-slate-700">
                        <span className="font-semibold">💰 Price:</span> {guide.price}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 flex items-center text-sky-500 font-semibold group-hover:translate-x-1 transition">
                    View Profile →
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl">
            <p className="text-xl text-slate-500">No guides available in {cityName} yet.</p>
            <button
              onClick={() => navigate("/explore")}
              className="mt-6 px-8 py-3 bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-600 transition"
            >
              Explore Other Cities
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default CityDetails;
