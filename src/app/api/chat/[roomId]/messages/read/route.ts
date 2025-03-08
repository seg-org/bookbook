import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { ReadMessageRequest } from "../../../schemas";

export async function PATCH(req: NextRequest, props: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await props.params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsedData = ReadMessageRequest.safeParse(await req.json());
  if (!parsedData.success) {
    return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
  }
  const userId = parsedData.data.userId;

  try {
    // check chatRoom exists and user is a member
    const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });
    if (!room) {
      return NextResponse.json({ error: `Room with id ${roomId} not found` }, { status: 404 });
    }
    if (!room.userIds.includes(session.user.id)) {
      return NextResponse.json({ error: "You are not a member of this room" }, { status: 403 });
    }

    const lastRead = userId === room.userIds[0] ? "lastReadA" : "lastReadB";
    const chatRoom = await prisma.chatRoom.update({
      where: { id: roomId },
      data: { [lastRead]: new Date() },
    });
    if (!chatRoom) {
      return NextResponse.json({ error: `ChatRoom with roomId ${roomId} not found` }, { status: 404 });
    }

    return NextResponse.json(chatRoom);
  } catch (error) {
    if (error instanceof Error) console.error(`Error updating lastRead of chatRoom with roomId ${roomId}`, error.stack);
    return NextResponse.json({ error: "Cannot update chatRoom's lastRead" }, { status: 500 });
  }
}
