"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      router.push("/");
    } catch (error) {
      setError("Something went wrong: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-4">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Input name="email" type="email" placeholder="Email" disabled={isLoading} />
        </div>
        <div>
          <Input name="password" type="password" placeholder="Password" disabled={isLoading} />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
      <p className="text-center text-base">
        ไม่มีบัญชี?{" "}
        <Link href="/register" className="text-blue-500 hover:underline">
          ลงทะเบียน
        </Link>
      </p>
    </div>
  );
}
