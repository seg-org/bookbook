"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form-nac";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";

const sellerSchema = z.object({
  idCardNumber: z.string().min(13, "หมายเลขบัตรประชาชนต้องถูกต้อง"),
  bankAccount: z.string().min(10, "หมายเลขบัญชีต้องถูกต้อง"),
  bankName: z.string().min(2, "กรุณาระบุชื่อธนาคาร"),
  idCardImage: z
    .any()
    .refine((files) => files?.length === 1, "ต้องอัปโหลดรูปบัตรประชาชน")
    .refine((files) => files?.[0]?.size <= 5000000, "ขนาดไฟล์ต้องไม่เกิน 5MB")
    .refine(
      (files) => ["image/jpeg", "image/png", "image/jpg"].includes(files?.[0]?.type),
      "รองรับเฉพาะไฟล์ .jpg, .jpeg และ .png",
    ),
});

export function SellerRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof sellerSchema>>({
    resolver: zodResolver(sellerSchema),
    defaultValues: {
      idCardNumber: "",
      bankAccount: "",
      bankName: "",
      idCardImage: undefined as unknown as FileList,
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

      const response = await fetch("/api/auth/seller-registration", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "การลงทะเบียนล้มเหลว");
      }

      toast({
        title: "ส่งข้อมูลการลงทะเบียนแล้ว",
        description: "การลงทะเบียนของคุณกำลังรอการอนุมัติ",
      });

      router.push("/");
    } catch (error) {
      toast({
        title: "ข้อผิดพลาด",
        description: error instanceof Error ? error.message : "การลงทะเบียนล้มเหลว",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h2 className="text-center text-2xl font-bold">ลงทะเบียนผู้ขาย</h2>

      <Form form={form} onSubmit={onSubmit}>
        <Card className="space-y-4 p-4">
          <h3 className="font-semibold">ข้อมูลส่วนตัว</h3>
          <FormField
            name="idCardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>หมายเลขบัตรประชาชน</FormLabel>
                <Input {...field} disabled={isLoading} />
                <FormDescription>กรุณากรอกหมายเลขบัตรประชาชน 13 หลัก</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="idCardImage"
            render={() => (
              <FormItem>
                <FormLabel>รูปบัตรประชาชน</FormLabel>
                <Input type="file" accept="image/*" onChange={handleImageChange} disabled={isLoading} />
                <FormDescription>อัปโหลดรูปบัตรประชาชนที่ชัดเจน (ขนาดไม่เกิน 5MB)</FormDescription>
                {previewUrl && (
                  <div className="mt-2">
                    <Image
                      src={previewUrl}
                      alt="ตัวอย่างบัตรประชาชน"
                      width={300}
                      height={200}
                      className="h-auto max-w-full rounded-lg"
                    />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>

        <Card className="space-y-4 p-4">
          <h3 className="font-semibold">ข้อมูลธนาคาร</h3>
          <FormField
            name="bankAccount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>หมายเลขบัญชีธนาคาร</FormLabel>
                <Input {...field} disabled={isLoading} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="bankName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อธนาคาร</FormLabel>
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
              กำลังส่งข้อมูล...
            </>
          ) : (
            "ส่งข้อมูลการลงทะเบียน"
          )}
        </Button>
      </Form>
    </div>
  );
}
