import { ShipmentMethod, TransactionStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getUrl } from "../objects/s3";
import {
  CreateTransactionRequest,
  GetTransactionRequest,
  TransactionCreateRespone,
  TransactionsRespone,
} from "./schemas";

export async function POST(req: NextRequest) {
  try {
    const parsedData = CreateTransactionRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const buyer = await prisma.user.count({
      where: { id: parsedData.data.buyerId },
    });
    if (buyer !== 1) {
      return NextResponse.json({ error: `buyer with id ${parsedData.data.buyerId} not found` }, { status: 404 });
    }

    const post = await prisma.post.findUnique({
      where: { id: parsedData.data.postId },
      select: {
        published: true,
        sellerId: true,
        price: true,
      },
    });
    if (!post) {
      return NextResponse.json({ error: `post with id ${parsedData.data.postId} not found` }, { status: 404 });
    }
    if (!post.published) {
      return NextResponse.json({ error: `post with id ${parsedData.data.postId} is not published` }, { status: 404 });
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        ...parsedData.data,
        sellerId: post.sellerId,
        status: TransactionStatus.PACKING,
        amount: parsedData.data.amount,

        shipmentMethod: ShipmentMethod.UNDEFINED,
        trackingURL: "",
        trackingNumber: "",
        isDelivered: false,
      },
    });

    return NextResponse.json(TransactionCreateRespone.parse(newTransaction), { status: 201 });
  } catch (error) {
    if (error instanceof Error) console.error("Error creating a transaction", error.stack);
    return NextResponse.json({ error: "Cannot create a transaction" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const parsedData = GetTransactionRequest.safeParse(queryParams);
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const transactions = await prisma.transaction.findMany({
      skip: parsedData.data.skip,
      ...(parsedData.data.take !== -1 ? { take: parsedData.data.take } : {}),
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
              parsedData.data.isPacking ? { status: TransactionStatus.PACKING } : {},
              parsedData.data.isDelivering ? { status: TransactionStatus.DELIVERING } : {},
              parsedData.data.isHold ? { status: TransactionStatus.HOLD } : {},
              parsedData.data.isComplete ? { status: TransactionStatus.COMPLETE } : {},
              parsedData.data.isFail ? { status: TransactionStatus.FAIL } : {},
              { id: "" },
            ].filter(Boolean),
          },
        ],
      },
      include: {
        post: {
          include: {
            book: true,
          },
        },
        buyer: true,
        seller: true,
        failData: true,
        review: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const transactionsWithURL = await Promise.all(
      transactions.map((transaction) => {
        const url = getUrl("book_images", transaction.post.book.coverImageKey);
        return {
          ...transaction,
          post: {
            ...transaction.post,
            book: {
              ...transaction.post.book,
              coverImageUrl: url,
            },
          },
        };
      }),
    );

    return NextResponse.json(TransactionsRespone.parse(transactionsWithURL), { status: 201 });
  } catch (error) {
    if (error instanceof Error) console.error("Error getting transactions", error.stack);
    return NextResponse.json({ error: "Cannot get a transaction" }, { status: 500 });
  }
}
