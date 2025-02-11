// app/api/auth/pdpa-consent/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accepted } = body;

    // Validate the input
    if (typeof accepted !== "boolean") {
      return NextResponse.json({ error: "Invalid consent status" }, { status: 400 });
    }

    // Get the user ID from the session or token (you may need to implement authentication)
    // For now, assume the user ID is passed in the request body
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Update the user's PDPA consent status
    const user = await prisma.user.update({
      where: { id: userId },
      data: { pdpaConsent: accepted },
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
