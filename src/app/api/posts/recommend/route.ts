import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TransactionStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Step 1: Fetch completed transactions by this buyer
    const transactions = await prisma.transaction.findMany({
      where: {
        buyerId: userId,
        status: TransactionStatus.COMPLETE,
      },
      include: {
        post: {
          include: {
            book: true,
          },
        },
      },
    });

    const boughtBookIds = new Set(transactions.map((tx) => tx.post.book.id));

    // Step 2: Extract genres and tags from bought books
    const preferredGenres = new Set<string>();
    const preferredTags = new Set<string>();

    transactions.forEach((tx) => {
      tx.post.book.bookGenres.forEach((genre) => preferredGenres.add(genre));
      tx.post.book.bookTags.forEach((tag) => preferredTags.add(tag));
    });

    // Step 3: Fetch posts
    const allPosts = await prisma.post.findMany({
      include: {
        book: true,
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Step 4: Filter posts in JS
    const recommendedPosts = allPosts.filter((post) => {
      const book = post.book;
      if (boughtBookIds.has(book.id)) return false;

      const genreMatch = book.bookGenres.some((genre: string) => preferredGenres.has(genre));
      const tagMatch = book.bookTags.some((tag: string) => preferredTags.has(tag));

      return genreMatch || tagMatch;
    });

    // Limit results
    const limitedPosts = recommendedPosts.slice(0, 1);
    if (limitedPosts.length === 0) {
      // If no posts are found, return a random post
      const randomPost = await prisma.post.findFirst({
        include: {
          book: true,
          seller: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        where: {
          sellerId: { not: userId }, // Exclude posts from the current user
        },
      });
      if (randomPost) {
        limitedPosts.push(randomPost);
      }
    }

    return NextResponse.json(limitedPosts, { status: 200 });
  } catch (error) {
    if (error instanceof Error) console.error("Error in recommendations", error.stack);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
