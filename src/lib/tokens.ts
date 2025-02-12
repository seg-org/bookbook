import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function generateVerificationToken(email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const existingToken = await prisma.verificationToken.findFirst({
    where: {
      email,
      type: "email",
    },
  });

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires,
      type: "email",
    },
  });

  return verificationToken;
}

export async function generatePhoneVerificationToken(email: string) {
  const token = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const existingToken = await prisma.verificationToken.findFirst({
    where: {
      email,
      type: "phone",
    },
  });

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires,
      type: "phone",
    },
  });

  return verificationToken;
}
