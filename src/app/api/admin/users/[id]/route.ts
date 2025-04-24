import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  if (req === undefined) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await props.params;

  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, address, bannedAt, bannedReason } = body;

    await prisma.user.update({
      where: { id: id },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        ...(bannedAt !== undefined && { bannedAt: bannedAt ? new Date(bannedAt) : null }),
        ...(bannedReason !== undefined && { bannedReason }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user",
      },
      { status: 400 },
    );
  }
}
