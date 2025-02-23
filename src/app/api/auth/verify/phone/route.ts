import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Missing verification code" }, { status: 400 });
    }

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token: code, type: "phone" }, // Ensure the token is for phone verification
    });

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }

    if (new Date(verificationToken.expires) < new Date()) {
      return NextResponse.json({ error: "Verification code expired" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: verificationToken.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { phoneVerified: new Date() },
    });

    await prisma.verificationToken.delete({
      where: { id: verificationToken.id },
    });

    return NextResponse.json({ message: "Phone number verified successfully" });
  } catch (error) {
    console.error("Phone verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
