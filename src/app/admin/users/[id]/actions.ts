"use server";

import { verifyAdmin } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

export async function banUser(formData: FormData) {
  "use server";

  await verifyAdmin();

  const userId = formData.get("userId")?.toString();
  const banUntil = formData.get("banUntil")?.toString();
  const banReason = formData.get("banReason")?.toString();

  if (!banUntil || !banReason) {
    throw new Error("กรุณากรอกข้อมูลให้ครบถ้วน");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      bannedUntil: new Date(banUntil),
      banReason,
    },
  });
}
