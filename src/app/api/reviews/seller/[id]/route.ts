import { NextRequest, NextResponse } from "next/server";

import { getUrl } from "@/app/api/objects/s3";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: sellerId } = await params;

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
      transaction: {
        buyer: {
          id: r.transaction.buyer.id,
          firstName: r.transaction.buyer.firstName,
          lastName: r.transaction.buyer.lastName,
        },
        post: {
          id: r.transaction.post.id,
          book: {
            title: r.transaction.post.book.title,
            coverImageUrl: getUrl("book_images", r.transaction.post.book.coverImageKey),
          },
        },
      },
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching seller reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
