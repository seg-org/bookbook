import { prisma } from "@/lib/prisma";
import { TransactionStatus } from "@prisma/client";

import { NextRequest, NextResponse } from "next/server";

import { GetTransactionCountRequest, TransactionCountRespone } from "../schemas";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const parsedData = GetTransactionCountRequest.safeParse(queryParams);
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    console.log(parsedData);

    const transactionCount = await prisma.transaction.count({
      where: {
        AND: [
          {
            createdAt: {
              gte: parsedData.data.startDate,
              lte: parsedData.data.endDate,
            },
          },
          {
            ...(parsedData.data.userId !== undefined
              ? {
                  OR: [
                    parsedData.data.asBuyer ? { buyerId: parsedData.data.userId } : {},
                    parsedData.data.asSeller ? { sellerId: parsedData.data.userId } : {},
                    { id: "" },
                  ].filter(Boolean),
                }
              : {}),
          },
          {
            OR: [
              parsedData.data.IsPacking ? { status: TransactionStatus.PACKING } : {},
              parsedData.data.IsDelivering ? { status: TransactionStatus.DELIVERING } : {},
              parsedData.data.IsHold ? { status: TransactionStatus.HOLD } : {},
              parsedData.data.IsComplete ? { status: TransactionStatus.COMPLETE } : {},
              parsedData.data.IsFail ? { status: TransactionStatus.FAIL } : {},
              { id: "" },
            ].filter(Boolean),
          },
        ],
      },
    });

    return NextResponse.json(TransactionCountRespone.parse(transactionCount), { status: 201 });
  } catch (error) {
    if (error instanceof Error) console.error("Error getting transaction count", error.stack);
    return NextResponse.json({ error: "Cannot get a transaction count" }, { status: 500 });
  }
}
