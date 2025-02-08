import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createPostRequest = z.object({
  title: z.string(),
  content: z.string(),
  price: z.number(),
  published: z.boolean(),
  bookId: z.string(),
  price: z.number(),
});

export async function POST(req: NextRequest) {
  try {
    const parsedData = createPostRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const book = await prisma.book.findUnique({
      where: { id: parsedData.data.bookId },
    });
    if (!book) {
      return NextResponse.json({ error: `Book with id ${parsedData.data.bookId} not found` }, { status: 404 });
    }

    const newPost = await prisma.post.create({ data: parsedData.data });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    if (error instanceof Error) console.error("Error creating post", error.stack);
    return NextResponse.json({ error: "Cannot create a post" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany();

    return NextResponse.json(posts);
  } catch (error) {
    if (error instanceof Error) console.error("Error getting posts", error.stack);
    return NextResponse.json({ error: "Cannot get posts" }, { status: 500 });
  }
}
