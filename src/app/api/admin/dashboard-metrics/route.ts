// src/app/api/admin/dashboard-metrics/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface Metrics {
  totalSales: number;
  transactionCount: number;
  activeUsers: number;
  newUsersThisWeek: number;
  averageOrderValue: number;
  bookCount: number;
}

export async function GET() {
  const session = await getServerSession(authOptions);

  // 🚫 Block unauthenticated or non-admin users
  if (!session || !session.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
  const bookCount = await prisma.book.count();

  const data = {
    totalSales,
    transactionCount,
    activeUsers,
    newUsersThisWeek,
    averageOrderValue: Math.round(averageOrderValue),
    bookCount,
  } satisfies Metrics;

  return NextResponse.json(data);
}
