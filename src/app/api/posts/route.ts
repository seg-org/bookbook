import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { getUrl } from "../objects/s3";
import { CreatePostRequest, GetPostsRequest, PostResponse, PostsResponsePaginated } from "./schemas";

export async function POST(req: NextRequest) {
  try {
    const parsedData = CreatePostRequest.safeParse(await req.json());
    console.log(parsedData);
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

    const data = {
      ...parsedData.data,
    };

    const newPost = await prisma.post.create({
      data,
      include: { book: true },
    });

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
        { status: 409 },
      );
    }
    if (error instanceof Error) console.error("Error creating post", error.stack);
    return NextResponse.json({ error: "Cannot create a post" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const rawQueryParams = Object.fromEntries(url.searchParams.entries());
    const validatedParams = GetPostsRequest.safeParse(rawQueryParams);
    if (!validatedParams.success) {
      return NextResponse.json({ error: validatedParams.error.errors }, { status: 400 });
    }

    const { page, limit, sortBy, sortOrder, ...filters } = validatedParams.data;
    const orderBy: { [key: string]: "asc" | "desc" }[] = [];

    if (sortBy && sortOrder) {
      orderBy.push({ [sortBy]: sortOrder });
    } else {
      orderBy.push({ createdAt: "desc" }); // default sort
    }

    const skip = (page - 1) * limit;

    const bookFilter: Prisma.BookWhereInput = {
      title: filters.title ? { contains: filters.title, mode: "insensitive" } : undefined,
      author: filters.author ? { contains: filters.author, mode: "insensitive" } : undefined,
      description: filters.description ? { contains: filters.description, mode: "insensitive" } : undefined,
      isbn: filters.isbn ? { contains: filters.isbn, mode: "insensitive" } : undefined,
      publisher: filters.publisher ? { contains: filters.publisher, mode: "insensitive" } : undefined,
      pages: {
        gte: filters.minPages ? filters.minPages : undefined,
        lte: filters.maxPages ? filters.maxPages : undefined,
      },
    };

    const session = await getServerSession(authOptions);
    const posts = await prisma.post.findMany({
      where: {
        book: bookFilter,
        published: true,
        sellerId: {
          not: session?.user.id,
        },
      },
      include: { book: true },
      skip,
      take: limit,
      orderBy,
    });

    const totalPosts = await prisma.post.count({
      where: {
        book: bookFilter,
        published: true,
      },
    });
    const totalPages = Math.ceil(totalPosts / limit);

    const postsWithImageUrl = posts.map((post) => {
      return {
        ...post,
        book: {
          ...post.book,
          coverImageUrl: getUrl("book_images", post.book.coverImageKey),
        },
      };
    });

    return NextResponse.json(
      PostsResponsePaginated.parse({ posts: postsWithImageUrl, total: totalPosts, totalPages, page }),
    );
  } catch (error) {
    if (error instanceof Error) console.error("Error getting posts", error.stack);
    return NextResponse.json({ error: "Cannot get posts" }, { status: 500 });
  }
}
