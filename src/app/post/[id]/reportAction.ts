"use server";

import { unauthorized } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function submitPostReport(_: unknown, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id || session.expires < new Date().toISOString()) {
    unauthorized();
  }

  const postId = formData.get("postId") as string;
  const reason = formData.get("reason") as string;
  const userId = session.user.id;

  if (!postId) {
    return { success: false, message: "ไม่พบโพสต์ดังกล่าว" };
  }

  if (!reason) {
    return { success: false, message: "กรุณากรอกข้อมูลให้ครบถ้วน" };
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return { success: false, message: "ไม่พบโพสต์ดังกล่าว" };
    }

    if (post.sellerId === userId) {
      return { success: false, message: "ไม่สามารถรายงานโพสต์ของตัวเองได้" };
    }

    await prisma.postReport.create({
      data: {
        reporterId: userId,
        postId: postId,
        reason: reason,
      },
    });

    return { success: true, message: "ส่งรายงานปัญหาสำเร็จ ทางทีมงานจะตรวจสอบโดยเร็วที่สุด" };
  } catch (error) {
    console.error("Error submitting post report:", error);
    return { success: false, message: "ส่งรายงานปัญหาล้มเหลว กรุณาลองใหม่อีกครั้ง" };
  }
}
