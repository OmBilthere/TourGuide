import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

const GuideDetails = () => {
  const { cityName, guideId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [guide , setGuide] = useState(null);
  const [cityId, setCityId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
    
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const controller = new AbortController();

    const fetchGuideAndCity = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0); // Scroll to top when loading
        
        // Fetch guide details
        const guideRes = await axios.get(`${API_BASE}/api/guides/${guideId}`, { signal: controller.signal });
        const g = guideRes.data?.guide;
        
        // Fetch city info to get city_id
        const citiesRes = await axios.get(`${API_BASE}/api/cities/${encodeURIComponent(cityName)}`, { signal: controller.signal });
        const cityData = citiesRes.data?.city;
        
        // Fetch reviews for the guide (non-blocking)
        try {
          const reviewsRes = await axios.get(`${API_BASE}/api/reviews/guide/${guideId}`, { signal: controller.signal });
          if (reviewsRes.data?.reviews) {
            setReviews(reviewsRes.data.reviews);
          }
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
        
        if (cityData?.id) {
          setCityId(cityData.id);
        }
        
        if (g) {
          const mappedGuide = {
            id: g.id,
            name: g.name || "Unknown",
            image: g.image || "",
            rating: g.rating ?? 0,
            city: g.city || cityName || "Unknown",
            languages: Array.isArray(g.languages) ? g.languages : (g.languages || []),
            speciality: g.speciality || "General",
            experience: g.experience_years ?? 0,
            price: g.price ?? 0,
            about: g.about || "",
            highlights: Array.isArray(g.highlights) ? g.highlights : (g.highlights || []),
            availableSlots: Array.isArray(g.available_slots) ? g.available_slots : (g.available_slots || []),
          };
          setGuide(mappedGuide);
        }
      } catch (error) {
        const isCanceled = error.name === "CanceledError" || axios.isCancel?.(error);
        if (!isCanceled) console.error("Error fetching guide:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuideAndCity();
    return () => controller.abort();
  }, [guideId, cityName]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600">Loading guide details...</p>
      </div>
    </div>
  );

  if (!guide) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-slate-600 mb-4">Guide not found</p>
          <button
            onClick={() => navigate("/explore")}
            className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  const handleSendRequest = async () => {
    if (!selectedSlot) {
      toast.error("Please select a slot first");
      return;
    }

    if (!user) {
      toast.error("Please log in to book a guide");
      return;
    }

    if (!cityId) {
      toast.error("City information not found");
      return;
    }

    const authToken = localStorage.getItem("token");
    if (!authToken) {
      toast.error("Missing bearer token. Please log in again.");
      return;
    }

    try {
      setLoading(true);

      const slotId = selectedSlot.id || selectedSlot;

      const amount = guide.price * 1;
      
      const res = await axios.post(`${API_BASE}/api/bookings/create`, {
        user_id: user.id,
        full_name: user.fullName || "",
        email: user.emailAddresses?.[0]?.emailAddress || "",
        avatar_url: user.imageUrl || "",
        role: "tourist",
        guide_id: guide.id,
        city_id: cityId,
        slot_id: slotId,
        amount,
        trip_date: new Date().toISOString().split('T')[0],
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.data?.success) {
        toast.success("Booking request sent!");
        navigate("/bookings");
      } else {
        toast.error(res.data?.message || "Booking failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasAvailableSlots = Array.isArray(guide.availableSlots) && guide.availableSlots.some((slot) => slot.is_available !== false);
  const canSendBookingRequest = !loading && Boolean(selectedSlot) && hasAvailableSlots;

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="px-4 sm:px-20 xl:px-32 pt-10 pb-4">
        <div className="w-full max-w-7xl mx-auto rounded-3xl bg-gradient-to-br from-sky-50 to-purple-50 px-6 py-12">
        <div className="grid md:grid-cols-3 gap-12 items-start">
          {/* Guide Image */}
          <div className="md:col-span-1 flex justify-center">
            <div className="w-48 h-48 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-200 to-slate-300">
              <img
                src={guide.image}
                alt={guide.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Guide Info */}
          <div className="md:col-span-2">
            <h1 className="text-5xl font-bold text-slate-900 mb-3">{guide.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`text-2xl ${
                    star <= Math.round(guide.rating) ? "text-amber-400" : "text-gray-300"
                  }`}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-lg font-bold text-slate-900">({guide.rating})</span>
            </div>

            {!hasAvailableSlots && (
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-rose-100 text-rose-700 px-4 py-2 font-semibold">
                ⚠️ Not Available Right Now
              </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-sm text-slate-600">City</p>
                <p className="font-bold text-slate-900">{guide.city}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-sm text-slate-600">Experience</p>
                <p className="font-bold text-slate-900">{guide.experience} years</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-sm text-slate-600">Speciality</p>
                <p className="font-bold text-slate-900 text-sky-600">{guide.speciality}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-sm text-slate-600">Price/Hour</p>
                <p className="font-bold text-slate-900">₹{guide.price}</p>
              </div>
            </div>

            {/* Languages */}
            <div className="mt-6">
              <p className="text-sm text-slate-600 mb-3 font-semibold">Languages</p>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(guide.languages) ? guide.languages.map((lang, i) => (
                  <span key={i} className="px-3 py-1.5 bg-sky-100 text-sky-700 rounded-full text-sm font-medium">
                    {lang}
                  </span>
                )) : (
                  <span className="px-3 py-1.5 bg-sky-100 text-sky-700 rounded-full text-sm font-medium">
                    {guide.languages}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* About Section */}
      <div className="px-4 sm:px-20 xl:px-32 pt-4 pb-4">
        <div className="w-full max-w-7xl mx-auto rounded-3xl bg-white px-6 py-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 text-center">About Guide</h2>
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-8 border border-slate-200">
            <p className="text-lg text-slate-700 leading-relaxed">{guide.about}</p>
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      {guide.highlights.length > 0 && (
        <div className="px-4 sm:px-20 xl:px-32 pt-4 pb-4">
          <div className="w-full max-w-7xl mx-auto rounded-3xl bg-white px-6 py-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-8 text-center">Tour Highlights</h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
              {guide.highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-4 bg-gradient-to-r from-sky-50 to-purple-50 rounded-2xl p-4 border border-sky-100">
                  <span className="text-2xl">✨</span>
                  <span className="font-semibold text-slate-800">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Slots Section */}
      <div className="px-4 sm:px-20 xl:px-32 pt-4 pb-4">
        <div className="w-full max-w-7xl mx-auto rounded-3xl bg-slate-50 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-5 text-center">Available Slots</h2>
          {!hasAvailableSlots && (
            <p className="text-rose-600 font-semibold mb-6">⚠️ This guide is currently unavailable. Please try another guide or come back later.</p>
          )}
          
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {guide.availableSlots && guide.availableSlots.length > 0 ? (
              guide.availableSlots.map((slot, index) => {
                const isAvailable = slot.is_available !== false;
                const isSelected = selectedSlot?.id === slot.id || selectedSlot === slot;
                
                return (
                  <button
                    key={index}
                    onClick={() => isAvailable && setSelectedSlot(slot)}
                    disabled={!isAvailable}
                    className={`px-6 py-3 rounded-xl cursor-pointer font-semibold transition-all ${
                      isSelected && isAvailable
                        ? "bg-sky-500 text-white shadow-lg scale-105"
                        : isAvailable
                        ? "bg-white border-2 border-slate-200 text-slate-900 hover:border-sky-400"
                        : "bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                    }`}
                  >
                    {slot.label || slot}
                    {!isAvailable && " ❌"}
                  </button>
                );
              })
            ) : (
              <p className="text-slate-600">No slots available</p>
            )}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSendRequest}
              disabled={!canSendBookingRequest}
              className={`px-8 py-4 rounded-2xl font-bold cursor-pointer text-lg transition-all max-w-md w-full ${
                canSendBookingRequest 
                  ? "bg-sky-500 text-white hover:bg-sky-600 shadow-lg hover:shadow-xl hover:scale-[1.02]" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? "Sending Request..." : "Send Booking Request"}
            </button>
          </div>
          
          {!selectedSlot && hasAvailableSlots && (
            <p className="text-sm text-amber-600 font-semibold mt-4 text-center">📍 Please select a time slot to continue.</p>
          )}
        </div>
        </div>
      </div>

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <div className="px-4 sm:px-20 xl:px-32 pt-4 pb-10">
          <div className="w-full max-w-7xl mx-auto rounded-3xl bg-white px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 mb-8 text-center">Reviews <span className="text-sky-500">({reviews.length})</span></h2>
            <div className="space-y-5">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.avatar_url || "https://via.placeholder.com/48"}
                      alt={review.user_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-slate-900">{review.user_name || "Anonymous"}</p>
                      <p className="text-xs text-slate-500">
                        {review.created_at
                          ? new Date(review.created_at).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={`text-lg ${
                        star <= review.rating ? "text-amber-400" : "text-gray-300"
                      }`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed">{review.review_text}</p>
              </div>
            ))}
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideDetails;
