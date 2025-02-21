"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Dialog, { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SellerInitiateTransaction() {
  const searchParams = useSearchParams();
  const encodedBookTitle = searchParams.get("bookTitle");
  const bookTitle = encodedBookTitle ? decodeURIComponent(encodedBookTitle) : "";
  const encodedPostId = searchParams.get("postId");
  const postId = encodedPostId ? decodeURIComponent(encodedPostId) : "";
  const encodedPostPriceString = searchParams.get("postPrice");
  const postPrice = encodedPostPriceString ? Number(decodeURIComponent(encodedPostPriceString)) : 0;

  const [selectedBook] = useState(bookTitle);
  const [negotiatedPrice] = useState(postPrice);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Validate form before submission
  const validateForm = () => {
    const newErrors: { selectedBook?: string } = {};
    if (!selectedBook) newErrors.selectedBook = "Select a book to sell.";
    return Object.keys(newErrors).length === 0;
  };

  // Simulate sending the transaction invitation
  const sendTransactionInvitation = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setOpenDialog(false);
    try {
      const encodedNegotiatedPrice = encodeURIComponent(negotiatedPrice);
      const encodedPostId = encodeURIComponent(postId);
      const encodedBookTitle = encodeURIComponent(selectedBook);
      router.push(`/checkout?amount=${encodedNegotiatedPrice}&postId=${encodedPostId}&bookTitle=${encodedBookTitle}`);
    } catch (error) {
      console.error("Error sending transaction invitation:", error);
      alert("Failed to send transaction invitation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <Card className="w-96 p-4">
        <CardContent>
          <h2 className="mb-4 text-xl font-bold">Buy this book</h2>
          <div className="mt-4">
            <label className="mb-1 block font-medium">Book Title</label>
            <p className="rounded border bg-gray-100 px-3 py-2">{bookTitle}</p>
          </div>
          <div className="mt-4">
            <label className="mb-1 block font-medium">Price (THB)</label>
            <p className="rounded border bg-gray-100 px-3 py-2">฿ {postPrice}</p>
          </div>
          <Button
            className="mt-4 w-full"
            onClick={() => {
              if (validateForm()) {
                setOpenDialog(true);
              }
            }}
            disabled={loading}
          >
            {loading ? "Processing..." : "BUY"}
          </Button>
        </CardContent>
      </Card>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Transaction Invitation</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to send this transaction invitation?</p>
          <p>
            <strong>Book Title:</strong> {selectedBook || "N/A"}
          </p>
          <p>
            <strong>Price (THB):</strong> {negotiatedPrice} THB
          </p>
          <DialogFooter>
            <Button onClick={() => setOpenDialog(false)} className="bg-gray-300 hover:bg-gray-400">
              Cancel
            </Button>
            <Button
              onClick={sendTransactionInvitation}
              disabled={loading || !selectedBook}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
