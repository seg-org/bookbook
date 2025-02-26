import { TransactionFailType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getUrl } from "../../objects/s3";

import { TransactionRespone, TransactionUpdateRespone, UpdateTransactionRequest } from "../schemas";

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  try {
    const parsedData = UpdateTransactionRequest.safeParse(await req.json());
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

    const updateTransaction = await prisma.$transaction(async (prisma) => {
      const updateTransaction = await prisma.transaction.update({
        where: { id: id },
        data: {
          ...(parsedData.data.status ? { status: parsedData.data.status } : {}),
          ...(parsedData.data.trackingURL ? { trackingURL: parsedData.data.trackingURL } : {}),
          ...(parsedData.data.isDelivered ? { isDelivered: parsedData.data.isDelivered } : {}),
          ...(parsedData.data.paymentMethod ? { paymentMethod: parsedData.data.paymentMethod } : {}),
          ...(parsedData.data.hashId ? { hashId: parsedData.data.hashId } : {}),
          ...(parsedData.data.shipmentMethod ? { shipmentMethod: parsedData.data.shipmentMethod } : {}),
        },
      });

      if (transaction.status === "FAIL" || transaction.status === "HOLD") {
        await prisma.transactionFail.deleteMany({
          where: { transactionId: id },
        });

        const updateTransactionFail = await prisma.transactionFail.create({
          data: {
            transactionId: updateTransaction.id,
            evidenceURL: parsedData.data.evidenceURL,
            detail: parsedData.data.detail,
            failType: (parsedData.data.status === "FAIL" && parsedData.data.failType) || TransactionFailType.UNDEFINED,
          },
        });
        return {
          ...updateTransaction,
          failData: updateTransactionFail,
        };
      }

      return updateTransaction;
    });

    return NextResponse.json(TransactionUpdateRespone.parse(updateTransaction));
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

    return NextResponse.json(TransactionRespone.parse(transactionWithURL));
  } catch (error) {
    if (error instanceof Error) console.error(`Error getting transaction with id ${id}`, error.stack);
    return NextResponse.json({ error: "Cannot get the transaction" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  try {
    await prisma.transactionFail.deleteMany({ where: { transactionId: id } });

    await prisma.transaction.deleteMany({ where: { id: id } });

    return NextResponse.json({ message: `Transaction with id ${id} deleted successfully` }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) console.error(`Error deleting book with id ${id}`, error.stack);
    return NextResponse.json({ error: "Cannot delete book" }, { status: 500 });
  }
}
