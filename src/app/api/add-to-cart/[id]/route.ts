import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  try {
    const postId = await prisma.cart.findFirst({
      where: { userId: id },
    });
    if (!postId) {
      return NextResponse.json({ error: `Cart with id ${id} not found` }, { status: 404 });
    }
    return NextResponse.json(postId);
  } catch (error) {
    if (error instanceof Error) console.error("Error getting cart", error.stack);
    return NextResponse.json({ error: "Cannot get cart" }, { status: 500 });
  }
}
