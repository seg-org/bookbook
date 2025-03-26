import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as z from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const sellerProfileSchema = z.object({
  bankAccount: z.string().min(10, "Bank account number must be at least 10 characters"),
  bankName: z.string().min(2, "Bank name is required"),
  idCardNumber: z.string().min(13, "ID card number must be 13 characters"),
});

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const data = await req.json();

    const parsedData = sellerProfileSchema.safeParse(data);
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const updatedSellerProfile = await prisma.sellerProfile.update({
      where: { userId: session.user.id },
      data: parsedData.data,
    });

    return NextResponse.json(updatedSellerProfile);
  } catch (error) {
    console.error("Error updating seller profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const sellers = await prisma.user.findMany({
      where: {
        isSeller: true,
      },
      include: {
        sellerProfile: true,
      },
    });

    const formatted = await Promise.all(
      sellers.map(async (s) => {
        const totalSales = await prisma.transaction.count({
          where: { sellerId: s.id, status: "COMPLETE" },
        });

        const reviews = await prisma.review.findMany({
          where: {
            transaction: {
              sellerId: s.id,
            },
          },
          select: { rating: true },
        });

        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;

        return {
          id: s.id,
          name: `${s.firstName} ${s.lastName}`,
          avatar: null, // or use s.image if you have it
          joinDate: s.createdAt.toISOString(),
          totalSales,
          averageRating,
          totalReviews,
        };
      })
    );

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error loading sellers:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
