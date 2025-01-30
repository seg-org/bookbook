import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface CreatePostRequest {
  title: string;
  content: string;
  published: boolean;
  bookId: string;
}

export async function POST(req: NextRequest) {
  try {
    const data: CreatePostRequest = await req.json();

    const missingFields = checkMissingFields(data);
    if (missingFields.length > 0) {
      return NextResponse.json({ error: `Missing required fields: ${missingFields.join(", ")}` }, { status: 400 });
    }

    const book = await prisma.book.findUnique({
      where: { id: data.bookId },
    });
    if (!book) {
      return NextResponse.json({ error: `Book with id ${data.bookId} not found` }, { status: 404 });
    }

    const newPost = await prisma.post.create({ data });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post", error);
    return NextResponse.json({ error: "Cannot create a post" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany();

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error getting posts", error);
    return NextResponse.json({ error: "Cannot get posts" }, { status: 500 });
  }
}

const checkMissingFields = (body: CreatePostRequest) => {
  const requiredFields: { key: keyof CreatePostRequest; type: string }[] = [
    { key: "title", type: "string" },
    { key: "content", type: "string" },
    { key: "published", type: "boolean" },
    { key: "bookId", type: "string" },
  ];

  const missingFields = requiredFields
    .filter(({ key, type }) => {
      const value = body[key];
      return value === undefined || typeof value !== type;
    })
    .map(({ key, type }) => `${key} (expected ${type})`);

  return missingFields;
};
