import { NextRequest, NextResponse } from "next/server"; 
import { getServerSession } from "next-auth";
import { z } from "zod"; 

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const SellerRegistrationRequestSchema = z.object({
  idCardNumber: z.string().min(13),
  bankAccount: z.string().min(10),
  bankName: z.string().min(2),
  idCardImageKey: z.string().min(1, "ID card image key is required"), 
});


export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const parsedData = SellerRegistrationRequestSchema.safeParse(body);

    if (!parsedData.success) {
       console.error("Validation Error:", parsedData.error.flatten().fieldErrors);
       return NextResponse.json({ error: "Invalid input data.", details: parsedData.error.flatten().fieldErrors }, { status: 400 });
    }

    const { idCardNumber, bankAccount, bankName, idCardImageKey } = parsedData.data;

    const existingProfile = await prisma.sellerProfile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (existingProfile) {
      await prisma.sellerProfile.update({
        where: {
          userId: session.user.id,
        },
        data: {
          idCardNumber,
          idCardImageKey: idCardImageKey, 
          bankAccount,
          bankName,
          isApproved: false, 
        },
      });

      return NextResponse.json({
        message: "Seller profile updated successfully. Re-approval may be required.",
      });
    } else {
      await prisma.sellerProfile.create({
        data: {
          userId: session.user.id,
          idCardNumber,
          idCardImageKey: idCardImageKey, 
          bankAccount,
          bankName,
          isApproved: false,
        },
      });

      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          isSeller: true,
        },
      });

      return NextResponse.json({
        message: "Seller registration submitted successfully. Awaiting approval.",
      });
    }
  } catch (error) {
    console.error("Seller Registration Error:", error);
    return NextResponse.json({ error: "Internal server error during registration." }, { status: 500 });
  }
}