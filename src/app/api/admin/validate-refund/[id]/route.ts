import { TransactionFailType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { TransactionUpdateRespone, UpdateTransactionRequest } from "./schemas";

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
