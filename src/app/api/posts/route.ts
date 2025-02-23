import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getUrl } from "../objects/s3";
import { CreatePostRequest, PostResponse, PostsResponse } from "./schemas";

export async function POST(req: NextRequest) {
  try {
    const parsedData = CreatePostRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const book = await prisma.book.findUnique({
      where: { id: parsedData.data.bookId },
    });
    if (!book) {
      return NextResponse.json({ error: `Book with id ${parsedData.data.bookId} not found` }, { status: 404 });
    }

    const seller = await prisma.user.findUnique({
      where: { id: parsedData.data.sellerId },
    });
    if (!seller) {
      return NextResponse.json({ error: `seller with id ${parsedData.data.sellerId} not found` }, { status: 404 });
    }

    const newPost = await prisma.post.create({ data: parsedData.data, include: { book: true } });
    const newPostWithImageUrl = {
      ...newPost,
      book: {
        ...newPost.book,
        coverImageUrl: getUrl("book_images", newPost.book.coverImageKey),
      },
    };

    return NextResponse.json(PostResponse.parse(newPostWithImageUrl), { status: 201 });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "Duplicate key violation (there is already a post with this book id)" },
        { status: 409 }
      );
    }
    if (error instanceof Error) console.error("Error creating post", error.stack);
    return NextResponse.json({ error: "Cannot create a post" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: { book: true },
    });

    const postsWithImageUrl = posts.map((post) => {
      const url = getUrl("book_images", post.book.coverImageKey);
      return {
        ...post,
        book: {
          ...post.book,
          coverImageUrl: url,
        },
      };
    });

    return NextResponse.json(PostsResponse.parse(postsWithImageUrl));
  } catch (error) {
    if (error instanceof Error) console.error("Error getting posts", error.stack);
    return NextResponse.json({ error: "Cannot get posts" }, { status: 500 });
  }
}
