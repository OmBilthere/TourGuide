import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const GuideDashboard = () => {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const [loading, setLoading] = useState(true);
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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-slate-800">Availability Status</h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              guideAvailable
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {guideAvailable ? "Available" : "Not Available"}
          </span>
        </div>
        <p className="text-gray-600 mt-3">
          If you are not available, mark yourself unavailable to stop new slot bookings.
        </p>
        <button
          onClick={handleAvailabilityToggle}
          disabled={updatingAvailability}
          className={`mt-4 px-6 py-3 rounded-xl text-white transition cursor-pointer ${
            guideAvailable
              ? "bg-amber-500 hover:bg-amber-600"
              : "bg-emerald-500 hover:bg-emerald-600"
          } ${updatingAvailability ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {updatingAvailability
            ? "Updating..."
            : guideAvailable
            ? "Mark Not Available"
            : "Mark Available"}
        </button>
      </div>

      <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-2xl font-semibold text-slate-800">Quick Actions</h2>
        <div className="flex flex-wrap gap-4 mt-5">
          <button
            onClick={() => navigate("/guide/bookings")}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition cursor-pointer"
          >
            Open Guide Bookings
          </button>
          <button
            onClick={() => navigate("/guide/profile/edit")}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition cursor-pointer"
          >
            Update Profile
          </button>
          <button
            onClick={() => navigate("/Explore")}
            className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-slate-700 rounded-xl transition cursor-pointer"
          >
            Explore Cities
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideDashboard;
