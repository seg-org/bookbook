import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { UpdateBookRequest } from "@/app/api/books/schemas";
import { getUrl } from "@/app/api/objects/s3";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  if (!session.user.isAdmin) {
    return new NextResponse("Forbidden", { status: 403 });
  }

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
    };

    if (parsedData.data.verifiedStatus === "REJECTED") {
      await prisma.book.delete({
        where: { id },
      });
      return NextResponse.json({ book: null, message: "Book rejected successfully" }, { status: 200 });
    }

    const updatedBook = await prisma.book.update({
      where: { id },
      data,
    });

    const updatedBookWithImageUrl = {
      ...updatedBook,
      coverImageUrl: getUrl("book_images", updatedBook.coverImageKey),
    };

    return NextResponse.json({ book: updatedBookWithImageUrl, message: "Book approved successfully" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) console.error(`Error updating book with id ${id}`, error.stack);
    return NextResponse.json({ error: "Cannot update the book" }, { status: 500 });
  }
}
