import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUrl } from "@/app/api/objects/s3";
import { BooksResponse } from "@/app/api/books/schemas";

export async function GET(req: NextRequest) {
  try {
    const books = await prisma.book.findMany({
      where: {
        verifiedStatus: "UNVERIFIED",
      },
    });
    const booksWithImageUrl = books.map((book) => {
      const url = getUrl("book_images", book.coverImageKey);
      return {
        ...book,
        coverImageUrl: url,
      };
    });

    return NextResponse.json(BooksResponse.parse(booksWithImageUrl));
  } catch (error) {
    if (error instanceof Error) console.error("Error getting books", error.stack);
    return NextResponse.json({ error: "Cannot get books" }, { status: 500 });
  }
}
