import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";
import { getPresignedUrl } from "../../objects/s3";
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: Request) {
  const {title, author, publisher, isbn} = await req.json();
  console.log(title,"gettttttttttttttttttttttt")
  try {
    const posts1 = await prisma.post.findMany({//GPT said The issue is that Prisma currently does not support querying JSON fields using `path`. 
      include: { book: true },
      where : {
        AND : [
            // {book: {path:["title"], contains: title, mode: "insensitive" }} ,
            // {book: {path:["author"], contains: author, mode: "insensitive" }}, 
            // {book: {path:["publisher"], contains: publisher, mode: "insensitive" }},
            // {book: {path:["isbn"], contains: isbn, mode: "insensitive" }},
        ]
      }
    });

    const posts = posts1.filter(post => {
        return  post.book.title.toLowerCase().includes(title.toLowerCase()) &&
                post.book.author.toLowerCase().includes(author.toLowerCase()) &&
                // post.book.publisher.toLowerCase().includes(publisher.toLowerCase()) &&
                post.book.isbn.toLowerCase().includes(isbn.toLowerCase());
    });
    
    const postsWithImageUrl = await Promise.all(
      posts.map(async (post) => {
        const url = await getPresignedUrl("book_images", post.book.coverImageKey);
        return {
          ...post,
          book: {
            ...post.book,
            coverImageUrl: url,
          },
        };
      })
    );

    return NextResponse.json(postsWithImageUrl);
  } catch (error) {
    if (error instanceof Error) console.error("Error getting posts", error.stack);
    return NextResponse.json({ error: "Cannot get posts" }, { status: 500 });
  }
}
