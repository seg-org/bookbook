"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { useGetTransaction } from "@/hooks/useGetTransactions";

export default function ReviewsPage() {
  const { id } = useParams();
  const selectedTransactionId = id as string;

  const { transaction, error: transactionError, loading } = useGetTransaction(selectedTransactionId);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!selectedTransactionId || !transaction) throw new Error("ไม่พบรายการสั่งซื้อ");
      if (rating < 1 || rating > 5) throw new Error("คะแนนต้องอยู่ระหว่าง 1-5");

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: selectedTransactionId,
          rating,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error("ไม่สามารถบันทึกรีวิวได้");
      }

      setRating(0);
      setComment("");
      setShowDialog(true);
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการส่งรีวิว");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null;
  if (transactionError) return <div>ไม่พบข้อมูลการซื้อขาย</div>;
  if (!transaction) return null;

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-blue-50 p-4">
      <div className="w-full max-w-3xl rounded-lg p-6">
        <h1 className="mb-6 text-center text-2xl font-bold">รีวิวการซื้อขาย</h1>

        <div className="grid gap-8">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-8 flex gap-6 rounded-xl border border-gray-200 bg-white p-6">
              <Image
                src={transaction?.post?.book?.coverImageUrl || "/placeholder.svg"}
                alt={transaction.post?.book?.title || "Book"}
                width={120}
                height={180}
                className="rounded-lg object-cover shadow-md"
              />

              <div className="flex flex-col justify-center space-y-2">
                <h3 className="text-xl font-bold text-gray-900">
                  {transaction.post?.book?.title || "ไม่มีชื่อหนังสือ"}
                </h3>
                <p className="text-base text-gray-700">
                  <span className="font-semibold">ผู้เขียน:</span> {transaction.post?.book?.author}
                </p>
                <p className="text-base text-gray-700">
                  <span className="font-semibold">ผู้ขาย:</span> {transaction.seller?.firstName}{" "}
                  {transaction.seller?.lastName}
                </p>
                <p className="pt-1 text-sm text-gray-400">รหัสรายการ: {transaction.id}</p>
              </div>
            </div>

            {error && <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="rating" className="mb-1 block text-sm font-medium">
                  คะแนน
                </label>
                <div className="mb-4 flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                      <Star
                        className={`h-10 w-10 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
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
                  className="min-h-[160px] w-full rounded-md border p-3 text-base"
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
    </div>
  );
}
