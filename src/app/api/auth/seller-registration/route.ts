import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const idCardNumber = formData.get("idCardNumber") as string;
    const bankAccount = formData.get("bankAccount") as string;
    const bankName = formData.get("bankName") as string;
    const idCardImage = formData.get("idCardImage") as File;

    if (!idCardImage) {
      return NextResponse.json({ error: "ID card image is required" }, { status: 400 });
    }

    // Upload image to blob storage (change it to supabase s3 later)
    const blob = await put(idCardImage.name, idCardImage, {
      access: "public",
    });

    const existingProfile = await prisma.sellerProfile.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (existingProfile) {
      return NextResponse.json({ error: "Seller profile already exists" }, { status: 400 });
    }

    await prisma.sellerProfile.create({
      data: {
        userId: session.user.id,
        idCardNumber,
        idCardImageKey: blob.url,
        bankAccount,
        bankName,
      },
    });

    // Update user's seller status
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        isSeller: true,
      },
    });

    return NextResponse.json({
      message: "Seller registration submitted successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
