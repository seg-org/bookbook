// src/app/api/admin/dashboard-metrics/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
  ]);

  const totalSales = totalSalesAgg._sum?.amount ?? 0;
  const averageOrderValue = transactionCount > 0 ? totalSales / transactionCount : 0;

  // 🆕 Additional metrics
  const [bookCount, userWithNoTx, booksWithNoTx] = await Promise.all([
    prisma.book.count(),
    prisma.user.count({
      where: {
        buyTransactions: {
          none: {},
        },
      },
    }),
    prisma.book.count({
      where: {
        posts: {
          every: {
            transactions: {
              none: {},
            },
          },
        },
      },
    }),
  ]);


  return NextResponse.json({
    totalSales,
    transactionCount,
    activeUsers,
    newUsersThisWeek,
    averageOrderValue: Math.round(averageOrderValue),
    bookCount,
    userWithNoTx,
    booksWithNoTx,
  });
}
