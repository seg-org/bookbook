// src/app/api/admin/dashboard-metrics/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const [totalSalesAgg, transactionCount, activeUsers] = await Promise.all([
    prisma.transaction.aggregate({
      _sum: { amount: true }, // field confirmed in schema
    }),
    prisma.transaction.count(),
    prisma.user.count({
      where: {
        buyTransactions: {
          some: {}, // valid relation
        },
      },
    }),
  ]);

  return NextResponse.json({
    totalSales: totalSalesAgg._sum?.amount ?? 0,
    transactionCount,
    activeUsers,
  });
}
