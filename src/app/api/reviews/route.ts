import { TransactionStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { CreateReviewRequest, GetReviewsRequest, ReviewResponse } from "./schemas";

// POST /api/reviews - Create a new review
export async function POST(req: NextRequest) {
  try {
    const parsedData = CreateReviewRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    // Check if transaction exists and is completed
    const transaction = await prisma.transaction.findUnique({
      where: { id: parsedData.data.transactionId },
      include: { review: true },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: `Transaction with id ${parsedData.data.transactionId} not found` },
        { status: 404 },
      );
    }

    if (transaction.status !== TransactionStatus.COMPLETE) {
      return NextResponse.json({ error: "Reviews can only be left for completed transactions" }, { status: 400 });
    }

    if (transaction.review) {
      return NextResponse.json({ error: "A review already exists for this transaction" }, { status: 400 });
    }

    const newReview = await prisma.review.create({
      data: {
        rating: parsedData.data.rating,
        comment: parsedData.data.comment,
        transactionId: parsedData.data.transactionId,
      },
    });

    return NextResponse.json(ReviewResponse.parse(newReview), { status: 201 });
  } catch (error) {
    if (error instanceof Error) console.error("Error creating a review", error.stack);
    return NextResponse.json({ error: "Cannot create a review" }, { status: 500 });
  }
}

// GET /api/reviews - Get reviews for a seller
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const parsedData = GetReviewsRequest.safeParse(queryParams);

    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      skip: parsedData.data.skip,
      take: parsedData.data.take || 10,
      where: {
        transaction: {
          ...(parsedData.data.sellerId ? { sellerId: parsedData.data.sellerId } : {}),
        },
      },
      include: {
        transaction: {
          include: {
            buyer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            post: {
              include: {
                book: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format the response to include book and buyer details
    const formattedReviews = reviews.map((review) => ({
      id: review.id,
      transactionId: review.transactionId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      buyer: review.transaction.buyer,
      book: review.transaction.post.book,
    }));

    return NextResponse.json(formattedReviews, { status: 200 });
  } catch (error) {
    if (error instanceof Error) console.error("Error getting reviews", error.stack);
    return NextResponse.json({ error: "Cannot get reviews" }, { status: 500 });
  }
}
