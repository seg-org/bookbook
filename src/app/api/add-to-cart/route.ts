import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const CreateAddToCartRequest = z.object({
  userId: z.string(),
  postId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const parsedData = CreateAddToCartRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    // If no userid in prisma.cart
    // prisma.cart add (userId, cartId)
    // else
    // prisma.cart update (userId, cartId)
    const { userId, postId } = parsedData.data;
    const cart = await prisma.cart.upsert({
      where: { userId },
      update: { postId: postId },
      create: { userId, postId },
    });
    return NextResponse.json(cart, { status: 201 });
  } catch (error) {
    if (error instanceof Error) console.error("Error adding to cart", error.stack);
    return NextResponse.json({ error: "Cannot add to cart" }, { status: 500 });
  }
}
