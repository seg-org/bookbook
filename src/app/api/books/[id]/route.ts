import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface UpdateBookRequest {
  title?: string;
  author?: string;
  publishedYear?: number;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id },
    });

    if (!book) {
      return NextResponse.json({ error: `Book with id ${params.id} not found` }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error(`Error getting book with id ${params.id}`, error);
    return NextResponse.json({ error: "Cannot get a book" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id },
    });

    if (!book) {
      return NextResponse.json({ error: `Book with id ${params.id} not found` }, { status: 404 });
    }

    const updatedData: UpdateBookRequest = await req.json();

    const updatedBook = await prisma.book.update({
      where: { id: params.id },
      data: updatedData,
    });

    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error(`Error updating book with id ${params.id}`, error);
    return NextResponse.json({ error: "Cannot update the book" }, { status: 500 });
  }
}
