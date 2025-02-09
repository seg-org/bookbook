import { prisma } from "@/lib/prisma";
import { sendVerificationSMS } from "@/lib/sms";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Check if the phone number is already verified
    const user = await prisma.user.findUnique({ where: { phoneNumber } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.phoneVerified) {
      return NextResponse.json({ error: "Phone number already verified" }, { status: 400 });
    }

    // Generate a new 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the new code in the database
    await prisma.phoneVerification.upsert({
      where: { phoneNumber },
      update: { code, expires: new Date(Date.now() + 10 * 60 * 1000) }, // Expires in 10 min
      create: { phoneNumber, code, expires: new Date(Date.now() + 10 * 60 * 1000) },
    });

    // Send the new verification code via SMS
    await sendVerificationSMS(phoneNumber, code);

    return NextResponse.json({ message: "Verification code resent" });
  } catch (error) {
    console.error("Resend phone verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
