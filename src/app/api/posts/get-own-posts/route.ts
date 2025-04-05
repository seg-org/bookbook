import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getUrl } from "../../objects/s3";
import { GetPostsRequest, PostsResponsePaginated } from "../schemas";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const rawQueryParams = Object.fromEntries(url.searchParams.entries());
    const validatedParams = GetPostsRequest.safeParse(rawQueryParams);
    if (!validatedParams.success) {
      return NextResponse.json({ error: validatedParams.error.errors }, { status: 400 });
    }

    const { page, limit, sortPrice, author } = validatedParams.data;
    if (!author) {
      return NextResponse.json({ error: "sellerId is required" }, { status: 400 });
    }

    const orderBy = sortPrice ? { price: sortPrice } : {};
    const skip = (page - 1) * limit;

    const posts = await prisma.post.findMany({
      where: { sellerId: author },
      include: { book: true },
      skip,
      take: limit,
      orderBy,
    });

    const totalPosts = await prisma.post.count({
      where: { sellerId: author },
    });
    const totalPages = Math.ceil(totalPosts / limit);

    const postsWithImageUrl = posts.map((post) => ({
      ...post,
      book: {
        ...post.book,
        coverImageUrl: getUrl("book_images", post.book.coverImageKey),
      },
    }));

    return NextResponse.json(
      PostsResponsePaginated.parse({ posts: postsWithImageUrl, total: totalPosts, totalPages, page })
    );
  } catch (error) {
    if (error instanceof Error) console.error("Error fetching seller posts", error.stack);
    return NextResponse.json({ error: "Cannot fetch seller posts" }, { status: 500 });
  }
}
