import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const beginningOfTime = new Date('0000-01-01T00:00:00Z');
const endOfTime = new Date('9999-12-31T23:59:59Z');

const getTransactionRequest = z.object({
  userId: z.string(),
  startDate: z.date().default(() => beginningOfTime),
  endDate: z.date().default(() => endOfTime),
  asBuyer: z.boolean().default(() => true),
  asSeller: z.boolean().default(() => true)
})

export async function POST(req : NextRequest) {
  try {
    const parsedData = getTransactionRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        createOn: {
          gte: parsedData.data.startDate,
          lte: parsedData.data.endDate,
        },
        OR: [
          parsedData.data.asBuyer ? { buyerId: parsedData.data.userId } : {},
          parsedData.data.asSeller ? { sellerId: parsedData.data.userId } : {}
        ].filter(Boolean) 
      }
    })

    return NextResponse.json(transactions, { status: 201 });
  } catch (error) {
    if (error instanceof Error) console.error("Error getting transactions", error.stack);
    return NextResponse.json({ error: "Cannot get a transaction" }, { status: 500 });
  }
}