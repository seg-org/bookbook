import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { CreateChatReportRequest } from "../schemas";
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsedData = CreateChatReportRequest.parse(body);

    const report = await prisma.chatReport.create({
      data: parsedData,
    });

    return NextResponse.json({ message: "Report submitted successfully", report });
  } catch (error: any) {
    console.error("Error submitting report:", error?.message || error, error?.stack);
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
}
