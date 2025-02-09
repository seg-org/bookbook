import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Twilio } from "twilio";

const twilioClient = new Twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const TWILIO_PHONE = process.env.TWILIO_PHONE;

export async function POST(req: Request) {
  try {
    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json({ error: "Missing phone number" }, { status: 400 });
    }

    // Generate a 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in database with expiration (e.g., 10 minutes)
    await prisma.phoneVerification.upsert({
      where: { phoneNumber },
      update: { code: otpCode, expires: new Date(Date.now() + 10 * 60 * 1000) },
      create: { phoneNumber, code: otpCode, expires: new Date(Date.now() + 10 * 60 * 1000) },
    });

    // Send OTP via Twilio SMS
    await twilioClient.messages.create({
      body: `Your verification code is: ${otpCode}`,
      from: TWILIO_PHONE,
      to: phoneNumber,
    });

    return NextResponse.json({ message: "Verification code sent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json({ error: "Failed to resend OTP" }, { status: 500 });
  }
}
