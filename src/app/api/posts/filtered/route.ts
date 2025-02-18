import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

import { getUrl } from "../../objects/s3";

export async function POST(req: NextRequest) {
  const {title, author, publisher, isbn} = await req.json();
  try {
    let posts = await prisma.post.findMany({
      include: { book: true , Bookmark : true},
    });

    posts = posts.filter(post => {
      return  post.book.title.toLowerCase().includes(title.toLowerCase()) &&
              post.book.author.toLowerCase().includes(author.toLowerCase()) &&
              post.book.publisher.toLowerCase().includes(publisher.toLowerCase()) &&
              post.book.isbn.toLowerCase().includes(isbn.toLowerCase());
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

    return NextResponse.json(postsWithImageUrl);
  } catch (error) {
    if (error instanceof Error) console.error("Error getting posts", error.stack);
    return NextResponse.json({ error: "Cannot get posts" }, { status: 500 });
  }
}

