import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { BookmarkResponse, BookmarksResponse, CreateBookmarkRequest } from "./schemas";

// const createBookmarkRequest = z.object({
//   postId: z.string(),
// });

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsedData = CreateBookmarkRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id: parsedData.data.postId },
    });
    if (!post) {
      return NextResponse.json({ error: `Post with id ${parsedData.data.postId} not found` }, { status: 404 });
    }

    const currentBookmark = await prisma.bookmark.findFirst({
      where: { postId: parsedData.data.postId, userId: session.user.id },
    });

    if (currentBookmark) {
      await prisma.bookmark.delete({
        where: { userId_postId: { postId: parsedData.data.postId, userId: session.user.id } },
      });

      return NextResponse.json({ message: "Bookmark deleted" });
    } else {
      const newBookmark = await prisma.bookmark.create({
        data: { postId: parsedData.data.postId, userId: session.user.id },
      });

      return NextResponse.json(BookmarkResponse.parse(newBookmark), { status: 201 });
    }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "Duplicate key violation (there is already a bookmark with this post id)" },
        { status: 409 }
      );
    }
    if (error instanceof Error) console.error("Error creating bookmark", error.stack);
    return NextResponse.json({ error: "Cannot create a bookmark" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json(BookmarksResponse.parse(bookmarks));
  } catch (error) {
    if (error instanceof Error) console.error("Error getting bookmarks", error.stack);
    return NextResponse.json({ error: "Cannot get bookmarks" }, { status: 500 });
  }
}
