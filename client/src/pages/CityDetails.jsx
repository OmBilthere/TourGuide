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
          name: g.name || g.full_name,
          image: g.image || g.avatar_url,
          rating: g.rating ?? 0,
          languages: Array.isArray(g.languages) ? g.languages : (g.languages || []),
          speciality: g.speciality || g.specialty || "General",
          price: g.price_per_hour ?? g.price ?? "",
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
            description: found.place_description || found.description || "",
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

 

  if (loading) return <div className="p-20 text-center">Loading...</div>;

  const allImages = cityInfo?.images || [];
  const cityDescription = cityInfo?.description || "";

  return (
    <div className="px-4 sm:px-20 xl:px-32 py-20">
      <h1 className="text-4xl font-semibold text-slate-800">
        Explore {cityName}
      </h1>

      <p className="text-gray-500 mt-4 max-w-4xl leading-7">
        {cityDescription}
      </p>

      {/* Gallery */}
      <div className="mt-16">
        <h2 className="text-3xl font-semibold text-slate-800">Gallery</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {allImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={cityName}
              className="h-64 w-full object-cover rounded-2xl"
            />
          ))}
        </div>
      </div>

      {/* Guides */}
      <div className="mt-16">
        <h2 className="text-3xl font-semibold text-slate-800">
          Available Guides
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {cityGuides.map((guide) => (
            <div
            onClick={() => navigate(`/Explore/${cityName}/guide/${guide.id}`)}
              key={guide.id}
              className="border rounded-2xl shadow-lg p-5 hover:bg-blue-200 transition cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <img
                  src={guide.image}
                  alt={guide.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold">{guide.name}</h3>
                  <p className="text-sm text-gray-500">
                    ⭐ {guide.rating}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-gray-600">
                <strong>Languages:</strong> {Array.isArray(guide.languages) ? guide.languages.join(", ") : guide.languages}
              </p>
              <p className="mt-2 text-gray-600">
                <strong>Speciality:</strong> {guide.speciality}
              </p>
              <p className="mt-2 text-gray-600">
                <strong>Price:</strong> {guide.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CityDetails;