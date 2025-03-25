import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getUrl } from "../../objects/s3";
import { GetPostsRequest, PostsResponsePaginated } from "../schemas";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const parsedParams = GetPostsRequest.safeParse(queryParams);

    if (!parsedParams.success) {
      return NextResponse.json({ error: parsedParams.error.errors }, { status: 400 });
    }

    const { title, author, genre, description, isbn, pages, publisher, page, limit, sortPrice } = parsedParams.data;

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const filters: any = {};
    if (title) filters.title = { contains: title, mode: "insensitive" };
    if (author) filters.author = { contains: author, mode: "insensitive" };
    if (genre) filters.genre = { contains: genre, mode: "insensitive" };
    if (description) filters.description = { contains: description, mode: "insensitive" };
    if (isbn) filters.isbn = isbn;
    if (pages) filters.pages = pages;
    if (publisher) filters.publisher = { contains: publisher, mode: "insensitive" };

    const total = await prisma.post.count({ where: filters });
    const totalPages = Math.ceil(total / limit);

    const posts = await prisma.post.findMany({
      where: filters,
      include: { book: true },
      orderBy: { price: sortPrice },
      skip: (page - 1) * limit,
      take: limit,
    });

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const postsWithImageUrl = posts.map((post: any) => ({
      ...post,
      book: {
        ...post.book,
        coverImageUrl: getUrl("book_images", post.book.coverImageKey),
      },
    }));

    return NextResponse.json(
      PostsResponsePaginated.parse({
        posts: postsWithImageUrl,
        total,
        totalPages,
        page,
      })
    );
  } catch (error) {
    if (error instanceof Error) console.error("Error fetching posts", error.stack);
    return NextResponse.json({ error: "Cannot fetch posts" }, { status: 500 });
  }
}
