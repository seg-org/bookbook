"use server";

import { verifyAdmin } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

export async function banUser(formData: FormData) {
  await verifyAdmin();

  const userId = formData.get("userId")?.toString();
  const banUntil = formData.get("banUntil")?.toString();
  const banReason = formData.get("banReason")?.toString();

  if (!userId || !banUntil || !banReason) {
    throw new Error("กรุณากรอกข้อมูลให้ครบถ้วน");
  }

  const banDate = new Date(banUntil);
  if (isNaN(banDate.getTime()) || banDate < new Date()) {
    throw new Error("วันที่แบนต้องเป็นวันที่ในอนาคต");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      bannedUntil: banDate,
      banReason,
    },
  });
}
