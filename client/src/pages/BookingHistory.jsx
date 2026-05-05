import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

const statusStyles = {
  requested: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
  completed: "bg-blue-100 text-blue-700",
};

const BookingHistory = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const { user, isLoaded } = useUser();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });


  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const controller = new AbortController();

    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/bookings/history/${user.id}`,
          {
            signal: controller.signal,
            ...getAuthHeaders(),
          }
        );

        const mappedBookings = (res.data.bookings || []).map((booking) => ({
          id: booking.id,
          status: booking.booking_status,
          paymentStatus: booking.payment_status,
          amount: booking.amount,
          bookedAt: booking.booked_at,
          tripDate: booking.trip_date,
          city: booking.city,
          slot: booking.slot_label,
          guide: {
            id: booking.guide_id,
            name: booking.guide_name,
            image: booking.guide_image,
            email: booking.guide_email,
            phone: booking.guide_number,
            speciality: booking.speciality,
            price: booking.price_per_hour,
          },
        }));

        setBookings(mappedBookings);
      } catch (error) {
        const isCanceled = error.name === "CanceledError" || axios.isCancel?.(error);
        if (!isCanceled) console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
    return () => controller.abort();
  }, [isLoaded, user?.id])

  const handleCancelBooking = async (id) => {
    try {
      const res = await axios.patch(
        `${API_BASE}/api/bookings/cancel/${id}`,
        {},
        getAuthHeaders()
      );

      if (res.data?.success) {
        toast.success("Booking cancelled successfully");
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
        );
        setActiveModal(null);
      }
    } catch (error) {
      const isCanceled = error.name === "CanceledError" || axios.isCancel?.(error);
      if (!isCanceled) console.error("Error canceling booking:", error);
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  const handlePayment = async (booking) => {
    try {
      const orderRes = await axios.post(
        `${API_BASE}/api/bookings/pay/order`,
        { bookingId: booking.id },
        getAuthHeaders()
      );

      const { order, keyId } = orderRes.data;

      if (!order || !keyId) {
        toast.error("Failed to initialize payment");
        return;
      }

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Tourist Guide Booking",
        description: `Payment for booking with ${booking.guide.name}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${API_BASE}/api/bookings/pay/verify`,
              {
                bookingId: booking.id,
                razorpay_order_id: order.id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              getAuthHeaders()
            );

            if (verifyRes.data?.success) {
              toast.success("Payment successful!");
              setBookings((prev) =>
                prev.map((b) =>
                  b.id === booking.id ? { ...b, paymentStatus: "paid" } : b
                )
              );
              setActiveModal(null);
            } else {
              toast.error(verifyRes.data?.message || "Payment verification failed");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            toast.error(error.response?.data?.message || "Payment verification failed");
          }
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error creating payment order:", error);
      toast.error(error.response?.data?.message || "Failed to create payment order");
    }
  };

  const activeBooking = bookings.find((b) => b.id === activeModal);

  if (bookings.length === 0) {
    return (
      <div className="px-4 sm:px-20 xl:px-32 py-20 text-center text-gray-500">
        <p className="text-2xl font-semibold">No bookings yet</p>
        <button
          onClick={() => navigate("/Explore")}
          className="mt-6 px-6 py-3 bg-blue-400 text-white rounded-xl"
        >
          Explore Guides
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-20 xl:px-32 py-20">
      <h1 className="text-4xl font-semibold text-slate-800 mb-10">
        My Bookings
      </h1>

      <div className="flex flex-col gap-6">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex flex-col sm:flex-row gap-6 border border-gray-200 rounded-2xl p-6 shadow-sm bg-white"
          >
            {/* Guide Image */}
            <img
              src={booking.guide?.image || "https://via.placeholder.com/150"}
              alt={booking.guide?.name || "Guide"}
              className="w-full sm:w-36 h-36 object-cover rounded-xl"
            />

            {/* Details */}
            <div className="flex-1 space-y-1">
              <h2 className="text-xl font-semibold text-slate-800">
                {booking.guide?.name || "Unknown Guide"}
              </h2>
              <p className="text-gray-500 text-sm">
                {booking.city || "Unknown City"} · {booking.guide?.speciality || "General"}
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Slot:</strong> {booking.slot}
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Price:</strong> ₹{booking.guide?.price || 0}/hr
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Booked on:</strong>{" "}
                {booking.bookedAt
                  ? new Date(booking.bookedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  })
                  : "N/A"}
              </p>

              {/* Status Badge */}
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                  statusStyles[booking.status] || "bg-gray-100 text-gray-600"
                }`}
              >
                {booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 justify-center items-end">
              {booking.status === "confirmed" && (
                <button
                  onClick={() => setActiveModal(booking.id)}
                  className="px-5 py-2 bg-green-500 text-white rounded-xl text-sm hover:bg-green-600 transition"
                >
                  View Detail
                </button>
              )}
              {booking.status === "requested" && (
                <button
                  onClick={() => handleCancelBooking(booking.id)}
                  className="px-5 py-2 border border-red-400 text-red-500 rounded-xl text-sm hover:bg-red-50 transition"
                >
                  Cancel trip
                </button>
              )}
              <button
                onClick={() =>
                  navigate(
                    `/Explore/${(booking.city || "").toLowerCase()}/guide/${booking.guide?.id}`
                  )
                }
                className="px-5 py-2 bg-blue-400 text-white rounded-xl text-sm hover:bg-blue-500 transition"
              >
                View Guide
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Contact + Payment Modal */}
      {activeModal && activeBooking && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src={activeBooking.guide.image}
                alt={activeBooking.guide.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  {activeBooking.guide.name}
                </h2>
                <p className="text-gray-500 text-sm">{activeBooking.city}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
              <p className="text-sm text-gray-500 font-medium">
                Contact Details
              </p>
              <p className="text-slate-800">📞 {activeBooking.guide.phone}</p>
              <p className="text-slate-800">✉️ {activeBooking.guide.email}</p>
            </div>

            {/* Booking Details */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
              <p className="text-sm text-gray-500 font-medium">
                Booking Details
              </p>
              <p className="text-slate-800 text-sm">
                <strong>Slot:</strong> {activeBooking.slot}
              </p>
              <p className="text-slate-800 text-sm">
                <strong>Amount:</strong> ₹{activeBooking.guide.price}/hr
              </p>
              <p className="text-sm">
                Payment:{" "}
                <span
                  className={`font-medium ${
                    activeBooking.paymentStatus === "paid"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {activeBooking.paymentStatus === "paid"
                    ? "Paid ✓"
                    : "Pending"}
                </span>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              {activeBooking.paymentStatus !== "paid" && (
                <button
                  onClick={() => handlePayment(activeBooking)}
                  className="flex-1 py-3 bg-blue-400 text-white rounded-xl font-medium hover:bg-blue-500 transition"
                >
                  Pay Now ₹{activeBooking.guide.price}
                </button>
              )}
              <button
                onClick={() => setActiveModal(null)}
                className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;