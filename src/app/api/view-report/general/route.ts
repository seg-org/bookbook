import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const generalReports = await prisma.generalReport.findMany({
      include: {
        reporter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const formatted = generalReports.map((r) => ({
      id: r.id,
      reporter: {
        id: r.reporter.id,
        firstName: r.reporter.firstName,
        lastName: r.reporter.lastName,
      },
      reason: r.reason ?? "",
      createdAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error fetching general reports:", error);
    return NextResponse.json({ error: "Failed to fetch general reports" }, { status: 500 });
  }
}
