import { Activity, BarChart3, BookOpen, DollarSign, UserCog, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { forbidden } from "next/navigation";
import { getServerSession } from "next-auth";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Metrics = {
  totalSales: number;
  transactionCount: number;
  activeUsers: number;
  newUsersThisWeek: number;
  averageOrderValue: number;
  bookCount: number;
};

async function getMetrics() {
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

  return data;
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.isAdmin === true;

  const metrics = await getMetrics();

  if (!isAdmin) {
    forbidden();
  }

  const metricCards = [
    {
      title: "ยอดขายทั้งหมด",
      value: `${metrics.totalSales.toLocaleString()} ฿`,
      icon: DollarSign,
    },
    {
      title: "จำนวนรายการ",
      value: metrics.transactionCount.toLocaleString(),
      icon: BarChart3,
    },
    {
      title: "ผู้ใช้ที่ใช้งานอยู่",
      value: metrics.activeUsers.toLocaleString(),
      icon: Users,
    },
    {
      title: "ผู้ใช้ใหม่ (7 วัน)",
      value: metrics.newUsersThisWeek.toLocaleString(),
      icon: UserPlus,
    },
    {
      title: "มูลค่าการสั่งซื้อเฉลี่ย",
      value: `${metrics.averageOrderValue.toFixed(2)} ฿`,
      icon: Activity,
    },
    {
      title: "จำนวนหนังสือทั้งหมด",
      value: metrics.bookCount.toLocaleString(),
      icon: BookOpen,
    },
  ];

  return (
    <main>
      <section className="w-screen max-w-6xl space-y-6 p-6">
        <h1 className="text-2xl font-bold tracking-tight">แดชบอร์ดผู้ดูแลระบบ</h1>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {metricCards.map(({ title, value, icon: Icon }, index) => (
            <Card key={index} className="shadow-sm transition hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                {metrics ? (
                  <>
                    <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                    {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                  </>
                ) : (
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                )}
              </CardHeader>
              <CardContent>
                {metrics ? (
                  <div className="text-2xl font-semibold">{value}</div>
                ) : (
                  <div className="h-8 animate-pulse rounded bg-muted" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="w-screen max-w-6xl space-y-6 p-6">
        <h2 className="mb-4 text-2xl font-bold tracking-tight">จัดการต่าง ๆ</h2>

        <Link href="/admin/users">
          <button className="flex items-center gap-1 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600">
            <UserCog />
            <span>จัดการบัญชีผู้ใช้งาน</span>
          </button>
        </Link>
      </section>
    </main>
  );
}
