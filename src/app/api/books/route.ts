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

    const missingFields = checkMissingFields(data);
    if (missingFields.length > 0) {
      return NextResponse.json({ error: `Missing required fields: ${missingFields.join(", ")}` }, { status: 400 });
    }

    const newBook = await prisma.book.create({ data });

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

const checkMissingFields = (body: CreateBookRequest) => {
  const missingFields = [];

  if (!body.title) {
    missingFields.push("title");
  }
  if (!body.author) {
    missingFields.push("author");
  }
  if (!body.publishedYear) {
    missingFields.push("publishedYear");
  }

  return missingFields;
};
