"use client";

import { Search, Star, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card/Card";
import { apiClient } from "@/data/axios";

interface Seller {
  id: string;
  name: string;
  avatar?: string;
  joinDate: string;
  totalSales: number;
  averageRating: number;
  totalReviews: number;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    <div className="mr-1 flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
    <span className="text-sm font-medium">{rating.toFixed(1)}</span>
  </div>
);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function SellerReviewsListPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    const fetchSellers = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get("/profile/seller");

        const sorted = [...res.data].sort((a, b) => {
          if (sortBy === "rating") return b.averageRating - a.averageRating;
          if (sortBy === "reviews") return b.totalReviews - a.totalReviews;
          if (sortBy === "sales") return b.totalSales - a.totalSales;
          if (sortBy === "newest") return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
          return 0;
        });
        setSellers(sorted);
        setFilteredSellers(sorted);
      } catch (err) {
        console.error("Failed to load sellers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, [sortBy]);

  useEffect(() => {
    const filtered = searchQuery.trim()
      ? sellers.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : sellers;
    setFilteredSellers(filtered);
  }, [searchQuery, sellers]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">ผู้ขายทั้งหมด</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse p-5">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                  <div className="h-3 w-1/2 rounded bg-gray-200" />
                  <div className="h-3 w-1/3 rounded bg-gray-200" />
                </div>
              </div>
              <div className="mt-4 h-3 w-full rounded bg-gray-200" />
              <div className="mt-4 h-8 w-24 rounded bg-gray-300" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">ผู้ขายทั้งหมด</h1>

      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="ค้นหาร้านค้า..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-full md:w-48">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="rating">เรียงตามคะแนน</option>
            <option value="reviews">เรียงตามจำนวนรีวิว</option>
            <option value="sales">เรียงตามยอดขาย</option>
            <option value="newest">เรียงตามวันที่เข้าร่วม</option>
          </select>
        </div>
      </div>

      {filteredSellers.length === 0 ? (
        <div className="py-12 text-center">
          <h3 className="text-xl font-medium text-gray-500">ไม่พบร้านค้าที่ตรงกับการค้นหา</h3>
          <p className="mt-2 text-gray-400">ลองค้นหาด้วยคำอื่น หรือล้างการค้นหา</p>
          <Button
            onClick={() => setSearchQuery("")}
            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
          >
            ล้างการค้นหา
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSellers.map((seller) => (
            <Card key={seller.id} className="overflow-hidden transition hover:shadow-lg">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
                    {seller.avatar ? (
                      <Image
                        src={seller.avatar || "/placeholder.svg"}
                        alt={seller.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h2 className="text-xl font-semibold">{seller.name}</h2>
                    <div className="mt-1 flex items-center">
                      <StarRating rating={seller.averageRating} />
                      <span className="ml-2 text-sm text-gray-500">({seller.totalReviews} รีวิว)</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">สมาชิกตั้งแต่ {formatDate(seller.joinDate)}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium">{seller.totalSales}</span> รายการขายแล้ว
                  </div>
                  <Link href={`/seller-reviews/${seller.id}`} passHref legacyBehavior>
                    <Button asChild className="text-sm font-medium">
                      <a>ดูรีวิวทั้งหมด</a>
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
