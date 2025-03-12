"use client";
import axios from "axios";
import { useEffect, useState } from "react";

interface Review {
  id: string;
  transactionId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [transactionId, setTransactionId] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");

  // Fetch existing reviews
  useEffect(() => {
    axios.get("/api/reviews").then((res) => setReviews(res.data));
  }, []);

  const handleSubmit = async () => {
    if (!transactionId) {
      alert("Transaction ID is required.");
      return;
    }

    try {
      await axios.post("/api/reviews", {
        transactionId,
        rating,
        comment,
      });
      setTransactionId("");
      setRating(5);
      setComment("");
      axios.get("/api/reviews").then((res) => setReviews(res.data)); // Refresh the list
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-xl font-bold">Book Reviews</h1>

      {/* Review Form */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Add a Review</h2>
        <input
          type="text"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          placeholder="Transaction ID"
          className="mt-2 w-full border p-2"
        />
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="mt-2 w-full border p-2"
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-2 w-full border p-2"
          placeholder="Write your review..."
        />
        <button onClick={handleSubmit} className="mt-2 rounded bg-blue-500 px-4 py-2 text-white">
          Submit Review
        </button>
      </div>
    </div>
  );
}
