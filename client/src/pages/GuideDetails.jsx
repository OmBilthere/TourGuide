import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { guidesData } from "../assets/assets.js";
import { toast } from "react-hot-toast";

const GuideDetails = () => {
  const { cityName, guideId } = useParams();
  const navigate = useNavigate();

  const guide = guidesData.find(
    (g) =>
      g.id === Number(guideId) &&
      g.city.toLowerCase() === cityName.toLowerCase()
  );

  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);

  if (!guide) {
    return <div className="p-20 text-center">Guide not found</div>;
  }

  const handleSendRequest = async () => {
    if (!selectedSlot) {
      toast.error("Please select a slot first");
      return;
    }

    const newBooking = {
      id: Date.now(), // change it in real app
      city: guide.city,
      guide,
      slot: selectedSlot,
      status: "requested",
      paymentStatus: "pending",
      bookedAt: new Date().toISOString(),
    };

    try {
      setLoading(true);

      // TODO: Yahan DB call aayegi
     
      toast.success("Booking request sent!");
      navigate("/history");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

          <p className="text-gray-500 mt-3">
            ⭐ {guide.rating} ({guide.reviews} reviews)
          </p>

          <div className="space-y-2 mt-6 text-gray-600">
            <p><strong>City:</strong> {guide.city}</p>
            <p><strong>Languages:</strong> {guide.languages}</p>
            <p><strong>Speciality:</strong> {guide.speciality}</p>
            <p><strong>Experience:</strong> {guide.experience}</p>
            <p><strong>Price:</strong> ₹{guide.price}/hr</p>
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
        <div className="flex flex-wrap gap-4 mt-6">
          {guide.availableSlots.map((slot, index) => (
            <button
              key={index}
              onClick={() => setSelectedSlot(slot)}
              className={`px-5 py-3 rounded-xl border cursor-pointer ${
                selectedSlot === slot ? "bg-blue-400" : "bg-white"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16">
        <button
          onClick={handleSendRequest}
          disabled={loading}
          className={`px-8 py-4 bg-blue-400 rounded-2xl cursor-pointer transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500"
          }`}
        >
          {loading ? "Sending..." : "Send Booking Request"}
        </button>
      </div>
    </div>
  );
};

export default GuideDetails;