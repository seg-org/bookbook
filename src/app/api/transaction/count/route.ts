import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { GetTransactionCountRequest, TransactionCountRespone } from "../schemas";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const parsedData = GetTransactionCountRequest.safeParse(queryParams);
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    console.log(searchParams);

    const transactionCount = await prisma.transaction.count({
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

    return NextResponse.json(TransactionCountRespone.parse(transactionCount), { status: 201 });
  } catch (error) {
    if (error instanceof Error) console.error("Error getting transaction count", error.stack);
    return NextResponse.json({ error: "Cannot get a transaction count" }, { status: 500 });
  }
}
