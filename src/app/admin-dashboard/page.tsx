// src/app/admin-dashboard/page.tsx
"use client";

import { Activity, BarChart3, DollarSign, UserPlus, Users } from "lucide-react"; // Lucide icons
import { useEffect, useState } from "react";
import { BookOpen, UserX, FileX } from "lucide-react"; // ⬅️ Add with your icons

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Metrics {
  totalSales: number;
  transactionCount: number;
  activeUsers: number;
  newUsersThisWeek: number;
  averageOrderValue: number;
  bookCount: number;
  userWithNoTx: number;
  booksWithNoTx: number;
}


export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard-metrics")
      .then((res) => res.json())
      .then(setMetrics);
  }, []);

  if (!metrics) return <p className="p-4 text-sm text-muted-foreground">Loading metrics...</p>;

  const metricCards = [
    {
      title: "Total Sales",
      value: `${metrics.totalSales.toLocaleString()} ฿`,
      icon: DollarSign,
    },
    {
      title: "Transactions",
      value: metrics.transactionCount.toLocaleString(),
      icon: BarChart3,
    },
    {
      title: "Active Users",
      value: metrics.activeUsers.toLocaleString(),
      icon: Users,
    },
    {
      title: "New Users (7d)",
      value: metrics.newUsersThisWeek.toLocaleString(),
      icon: UserPlus,
    },
    {
      title: "Avg. Order Value",
      value: `${metrics.averageOrderValue.toFixed(2)} ฿`,
      icon: Activity,
    },
    {
      title: "Total Books",
      value: metrics.bookCount.toLocaleString(),
      icon: BookOpen,
    },
    {
      title: "Users w/o Transactions",
      value: metrics.userWithNoTx.toLocaleString(),
      icon: UserX,
    },
    {
      title: "Books w/o Transactions",
      value: metrics.booksWithNoTx.toLocaleString(),
      icon: FileX,
    },

  ];

  return (
    <section className="space-y-6 p-6">
      <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {metricCards.map(({ title, value, icon: Icon }) => (
          <Card key={title} className="shadow-sm transition hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
