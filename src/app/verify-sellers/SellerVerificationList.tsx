"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";

type Seller = {
  id: string;
  idCardNumber: string;
  idCardImageKey: string;
  bankAccount: string;
  bankName: string;
  user: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
  };
};

export function SellerVerificationList({ sellers }: { sellers: Seller[] }) {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleVerification = async (sellerId: string, approved: boolean) => {
    setLoading((prev) => ({ ...prev, [sellerId]: true }));

    try {
      const response = await fetch("/api/admin/verify-seller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerId, approved }),
      });

      if (!response.ok) {
        throw new Error("Failed to verify seller");
      }

      toast({
        title: "Success",
        description: `Seller ${approved ? "approved" : "rejected"} successfully`,
      });

      // Refresh the page to update the list
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process verification : " + { error },
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [sellerId]: false }));
    }
  };

  return (
    <div className="space-y-4">
      {sellers.map((seller) => (
        <Card key={seller.id}>
          <CardHeader>
            <CardTitle>{seller.user.email}</CardTitle>
            <CardDescription>
              {seller.user.firstName} {seller.user.lastName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold">Personal Information</h3>
                <p>Phone: {seller.user.phoneNumber}</p>
                <p>ID Card: {seller.idCardNumber}</p>
                <p>Bank Account: {seller.bankAccount}</p>
                <p>Bank Name: {seller.bankName}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="mb-2 font-semibold">ID Card Image</h3>
                <Image src={seller.idCardImageKey} alt="ID Card" className="max-w-md rounded-lg" />
              </div>
              <div className="flex space-x-4 md:col-span-2">
                <Button
                  onClick={() => handleVerification(seller.id, true)}
                  disabled={loading[seller.id]}
                  className="flex-1"
                >
                  {loading[seller.id] ? "Processing..." : "Approve"}
                </Button>
                <Button
                  onClick={() => handleVerification(seller.id, false)}
                  disabled={loading[seller.id]}
                  className="flex-1"
                >
                  {loading[seller.id] ? "Processing..." : "Reject"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
