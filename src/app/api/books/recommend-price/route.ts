import { NextResponse } from "next/server";

import { getRecommendPrice } from "./getRecommendPrice";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get("book_id");

  if (!bookId) {
    return NextResponse.json({ error: "book_id is required" }, { status: 400 });
  }

  return NextResponse.json({
    recommendedPrice: await getRecommendPrice(bookId),
  } satisfies BookRecommendPriceResponse);
}

export type BookRecommendPriceResponse = {
  recommendedPrice: number | null;
};
