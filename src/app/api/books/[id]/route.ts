import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getUrl } from "../../objects/s3";
import { BookResponse, UpdateBookRequest } from "../schemas";

export async function GET(_: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  try {
    const book = await prisma.book.findUnique({
      where: { id },
    });
    if (!book) {
      return NextResponse.json({ error: `Book with id ${id} not found` }, { status: 404 });
    }

    const bookWithImageUrl = {
      ...book,
      coverImageUrl: getUrl("book_images", book.coverImageKey),
    };

    return NextResponse.json(BookResponse.parse(bookWithImageUrl));
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

    const parsedData = UpdateBookRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const data = {
      ...parsedData.data,
      bookGenres: parsedData.data.bookGenres ?? [],
      bookTags: parsedData.data.bookTags ?? [],
    };

    const updatedBook = await prisma.book.update({
      where: { id },
      data,
    });

    const updatedBookWithImageUrl = {
      ...updatedBook,
      coverImageUrl: getUrl("book_images", updatedBook.coverImageKey),
    };

    return NextResponse.json(updatedBookWithImageUrl);
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
