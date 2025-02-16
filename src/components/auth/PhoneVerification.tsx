"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function PhoneVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const code = formData.get("code");

      const response = await fetch("/api/auth/verify/phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error("Verification failed");
      }

      router.push("/pdpa-consent");
    } catch (error) {
      setError("Invalid verification code : " + { error });
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      const response = await fetch("/api/auth/resend/phone-code", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to resend code");
      }
    } catch (error) {
      setError("Failed to resend verification code : " + { error });
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-4">
      <p className="text-center text-gray-600">เราส่งรหัส OTP ไปที่เบอร์โทรศัพท์ของคุณ</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input name="code" type="text" placeholder="Enter 6-digit code" disabled={isLoading} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "กำลังยืนยัน..." : "ยืนยัน"}
        </Button>
      </form>
      <Button type="button" className="w-full" onClick={resendCode} disabled={isLoading}>
        ส่งรหัส OTP อีกครั้ง
      </Button>
    </div>
  );
}
