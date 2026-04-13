import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyBookings } from "../assets/assets.js";
import toast from "react-hot-toast";

const statusStyles = {
  requested: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
  completed: "bg-blue-100 text-blue-700",
};

const BookingHistory = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(dummyBookings);
  const [activeModal, setActiveModal] = useState(null);


  const handleCancelBooking = (id) => {
  
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
    );
    setActiveModal(null);
  };

const handlePayment = (booking) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: booking.guide.price * 100, // Razorpay paisa paise mein leta hai (x100)
    currency: "INR",
    name: "TourGuide App",
    description: `Booking with ${booking.guide.name}`,
    image: booking.guide.image,
    handler: async function (response) {
      // Payment successful
      // response.razorpay_payment_id milega

      // TODO: DB mein paymentStatus update karo
      // await updateDoc(doc(db, "bookings", booking.id), {
      //   paymentStatus: "paid",
      //   paymentId: response.razorpay_payment_id,
      // });

      // Local state update
      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id
            ? {
                ...b,
                paymentStatus: "paid",
                paymentId: response.razorpay_payment_id,
              }
            : b
        )
      );

      setActiveModal(null);
      toast.success("Payment successful!");
    },
    prefill: {
      name: booking.userName,
      email: booking.userEmail,
    },
    theme: {
      color: "#60a5fa", // blue-400
    },
  };

  const razor = new window.Razorpay(options);
  razor.open();
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
        Booking History
      </h1>

      <div className="flex flex-col gap-6">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex flex-col sm:flex-row gap-6 border border-gray-200 rounded-2xl p-6 shadow-sm bg-white"
          >
            {/* Guide Image */}
            <img
              src={booking.guide.image}
              alt={booking.guide.name}
              className="w-full sm:w-36 h-36 object-cover rounded-xl"
            />

            {/* Details */}
            <div className="flex-1 space-y-1">
              <h2 className="text-xl font-semibold text-slate-800">
                {booking.guide.name}
              </h2>
              <p className="text-gray-500 text-sm">
                {booking.city} · {booking.guide.speciality}
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Slot:</strong> {booking.slot}
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Price:</strong> ₹{booking.guide.price}/hr
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Booked on:</strong>{" "}
                {new Date(booking.bookedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
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
                    `/Explore/${booking.city.toLowerCase()}/guide/${booking.guide.id}`
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