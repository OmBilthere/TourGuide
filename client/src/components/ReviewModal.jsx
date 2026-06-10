import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { X } from "lucide-react";

const ReviewModal = ({ booking, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (reviewText.trim().length === 0) {
      toast.error("Please write a review");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${API_BASE}/api/reviews/create`,
        {
          booking_id: booking.id,
          user_id: booking.userId,
          guide_id: booking.guideId,
          rating,
          review_text: reviewText,
        },
        getAuthHeaders()
      );

      if (response.data?.success) {
        toast.success("Review submitted successfully!");
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">Leave a Review</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Guide Info */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
          <img
            src={booking.guideImage}
            alt={booking.guideName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-slate-800">{booking.guideName}</p>
            <p className="text-sm text-gray-500">{booking.city}</p>
          </div>
        </div>

        {/* Star Rating */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Rate your experience</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="transition"
              >
                <span
                  className={`text-4xl ${
                    star <= (hoverRating || rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Review Text */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Share your experience
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Tell us about your experience with this guide..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            rows="4"
          />
          <p className="text-xs text-gray-500 mt-1">
            {reviewText.length} / 500 characters
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitReview}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-blue-400 text-white rounded-xl hover:bg-blue-500 transition disabled:opacity-50 cursor-pointer font-medium"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
