import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await props.params;
  console.log(id);

  try {
    const { sellerId, approved } = await req.json();

    if (!sellerId || typeof approved !== "boolean") {
      return new NextResponse("Invalid request data", { status: 400 });
    }

    if (approved) {
      const updatedSeller = await prisma.sellerProfile.update({
        where: { id: sellerId },
        data: {
          isApproved: true,
          approvedAt: new Date(),
        },
      });

      return NextResponse.json(updatedSeller);
    } else {
      // Reject and delete the seller profile
      const sellerProfile = await prisma.sellerProfile.findUnique({
        where: { id: sellerId },
        select: { userId: true },
      });

      if (!sellerProfile) {
        return new NextResponse("Seller profile not found", { status: 404 });
      }

      await prisma.sellerProfile.delete({
        where: { id: sellerId },
      });

      await prisma.user.update({
        where: { id: sellerProfile.userId },
        data: { isSeller: false },
      });

      return NextResponse.json({ message: "Seller profile rejected and removed" });
    }
  } catch (error) {
    console.error("Error verifying seller:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
