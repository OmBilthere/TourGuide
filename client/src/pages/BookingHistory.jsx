import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import ReviewModal from "../components/ReviewModal";

const statusStyles = {
  requested: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
  rejected: "bg-rose-100 text-rose-700",
  completed: "bg-blue-100 text-blue-700",
};

const primaryBtn = "py-2 px-4 bg-sky-500 text-white rounded-lg text-sm hover:bg-sky-600 active:scale-95 transition";
const primaryBtnLarge = "flex-1 py-3 bg-sky-500 text-white rounded-lg font-medium hover:bg-sky-600 active:scale-95 transition";
const secondaryBtn = "flex-1 py-3 cursor-pointer border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition";

const mapBooking = (booking) => ({
  id: booking.id,
  status: booking.booking_status,
  paymentStatus: booking.payment_status,
  amount: booking.amount,
  bookedAt: booking.booked_at,
  tripDate: booking.trip_date,
  completionCode: booking.completion_code,
  city: booking.city,
  slot: booking.slot_label,
  guideId: booking.guide_id,
  userId: booking.user_id,
  guideName: booking.guide_name,
  guideImage: booking.guide_image,
  guideEmail: booking.guide_email,
  guidePhone: booking.guide_number,
  guideSpeciality: booking.speciality,
  price: booking.price,
});

