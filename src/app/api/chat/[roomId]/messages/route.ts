import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createChatMessageRequest = z.object({
  message: z.string(),
  roomId: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsedData = createChatMessageRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    // check chatRoom exists and user is a member
    const room = await prisma.chatRoom.findUnique({ where: { id: parsedData.data.roomId } });
    if (!room) {
      return NextResponse.json({ error: `Room with id ${parsedData.data.roomId} not found` }, { status: 404 });
    }
    if (!room.userIds.includes(session.user.id)) {
      return NextResponse.json({ error: "You are not a member of this room" }, { status: 403 });
    }

    const chatMessage = await prisma.$transaction(async (prisma) => {
      const message = await prisma.chatMessage.create({
        data: { message: parsedData.data.message, roomId: parsedData.data.roomId, senderId: session.user.id },
      });

      const lastRead = session.user.id === room.userIds[0] ? "lastReadA" : "lastReadB";
      await prisma.chatRoom.update({
        where: { id: parsedData.data.roomId },
        data: { [lastRead]: new Date() },
      });

      return message;
    });

    return NextResponse.json(chatMessage, { status: 200 });
  } catch (error) {
    if (error instanceof Error) console.error("Error creating chatMessage", error.stack);
    return NextResponse.json({ error: "Cannot create a chatMessage" }, { status: 500 });
  }
}

export async function GET(_: NextRequest, props: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await props.params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    // check chatRoom exists and user is a member
    const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });
    if (!room) {
      return NextResponse.json({ error: `Room with id ${roomId} not found` }, { status: 404 });
    }
    if (!room.userIds.includes(session.user.id)) {
      return NextResponse.json({ error: "You are not a member of this room" }, { status: 403 });
    }

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
