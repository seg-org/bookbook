// src/app/admin-dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, DollarSign, Users, UserPlus, BarChart3 } from "lucide-react"; // Lucide icons

interface Metrics {
  totalSales: number;
  transactionCount: number;
  activeUsers: number;
  newUsersThisWeek: number;
  averageOrderValue: number;
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
  ];

  return (
    <section className="p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {metricCards.map(({ title, value, icon: Icon }) => (
          <Card key={title} className="shadow-sm hover:shadow-md transition">
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
