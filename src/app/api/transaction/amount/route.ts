import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { GetTransactionAmountRequest, TransactionAmountRespone } from "../schemas";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const parsedData = GetTransactionAmountRequest.safeParse(queryParams);
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const sumAmount = await prisma.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        createdAt: {
          gte: parsedData.data.startDate,
          lte: parsedData.data.endDate,
        },
        ...(parsedData.data.userId
          ? {
              OR: [
                parsedData.data.asBuyer ? { buyerId: parsedData.data.userId } : {},
                parsedData.data.asSeller ? { sellerId: parsedData.data.userId } : {},
              ].filter(Boolean),
            }
          : {}),
      },
    });

    return NextResponse.json(TransactionAmountRespone.parse(sumAmount._sum.amount), { status: 201 });
  } catch (error) {
    if (error instanceof Error) console.error("Error getting transaction amount", error.stack);
    return NextResponse.json({ error: "Cannot get a transaction amount" }, { status: 500 });
  }
}
