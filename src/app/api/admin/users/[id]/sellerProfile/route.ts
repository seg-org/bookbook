import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import * as z from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const sellerProfileSchema = z.object({
  bankAccount: z.string(),
  bankName: z.string(),
  idCardNumber: z.string(),
});

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await props.params;

  try {
    const data = await req.json();

    const parsedData = sellerProfileSchema.safeParse(data);
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    await prisma.sellerProfile.update({
      where: { userId: id },
      data: {
        ...parsedData.data,
        isApproved: false,
        approvedAt: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Seller profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating seller profile:", error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
