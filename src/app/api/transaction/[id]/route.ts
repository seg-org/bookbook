import { TransactionFailType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { getUrl } from "../../objects/s3";
import {
  TransactionCountRespone,
  TransactionRespone,
  TransactionUpdateRespone,
  UpdateTransactionRequest,
} from "../schemas";

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

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

    if (parsedData.data.status == "FAIL" || (transaction.status == "HOLD" && parsedData.data.status != "HOLD")) {
      if (!session?.user?.isAdmin) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    const updateTransaction = await prisma.$transaction(async (prisma) => {
      const updateTransaction = await prisma.transaction.update({
        where: { id: id },
        data: {
          ...(parsedData.data.status !== undefined ? { status: parsedData.data.status } : {}),
          ...(parsedData.data.paymentMethod !== undefined ? { paymentMethod: parsedData.data.paymentMethod } : {}),
          ...(parsedData.data.hashId !== undefined ? { hashId: parsedData.data.hashId } : {}),
          ...(parsedData.data.amount !== undefined ? { amount: parsedData.data.amount } : {}),
          ...(parsedData.data.shipmentMethod !== undefined ? { shipmentMethod: parsedData.data.shipmentMethod } : {}),
          ...(parsedData.data.address !== undefined ? { address: parsedData.data.address } : {}),
          ...(parsedData.data.trackingURL !== undefined ? { trackingURL: parsedData.data.trackingURL } : {}),
          ...(parsedData.data.trackingNumber !== undefined ? { trackingNumber: parsedData.data.trackingNumber } : {}),
          ...(parsedData.data.isDelivered !== undefined ? { isDelivered: parsedData.data.isDelivered } : {}),
        },
      });

      if (transaction.status === "FAIL" || transaction.status === "HOLD") {
        await prisma.transactionFail.deleteMany({
          where: { transactionId: id },
        });
      }

      if (updateTransaction.status === "FAIL" || updateTransaction.status === "HOLD") {
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
        review: true,
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
