import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const statusStyles = {
  requested: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
  rejected: "bg-rose-100 text-rose-700",
  completed: "bg-blue-100 text-blue-700",
};

const GuideBookings = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [completionCodes, setCompletionCodes] = useState({});

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

  const updateBookingStatus = async (bookingId, action, completionCode = "") => {
    try {
      setUpdatingId(bookingId);

      if (action === "confirm") {
        const shouldConfirm = window.confirm("Are you sure you want to confirm this booking?");
        if (!shouldConfirm) {
          return;
        }
      }

      const endpointMap = {
        confirm: `${API_BASE}/api/guides/bookings/confirm/${bookingId}`,
        reject: `${API_BASE}/api/guides/bookings/reject/${bookingId}`,
        complete: `${API_BASE}/api/guides/bookings/complete/${bookingId}`,
      };

      const endpoint = endpointMap[action];

      await axios.patch(
        endpoint,
        action === "complete" ? { completion_code: completionCode } : {},
        authHeaders
      );

      const nextStatus =
        action === "confirm" ? "confirmed" : action === "reject" ? "rejected" : "completed";

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

      const successMessage =
        action === "confirm"
          ? "Booking confirmed"
          : action === "reject"
            ? "Booking rejected"
            : "Booking completed";

      toast.success(successMessage);

      if (action === "complete") {
        setCompletionCodes((prev) => {
          const next = { ...prev };
          delete next[bookingId];
          return next;
        });
      }
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
        Manage live booking requests, confirm or reject tours, and mark tours as completed.
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
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => updateBookingStatus(booking.id, "confirm")}
                        disabled={isUpdating}
                        className="px-5 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isUpdating ? "Updating..." : "Confirm Booking"}
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking.id, "reject")}
                        disabled={isUpdating}
                        className="px-5 py-2 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isUpdating ? "Updating..." : "Reject Booking"}
                      </button>
                    </div>
                  )}

                  {isConfirmed && (
                    <div className="w-full sm:max-w-md rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 sm:p-5 shadow-sm">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div>
                          <p className="text-sm font-semibold text-emerald-800">Complete Trip</p>
                          <p className="text-xs text-emerald-700/80">
                            Enter the tourist's 6-digit code to finish this booking.
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-white text-emerald-700 border border-emerald-200">
                          OTP Required
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={completionCodes[booking.id] || ""}
                          onChange={(event) =>
                            setCompletionCodes((prev) => ({
                              ...prev,
                              [booking.id]: event.target.value.replace(/\D/g, "").slice(0, 6),
                            }))
                          }
                          placeholder="Enter 6-digit code"
                          className="w-full sm:w-52 px-4 py-3 rounded-xl border border-emerald-200 bg-white text-center tracking-[0.35em] text-base font-semibold outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                        />
                        <button
                          onClick={() =>
                            updateBookingStatus(
                              booking.id,
                              "complete",
                              completionCodes[booking.id] || ""
                            )
                          }
                          disabled={isUpdating || !(completionCodes[booking.id] || "").trim()}
                          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium shadow-sm hover:bg-emerald-700 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {isUpdating ? "Updating..." : "Mark Completed"}
                        </button>
                      </div>

                      <p className="mt-3 text-xs text-emerald-800/80 leading-5">
                        Ask the tourist for the 6-digit completion code before marking complete.
                      </p>
                    </div>
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
