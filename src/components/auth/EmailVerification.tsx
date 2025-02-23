"use client";

import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function EmailVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user?.email) {
        setEmail(session.user.email);
      } else {
        setError("ไม่พบอีเมล กรุณาเข้าสู่ระบบอีกครั้ง");
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    if (email) {
      const sendVerificationEmail = async () => {
        try {
          const response = await fetch("/api/auth/resend/email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to send verification email");
          }
        } catch (error) {
          setError(`ไม่สามารถส่งอีเมลยืนยันได้: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      };

      sendVerificationEmail();
    }
  }, [email]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const token = formData.get("token");

      if (!email) {
        throw new Error("ไม่พบอีเมล");
      }

      const response = await fetch("/api/auth/verify/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "การยืนยันล้มเหลว");
      }

      router.push("/verify/phone");
    } catch (error) {
      setError(`รหัสยืนยันไม่ถูกต้อง: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async () => {
    try {
      if (!email) {
        throw new Error("ไม่พบอีเมล");
      }

      const response = await fetch("/api/auth/resend/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "ไม่สามารถส่งอีเมลยืนยันได้");
      }
    } catch (error) {
      setError(`ไม่สามารถส่งอีเมลยืนยันได้: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h2 className="text-center text-2xl font-bold">ยืนยันอีเมล</h2>
      {email ? (
        <p className="text-center text-gray-600">เราส่งอีเมลยืนยันให้ท่านที่ {email}</p>
      ) : (
        <p className="text-center text-gray-600">ไม่พบอีเมล กรุณาเข้าสู่ระบบอีกครั้ง</p>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <Input name="token" type="text" placeholder="กรอกรหัสยืนยัน" disabled={isLoading} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "กำลังยืนยัน..." : "ยืนยัน"}
        </Button>
      </form>
      {email && (
        <Button type="button" className="w-full" onClick={resendVerification} disabled={isLoading}>
          ส่งรหัสยืนยันอีกครั้ง
        </Button>
      )}
    </div>
  );
}
