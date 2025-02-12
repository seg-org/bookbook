"use client";

import { Button } from "@/components/ui/Button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phoneNumber: z.string().regex(/^\+?\d{1,14}$/, "Invalid phone number"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      router.push("/verify?email=" + encodeURIComponent(values.email));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  console.log("FORM", form);

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FormField
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <Input {...field} disabled={isLoading} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <Input {...field} disabled={isLoading} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <Input {...field} type="email" disabled={isLoading} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <Input {...field} type="password" disabled={isLoading} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <Input {...field} type="tel" disabled={isLoading} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <Input {...field} disabled={isLoading} />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="acceptTerms"
        render={({ field }) => (
          <FormItem className="flex items-center space-x-2">
            <Input
              type="checkbox"
              checked={field.value}
              onChange={field.onChange}
              disabled={isLoading}
              className="h-4 w-4"
            />
            <FormLabel>I accept the terms and conditions</FormLabel>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Registering..." : "Register"}
      </Button>
    </Form>
  );
}
