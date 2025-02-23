"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import Dialog, { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";

export default function SellerInitiateTransaction() {
  const [selectedBook, setSelectedBook] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [negotiatedPrice, setNegotiatedPrice] = useState("");
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
    const newErrors: { selectedBook?: string; buyerEmail?: string; negotiatedPrice?: string } = {};
    if (!selectedBook) newErrors.selectedBook = "Select a book to sell.";
    if (!buyerEmail || !buyerEmail.includes("@")) {
      newErrors.buyerEmail = "Enter a valid buyer email.";
    }
    if (!negotiatedPrice || isNaN(Number(negotiatedPrice)) || Number(negotiatedPrice) <= 0) {
      newErrors.negotiatedPrice = "Enter a valid negotiated price.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Simulate sending the transaction invitation
  const sendTransactionInvitation = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setOpenDialog(false);
    try {
      alert(`Transaction invitation sent for book: The Great Gatsby - F. Scott Fitzgerald`);
      router.push("/");
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
          <h2 className="mb-4 text-xl font-bold">Initiate Transaction</h2>

          {/* Select Book (native dropdown) */}
          <div className="mt-4">
            <label className="mb-1 block font-medium">Select Book</label>
            <select
              className="w-full rounded-lg border px-3 py-2"
              value={selectedBook}
              onChange={(e) => {
                setSelectedBook(e.target.value);
                setErrors((prev) => ({ ...prev, selectedBook: undefined }));
              }}
            >
              <option value="">Select a book</option>
              <option value="theGreatGatsby">The Great Gatsby - F. Scott Fitzgerald</option>
            </select>
            {errors.selectedBook && <p className="text-sm text-red-500">{errors.selectedBook}</p>}
          </div>

          {/* Buyer Email Input */}
          <div className="mt-4">
            <label className="mb-1 block font-medium">Buyer Email</label>
            <Input
              type="email"
              placeholder="Enter buyer's email"
              value={buyerEmail}
              onChange={(e) => {
                setBuyerEmail(e.target.value);
                setErrors((prev) => ({ ...prev, buyerEmail: undefined }));
              }}
            />
            {errors.buyerEmail && <p className="text-sm text-red-500">{errors.buyerEmail}</p>}
          </div>

          {/* Negotiated Price Input */}
          <div className="mt-4">
            <label className="mb-1 block font-medium">Final Agreed Price (THB)</label>
            <Input
              type="number"
              placeholder="Enter negotiated price..."
              value={negotiatedPrice}
              onChange={(e) => {
                setNegotiatedPrice(e.target.value);
                setErrors((prev) => ({ ...prev, negotiatedPrice: undefined }));
              }}
            />
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
            {loading ? "Processing..." : "Send Invitation"}
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
            <strong>Book:</strong> {selectedBook ? "The Great Gatsby - F. Scott Fitzgerald" : "N/A"}
          </p>
          <p>
            <strong>Agreed Price:</strong> {negotiatedPrice} THB
          </p>
          <p>
            <strong>Buyer Email:</strong> {buyerEmail}
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