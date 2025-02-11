import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createDamageRequest = z.object({
  postId: z.string(),
  damagePictureURL: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const parsedData = createDamageRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id: parsedData.data.postId },
    });
    if (!post) {
      return NextResponse.json({ error: `Post with id ${parsedData.data.postId} not found` }, { status: 404 });
    }

    const newDamage = await prisma.damage.create({
      data: parsedData.data,
    });

    return NextResponse.json(newDamage, { status: 201 });
  } catch (error) {
    if (error instanceof Error) console.error("Error creating damage", error.stack);
    return NextResponse.json({ error: "Cannot create damage" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ error: "postId is required" }, { status: 400 });
  }

  try {
    const damages = await prisma.damage.findMany({
      where: { postId },
    });

    return NextResponse.json(damages);
  } catch (error) {
    if (error instanceof Error) console.error("Error getting damages", error.stack);
    return NextResponse.json({ error: "Cannot get damages" }, { status: 500 });
  }
}