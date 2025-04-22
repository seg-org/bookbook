"use client";

import Image from "next/image";
import { useState } from "react";

import { getUrl } from "@/app/api/objects/s3";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sellerIdCardFolderName } from "@/constants/s3FolderName";
import { Seller } from "@/data/dto/user.dto";
import { useToast } from "@/hooks/useToast";

export function SellerVerificationList({ sellers }: { sellers: Seller[] }) {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleVerification = async (sellerId: string, approved: boolean) => {
    setLoading((prev) => ({ ...prev, [sellerId]: true }));

    try {
      const response = await fetch(`/api/admin/verify-seller/${sellerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerId, approved }),
      });

      if (!response.ok) {
        throw new Error("ไม่สามารถยืนยันผู้ขายได้");
      }

      toast({
        title: "สำเร็จ",
        description: `${approved ? "อนุมัติ" : "ปฏิเสธ"}ผู้ขายเรียบร้อยแล้ว`,
      });

      window.location.reload();
    } catch (error) {
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถดำเนินการยืนยันได้ : " + { error },
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
                <h3 className="mb-2 font-semibold">ข้อมูลส่วนตัว</h3>
                <p>เบอร์โทรศัพท์: {seller.user.phoneNumber}</p>
                <p>เลขบัตรประชาชน: {seller.idCardNumber}</p>
                <p>เลขบัญชีธนาคาร: {seller.bankAccount}</p>
                <p>ชื่อธนาคาร: {seller.bankName}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="mb-2 font-semibold">รูปบัตรประชาชน</h3>
                {seller.idCardImageKey ? (
                  <Image
                    src={getUrl(sellerIdCardFolderName, seller.idCardImageKey)}
                    alt="บัตรประชาชน"
                    width={500}
                    height={300}
                    className="max-w-md rounded-lg"
                  />
                ) : (
                  <p>กำลังโหลดรูปภาพ...</p>
                )}
              </div>
              <div className="flex space-x-4 md:col-span-2">
                <Button
                  onClick={() => handleVerification(seller.id, true)}
                  disabled={loading[seller.id]}
                  className="flex-1"
                >
                  {loading[seller.id] ? "กำลังดำเนินการ..." : "อนุมัติ"}
                </Button>
                <Button
                  onClick={() => handleVerification(seller.id, false)}
                  disabled={loading[seller.id]}
                  className="flex-1"
                >
                  {loading[seller.id] ? "กำลังดำเนินการ..." : "ปฏิเสธ"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
