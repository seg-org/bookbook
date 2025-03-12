import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const reports = await prisma.chatReport.findMany({
      include: {
        // TODO: May need to include more fields here
        reporter: { select: { id: true, firstName: true, email: true } },
        room: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching chat reports:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
