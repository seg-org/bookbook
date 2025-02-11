import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateBookRequest = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  genre: z.string().optional(),
  description: z.string().optional(),
  isbn: z.string().optional(),
  pages: z.number().optional(),
  coverImageKey: z.string().optional(),
});

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
    if (error instanceof Error) console.error(`Error getting book with id ${id}`, error.stack);
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

    const parsedData = updateBookRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const updatedBook = await prisma.book.update({
      where: { id },
      data: parsedData.data,
    });

    return NextResponse.json(updatedBook);
  } catch (error) {
    if (error instanceof Error) console.error(`Error updating book with id ${id}`, error.stack);
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
    if (error instanceof Error) console.error(`Error deleting book with id ${params.id}`, error.stack);
    return NextResponse.json({ error: "Cannot delete book" }, { status: 500 });
  }
}
