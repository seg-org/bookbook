import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface CreateBookRequest {
  title: string;
  author: string;
  genre: string;
  description: string;
  isbn: string;
  pages: number;
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
  const requiredFields: { key: keyof CreateBookRequest; type: string }[] = [
    { key: "title", type: "string" },
    { key: "author", type: "string" },
    { key: "genre", type: "string" },
    { key: "description", type: "string" },
    { key: "isbn", type: "string" },
    { key: "pages", type: "number" },
  ];

  const missingFields = requiredFields
    .filter(({ key, type }) => {
      const value = body[key];
      return value === undefined || typeof value !== type;
    })
    .map(({ key, type }) => `${key} (expected ${type})`);

  return missingFields;
};
