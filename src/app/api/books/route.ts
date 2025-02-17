import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUrl } from "../objects/s3";
import { BookResponse, CreateBookRequest } from "./schemas";

export async function POST(req: NextRequest) {
  try {
    const parsedData = CreateBookRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const newBook = await prisma.book.create({ data: parsedData.data });

    return NextResponse.json(BookResponse.parse(newBook), { status: 201 });
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

    return NextResponse.json(booksWithImageUrl);
  } catch (error) {
    if (error instanceof Error) console.error("Error getting books", error.stack);
    return NextResponse.json({ error: "Cannot get books" }, { status: 500 });
  }
}
