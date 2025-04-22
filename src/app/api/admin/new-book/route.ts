import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUrl } from "@/app/api/objects/s3";
import { BooksResponse } from "@/app/api/books/schemas";

import { authOptions } from "@/lib/auth";

import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  if (!session.user.isAdmin) {
    return new NextResponse("Forbidden", { status: 403 });
  }
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
