import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const statusStyles = {
  requested: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
  completed: "bg-blue-100 text-blue-700",
};

const GuideBookings = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [bookings, setBookings] = useState([]);

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

    const fetchGuideBookings = async () => {
      try {
        setLoading(true);

        const profileRes = await axios.get(`${API_BASE}/api/guides/me/profile`, {
          ...authHeaders,
          signal: controller.signal,
        });

        const guideId = profileRes.data?.profile?.id;

        if (!guideId) {
          setBookings([]);
          return;
        }

        const bookingsRes = await axios.get(`${API_BASE}/api/guides/bookings/${guideId}`, {
          ...authHeaders,
          signal: controller.signal,
        });

        setBookings(bookingsRes.data?.bookings || []);
      } catch (error) {
        const isCanceled = error.name === "CanceledError" || axios.isCancel?.(error);
        if (!isCanceled) {
          console.error("Failed to fetch guide bookings:", error);
          toast.error(error.response?.data?.message || "Failed to load guide bookings");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGuideBookings();
    return () => controller.abort();
  }, [API_BASE, authHeaders]);

  const updateBookingStatus = async (bookingId, action) => {
    try {
      setUpdatingId(bookingId);

      const endpoint =
        action === "confirm"
          ? `${API_BASE}/api/guides/bookings/confirm/${bookingId}`
          : `${API_BASE}/api/guides/bookings/complete/${bookingId}`;

      await axios.patch(endpoint, {}, authHeaders);

      const nextStatus = action === "confirm" ? "confirmed" : "completed";

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                booking_status: nextStatus,
                payment_status: action === "complete" ? "paid" : booking.payment_status,
              }
            : booking
        )
      );

      toast.success(action === "confirm" ? "Booking confirmed" : "Booking completed");
    } catch (error) {
      console.error(`Failed to ${action} booking:`, error);
      toast.error(error.response?.data?.message || `Failed to ${action} booking`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="px-4 sm:px-20 xl:px-32 py-20">
      <h1 className="text-4xl font-semibold text-slate-800">Guide Bookings</h1>
      <p className="mt-4 text-gray-600 max-w-3xl">
        Manage live booking requests, confirm upcoming tours, and mark tours as completed.
      </p>

      {loading ? (
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 text-gray-500">
          Loading bookings...
        </div>
      ) : bookings.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-gray-500">
          No bookings found yet.
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-5">
          {bookings.map((booking) => {
            const status = String(booking.booking_status || "").toLowerCase();
            const isRequested = status === "requested";
            const isConfirmed = status === "confirmed";
            const isUpdating = updatingId === booking.id;

            return (
              <div
                key={booking.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800">
                      {booking.tourist_name || "Traveler"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {booking.city || "Unknown City"} • {booking.slot_label || "Slot not assigned"}
                    </p>
                  </div>

                  <span
                    className={`w-fit px-3 py-1 rounded-full text-xs font-medium ${
                      statusStyles[status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
                  </span>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 mt-5 text-sm">
                  <p className="text-gray-600">
                    <strong>Trip Date:</strong>{" "}
                    {booking.trip_date
                      ? new Date(booking.trip_date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                  <p className="text-gray-600">
                    <strong>Amount:</strong> INR {booking.amount || 0}
                  </p>
                  <p className="text-gray-600">
                    <strong>Payment:</strong> {booking.payment_status || "pending"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 mt-5">
                  {isRequested && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, "confirm")}
                      disabled={isUpdating}
                      className="px-5 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? "Updating..." : "Confirm Booking"}
                    </button>
                  )}

                  {isConfirmed && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, "complete")}
                      disabled={isUpdating}
                      className="px-5 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? "Updating..." : "Mark Completed"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GuideBookings;
