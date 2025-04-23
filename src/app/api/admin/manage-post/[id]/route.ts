import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { getUrl } from "@/app/api/objects/s3";
import { PostResponse, UpdatePostRequest } from "@/app/api/posts/schemas";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const { id } = await props.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: `Post with id ${id} not found` }, { status: 404 });
    }
    const parsedData = UpdatePostRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const data = {
      ...parsedData.data,
      published: parsedData.data.verifiedStatus === "VERIFIED" ? true : false,
    };

    const updatedPost = await prisma.post.update({
      where: { id: id },
      data: data,
      include: { book: true },
    });

    const book = await prisma.book.findUnique({
      where: { id: updatedPost.bookId },
    });
    if (!book) {
      return NextResponse.json({ error: `Book with id ${parsedData.data.bookId} not found` }, { status: 404 });
    }

    const updatedPostWithImageUrl = {
      ...updatedPost,
      book: {
        ...book,
        coverImageUrl: getUrl("book_images", book.coverImageKey),
      },
    };

    return NextResponse.json(PostResponse.parse(updatedPostWithImageUrl));
  } catch (error) {
    if (error instanceof Error) console.error(`Error updating post with id ${id}`, error.stack);
    return NextResponse.json({ error: "Cannot update the post" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, props: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const { id } = await props.params;
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ error: `Post with id ${id} not found` }, { status: 404 });
    }

    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ message: `Post with id ${id} deleted successfully` }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) console.error(`Error deleting post with id ${id}`, error.stack);
    return NextResponse.json({ error: "Cannot delete post" }, { status: 500 });
  }
}
