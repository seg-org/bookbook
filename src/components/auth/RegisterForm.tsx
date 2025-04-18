"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/Button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form-nac";
import { Input } from "@/components/ui/Input";

const registerSchema = z.object({
  firstName: z.string().min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร"),
  lastName: z.string().min(2, "นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
  phoneNumber: z.string().regex(/^\+?\d{1,14}$/, "หมายเลขโทรศัพท์ไม่ถูกต้อง"),
  address: z.string().min(10, "ที่อยู่ต้องมีอย่างน้อย 10 ตัวอักษร"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "คุณต้องยอมรับเงื่อนไขและข้อตกลง",
  }),
});

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      address: "",
      acceptTerms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "การลงทะเบียนล้มเหลว");
      }

      const loginResponse = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (loginResponse?.error) {
        throw new Error(loginResponse.error);
      }

      router.push("/verify/email");
    } catch (error) {
      setErrorMessage(error as string);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form form={form} onSubmit={onSubmit}>
      {errorMessage && <p className="mb-2 text-sm text-red-500">{errorMessage}</p>}

      <FormField
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ชื่อ</FormLabel>
            <Input {...field} disabled={isLoading} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>นามสกุล</FormLabel>
            <Input {...field} disabled={isLoading} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>อีเมล</FormLabel>
            <Input {...field} type="email" disabled={isLoading} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>รหัสผ่าน</FormLabel>
            <Input {...field} type="password" disabled={isLoading} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>เบอร์โทรศัพท์</FormLabel>
            <Input {...field} type="tel" disabled={isLoading} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ที่อยู่</FormLabel>
            <Input {...field} disabled={isLoading} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="acceptTerms"
        render={({ field }) => (
          <FormItem className="flex items-baseline gap-2 py-2">
            <Input
              type="checkbox"
              checked={field.value}
              onChange={field.onChange}
              disabled={isLoading}
              className="h-3 w-3"
            />
            <FormLabel>ฉันยอมรับเงื่อนไขและข้อตกลง</FormLabel>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "กำลังลงทะเบียน..." : "ลงทะเบียน"}
      </Button>
    </Form>
  );
}
