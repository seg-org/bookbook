import { prisma } from "@/lib/prisma";
import { TransactionStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";


const createTransactionRequest = z.object({
  buyerId: z.string(),
  postId: z.string(),

  paymentMethod: z.enum(["CREDIT_CARD","ONLINE_BANKING"]),
  hashId: z.string(),

  shipmentMethod: z.enum(["DELIVERY"]),
  trackingURL: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    console.log("json : ")
    console.log(req)
    const parsedData = createTransactionRequest.safeParse(await req.json());
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
    }

    const buyer = await prisma.user.findUnique({
      where: { id: parsedData.data.buyerId },
    })
    if(!buyer) {
      return NextResponse.json({ error: `buyer with id ${parsedData.data.buyerId} not found` }, { status: 404 });
    }

    const post = await prisma.post.findUnique({
      where: { id: parsedData.data.postId },      
    })
    if(!post) {
      return NextResponse.json({ error: `post with id ${parsedData.data.postId} not found` }, { status: 404 });
    }
    if(!post.published) {
      return NextResponse.json({ error: `post with id ${parsedData.data.postId} is not published` }, { status: 404 });
    }

    const newTransaction = await prisma.transaction.create({
      data : {
        ...parsedData.data,
        sellerId: post.sellerId,
        status: TransactionStatus.APPROVING,
        amount: post.price,
        isDelivered: false
      }
    })

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    if (error instanceof Error) console.error("Error creating a transaction", error.stack);
    return NextResponse.json({ error: "Cannot create a transaction" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      include: { 
        buyer: true,
        seller: true,
        post: true,
        failData: true 
      },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    if (error instanceof Error) console.error("Error getting transactions", error.stack);
    return NextResponse.json({ error: "Cannot get transactions" }, { status: 500 });
  }
}
