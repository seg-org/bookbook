import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createChatRoomRequest = z.object({
  subject: z.enum(["post", "report"]),
  subjectId: z.string(),
  userId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const parsedData = createChatRoomRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: parsedData.data.userId },
    });
    if (!user) return NextResponse.json({ error: `User with id ${parsedData.data.userId} not found` }, { status: 404 });

    if (parsedData.data.subject === "post") {
      let chatRoom = await prisma.chatRoom.findFirst({
        where: { postId: parsedData.data.subjectId, userIds: { hasSome: [parsedData.data.userId] } },
      });
      if (!chatRoom) {
        // not found, create a new chat room
        const post = await prisma.post.findUnique({
          where: { id: parsedData.data.subjectId },
        });
        if (!post) {
          return NextResponse.json({ error: `Post with id ${parsedData.data.subjectId} not found` }, { status: 404 });
        }

        chatRoom = await prisma.chatRoom.create({
          data: {
            postId: parsedData.data.subjectId,
            userIds: [parsedData.data.userId, post.sellerId],
          },
        });
      }

      return NextResponse.json(chatRoom, { status: 200 });
    }
  } catch (error) {
    if (error instanceof Error) console.error("Error creating a chatroom", error.stack);
    return NextResponse.json({ error: "Cannot create a chatroom" }, { status: 500 });
  }
}
