import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const parsedData = getTransactionRequest.safeParse(queryParams);
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const transaction_count = await prisma.transaction.count({
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
    });

    return NextResponse.json(transaction_count, { status: 201 });
  } catch (error) {
    if (error instanceof Error) console.error("Error getting transactions", error.stack);
    return NextResponse.json({ error: "Cannot get a transaction" }, { status: 500 });
  }
}
