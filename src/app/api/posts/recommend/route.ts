import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getUrl } from "../../objects/s3";
import { PostsResponse } from "../schemas";

// Function to generate a seeded random number
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export async function GET(request: Request) {
  try {
    // Parse the URL parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }

    // Get all posts from the database
    const posts = await prisma.post.findMany({
      include: { book: true },
    });

    let postsWithImageUrl = await Promise.all(
      posts.map((post) => {
        const url = getUrl("book_images", post.book.coverImageKey);
        return {
          ...post,
          book: {
            ...post.book,
            coverImageUrl: url,
          },
        };
      })
    );

    if (postsWithImageUrl.length === 0) {
      return NextResponse.json({ error: "No posts available" }, { status: 404 });
    }

    // Convert user ID to a number for seeding
    const seed = parseInt(userId, 10) || 0;
    const randomIndex = Math.floor(seededRandom(seed) * postsWithImageUrl.length);

    const recommendedPost = postsWithImageUrl[randomIndex];

    postsWithImageUrl = postsWithImageUrl.filter((post) => post.id != recommendedPost.id);

    postsWithImageUrl = [recommendedPost, ...postsWithImageUrl];

    return NextResponse.json(PostsResponse.parse(postsWithImageUrl));
  } catch (error) {
    console.error("Error fetching recommended post:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
