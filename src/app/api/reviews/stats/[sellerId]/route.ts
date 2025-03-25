import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { ReviewStatsResponse } from "../../schemas";

// GET /api/reviews/stats/[sellerId] - Get review stats for a seller
export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const sellerId = (await props.params).id;

    // Check if seller exists
    const sellerExists = await prisma.user.findFirst({
      where: {
        id: sellerId,
        isSeller: true,
      },
    });

    if (!sellerExists) {
      return NextResponse.json({ error: `Seller with id ${sellerId} not found` }, { status: 404 });
    }

    // Get all reviews for transactions where this user was the seller
    const reviews = await prisma.review.findMany({
      where: {
        transaction: {
          sellerId: sellerId,
        },
      },
      select: {
        rating: true,
      },
    });

    const totalReviews = reviews.length;

    if (totalReviews === 0) {
      return NextResponse.json(
        {
          sellerId,
          averageRating: 0,
          totalReviews: 0,
          ratingCounts: [
            { rating: 1, count: 0 },
            { rating: 2, count: 0 },
            { rating: 3, count: 0 },
            { rating: 4, count: 0 },
            { rating: 5, count: 0 },
          ],
        },
        { status: 200 }
      );
    }

    // Calculate average rating
    const sumRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = parseFloat((sumRatings / totalReviews).toFixed(1));

    // Count reviews for each rating (1-5)
    const ratingCounts = [];
    for (let i = 1; i <= 5; i++) {
      const count = reviews.filter((review) => review.rating === i).length;
      ratingCounts.push({ rating: i, count });
    }

    const stats = {
      sellerId,
      averageRating,
      totalReviews,
      ratingCounts,
    };

    return NextResponse.json(ReviewStatsResponse.parse(stats), { status: 200 });
  } catch (error) {
    if (error instanceof Error) console.error("Error getting seller review stats", error.stack);
    return NextResponse.json({ error: "Cannot get seller review stats" }, { status: 500 });
  }
}
