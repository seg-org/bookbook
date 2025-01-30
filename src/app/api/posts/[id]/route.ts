import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface UpdatePostRequest {
  title?: string;
  content?: string;
  published?: boolean;
  bookId?: string;
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return NextResponse.json({ error: `Post with id ${params.id} not found` }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(`Error getting post with id ${params.id}`, error);
    return NextResponse.json({ error: "Cannot get a post" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return NextResponse.json({ error: `Post with id ${params.id} not found` }, { status: 404 });
    }

    const updatedData: UpdatePostRequest = await req.json();
    const errors = checkInvalidTypes(updatedData);
    if (errors.length > 0) {
      return NextResponse.json({ error: `Invalid fields: ${errors.join(", ")}` }, { status: 400 });
    }

    const book = await prisma.book.findUnique({
      where: { id: updatedData.bookId },
    });
    if (!book) {
      return NextResponse.json({ error: `Book with id ${updatedData.bookId} not found` }, { status: 404 });
    }

    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: updatedData,
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(`Error updating post with id ${params.id}`, error);
    return NextResponse.json({ error: "Cannot update the post" }, { status: 500 });
  }
}

const checkInvalidTypes = (body: UpdatePostRequest) => {
  const fieldTypes: { key: keyof UpdatePostRequest; type: string }[] = [
    { key: "title", type: "string" },
    { key: "content", type: "string" },
    { key: "published", type: "boolean" },
    { key: "bookId", type: "string" },
  ];

  const invalidFields = fieldTypes
    .filter(({ key, type }) => key in body && typeof body[key] !== type)
    .map(({ key, type }) => `${key} (expected ${type})`);

  return invalidFields;
};
