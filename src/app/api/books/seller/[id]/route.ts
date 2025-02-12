import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  try {
    const books = await prisma.book.findMany({
      where: { sellerId: id },
    });

    return NextResponse.json(books);
  } catch (error) {
    if (error instanceof Error) console.error(`Error getting books with sellerId ${id}`, error.stack);
    return NextResponse.json({ error: "Cannot get a book" }, { status: 500 });
  }
}
