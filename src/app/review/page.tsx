"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";

// Temporary mock transaction (simulate being passed from "Rate" button)
const mockTransactions = [
  {
    id: "t123",
    bookTitle: "แฮร์รี่ พอตเตอร์กับศิลาอาถรรพ์",
    bookAuthor: "J.K. Rowling",
    bookImage: "/placeholder.svg?height=60&width=40",
    sellerName: "ร้านหนังสือมือสอง",
  },
];

interface Review {
  id: string;
  transactionId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    image: string;
  };
  book?: {
    title: string;
    author?: string;
    image: string;
  };
}

export default function ReviewsPage() {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  const selectedTransactionId = "t123"; // Will be passed in the future
  const transaction = mockTransactions.find((t) => t.id === selectedTransactionId);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!selectedTransactionId || !transaction) throw new Error("ไม่พบรายการสั่งซื้อ");
      if (rating < 1 || rating > 5) throw new Error("คะแนนต้องอยู่ระหว่าง 1-5");

      await new Promise((resolve) => setTimeout(resolve, 800));

      const newReview: Review = {
        id: `review-${Date.now()}`,
        transactionId: selectedTransactionId,
        rating,
        comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: {
          name: "คุณ (ผู้ซื้อ)",
          image: "/placeholder.svg?height=40&width=40",
        },
        book: {
          title: transaction.bookTitle,
          author: transaction.bookAuthor,
          image: transaction.bookImage,
        },
      };

      setReviews([newReview, ...reviews]);
      setRating(0);
      setComment("");
      setShowDialog(true);
    } catch (error) {
      console.error("Error submitting review:", error);
      setError(error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการส่งรีวิว");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-6 text-2xl font-bold">รีวิวการซื้อขาย</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Review Form */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold">เขียนรีวิวใหม่</h2>

          {transaction && (
            <div className="mb-4 flex items-start gap-4 rounded-md border bg-gray-50 p-4">
              <Image
                src={transaction.bookImage}
                alt={transaction.bookTitle}
                width={60}
                height={90}
                className="rounded object-cover"
              />
              <div className="flex flex-col">
                <span className="text-lg font-medium">{transaction.bookTitle}</span>
                <span className="text-sm text-gray-600">{transaction.bookAuthor}</span>
                <span className="text-sm text-gray-600">{transaction.sellerName}</span>
                <span className="text-xs text-gray-400">รหัสรายการ: {transaction.id}</span>
              </div>
            </div>
          )}

          {error && <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="rating" className="mb-1 block text-sm font-medium">
                คะแนน
              </label>
              <div className="mb-2 flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                    <Star
                      className={`h-8 w-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  </button>
                ))}
              </div>
              <Input type="hidden" id="rating" value={rating} min="1" max="5" required readOnly />
            </div>

            <div>
              <label htmlFor="comment" className="mb-1 block text-sm font-medium">
                ความคิดเห็น
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px] w-full rounded-md border p-2"
                placeholder="แสดงความคิดเห็นของคุณเกี่ยวกับการซื้อขายนี้..."
              />
            </div>

            <Button variant="default" type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "กำลังส่ง..." : "ส่งรีวิว"}
            </Button>
          </form>

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>ส่งรีวิวสำเร็จ</DialogTitle>
              </DialogHeader>
              <div className="py-2">ขอบคุณสำหรับความคิดเห็นของคุณ!</div>
              <DialogFooter>
                <Button onClick={() => setShowDialog(false)}>ปิด</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
