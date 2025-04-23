import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { getUrl } from "@/app/api/objects/s3";
import { GetPostsRequest, PostsResponsePaginated } from "@/app/api/posts/schemas";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const rawQueryParams = Object.fromEntries(url.searchParams.entries());
    const validatedParams = GetPostsRequest.safeParse(rawQueryParams);
    if (!validatedParams.success) {
      return NextResponse.json({ error: validatedParams.error.errors }, { status: 400 });
    }

    const { page, limit, sortBy, sortOrder, verifiedStatus, postId, ...filters } = validatedParams.data;
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
        verifiedStatus,
        id: postId ? { equals: postId } : undefined,
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
        verifiedStatus,
        id: postId ? { equals: postId } : undefined,
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
