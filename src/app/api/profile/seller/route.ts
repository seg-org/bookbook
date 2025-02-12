import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const data = await req.json();
    const updatedSellerProfile = await prisma.sellerProfile.update({
      where: { userId: session.user.id },
      data: {
        bankAccount: data.bankAccount,
        bankName: data.bankName,
        idCardNumber: data.idCardNumber,
      },
    });

    return NextResponse.json(updatedSellerProfile);
  } catch (error) {
    console.error("Error updating seller profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
