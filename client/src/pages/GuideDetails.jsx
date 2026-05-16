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
        } catch (reviewError) {
          // Reviews fetch failure is non-critical
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
  }, [guideId, cityName])

  if (loading) return <div className="p-20 text-center">Loading guide details...</div>;

  if (!guide) {
    return <div className="p-20 text-center">Guide not found</div>;
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

      // Get slot ID from selected slot
      const slotId = selectedSlot.id || selectedSlot;
      
      // Calculate amount (price per hour, assuming 1 hour default)
      const amount = guide.price * 1; // Can be adjusted for duration
      
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
    <div className="px-4 sm:px-20 xl:px-32 py-20">
      {/* Hero */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <img
          src={guide.image}
          alt={guide.name}
          className="w-full max-w-md rounded-3xl shadow-lg"
        />

        <div>
          <h1 className="text-4xl font-semibold text-slate-800">
            {guide.name}
          </h1>

          <div className="flex items-center gap-2 mt-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-xl ${
                    star <= Math.round(guide.rating) ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-500 text-sm">({guide.rating})</p>
          </div>

          {!hasAvailableSlots && (
            <div className="mt-4 inline-flex items-center rounded-full bg-rose-100 text-rose-700 px-4 py-2 text-sm font-medium">
              Guide is not available right now
            </div>
          )}

          <div className="space-y-2 mt-6 text-gray-600">
            <p><strong>City:</strong> {guide.city}</p>
            <p><strong>Languages:</strong> {Array.isArray(guide.languages) ? guide.languages.join(", ") : guide.languages}</p>
            <p><strong>Speciality:</strong> {guide.speciality}</p>
            <p><strong>Experience:</strong> {guide.experience} years</p>
            <p><strong>Price:</strong> ₹{guide.price}</p>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="mt-16">
        <h2 className="text-3xl font-semibold text-slate-800">About Guide</h2>
        <p className="text-gray-500 mt-4 leading-7">{guide.about}</p>
      </div>

      {/* Highlights */}
      <div className="mt-16">
        <h2 className="text-3xl font-semibold text-slate-800">Tour Highlights</h2>
        <div className="flex flex-wrap gap-3 mt-6">
          {guide.highlights.map((item, index) => (
            <span key={index} className="px-4 py-2 bg-slate-100 rounded-full">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Slots */}
      <div className="mt-16">
        <h2 className="text-3xl font-semibold text-slate-800">Select Slot</h2>
        {!hasAvailableSlots && (
          <p className="text-sm text-rose-600 mt-3">
            This guide is currently unavailable. Please try another guide or come back later.
          </p>
        )}
        <div className="flex flex-wrap gap-4 mt-6">
          {guide.availableSlots && guide.availableSlots.length > 0 ? (
            guide.availableSlots.map((slot, index) => {
              const isAvailable = slot.is_available !== false; // true by default if not specified
              const isSelected = selectedSlot?.id === slot.id || selectedSlot === slot;
              
              return (
                <button
                  key={index}
                  onClick={() => isAvailable && setSelectedSlot(slot)}
                  disabled={!isAvailable}
                  className={`px-5 py-3 rounded-xl border cursor-pointer transition ${
                    isSelected && isAvailable
                      ? "bg-blue-400 text-white border-blue-400"
                      : isAvailable
                      ? "bg-white border-gray-300 hover:border-blue-400"
                      : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                  }`}
                >
                  {slot.label || slot}
                  {!isAvailable && " (Booked)"}
                </button>
              );
            })
          ) : (
            <p className="text-gray-500">No slots available</p>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16">
        <button
          onClick={handleSendRequest}
          disabled={!canSendBookingRequest}
          className={`px-8 py-4 bg-blue-400 rounded-2xl cursor-pointer transition ${
            canSendBookingRequest ? "hover:bg-blue-500" : "opacity-50 cursor-not-allowed"
          }`}
        >
          {loading ? "Sending..." : "Send Booking Request"}
        </button>
        {!selectedSlot && hasAvailableSlots && (
          <p className="text-sm text-amber-600 mt-3">Please select one slot to continue.</p>
        )}
        {!hasAvailableSlots && (
          <p className="text-sm text-rose-600 mt-3">Booking is disabled because guide is not available.</p>
        )}
      </div>

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-semibold text-slate-800">Reviews ({reviews.length})</h2>
          <div className="flex flex-col gap-4 mt-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border border-gray-200 rounded-lg p-5 bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.avatar_url || "https://via.placeholder.com/40"}
                      alt={review.user_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-slate-800">{review.user_name || "Anonymous"}</p>
                      <p className="text-xs text-gray-500">
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
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-lg ${
                          star <= review.rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-3">{review.review_text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideDetails;