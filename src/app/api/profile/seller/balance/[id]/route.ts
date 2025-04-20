import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

import { prisma } from "@/lib/prisma";

const sellerProfileSchema = z.object({
  diff: z.number().optional(),
});

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const userId = params.id;

  try {
    const data = await req.json();

    const parsedData = sellerProfileSchema.safeParse(data);
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: userId },
    });

    if (!sellerProfile) {
      return NextResponse.json({ error: "Seller profile not found" }, { status: 404 });
    }

    const currentBalance = sellerProfile.balance || 0;

    const newBalance = currentBalance + (parsedData.data.diff || 0);

    const updatedSellerProfile = await prisma.sellerProfile.update({
      where: { userId: userId },
      data: {
        balance: newBalance,
      },
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
          avatar: null, //s.sellerProfile?.idCardImageKey ? getUrl("idCard_images", s.sellerProfile.idCardImageKey) : null,
          joinDate: s.createdAt.toISOString(),
          totalSales,
          averageRating,
          totalReviews,
        };
      }),
    );

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error loading sellers:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
