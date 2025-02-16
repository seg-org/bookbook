import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get("book_id");

  if (!bookId) {
    return NextResponse.json({ error: "book_id is required" }, { status: 400 });
  }

  const result = await prisma.post.aggregate({
    where: { bookId },
    _avg: { price: true },
  });

  return NextResponse.json({
    recommendedPrice: result._avg.price,
  } satisfies BookRecommendPriceResponse);
}

export type BookRecommendPriceResponse = {
  recommendedPrice: number | null;
};
