import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import GeneralReportForm from "./ReportForm";

export default async function ReportGeneralProblemPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user.id || session.expires < new Date().toISOString()) {
    redirect("/login");
  }

  return (
    <main className="m-4 mx-auto w-screen max-w-4xl rounded-xl bg-white p-4 shadow-lg">
      <h1 className="text-2xl font-bold">แจ้งปัญหาการใช้งาน</h1>
      <p>แจ้งปัญหาอื่น ๆ ที่ไม่เกี่ยวกับผู้ใช้อื่น</p>

      <GeneralReportForm />
    </main>
  );
}
