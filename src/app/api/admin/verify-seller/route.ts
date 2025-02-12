import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { sellerId, approved } = await req.json();

    if (!sellerId || typeof approved !== "boolean") {
      return new NextResponse("Invalid request data", { status: 400 });
    }

    const updatedSeller = await prisma.sellerProfile.update({
      where: { id: sellerId },
      data: { isApproved: approved },
    });

    return NextResponse.json(updatedSeller);
  } catch (error) {
    console.error("Error verifying seller:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
