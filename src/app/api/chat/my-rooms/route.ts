import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const chatRooms = await prisma.chatRoom.findMany({
    where: { userIds: { hasSome: [session.user.id] } },
  });

  return NextResponse.json(chatRooms);
}
