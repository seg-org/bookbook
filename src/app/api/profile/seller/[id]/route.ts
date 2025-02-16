import { getUrl } from "@/app/api/objects/s3";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { sellerProfile: true },
    });

    if (!user) {
      return NextResponse.json({ error: `User with id ${id} not found` }, { status: 404 });
    }

    const userWithImageUrl = {
      ...user,
      sellerProfile: {
        ...user.sellerProfile,
        idCardImageUrl: getUrl("idCard_images", user.sellerProfile?.idCardImageKey || ""),
      },
    };

    return NextResponse.json(userWithImageUrl);
  } catch (error) {
    if (error instanceof Error) console.error(`Error getting user with id ${id}`, error.stack);
    return NextResponse.json({ error: "Cannot get a user" }, { status: 500 });
  }
}
