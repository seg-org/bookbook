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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import { sellerIdCardFolderName } from "@/constants/s3FolderName";
import { getObjectUrl, putObject } from "@/data/object";
import { useToast } from "@/hooks/useToast";

const sellerSchema = z.object({
  idCardNumber: z.string().min(13, "หมายเลขบัตรประชาชนต้องถูกต้อง"),
  bankAccount: z.string().min(10, "หมายเลขบัญชีต้องถูกต้อง"),
  bankName: z.string().min(2, "กรุณาระบุชื่อธนาคาร"),
  idCardImageKey: z.string().min(1, "ต้องอัปโหลดรูปบัตรประชาชน"),
});

type SellerFormData = z.infer<typeof sellerSchema>;

export function SellerRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<SellerFormData>({
    resolver: zodResolver(sellerSchema),
    defaultValues: {
      idCardNumber: "",
      bankAccount: "",
      bankName: "",
      idCardImageKey: "",
    },
  });

  const handleIdCardUpload = async (file: File) => {
    if (file.size > 5000000) {
      setUploadError("ขนาดไฟล์ต้องไม่เกิน 5MB");
      form.resetField("idCardImageKey");
      setImageUrl(null);
      return;
    }
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setUploadError("รองรับเฉพาะไฟล์ .jpg, .jpeg และ .png");
      form.resetField("idCardImageKey");
      setImageUrl(null);
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setImageUrl(null);

    try {
      const uploadedImage = await putObject(file, sellerIdCardFolderName);

      if (uploadedImage instanceof Error) {
        console.error("Upload Error:", uploadedImage);
        throw new Error("Failed to upload ID card image");
      }

      const getObjectRes = await getObjectUrl(uploadedImage.key, uploadedImage.folder);
      if (getObjectRes instanceof Error) {
        console.error("Get URL Error:", getObjectRes);
        throw new Error("Failed to get image URL after upload");
      }

      form.setValue("idCardImageKey", uploadedImage.key, { shouldValidate: true });
      setImageUrl(getObjectRes.signedUrl);
    } catch (error) {
      console.error("Error uploading ID card:", error);
      const message = error instanceof Error ? error.message : "An unknown error occurred during upload.";
      setUploadError(message);
      form.setValue("idCardImageKey", "");
      form.trigger("idCardImageKey");
    } finally {
      setIsUploading(false);
    }
  };

  async function onSubmit(values: SellerFormData) {
    if (!values.idCardImageKey || isUploading) {
      toast({
        title: "ข้อผิดพลาด",
        description: "กรุณารอการอัปโหลดรูปภาพให้เสร็จสิ้น หรือ อัปโหลดรูปภาพก่อน",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/seller-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "การลงทะเบียนล้มเหลว");
      }

      toast({
        title: "ส่งข้อมูลการลงทะเบียนแล้ว",
        description: result.message || "การลงทะเบียนของคุณกำลังรอการอนุมัติ",
      });

      router.push("/");
    } catch (error) {
      toast({
        title: "ข้อผิดพลาดในการส่งข้อมูล",
        description: error instanceof Error ? error.message : "การลงทะเบียนล้มเหลว",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card className="space-y-4 p-4">
            <h3 className="font-semibold">ข้อมูลส่วนตัว</h3>
            <FormField
              control={form.control}
              name="idCardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>หมายเลขบัตรประชาชน</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading || isUploading} />
                  </FormControl>
                  <FormDescription>กรุณากรอกหมายเลขบัตรประชาชน 13 หลัก</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>รูปบัตรประชาชน</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/jpeg, image/png, image/jpg"
                  disabled={isLoading || isUploading}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleIdCardUpload(e.target.files[0]);
                    } else {
                      form.setValue("idCardImageKey", "");
                      setImageUrl(null);
                      setUploadError(null);
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                อัปโหลดรูปบัตรประชาชนที่ชัดเจน (ขนาดไม่เกิน 5MB, เฉพาะ .jpg, .jpeg, .png)
              </FormDescription>
              {isUploading && (
                <div className="mt-2 flex items-center text-sm text-blue-600">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  กำลังอัปโหลด...
                </div>
              )}
              {uploadError && <p className="mt-1 text-sm text-red-600">{uploadError}</p>}
              <FormMessage>{form.formState.errors.idCardImageKey?.message}</FormMessage>
              {imageUrl && !isUploading && !uploadError && (
                <div className="mt-2">
                  <Image
                    src={imageUrl}
                    alt="ตัวอย่างบัตรประชาชน"
                    width={300}
                    height={200}
                    className="h-auto max-w-full rounded-lg border"
                  />
                </div>
              )}
            </FormItem>
          </Card>

          <Card className="space-y-4 p-4">
            <h3 className="font-semibold">ข้อมูลธนาคาร</h3>
            <FormField
              control={form.control}
              name="bankAccount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>หมายเลขบัญชีธนาคาร</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading || isUploading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อธนาคาร</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading || isUploading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>

          <Button type="submit" className="w-full" disabled={isLoading || isUploading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                กำลังส่งข้อมูล...
              </>
            ) : (
              "ส่งข้อมูลการลงทะเบียน"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
