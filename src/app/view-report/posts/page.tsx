"use client";

import { User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { Card } from "@/components/ui/card/Card";
import { apiClient } from "@/data/axios";

interface PostReport {
  id: string;
  reporter: {
    id: string;
    firstName: string;
    lastName: string;
  };
  reason: string;
  createdAt: string;
  post: {
    id: string;
    title: string;
    book: {
      title: string;
      coverImageUrl: string;
    };
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
  const [reviews, setReviews] = useState<PostReport[]>([]);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rRes] = await Promise.all([apiClient.get(`/view-report/posts`)]);
        setReviews(rRes.data);
      } catch (err) {
        console.error("Failed to load post reports", err);
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
      <h1 className="mb-6 text-3xl font-bold">รายงานปัญหาโพสต์ต่าง ๆ</h1>

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
                  <div className="h-15 relative w-10 overflow-hidden">
                    <Image
                      src={report.post?.book?.coverImageUrl || "/placeholder.svg"}
                      alt={report.post?.id || "Book cover"}
                      width={40}
                      height={60}
                      className="object-cover"
                    />
                  </div>
                  <div className="font-medium">{report.post.id}</div>
                </div>
                <div className="text-gray-700">{report.reason}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
