import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPresignedUrl } from "../objects/s3";

const createBookRequest = z.object({
  title: z.string(),
  author: z.string(),
  genre: z.string(),
  description: z.string(),
  isbn: z.string(),
  pages: z.number(),
  coverImageKey: z.string(),
  sellerId: z.string()
});

export async function POST(req: NextRequest) {
  try {
    const parsedData = createBookRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const seller = await prisma.user.findUnique({
      where: { id: parsedData.data.sellerId },
    })
    if(!seller) {
      return NextResponse.json({ error: `buyer with id ${parsedData.data.sellerId} not found` }, { status: 404 });
    }

    const newBook = await prisma.book.create({ data: parsedData.data });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    if (error instanceof Error) console.error("Error creating book", error.stack);
    return NextResponse.json({ error: "Cannot create a book" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const books = await prisma.book.findMany();
    const booksWithImageUrl = await Promise.all(
      books.map(async (book) => {
        const url = await getPresignedUrl("book_images", book.coverImageKey);
        return {
          ...book,
          coverImageUrl: url,
        };
      })
    );

    return NextResponse.json(booksWithImageUrl);
  } catch (error) {
    if (error instanceof Error) console.error("Error getting books", error.stack);
    return NextResponse.json({ error: "Cannot get books" }, { status: 500 });
  }
}
