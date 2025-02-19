import { prisma } from "@/lib/prisma";
import { TransactionFailType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUrl } from "../../objects/s3";

const updateTransactionRequest = z
  .object({
    status: z.enum(["APPROVING", "PAYING", "PACKING", "DELIVERING", "COMPLETE", "HOLD", "FAIL"]).optional(),
    isDelivered: z.boolean().optional(),
    trackingURL: z.string().optional(),

    // for fail status only
    evidenceURL: z
      .string()
      .optional()
      .transform((value) => value ?? ""),
    detail: z
      .string()
      .optional()
      .transform((value) => value ?? ""),
    failType: z
      .enum(["UNDELIVERED", "UNQUALIFIED", "REJECT", "TERMINATION", "OTHER"])
      .optional()
      .transform((value) => value ?? TransactionFailType.OTHER),
  })
  .refine((data) => data.status !== "FAIL" || (data.evidenceURL && data.detail && data.failType), {
    message: "If status is fail, evidenceURL, detail, and failType must be given",
    path: ["status"],
  });

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  try {
    const parsedData = updateTransactionRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const transaction = await prisma.transaction.findFirst({
      where: { id: id },
      select: {
        status: true,
      },
    });

    if (!transaction) {
      return NextResponse.json({ error: `Transaction with id ${id} not found` }, { status: 404 });
    }

    const result = await prisma.$transaction(async (prisma) => {
      const updateTransaction = await prisma.transaction.update({
        where: { id: id },
        data: {
          ...(parsedData.data.status ? { status: parsedData.data.status } : {}),
          ...(parsedData.data.trackingURL ? { trackingURL: parsedData.data.trackingURL } : {}),
          ...(parsedData.data.isDelivered ? { isDelivered: parsedData.data.isDelivered } : {}),
        },
      });

      if (transaction.status == "FAIL") {
        await prisma.transactionFail.deleteMany({
          where: { transactionId: id },
        });
      }

      if (parsedData.data.status == "FAIL") {
        await prisma.transactionFail.create({
          data: {
            transactionId: updateTransaction.id,
            evidenceURL: parsedData.data.evidenceURL,
            detail: parsedData.data.detail,
            failType: parsedData.data.failType,
          },
        });
      }

      return updateTransaction;
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) console.error(`Error updating transaction with id ${id}`, error.stack);
    return NextResponse.json({ error: "Cannot update the transaction" }, { status: 500 });
  }
}

export async function GET(_: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  try {
    const transaction = await prisma.transaction.findFirst({
      where: { id: id },
      include: {
        buyer: true,
        seller: true,
        post: {
          include: {
            book: true,
          },
        },
        failData: true,
      },
    });

    if (!transaction) {
      return NextResponse.json({ error: `Transaction with id ${id} not found` }, { status: 404 });
    }

    const url = getUrl("book_images", transaction.post.book.coverImageKey);
    const transactionWithURL = {
      ...transaction,
      post: {
        ...transaction.post,
        book: {
          ...transaction.post.book,
          coverImageUrl: url,
        },
      },
    };

    return NextResponse.json(transactionWithURL);
  } catch (error) {
    if (error instanceof Error) console.error(`Error getting transaction with id ${id}`, error.stack);
    return NextResponse.json({ error: "Cannot get the transaction" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  try {
    await prisma.transactionFail.deleteMany({ where: { transactionId: id } });

    const result = await prisma.transaction.deleteMany({ where: { id: id } });

    return NextResponse.json(
      { message: `${result.count} transactions with id ${id} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) console.error(`Error deleting book with id ${id}`, error.stack);
    return NextResponse.json({ error: "Cannot delete book" }, { status: 500 });
  }
}
