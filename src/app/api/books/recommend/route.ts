import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

// Function to generate a seeded random number
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export async function GET(request: Request) {
  try {
    // Parse the URL parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    }

    // Get all books from the database
    const books = await prisma.book.findMany();

    if (books.length === 0) {
      return NextResponse.json({ error: "No books available" }, { status: 404 });
    }

    // Convert user ID to a number for seeding
    const seed = parseInt(userId, 10) || 0;
    const randomIndex = Math.floor(seededRandom(seed) * books.length);

    const recommendedBook = books[randomIndex];

    return NextResponse.json(recommendedBook);
  } catch (error) {
    console.error("Error fetching recommended book:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
