import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, context: { params: { id: string } }) {
  const { id: sellerId } = context.params;

  try {
    const reviews = await prisma.review.findMany({
      where: {
        transaction: {
          sellerId,
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
                book: {
                  select: {
                    id: true,
                    title: true,
                    coverImageKey: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const formatted = reviews.map((r) => ({
      id: r.id,
      sellerId,
      rating: r.rating,
      comment: r.comment ?? "",
      createdAt: r.createdAt.toISOString(),
      buyer: r.transaction.buyer,
      book: {
        id: r.transaction.post.book.id,
        title: r.transaction.post.book.title,
        cover: r.transaction.post.book.coverImageKey
          ? `https://bookbook-bucket.s3.ap-southeast-1.amazonaws.com/book_covers/${r.transaction.post.book.coverImageKey}`
          : null,
      },
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching seller reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
