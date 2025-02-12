import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  const books = await prisma.book.findMany({
    where: { title: { contains: query } },
    select: { id: true, title: true },
  });

  return NextResponse.json({ books } satisfies BooksAutocompleteResponse);
}

export type BooksAutocompleteResponse = {
  books: { id: string; title: string }[];
};
