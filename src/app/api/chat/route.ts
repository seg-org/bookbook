import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createChatRoomRequest = z.object({
  subject: z.enum(["post", "report"]),
  subjectId: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const parsedData = createChatRoomRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user) return NextResponse.json({ error: `User with id ${session.user.id} not found` }, { status: 404 });

    if (parsedData.data.subject === "post") {
      let chatRoom = await prisma.chatRoom.findFirst({
        where: { postId: parsedData.data.subjectId, userIds: { hasSome: [session.user.id] } },
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
            userIds: [session.user.id, post.sellerId],
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
