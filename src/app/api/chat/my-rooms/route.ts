import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { getUrl } from "../../objects/s3";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const chatRooms = await prisma.chatRoom.findMany({
    where: { userIds: { hasSome: [session.user.id] } },
    include: { post: { include: { book: true } } },
  });

  const chatRoomsWithInfo = await Promise.all(
    chatRooms.map(async (cr) => {
      const url = getUrl("book_images", cr.post.book.coverImageKey);
      const otherUserId = cr.userIds.find((id) => id !== session.user.id);
      const userB = await prisma.user.findUnique({ where: { id: otherUserId } });
      const lastMessage = await prisma.chatMessage.findFirst({
        where: { roomId: cr.id },
        orderBy: { createdAt: "desc" },
      });

      return {
        ...cr,
        post: {
          book: {
            ...cr.post.book,
            coverImageUrl: url,
          },
        },
        userB,
        lastMessage,
      };
    })
  );

  return NextResponse.json(chatRoomsWithInfo);
}
