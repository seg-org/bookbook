// src/app/admin-dashboard/page.tsx
"use client";

import { Activity, BarChart3, BookOpen, DollarSign, UserPlus, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import type { Metrics } from "@/app/api/admin/dashboard-metrics/route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const { data: session, status } = useSession();

  const isAdmin = session?.user?.isAdmin === true;

  useEffect(() => {
    if (status !== "loading" && session && !isAdmin) {
      setUnauthorized(true);
    }
  }, [session, status, isAdmin]);

  useEffect(() => {
    if (!session || !isAdmin) return;

    fetch("/api/admin/dashboard-metrics")
      .then((res) => res.json())
      .then(setMetrics)
      .catch((error) => {
        console.error("Error fetching metrics:", error);
        // Consider adding an error state and UI feedback
      });
  }, [session, isAdmin]);

  if (status === "loading") {
    return <p className="p-4 text-sm text-muted-foreground">กำลังตรวจสอบสิทธิ์...</p>;
  }

  if (unauthorized) {
    return (
      <section className="p-6">
        <h1 className="mb-2 text-2xl font-bold text-red-500">ไม่มีสิทธิ์เข้าถึง</h1>
        <p className="text-sm text-muted-foreground">คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้</p>
      </section>
    );
  }

  const metricCards = metrics
    ? [
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
      ]
    : Array(6).fill({ title: "", value: "", icon: null });

  return (
    <section className="space-y-6 p-6">
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
  );
}
