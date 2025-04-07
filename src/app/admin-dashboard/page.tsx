// src/app/admin-dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Metrics {
  totalSales: number;
  transactionCount: number;
  activeUsers: number;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard-metrics")
      .then((res) => res.json())
      .then(setMetrics);
  }, []);

  if (!metrics) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <Card>
        <CardHeader><CardTitle>Total Sales</CardTitle></CardHeader>
        <CardContent>{metrics.totalSales} ฿</CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Transactions</CardTitle></CardHeader>
        <CardContent>{metrics.transactionCount}</CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Active Users</CardTitle></CardHeader>
        <CardContent>{metrics.activeUsers}</CardContent>
      </Card>
    </div>
  );
}
