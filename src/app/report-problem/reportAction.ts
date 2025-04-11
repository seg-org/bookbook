"use server";

import { unauthorized } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function submitGeneralReport(_: unknown, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id || session.expires < new Date().toISOString()) {
    unauthorized();
  }

  const problem = formData.get("problem") as string;
  const userId = session.user.id;

  if (!problem) {
    return { success: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน" };
  }

  try {
    await prisma.generalReport.create({
      data: {
        reporterId: userId,
        reason: problem,
      },
    });

    return { success: true, message: "ส่งรายงานปัญหาสำเร็จ ขอบคุณที่ใช้บริการ" };
  } catch (error) {
    console.error("Error submitting general report:", error);
    return { success: false, message: "ส่งรายงานปัญหาล้มเหลว กรุณาลองใหม่อีกครั้ง" };
  }
}
