"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form-nac";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";

const userFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  address: z.string().nullable(),
});

const sellerFormSchema = z.object({
  bankAccount: z.string(),
  bankName: z.string(),
  idCardNumber: z.string(),
});

type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  address: string | null;
  isSeller: boolean;
  sellerProfile?:
    | {
        id: string;
        bankAccount: string;
        bankName: string;
        idCardNumber: string;
        idCardImageKey: string;
        idCardImageUrl: string;
        isApproved: boolean;
        balance: number;
      }
    | null
    | undefined;
};

export function ProfileForm({ initialData }: { initialData: UserProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: initialData.email,
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      phoneNumber: initialData.phoneNumber,
      address: initialData.address,
    },
  });

  const sellerForm = useForm({
    resolver: zodResolver(sellerFormSchema),
    defaultValues: initialData.sellerProfile
      ? {
          bankAccount: initialData.sellerProfile.bankAccount,
          bankName: initialData.sellerProfile.bankName,
          idCardNumber: initialData.sellerProfile.idCardNumber,
        }
      : undefined,
  });

  async function onSubmit(data: z.infer<typeof userFormSchema>) {
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile :" + { error },
        variant: "destructive",
      });
    }
  }

  async function onSellerSubmit(data: z.infer<typeof sellerFormSchema>) {
    try {
      const response = await fetch(`/api/admin/users/${initialData.id}/sellerProfile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update seller profile");

      toast({
        title: "Success",
        description: "Seller profile updated successfully",
      });
      setIsEditing(false);
      alert("โปรไฟล์ผู้ขายถูกระงับเรียบร้อย");
      router.push("/admin/users");
    } catch (error) {
      console.error("Error updating seller profile:", error);
      toast({
        title: "Error",
        description: "Failed to update seller profile : " + { error },
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>ข้อมูลส่วนตัว</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Form form={form} onSubmit={onSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>อีเมล</FormLabel>
                    <Input {...field} disabled={true} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อจริง</FormLabel>
                    <Input {...field} disabled={true} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>นามสกุล</FormLabel>
                    <Input {...field} disabled={true} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>เบอร์โทรศัพท์</FormLabel>
                    <Input {...field} value={field.value || ""} disabled={true} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ที่อยู่</FormLabel>
                    <Input {...field} value={field.value || ""} disabled={true} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isEditing && <Button type="submit">บันทึก</Button>}
          </Form>
        </CardContent>
      </Card>

      {initialData.isSeller && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลผู้ขาย</CardTitle>
            </CardHeader>
            <CardContent>
              <Form form={sellerForm} onSubmit={onSellerSubmit}>
                <FormField
                  name="bankAccount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>บัญชีธนาคาร</FormLabel>
                      <Input {...field} disabled={false} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ชื่อธนาคาร</FormLabel>
                      <Input {...field} disabled={false} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="idCardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>เลขบัตรประชาชน</FormLabel>
                      <Input {...field} disabled={false} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {initialData.sellerProfile?.idCardImageKey && (
                  <div>
                    <FormLabel>รูปถ่ายบัตรประชาชน</FormLabel>
                    <Image
                      src={initialData.sellerProfile.idCardImageUrl}
                      width={300}
                      height={200}
                      alt="ID Card"
                      className="mt-2 max-w-md rounded-lg"
                    />
                  </div>
                )}

                {isEditing && <Button type="submit">บันทึกข้อมูลผู้ขาย</Button>}
                {/* Make icon big at the left column and other information at right column */}
                <div className="mt-4 flex flex-col items-center justify-center">
                  {/*If balance >= 100 show ถอนเงิน else ขั้นต่ำ*/}
                  <Button className="h-10 w-60 bg-red-500 hover:bg-red-600" type="submit">
                    ระงับบัญชีผู้ขาย
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
