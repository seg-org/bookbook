import { prisma } from "@/lib/prisma";
import { TransactionFailType } from "@prisma/client";
import { equal } from "assert";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateTransactionRequest = z.object({
  status: z.enum(["APPROVING","PAYING","VERIFYING","COMPLETE","FAIL"]),
  isDelivered: z.boolean(),

  // for fail status only
  evidenceURL: z.string().optional().transform(value => value ?? ""),
  detail: z.string().optional().transform(value => value ?? ""),  
  failType: z.enum(["CHEAT"]).optional(),
}).refine(data => data.status !== "FAIL" || (data.evidenceURL && data.detail && data.failType),{
  message: "If status is fail, evidenceURL, detail, and failType must be given",
  path: ["status"]
})

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;  
  try {
    const transaction = await prisma.transaction.findFirst({
      where: { id: id },
    });

    if (!transaction) {
      return NextResponse.json({ error: `Transaction with id ${id} not found` }, { status: 404 });
    }

    const parsedData = updateTransactionRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const updateTransaction = await prisma.transaction.update({
      where: { id: id },
      data: {
        status: parsedData.data.status,
        isDelivered: parsedData.data.isDelivered
      }
    });

    if(transaction.status == "FAIL") {
      await prisma.transactionFail.deleteMany({ where: { transactionId : id } });
    }

    if(parsedData.data.status == "FAIL") {
      const updateTransactionFail = await prisma.transactionFail.create({
        data: {
          transactionId: updateTransaction.id,
          evidenceURL: parsedData.data.evidenceURL,
          detail: parsedData.data.detail,
          failType: (parsedData.data.failType ?? TransactionFailType.CHEAT)
        }
      });
    }

    return NextResponse.json(updateTransaction);
  } catch (error) {
    if (error instanceof Error) console.error(`Error updating transaction with id ${id}`, error.stack);
    return NextResponse.json({ error: "Cannot update the transaction" }, { status: 500 });
  }
}

export async function GET(_: NextRequest, props : { params: Promise<{ id: string}> }) {
  const { id } = await props.params;  
  try {
    const transaction = await prisma.transaction.findFirst({
      where: { id: id },
      include : {
        buyer: true,
        seller: true,
        post: true,
        failData: true
      }
    });

    if (!transaction) {
      return NextResponse.json({ error: `Transaction with id ${id} not found` }, { status: 404 });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    if (error instanceof Error) console.error(`Error updating transaction with id ${id}`, error.stack);
    return NextResponse.json({ error: "Cannot update the transaction" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;  
  try {

    await prisma.transactionFail.deleteMany({ where: { transactionId : id } });

    const result = await prisma.transaction.deleteMany({ where: { id: id } });

    return NextResponse.json({ message: `${result.count} transactions with id ${id} deleted successfully` }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) console.error(`Error deleting book with id ${id}`, error.stack);
    return NextResponse.json({ error: "Cannot delete book" }, { status: 500 });
  }
}