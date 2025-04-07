// src/app/admin-dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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

  if (!metrics) return <p className="p-4">Loading...</p>;

  return (
    <div className="space-y-6 p-6">
      {/* Metrics cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>{metrics.totalSales} ฿</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>{metrics.transactionCount}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>{metrics.activeUsers}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>New Users (7d)</CardTitle>
          </CardHeader>
          <CardContent>{metrics.newUsersThisWeek}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg. Order Value</CardTitle>
          </CardHeader>
          <CardContent>{metrics.averageOrderValue.toFixed(2)} ฿</CardContent>
        </Card>
      </div>
    </div>
  );
}
