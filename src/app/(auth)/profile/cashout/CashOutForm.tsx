"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

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
      }
    | null
    | undefined;
};

const CashOutFormSchema = z.object({
  bankAccount: z.string().min(10, "เลขบัญชีต้องมี 10 หลัก"),
  bankName: z.string().min(1, "กรุณาเลือกธนาคาร"),
  amount: z.number().min(100, "จำนวนเงินขั้นต่ำในการถอนคือ 100 บาท"),
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

  return (
    <div className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-semibold">ถอนเงิน</h2>
      <Form {...form}>
        <form className="space-y-4">
          <div>
            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
              ธนาคาร
            </label>
            <Select onValueChange={(value) => form.setValue("bankName", value)}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกธนาคาร" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ธนาคารกรุงเทพ">ธนาคารกรุงเทพ</SelectItem>
                <SelectItem value="ธนาคารกสิกรไทย">ธนาคารกสิกรไทย</SelectItem>
                <SelectItem value="ธนาคารไทยพาณิชย์">ธนาคารไทยพาณิชย์</SelectItem>
                {/* Add more banks as needed */}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700">
              เลขบัญชี
            </label>
            <Input
              id="bankAccount"
              placeholder="เลขบัญชี"
              {...form.register("bankAccount")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
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

          <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600">
            ถอนเงิน
          </Button>
        </form>
      </Form>
    </div>
  );
}
