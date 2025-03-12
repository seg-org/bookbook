"use client";
import axios from "axios";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";

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
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");

  // Fetch existing reviews
  useEffect(() => {
    axios.get("/api/reviews").then((res) => setReviews(res.data));
  }, []);

  if(reviews.length === 0) {
    console.log('No reviews found');
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await axios.post("/api/reviews", {
        rating,
        comment,
      });
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
      <h1 className="mb-4 text-xl font-bold">Add a Review</h1>

      {/* Review Form */}
      <Form onSubmit={handleSubmit}>
        <Input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="mt-2 w-full border p-2"
        />
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-2 w-full border p-2"
          placeholder="Write your review..."
        />
        <Button variant='default' type="submit" className="mt-2 rounded bg-blue-500 px-4 py-2 text-white">
          Submit Review
        </Button>
      </Form>
    </div>
  );
}
