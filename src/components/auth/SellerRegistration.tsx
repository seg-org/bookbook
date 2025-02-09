"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const sellerSchema = z.object({
  idCardNumber: z.string().min(13, "ID card number must be valid"),
  bankAccount: z.string().min(10, "Bank account number must be valid"),
  bankName: z.string().min(2, "Bank name is required"),
  idCardImage: z
    .any()
    .refine((files) => files?.length === 1, "ID card image is required")
    .refine((files) => files?.[0]?.size <= 5000000, "Image must be less than 5MB")
    .refine(
      (files) => ["image/jpeg", "image/png", "image/jpg"].includes(files?.[0]?.type),
      "Only .jpg, .jpeg, and .png formats are supported"
    ),
  shopName: z.string().min(2, "Shop name is required"),
  shopDescription: z.string().min(10, "Shop description must be at least 10 characters"),
});

export function SellerRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(sellerSchema),
    defaultValues: {
      idCardNumber: "",
      bankAccount: "",
      bankName: "",
      idCardImage: undefined,
      shopName: "",
      shopDescription: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("idCardImage", e.target.files);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof sellerSchema>) {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("idCardNumber", values.idCardNumber);
      formData.append("bankAccount", values.bankAccount);
      formData.append("bankName", values.bankName);
      formData.append("idCardImage", values.idCardImage[0]);
      formData.append("shopName", values.shopName);
      formData.append("shopDescription", values.shopDescription);

      const response = await fetch("/api/auth/seller-registration", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      toast({
        title: "Registration submitted",
        description: "Your seller registration is pending approval.",
      });

      router.push("/dashboard?status=pending-approval");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Registration failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h2 className="text-center text-2xl font-bold">Seller Registration</h2>
      <Form form={form} onSubmit={onSubmit}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="space-y-4 p-4">
            <h3 className="font-semibold">Shop Information</h3>
            <FormField
              control={form.control}
              name="shopName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop Name</FormLabel>
                  <Input {...field} disabled={isLoading} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shopDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop Description</FormLabel>
                  <Input {...field} disabled={isLoading} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>

          <Card className="space-y-4 p-4">
            <h3 className="font-semibold">Personal Information</h3>
            <FormField
              control={form.control}
              name="idCardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Card Number</FormLabel>
                  <Input {...field} disabled={isLoading} />
                  <FormDescription>Enter your 13-digit national ID number</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idCardImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Card Image</FormLabel>
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleImageChange}
                    disabled={isLoading}
                  />
                  <FormDescription>Upload a clear photo of your ID card (max 5MB)</FormDescription>
                  {previewUrl && (
                    <div className="mt-2">
                      <img src={previewUrl} alt="ID Card Preview" className="h-auto max-w-full rounded-lg" />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>

          <Card className="space-y-4 p-4">
            <h3 className="font-semibold">Bank Information</h3>
            <FormField
              control={form.control}
              name="bankAccount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Account Number</FormLabel>
                  <Input {...field} disabled={isLoading} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <Input {...field} disabled={isLoading} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Registration"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
