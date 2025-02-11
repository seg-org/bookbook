import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, email } = await req.json();

    if (!token || !email) {
      return NextResponse.json({ error: "Missing token or email" }, { status: 400 });
    }

    const existingToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // Check if the token belongs to the correct email
    if (existingToken.email !== email) {
      return NextResponse.json({ error: "Invalid token for this email" }, { status: 400 });
    }

    // Check if the token has expired
    if (new Date(existingToken.expires) < new Date()) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 });
    }

    // Mark the user as verified
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    // Delete the token after successful verification
    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
