import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getUrl } from "../../objects/s3";
import { PostResponse, UpdatePostRequest } from "../schemas";

export async function GET(_: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { book: true },
    });

    if (!post) {
      return NextResponse.json({ error: `Post with id ${id} not found` }, { status: 404 });
    }

    const postWithImageUrl = {
      ...post,
      book: {
        ...post.book,
        coverImageUrl: getUrl("book_images", post.book.coverImageKey),
      },
    };

    return NextResponse.json(PostResponse.parse(postWithImageUrl));
  } catch (error) {
    if (error instanceof Error) console.error(`Error getting post with id ${id}`, error.stack);
    return NextResponse.json({ error: "Cannot get a post" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
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
