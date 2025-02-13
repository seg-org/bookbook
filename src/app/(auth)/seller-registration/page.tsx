"use client";

import { SellerRegistration } from "@/components/auth/SellerRegistration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SellerRegistrationPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">ลงทะเบียนผู้ขาย</CardTitle>
        </CardHeader>
        <CardContent>
          <SellerRegistration />
        </CardContent>
      </Card>
    </main>
  );
}
