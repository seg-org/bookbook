"use client";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import Dialog, { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Mock seller's books
const mockBooks = [
  { id: "book1", title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 250 },
  { id: "book2", title: "1984", author: "George Orwell", price: 200 },
];

export default function SellerInitiateTransaction() {
  const [selectedBook, setSelectedBook] = useState("");
  const [buyerEmail, setBuyerEmail] = useState(""); // Buyer email input
  const [negotiatedPrice, setNegotiatedPrice] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ selectedBook?: string; buyerEmail?: string; negotiatedPrice?: string }>({});
  const router = useRouter();

  // ✅ Validate form before submission
  const validateForm = () => {
    let newErrors: { selectedBook?: string; buyerEmail?: string; negotiatedPrice?: string } = {};
    if (!selectedBook) newErrors.selectedBook = "Select a book to sell.";
    if (!buyerEmail || !buyerEmail.includes("@")) newErrors.buyerEmail = "Enter a valid buyer email.";
    if (!negotiatedPrice || isNaN(Number(negotiatedPrice)) || Number(negotiatedPrice) <= 0)
      newErrors.negotiatedPrice = "Enter a valid negotiated price.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit Transaction Invitation API Call
  const sendTransactionInvitation = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setOpenDialog(false);

    try {
      const response = await axios.post("/api/transaction/invite", {
        sellerId: "user456", // Mock seller ID (Replace with actual logged-in seller ID)
        buyerEmail, // Now sending email instead of buyer ID
        bookId: selectedBook,
        negotiatedPrice: Number(negotiatedPrice),
        status: "PENDING_BUYER_CONFIRMATION", // Buyer must confirm before proceeding
      });

      if (response.status === 201) {
        alert("Transaction invitation sent successfully!");
        router.push("/transactionHistoryPage"); // Redirect to transaction history
      }
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

          {/* Select Book */}
          <div className="mt-4">
            <label className="mb-1 block font-medium">Select Book</label>
            <Select onValueChange={setSelectedBook}>
              <SelectTrigger>
                <SelectValue placeholder="Select a book" />
              </SelectTrigger>
              <SelectContent>
                {mockBooks.map((book) => (
                  <SelectItem key={book.id} value={book.id}>
                    {book.title} - {book.author} ({book.price} THB)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.selectedBook && <p className="text-sm text-red-500">{errors.selectedBook}</p>}
          </div>

          {/* Buyer Email Input */}
          <div className="mt-4">
            <label className="mb-1 block font-medium">Buyer Email</label>
            <Input
              type="email"
              placeholder="Enter buyer's email"
              value={buyerEmail}
              onChange={(e) => setBuyerEmail(e.target.value)}
            />
            {errors.buyerEmail && <p className="text-sm text-red-500">{errors.buyerEmail}</p>}
          </div>

          {/* Negotiated Price */}
          <div className="mt-4">
            <label className="mb-1 block font-medium">Final Agreed Price (THB)</label>
            <Input
              type="number"
              placeholder="Enter negotiated price..."
              value={negotiatedPrice}
              onChange={(e) => setNegotiatedPrice(e.target.value)}
            />
            {errors.negotiatedPrice && <p className="text-sm text-red-500">{errors.negotiatedPrice}</p>}
          </div>

          <Button className="mt-4 w-full" onClick={() => setOpenDialog(true)} disabled={loading}>
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
            <strong>Book:</strong> {mockBooks.find((b) => b.id === selectedBook)?.title}
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
              disabled={loading}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
