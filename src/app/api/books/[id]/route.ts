import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface UpdateBookRequest {
  title?: string;
  author?: string;
  genre?: string;
  description?: string;
  isbn?: string;
  pages?: number;
}

export async function GET(_: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  try {
    const book = await prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      return NextResponse.json({ error: `Book with id ${id} not found` }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error(`Error getting book with id ${id}`, error);
    return NextResponse.json({ error: "Cannot get a book" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  try {
    const book = await prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      return NextResponse.json({ error: `Book with id ${id} not found` }, { status: 404 });
    }

    const updatedData: UpdateBookRequest = await req.json();
    const errors = checkInvalidTypes(updatedData);
    if (errors.length > 0) {
      return NextResponse.json({ error: `Invalid fields: ${errors.join(", ")}` }, { status: 400 });
    }

    const updatedBook = await prisma.book.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error(`Error updating book with id ${id}`, error);
    return NextResponse.json({ error: "Cannot update the book" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const book = await prisma.book.findUnique({ where: { id: params.id } });
    if (!book) {
      return NextResponse.json({ error: `Book with id ${params.id} not found` }, { status: 404 });
    }

    const posts = await prisma.post.findMany({ where: { bookId: params.id } });
    if (posts.length > 0) {
      return NextResponse.json(
        { error: `Cannot delete book with id ${params.id} because it has posts` },
        { status: 400 }
      );
    }

    await prisma.book.delete({ where: { id: params.id } });

    return NextResponse.json({ message: `Book with id ${params.id} deleted successfully` }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting book with id ${params.id}`, error);
    return NextResponse.json({ error: "Cannot delete book" }, { status: 500 });
  }
}

const checkInvalidTypes = (body: UpdateBookRequest) => {
  const fieldTypes: { key: keyof UpdateBookRequest; type: string }[] = [
    { key: "title", type: "string" },
    { key: "author", type: "string" },
    { key: "genre", type: "string" },
    { key: "description", type: "string" },
    { key: "isbn", type: "string" },
    { key: "pages", type: "number" },
  ];

  const invalidFields = fieldTypes
    .filter(({ key, type }) => key in body && typeof body[key] !== type)
    .map(({ key, type }) => `${key} (expected ${type})`);

  return invalidFields;
};
