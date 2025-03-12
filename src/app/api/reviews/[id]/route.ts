import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ReviewResponse, UpdateReviewRequest } from "../schemas";

// GET /api/reviews/[id] - Get a specific review
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reviewId = params.id;

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
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
    });

    if (!review) {
      return NextResponse.json({ error: `Review with id ${reviewId} not found` }, { status: 404 });
    }

    // Format the response to include book and buyer details
    const formattedReview = {
      id: review.id,
      transactionId: review.transactionId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      buyer: review.transaction.buyer,
      book: review.transaction.post.book,
    };

    return NextResponse.json(formattedReview, { status: 200 });
  } catch (error) {
    if (error instanceof Error) console.error("Error getting review", error.stack);
    return NextResponse.json({ error: "Cannot get review" }, { status: 500 });
  }
}

// PATCH /api/reviews/[id] - Update a review
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reviewId = params.id;
    const parsedData = UpdateReviewRequest.safeParse(await req.json());

    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        transaction: true,
      },
    });

    if (!existingReview) {
      return NextResponse.json({ error: `Review with id ${reviewId} not found` }, { status: 404 });
    }

    // Update the review
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: parsedData.data.rating,
        comment: parsedData.data.comment,
      },
    });

    return NextResponse.json(ReviewResponse.parse(updatedReview), { status: 200 });
  } catch (error) {
    if (error instanceof Error) console.error("Error updating review", error.stack);
    return NextResponse.json({ error: "Cannot update review" }, { status: 500 });
  }
}

// DELETE /api/reviews/[id] - Delete a review
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reviewId = params.id;

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      return NextResponse.json({ error: `Review with id ${reviewId} not found` }, { status: 404 });
    }

    // Delete the review
    await prisma.review.delete({
      where: { id: reviewId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) console.error("Error deleting review", error.stack);
    return NextResponse.json({ error: "Cannot delete review" }, { status: 500 });
  }
}
