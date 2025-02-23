import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { token, email } = await req.json();

    if (!token || !email) {
      return NextResponse.json({ error: "ไม่มีโทเคนหรืออีเมล" }, { status: 400 });
    }

    const existingToken = await prisma.verificationToken.findUnique({
      where: { token, type: "email" },
    });

    if (!existingToken || existingToken.email !== email) {
      return NextResponse.json({ error: "โทเคนไม่ถูกต้องหรือหมดอายุ" }, { status: 400 });
    }

    if (new Date(existingToken.expires) < new Date()) {
      return NextResponse.json({ error: "โทเคนหมดอายุ" }, { status: 400 });
    }

    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.json({ message: "ยืนยันอีเมลสำเร็จ" });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json({ error: "ข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
  }
}
