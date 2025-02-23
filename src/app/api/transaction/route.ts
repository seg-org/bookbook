import { PaymentMethod, ShipmentMethod, TransactionStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

import { getUrl } from "../objects/s3";

const createTransactionRequest = z.object({
  buyerId: z.string(),
  postId: z.string(),

  amount: z.number().nonnegative(),
});

const beginningOfTime = new Date("0000-01-01T00:00:00Z");
const endOfTime = new Date("9999-12-31T23:59:59Z");

const parseToBoolean = (dft: boolean) => {
  return (val: string | undefined) => (val ? val == "true" : dft);
};

const parseToPosInt = (dft: number) => {
  return (val: string | undefined) => (val ? Math.max(parseInt(val), 0) : dft);
};

const parseToDate = (dft: Date) => {
  return (val: string | undefined) => (val ? new Date(val) : dft);
};

const getTransactionRequest = z.object({
  userId: z.string().optional(),
  startDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), { message: "Invalid date format" })
    .transform(parseToDate(beginningOfTime)),
  endDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), { message: "Invalid date format" })
    .transform(parseToDate(endOfTime)),
  asBuyer: z.string().optional().transform(parseToBoolean(true)),
  asSeller: z.string().optional().transform(parseToBoolean(true)),
  skip: z.string().optional().transform(parseToPosInt(0)),
  take: z.string().optional().transform(parseToPosInt(-1)),
});

export async function POST(req: NextRequest) {
  try {
    const parsedData = createTransactionRequest.safeParse(await req.json());
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
        status: TransactionStatus.APPROVING,
        paymentMethod: PaymentMethod.UNDEFINED,
        hashId: "",
        amount: parsedData.data.amount,
        shipmentMethod: ShipmentMethod.UNDEFINED,
        trackingURL: "",
        isDelivered: false,
      },
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    if (error instanceof Error) console.error("Error creating a transaction", error.stack);
    return NextResponse.json({ error: "Cannot create a transaction" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const parsedData = getTransactionRequest.safeParse(queryParams);
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const transactions = await prisma.transaction.findMany({
      skip: parsedData.data.skip,
      ...(parsedData.data.take !== -1 ? { take: parsedData.data.take } : {}),
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
      include: {
        post: {
          include: {
            book: true,
          },
        },
        buyer: true,
        seller: true,
        failData: true,
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
      })
    );

    return NextResponse.json(transactionsWithURL, { status: 201 });
  } catch (error) {
    if (error instanceof Error) console.error("Error getting transactions", error.stack);
    return NextResponse.json({ error: "Cannot get a transaction" }, { status: 500 });
  }
}
