// src/app/api/books/recommend-price/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET (Type A): ?book_id=xxx&mode=average
 *   -> returns average price from posts
 *
 * GET (Type B): ?book_id=xxx&mode=manual
 *   -> returns the admin-set recommendPrice from Book
 *
 * POST:
 *   -> sets the manual recommendPrice for a Book (admin only)
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get("book_id");
  const mode = searchParams.get("mode") || "average";
  if (!bookId) {
    return NextResponse.json({ error: "book_id is required" }, { status: 400 });
  }

  if (mode === "manual") {
    // Return the Book's recommendPrice
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      return NextResponse.json({ error: `Book with id ${bookId} not found` }, { status: 404 });
    }
    return NextResponse.json({ recommendPrice: book.recommendPrice });
  } else {
    // mode === "average" or default
    // Return the existing average from your aggregator
    // (This is your existing code.)
    const result = await prisma.post.aggregate({
      where: { bookId },
      _avg: { price: true },
    });
    return NextResponse.json({ recommendedPrice: result._avg.price });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { bookId, recommendPrice } = body;
    if (!bookId || recommendPrice === undefined) {
      return NextResponse.json({ error: "Missing bookId or recommendPrice" }, { status: 400 });
    }

    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: { recommendPrice: recommendPrice },
    });

    return NextResponse.json({
      message: "recommendPrice updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.error("Error updating recommendPrice:", error);
    return NextResponse.json({ error: "Failed to update recommendPrice" }, { status: 500 });
  }
}
