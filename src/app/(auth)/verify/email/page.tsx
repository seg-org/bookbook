"use client";

import { EmailVerification } from "@/components/auth/EmailVerification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">ยืนยันอีเมล</CardTitle>
        </CardHeader>
        <CardContent>
          <EmailVerification />
        </CardContent>
      </Card>
    </main>
  );
}
