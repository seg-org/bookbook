"use client";

import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/CheckBox";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function PDPAConsent() {
  const [isLoading, setIsLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/pdpa-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accepted }),
      });

      if (!response.ok) {
        throw new Error("บันทึกการยินยอมล้มเหลว");
      }

      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="prose prose-sm">
        <h3>การเก็บรวบรวมข้อมูลส่วนบุคคล</h3>
        <p>
          เราจะเก็บรวบรวมข้อมูลส่วนบุคคลของท่าน เช่น ชื่อ ข้อมูลติดต่อ และข้อมูลระบุตัวตน เพื่อใช้ในการให้บริการของเรา
        </p>

        <h3>การใช้ข้อมูลส่วนบุคคล</h3>
        <p>
          ข้อมูลส่วนบุคคลของท่านจะถูกนำไปใช้เพื่อ: - การสร้างและจัดการบัญชีผู้ใช้ - การยืนยันตัวตน - การดำเนินธุรกรรม -
          การติดต่อเกี่ยวกับบริการของเรา - การปฏิบัติตามกฎหมายและข้อบังคับ
        </p>

        <h3>การเปิดเผยข้อมูลส่วนบุคคล</h3>
        <p>
          เราอาจเปิดเผยข้อมูลส่วนบุคคลของท่านให้กับ: - ผู้ให้บริการและพันธมิตร - หน่วยงานกฎหมายเมื่อจำเป็นตามกฎหมาย -
          ผู้ใช้รายอื่น (จำกัดเฉพาะข้อมูลที่จำเป็นต่อธุรกรรม)
        </p>

        <h3>สิทธิของท่าน</h3>
        <p>
          ท่านมีสิทธิที่จะ: - ขอเข้าถึงข้อมูลส่วนบุคคลของท่าน - ขอแก้ไขข้อมูลของท่าน - ถอนความยินยอม -
          ขอให้ลบข้อมูลของท่าน (ภายใต้ข้อกำหนดทางกฎหมาย)
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="consent" checked={accepted} onCheckedChange={(checked) => setAccepted(checked as boolean)} />
          <label htmlFor="consent" className="text-sm">
            ข้าพเจ้าได้อ่านและยอมรับการเก็บรวบรวม การใช้ และการเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้าตามที่ระบุไว้ข้างต้น
          </label>
        </div>

        <Button type="submit" disabled={!accepted || isLoading} className="w-full">
          {isLoading ? "กำลังบันทึก..." : "ยอมรับและดำเนินการต่อ"}
        </Button>
      </form>
    </div>
  );
}