const BookingHistory = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [reviewModal, setReviewModal] = useState(null);
  const { user, isLoaded } = useUser();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const fetchBookings = async (signal) => {
    if (!user?.id) return;

    const res = await axios.get(`${API_BASE}/api/bookings/history/${user.id}`, {
      signal,
      ...getAuthHeaders(),
    });

    const mappedBookings = (res.data.bookings || []).map(mapBooking);
    setBookings(mappedBookings);
  };

  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const controller = new AbortController();

    const loadBookings = async () => {
      try {
        await fetchBookings(controller.signal);
      } catch (error) {
        const isCanceled = error.name === "CanceledError" || axios.isCancel?.(error);
        if (!isCanceled) console.error("Error fetching bookings:", error);
      }
    };

    loadBookings();
    return () => controller.abort();
  }, [isLoaded, user?.id]);

  const handleCancelBooking = async (id) => {
    try {
      const res = await axios.patch(`${API_BASE}/api/bookings/cancel/${id}`, {}, getAuthHeaders());
      if (res.data?.success) {
        toast.success("Booking cancelled successfully");
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
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
      const orderRes = await axios.post(`${API_BASE}/api/bookings/pay/order`, { bookingId: booking.id }, getAuthHeaders());
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
        description: `Payment for booking with ${booking.guideName}`,
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
              await fetchBookings();
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
  const canShowGuideContact = activeBooking?.paymentStatus === "paid";

  if (!bookings || bookings.length === 0) {
    return (
      <div className="px-4 sm:px-20 xl:px-32 py-10 text-center text-gray-500">
        <div className="w-full max-w-7xl mx-auto rounded-3xl bg-white px-6 py-12 shadow-sm border border-gray-100">
          <p className="text-2xl font-semibold">No bookings yet</p>
          <button onClick={() => navigate("/Explore")} className={"mt-6 max-w-xs " + primaryBtnLarge}>
            Explore Guides
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero */}
      <div className="px-4 sm:px-20 xl:px-32 pt-10 pb-4">
        <div className="w-full max-w-7xl mx-auto rounded-3xl bg-gradient-to-br from-sky-50 to-purple-50 px-6 py-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-slate-900 mb-3">My Bookings</h1>
            <p className="text-slate-600">Manage your upcoming trips and view past bookings.</p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-20 xl:px-32 pt-4 pb-12">
        <div className="w-full max-w-7xl mx-auto space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="grid grid-cols-1 sm:grid-cols-6 gap-6 items-center bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
            >
              <div className="sm:col-span-1 flex items-center justify-center">
                <img src={booking.guideImage || "https://via.placeholder.com/150"} alt={booking.guideName || "Guide"} className="w-28 h-28 object-cover rounded-2xl shadow" />
              </div>

              <div className="sm:col-span-3">
                <h2 className="text-2xl font-semibold text-slate-900">{booking.guideName || "Unknown Guide"}</h2>
                <p className="text-gray-500">{booking.city || "Unknown City"} · {booking.guideSpeciality || "General"}</p>
                <div className="mt-3 text-sm text-slate-600 space-y-1">
                  <p><strong>Slot:</strong> {booking.slot}</p>
                  <p><strong>Total Charge:</strong> ₹{booking.amount || 0}</p>
                  <p><strong>Booked on:</strong> {booking.bookedAt ? new Date(booking.bookedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "N/A"}</p>
                </div>
              </div>

              <div className="sm:col-span-1 flex items-center justify-center">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${statusStyles[booking.status] || "bg-gray-100 text-gray-600"}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              <div className="sm:col-span-1 flex flex-col gap-3 items-stretch justify-center">
                {booking.status === "confirmed" && (
                  <button onClick={() => setActiveModal(booking.id)} className={primaryBtn}>Details</button>
                )}

                {booking.status === "completed" && (
                  <button onClick={() => setReviewModal(booking.id)} className={primaryBtn}>Leave Review</button>
                )}

                {booking.status === "requested" && (
                  <button onClick={() => handleCancelBooking(booking.id)} className="py-2 px-4 border border-red-400 text-red-500 rounded-xl text-sm hover:bg-red-50 transition">Cancel</button>
                )}

                <button onClick={() => navigate(`/Explore/${(booking.city || "").toLowerCase()}/guide/${booking.guideId}`)} className={primaryBtn}>View Guide</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {reviewModal && bookings.find((b) => b.id === reviewModal) && (
        <ReviewModal booking={bookings.find((b) => b.id === reviewModal)} onClose={() => setReviewModal(null)} onSuccess={() => fetchBookings()} />
      )}

      {/* Contact + Payment Modal */}
      {activeModal && activeBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setActiveModal(null)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-6">
              <img src={activeBooking.guideImage} alt={activeBooking.guideName} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <h2 className="text-xl font-semibold text-slate-800">{activeBooking.guideName}</h2>
                <p className="text-gray-500 text-sm">{activeBooking.city}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
              <p className="text-sm text-gray-500 font-medium">Contact Details</p>
              {canShowGuideContact ? (
                <>
                  <p className="text-slate-800">📞 {activeBooking.guidePhone || "Not available"}</p>
                  <p className="text-slate-800">✉️ {activeBooking.guideEmail || "Not available"}</p>
                </>
              ) : (
                <p className="text-amber-700 text-sm">Contact details unlock after successful payment.</p>
              )}
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
              <p className="text-sm text-gray-500 font-medium">Booking Details</p>
              <p className="text-slate-800 text-sm"><strong>Slot:</strong> {activeBooking.slot}</p>
              <p className="text-slate-800 text-sm"><strong>Amount:</strong> ₹{activeBooking.amount}</p>
              <p className="text-sm">Payment: <span className={`font-medium ${activeBooking.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"}`}>{activeBooking.paymentStatus === "paid" ? "Paid ✓" : "Pending"}</span></p>
            </div>

            {canShowGuideContact && activeBooking.completionCode && (
              <div className="bg-sky-50 rounded-xl p-4 mb-6 space-y-2 border border-sky-100">
                <p className="text-sm text-sky-700 font-medium">Trip Completion Code</p>
                <p className="text-slate-800 text-lg font-semibold tracking-[0.25em]">{activeBooking.completionCode}</p>
                <p className="text-sm text-gray-600">Share this code with the guide after the trip. The guide will enter it to mark the trip completed.</p>
              </div>
            )}

            <div className="flex gap-3">
              {activeBooking.paymentStatus !== "paid" && (
                <button onClick={() => handlePayment(activeBooking)} className={primaryBtnLarge}>Pay Now ₹{activeBooking.amount}</button>
              )}
              <button onClick={() => setActiveModal(null)} className={secondaryBtn}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
