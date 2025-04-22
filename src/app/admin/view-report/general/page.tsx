"use client";

import { User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card/Card";
import { apiClient } from "@/data/axios";
import { deleteGeneralReport } from "@/data/report";

interface GeneralReport {
  id: string;
  reason: string;
  createdAt: string;
  reporter: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function SellerReviewsPage() {
  const [reviews, setReviews] = useState<GeneralReport[]>([]);
  const [sortBy, setSortBy] = useState("newest");

  const handleDeleteReport = async (reportId: string) => {
    await deleteGeneralReport(reportId);
    setReviews((prev) => prev.filter((report) => report.id !== reportId));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rRes] = await Promise.all([apiClient.get(`/view-report/general`)]);
        setReviews(rRes.data);
      } catch (err) {
        console.error("Failed to load general reports", err);
      }
    };
    fetchData();
  }, []);

  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return 0;
    });
  }, [reviews, sortBy]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">รายงานปัญหาการใช้งานทั่วไป</h1>

      <div className="mb-4 flex justify-end">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">ล่าสุด</option>
          <option value="oldest">เก่าสุด</option>
        </select>
      </div>

      {sortedReviews.length === 0 ? (
        <Card>
          <div className="p-8 text-center">
            <h3 className="text-xl font-medium text-gray-500">ยังไม่มีรายงานปัญหา</h3>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedReviews.map((report) => (
            <Card key={report.id} className="overflow-hidden">
              <div className="p-4">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-6 w-6 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      {report.reporter.firstName} {report.reporter.lastName}
                      <div className="text-sm text-gray-500">{formatDate(report.createdAt)}</div>
                    </div>
                  </div>
                </div>
                <div className="mb-4 flex items-center gap-3 rounded-md bg-gray-50 p-3">
                  <div className="font-medium">{report.reason}</div>
                </div>
              </div>
              <Button className="m-4 bg-blue-500 hover:bg-blue-600" onClick={() => handleDeleteReport(report.id)}>
                ยอมรับ
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
