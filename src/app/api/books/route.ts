import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getUrl } from "../objects/s3";
import { BookResponse, BooksResponse, CreateBookRequest } from "./schemas";

export async function POST(req: NextRequest) {
  try {
    const parsedData = CreateBookRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const newBook = await prisma.book.create({ data: parsedData.data });
    const newBookWithImageUrl = {
      ...newBook,
      coverImageUrl: getUrl("book_images", newBook.coverImageKey),
    };

    return NextResponse.json(BookResponse.parse(newBookWithImageUrl), { status: 201 });
  } catch (error) {
    if (error instanceof Error) console.error("Error creating book", error.stack);
    return NextResponse.json({ error: "Cannot create a book" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const books = await prisma.book.findMany();
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
