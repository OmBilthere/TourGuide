import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const GuideDashboard = () => {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    requested: 0,
    confirmed: 0,
    completed: 0,
  });
  const [guideAvailable, setGuideAvailable] = useState(true);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  const authHeaders = useMemo(() => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token || ""}`,
      },
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const profileRes = await axios.get(`${API_BASE}/api/guides/me/profile`, {
          ...authHeaders,
          signal: controller.signal,
        });

        setProfile(profileRes.data?.profile || null);

        const guideId = profileRes.data?.profile?.id;
        const hasAvailableSlots = profileRes.data?.profile?.has_available_slots;
        setGuideAvailable(Boolean(hasAvailableSlots));

        if (!guideId) {
          setStats({ requested: 0, confirmed: 0, completed: 0 });
          return;
        }

        const bookingsRes = await axios.get(`${API_BASE}/api/guides/bookings/${guideId}`, {
          ...authHeaders,
          signal: controller.signal,
        });

        const bookings = bookingsRes.data?.bookings || [];

        const nextStats = bookings.reduce(
          (acc, booking) => {
            const status = String(booking.booking_status || "").toLowerCase();
            if (status === "requested") acc.requested += 1;
            if (status === "confirmed") acc.confirmed += 1;
            if (status === "completed") acc.completed += 1;
            return acc;
          },
          { requested: 0, confirmed: 0, completed: 0 }
        );

        setStats(nextStats);

        // Fetch reviews for this guide
        try {
          const reviewsRes = await axios.get(`${API_BASE}/api/reviews/guide/${guideId}`, {
            signal: controller.signal,
          });
          if (reviewsRes.data?.reviews) {
            setReviews(reviewsRes.data.reviews);
          }
        } catch (reviewError) {
          console.log("Reviews fetch error (non-critical):", reviewError.message);
        }
      } catch (error) {
        const isCanceled = error.name === "CanceledError" || axios.isCancel?.(error);
        if (!isCanceled) {
          console.error("Failed to load guide dashboard:", error);
          toast.error(error.response?.data?.message || "Failed to load dashboard data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    return () => controller.abort();
  }, [API_BASE, authHeaders]);

  const handleAvailabilityToggle = async () => {
    try {
      setUpdatingAvailability(true);
      const nextValue = !guideAvailable;

      const res = await axios.patch(
        `${API_BASE}/api/guides/me/availability`,
        { is_available: nextValue },
        authHeaders
      );

      const latest = res.data?.profile?.has_available_slots;
      setGuideAvailable(Boolean(latest));
      toast.success(res.data?.message || "Availability updated");
    } catch (error) {
      console.error("Failed to update availability:", error);
      toast.error(error.response?.data?.message || "Failed to update availability");
    } finally {
      setUpdatingAvailability(false);
    }
  };

  return (
    <div className="px-4 sm:px-20 xl:px-32 py-20">
      <h1 className="text-4xl font-semibold text-slate-800">Guide Dashboard</h1>
      <p className="mt-4 text-gray-600 max-w-3xl">
        Welcome to your panel. From here you can manage incoming requests, track your tours,
        and keep your availability updated.
      </p>

      <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-slate-800">Your Profile</h2>
          <button
            onClick={() => navigate("/guide/profile/edit")}
            className="px-5 py-2.5 rounded-xl border border-sky-200 text-sky-700 hover:bg-sky-50 transition cursor-pointer"
          >
            Edit Profile
          </button>
        </div>

        {loading ? (
          <p className="mt-4 text-gray-500">Loading profile...</p>
        ) : profile ? (
          <div className="mt-5 space-y-5 text-sm">
            <div className="rounded-2xl border border-gray-200 bg-slate-50 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="relative shrink-0">
                  <img
                    src={profile.avatar_url || "https://via.placeholder.com/160?text=Guide"}
                    alt={profile.name || "Guide profile"}
                    className="h-28 w-28 rounded-2xl object-cover border border-gray-200 bg-white"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-gray-500">Guide Photo</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <p className="text-xl font-semibold text-slate-800">
                      {profile.name || "Guide"}
                    </p>
                    <button
                      type="button"
                      onClick={handleAvailabilityToggle}
                      disabled={updatingAvailability}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        guideAvailable
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      } ${updatingAvailability ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      {updatingAvailability
                        ? "Updating..."
                        : guideAvailable
                        ? "Available"
                        : "Not Available"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="rounded-2xl border border-gray-200 bg-slate-50 p-5">
                <p className="text-gray-500">City</p>
                <p className="mt-1 text-lg font-semibold text-slate-800">{profile.city || "N/A"}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-slate-50 p-5">
                <p className="text-gray-500">Speciality</p>
                <p className="mt-1 text-lg font-semibold text-slate-800">
                  {profile.speciality || "N/A"}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-slate-50 p-5">
                <p className="text-gray-500">Experience</p>
                <p className="mt-1 text-lg font-semibold text-slate-800">
                  {profile.experience_years ?? "N/A"} years
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-slate-50 p-5">
                <p className="text-gray-500">Price</p>
                <p className="mt-1 text-lg font-semibold text-slate-800">
                  INR {profile.price ?? 0}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-slate-50 p-5">
                <p className="text-gray-500">Phone</p>
                <p className="mt-1 text-lg font-semibold text-slate-800">
                  {profile.phone || "Not added"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-slate-50 p-5">
              <p className="text-gray-500">About</p>
              <p className="mt-1 text-slate-700 leading-7">
                {profile.about || "No description added yet."}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-slate-50 p-5">
              <p className="text-gray-500">Languages</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(profile.languages || []).length > 0 ? (
                  profile.languages.map((item) => (
                    <span key={item} className="px-3 py-1 rounded-full bg-white border text-gray-700">
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No languages added</span>
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-slate-50 p-5">
              <p className="text-gray-500">Highlights</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(profile.highlights || []).length > 0 ? (
                  profile.highlights.map((item) => (
                    <span key={item} className="px-3 py-1 rounded-full bg-white border text-gray-700">
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No highlights added</span>
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-slate-50 p-5 md:col-span-2">
              <p className="text-gray-500">Slots</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(profile.slots || []).length > 0 ? (
                  profile.slots.map((item) => (
                    <span key={item} className="px-3 py-1 rounded-full bg-white border text-gray-700">
                      {item}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No slots added</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-gray-500">No profile found. Please complete your guide profile.</p>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-5 mt-10">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <p className="text-sm text-gray-500">Pending Requests</p>
          <p className="text-3xl font-semibold text-slate-800 mt-2">{loading ? "--" : stats.requested}</p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
          <p className="text-sm text-gray-500">Confirmed Tours</p>
          <p className="text-3xl font-semibold text-slate-800 mt-2">{loading ? "--" : stats.confirmed}</p>
        </div>

        <div className="rounded-2xl border border-violet-100 bg-violet-50 p-6">
          <p className="text-sm text-gray-500">Completed Tours</p>
          <p className="text-3xl font-semibold text-slate-800 mt-2">{loading ? "--" : stats.completed}</p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-2xl font-semibold text-slate-800">Your Reviews ({reviews.length})</h2>
        {reviews.length > 0 ? (
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
        ) : (
          <p className="text-gray-500 mt-4">No reviews yet. Keep up the great work!</p>
        )}
      </div>
    </div>
  );
};

export default GuideDashboard;
