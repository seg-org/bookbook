import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: { id?: string } }) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ error: "Missing seller ID" }, { status: 400 });
  }

  try {
    const books = await prisma.book.findMany({
      where: { sellerId: id },
      select: {
        id: true,
        title: true,
        author: true,
        coverImageKey: true,
      },
    });

    if (books.length === 0) {
      return NextResponse.json({ error: `No books found for seller ${id}` }, { status: 404 });
    }

    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    console.error(`Error fetching books for seller ${id}:`, error);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}
