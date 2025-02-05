import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createBookRequest = z.object({
  title: z.string(),
  author: z.string(),
  genre: z.string(),
  description: z.string(),
  isbn: z.string(),
  pages: z.number(),
  coverImageUrl: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsedData = createBookRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const newBook = await prisma.book.create({ data: parsedData.data });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error("Error creating book", error);
    return NextResponse.json({ error: "Cannot create a book" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const books = await prisma.book.findMany();

    return NextResponse.json(books);
  } catch (error) {
    console.error("Error getting books", error);
    return NextResponse.json({ error: "Cannot get books" }, { status: 500 });
  }
}
