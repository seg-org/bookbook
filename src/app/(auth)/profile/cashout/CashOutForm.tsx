"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Form, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";

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

const CashOutFormSchema = z.object({
  bankAccount: z.string().min(10, "เลขบัญชีต้องมี 10 หลัก"),
  bankName: z.string().min(1, "กรุณาเลือกธนาคาร"),
  amount: z
    .string()
    .min(1, "กรุณากรอกจำนวนเงิน")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), { message: "จำนวนเงินต้องเป็นตัวเลข" })
    .refine((val) => val >= 100, { message: "จำนวนเงินขั้นต่ำในการถอนคือ 100 บาท" }),
});

type CashOutFormData = z.infer<typeof CashOutFormSchema>;

export function CashOutForm({ initialData }: { initialData: UserProfile }) {
  const form = useForm<CashOutFormData>({
    resolver: zodResolver(CashOutFormSchema),
    defaultValues: {
      bankAccount: initialData.sellerProfile?.bankAccount || "",
      bankName: initialData.sellerProfile?.bankName || "",
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  async function onSubmit(data: CashOutFormData, initialData: UserProfile, form: UseFormReturn<CashOutFormData>) {
    const balance = initialData.sellerProfile?.balance ?? 0;

    if (data.amount > balance) {
      form.setError("amount", {
        type: "manual",
        message: "ยอดเงินในบัญชีไม่เพียงพอ",
      });
      return;
    }

    try {
      const response = await fetch(`/api/profile/seller/balance/${initialData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          diff: -data.amount,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();

        form.setError("amount", {
          type: "manual",
          message: "การถอนเงินล้มเหลว",
        });
      }
      toast({
        title: "ถอนเงินสำเร็จ",
        description: `คุณได้ถอนเงินจำนวน ${data.amount} บาท`,
      });

      alert("ถอนเงินสำเร็จ");
      router.push("/profile");
    } catch {
      form.setError("amount", {
        type: "manual",
        message: "การถอนเงินล้มเหลว",
      });
      toast({
        title: "Error",
        description: "การถอนเงินล้มเหลว",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-semibold">ถอนเงิน</h2>
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((data: CashOutFormData) => onSubmit(data, initialData, form))}
        >
          <div className="block text-sm font-medium">ยอดเงินในบัญชี</div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-6xl text-orange-500"> ฿ {initialData.sellerProfile?.balance}</p>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
              ธนาคาร
            </label>
            <FormControl>
              <Input readOnly id="bankName" placeholder="ธนาคาร" {...form.register("bankName")} />
            </FormControl>
          </div>
          <div>
            <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700">
              เลขบัญชี
            </label>
            <Input readOnly id="bankAccount" placeholder="เลขบัญชี" {...form.register("bankAccount")} />
            {form.formState.errors.bankAccount && (
              <p className="mt-2 text-sm text-red-600">{form.formState.errors.bankAccount.message}</p>
            )}
          </div>
          {/*จำนวนเงินที่ถอน*/}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              จำนวนเงินที่ถอน
            </label>
            <Input
              id="amount"
              type="number"
              placeholder="จำนวนเงินที่ถอน"
              {...form.register("amount")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {form.formState.errors.amount && (
            <p className="mt-2 text-sm text-red-600">{form.formState.errors.amount.message}</p>
          )}

          <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600">
            ถอนเงิน
          </Button>
        </form>
      </Form>
    </div>
  );
}
