// src/app/api/admin/dashboard-metrics/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const [totalSalesAgg, transactionCount, activeUsers, newUsersThisWeek] = await Promise.all([
    prisma.transaction.aggregate({
      _sum: { amount: true },
    }),
    prisma.transaction.count(),
    prisma.user.count({
      where: {
        buyTransactions: {
          some: {},
        },
      },
    }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // past 7 days
        },
      },
    }),
  ]);

  const totalSales = totalSalesAgg._sum?.amount ?? 0;
  const avgOrderValue = transactionCount > 0 ? totalSales / transactionCount : 0;

  return NextResponse.json({
    totalSales,
    transactionCount,
    activeUsers,
    newUsersThisWeek,
    averageOrderValue: Math.round(avgOrderValue),
  });
}
