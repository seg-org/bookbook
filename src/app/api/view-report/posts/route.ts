import { NextResponse } from "next/server";

import { getUrl } from "@/app/api/objects/s3";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const postReports = await prisma.postReport.findMany({
      include: {
        reporter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        post: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                coverImageKey: true,
              },
            },
          },
        },
      },
    });

    const formatted = postReports.map((r) => ({
      id: r.id,
      reporter: {
        id: r.reporter.id,
        firstName: r.reporter.firstName,
        lastName: r.reporter.lastName,
      },
      reason: r.reason ?? "",
      createdAt: r.createdAt.toISOString(),
      post: {
        id: r.post.id,
        title: r.post.title,
        book: {
          title: r.post.book.title,
          coverImageUrl: getUrl("book_images", r.post.book.coverImageKey),
        },
      },
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching general reports:", error);
    return NextResponse.json({ error: "Failed to fetch general reports" }, { status: 500 });
  }
}
