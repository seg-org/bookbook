import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { sendVerificationSMS } from "@/lib/sms";

export async function POST(req: Request) {
  try {
    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Check if the phone number exists
    const user = await prisma.user.findUnique({ where: { phoneNumber } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ignore : To be able to verify the phone number even if it's already verified
    // if (user.phoneVerified) {
    //   return NextResponse.json({ error: "Phone number already verified" }, { status: 400 });
    // }

    // Generate a new 6-digit verification code
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

    await prisma.verificationToken.upsert({
      where: { email_type: { email: user.email, type: "phone" } },
      update: { token, expires },
      create: { email: user.email, token, type: "phone", expires },
    });

    await sendVerificationSMS(phoneNumber, token);

    return NextResponse.json({ message: "Verification code resent" });
  } catch (error) {
    console.error("Resend phone verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
