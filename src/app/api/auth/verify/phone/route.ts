import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Missing verification code" }, { status: 400 });
    }

    // Find the OTP in the database
    const existingOTP = await prisma.phoneVerification.findUnique({
      where: { code },
    });

    if (!existingOTP) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }

    // Check if OTP has expired
    if (new Date(existingOTP.expires) < new Date()) {
      return NextResponse.json({ error: "Verification code expired" }, { status: 400 });
    }

    // Update user's phone verification status
    await prisma.user.update({
      where: { phoneNumber: existingOTP.phoneNumber },
      data: { phoneVerified: new Date() },
    });

    // Delete OTP after successful verification
    await prisma.phoneVerification.delete({
      where: { code },
    });

    return NextResponse.json({ message: "Phone number verified successfully" });
  } catch (error) {
    console.error("Phone verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
