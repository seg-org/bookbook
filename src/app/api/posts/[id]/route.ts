import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updatePostRequest = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  published: z.boolean().optional(),
  bookId: z.string().optional(),
});

export async function GET(_: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: `Post with id ${id} not found` }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(`Error getting post with id ${id}`, error);
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

    const parsedData = updatePostRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const book = await prisma.book.findUnique({
      where: { id: parsedData.data.bookId },
    });
    if (!book) {
      return NextResponse.json({ error: `Book with id ${parsedData.data.bookId} not found` }, { status: 404 });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: parsedData.data,
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(`Error updating post with id ${id}`, error);
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
    console.error(`Error deleting post with id ${id}`, error);
    return NextResponse.json({ error: "Cannot delete post" }, { status: 500 });
  }
}
