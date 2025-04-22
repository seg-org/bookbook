import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { CreateChatReportRequest } from "../schemas";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedData = CreateChatReportRequest.parse(body);

    const duplicateReport = await prisma.chatReport.findFirst({
      where: {
        reporterId: parsedData.reporterId,
        roomId: parsedData.roomId,
        createdAt: {
          gte: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
      },
    });

    if (duplicateReport) {
      return NextResponse.json(
        { error: "You have already reported this chat within the last 24 hours." },
        { status: 429 },
      );
    }

    const report = await prisma.chatReport.create({
      data: parsedData,
    });

    return NextResponse.json({ message: "Report submitted successfully", report });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error submitting report:", error.message || error, error.stack);
    }
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const reports = await prisma.chatReport.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        reporter: true,
        room: true,
      },
    });

    return NextResponse.json(reports);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching reports:", error.message || error, error.stack);
    }
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}
