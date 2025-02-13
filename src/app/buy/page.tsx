"use client";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import Dialog, { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { useRouter, useSearchParams } from "next/navigation";
import path from "path";
import { useState } from "react";

export default function SellerInitiateTransaction() {
  const searchParms = useSearchParams();
  const encodedBookTitle = searchParms.get("bookTitle");
  const bookTitle = encodedBookTitle ? decodeURIComponent(encodedBookTitle) : "";
  const encodedPostId = searchParms.get("postId");
  const postId = encodedPostId ? decodeURIComponent(encodedPostId) : "";
  const encodedPostPriceString = searchParms.get("postPrice");
  const postPrice = encodedPostPriceString ? Number(decodeURIComponent(encodedPostPriceString)) : 0;

  const [selectedBook, setSelectedBook] = useState(bookTitle);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [negotiatedPrice, setNegotiatedPrice] = useState(postPrice);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    selectedBook?: string;
    buyerEmail?: string;
    negotiatedPrice?: string;
  }>({});
  const router = useRouter();

  // Validate form before submission
  const validateForm = () => {
    const newErrors: { selectedBook?: string; negotiatedPrice?: number } = {};
    if (!selectedBook) newErrors.selectedBook = "Select a book to sell.";
    return Object.keys(newErrors).length === 0;
  };

  // Simulate sending the transaction invitation
  // Simulate sending the transaction invitation
  const sendTransactionInvitation = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setOpenDialog(false);
    try {
      const encodedNegotiatedPrice = encodeURIComponent(negotiatedPrice);
      const encodedSellerEmail = encodeURIComponent(buyerEmail);
      const encodedPostId = encodeURIComponent(postId);
      const encodedBookTitle = encodeURIComponent(selectedBook);
      router.push(`/checkout?amount=${encodedNegotiatedPrice}&email=${encodedSellerEmail}&postId=${encodedPostId}&bookTitle=${encodedBookTitle}`);
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

          {/* Select Book (native dropdown) */}
          <div className="mt-4">
            <label className="mb-1 block font-medium">Book Title</label>
            <p className="px-3 py-2 border rounded bg-gray-100">{bookTitle}</p>
            {errors.selectedBook && <p className="text-sm text-red-500">{errors.selectedBook}</p>}
          </div>

          {/* Negotiated Price Input */}
          <div className="mt-4">
            <label className="mb-1 block font-medium">Price (THB)</label>
            <p className="px-3 py-2 border rounded bg-gray-100">฿ {postPrice}</p>
            {errors.negotiatedPrice && <p className="text-sm text-red-500">{errors.negotiatedPrice}</p>}
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

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Transaction Invitation</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to send this transaction invitation?</p>
          <p>
            <strong>Book Title:</strong> {selectedBook ? selectedBook : "N/A"}
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