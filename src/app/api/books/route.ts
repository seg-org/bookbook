import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface CreateBookRequest {
  title: string;
  author: string;
  publishedYear: number;
}

export async function POST(req: NextRequest) {
  try {
    const data: CreateBookRequest = await req.json();

    if (!data.title || !data.author || !data.publishedYear) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newBook = await prisma.book.create({ data });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error("Error creating book", error);
    return NextResponse.json({ error: "Cannot create a book" }, { status: 500 });
  }
}

export async function GET() {
  const books = await prisma.book.findMany();

  return Response.json(books);
}
