import { prisma } from "@/lib/prisma";
import { TransactionStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUrl } from "../objects/s3";

const createTransactionRequest = z.object({
  buyerId: z.string(),
  postId: z.string(),

  paymentMethod: z.enum(["CREDIT_CARD", "ONLINE_BANKING"]),
  hashId: z.string(),

  shipmentMethod: z.enum(["DELIVERY"]),
  trackingURL: z.string(),

  amount: z.number(),
});

const beginningOfTime = new Date("0000-01-01T00:00:00Z");
const endOfTime = new Date("9999-12-31T23:59:59Z");

const getTransactionRequest = z.object({
  userId: z.string().default(() => ""),
  startDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), { message: "Invalid date format" })
    .transform((val) => (val == undefined ? beginningOfTime : new Date(val))),
  endDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), { message: "Invalid date format" })
    .transform((val) => (val == undefined ? endOfTime : new Date(val))),
  asBuyer: z
    .string()
    .optional()
    .transform((val) => (val == undefined ? true : val == "true")),
  asSeller: z
    .string()
    .optional()
    .transform((val) => (val == undefined ? true : val == "true")),
  skip: z
    .string()
    .optional()
    .transform((val) => (val == undefined ? 0 : Math.max(0,parseInt(val)))),
  take: z
    .string()
    .optional()
    .transform((val) => (val == undefined ? -1 : Math.max(0,parseInt(val)))),
});

export async function POST(req: NextRequest) {
  try {
    const parsedData = createTransactionRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const buyer = await prisma.user.findUnique({
      where: { id: parsedData.data.buyerId },
    });
    if (!buyer) {
      return NextResponse.json({ error: `buyer with id ${parsedData.data.buyerId} not found` }, { status: 404 });
    }

    const post = await prisma.post.findUnique({
      where: { id: parsedData.data.postId },
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
        status: TransactionStatus.PAYING,
        amount: parsedData.data.amount,
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
      ...(parsedData.data.take !== -1 ? {take: parsedData.data.take} : {}),
      where: {
        createdAt: {
          gte: parsedData.data.startDate,
          lte: parsedData.data.endDate,
        },
        ...(parsedData.data.userId !== ""
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
