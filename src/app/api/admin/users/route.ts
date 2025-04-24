import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  if (req === undefined) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            buyTransactions: true,
            sellTransactions: true,
            posts: true,
          },
        },
        sellerProfile: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse("Bad Request", { status: 400 });
  }
}
