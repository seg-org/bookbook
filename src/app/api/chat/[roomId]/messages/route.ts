import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, props: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await props.params;
  try {
    const chatMessages = await prisma.chatMessage.findMany({
      where: { roomId },
    });

    if (!chatMessages) {
      return NextResponse.json({ error: `ChatMessages with roomId ${roomId} not found` }, { status: 404 });
    }

    return NextResponse.json(chatMessages);
  } catch (error) {
    if (error instanceof Error) console.error(`Error getting chatMessages with roomId ${roomId}`, error.stack);
    return NextResponse.json({ error: "Cannot get chatMessages" }, { status: 500 });
  }
}
