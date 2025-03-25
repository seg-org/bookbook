"use client";

import { Search, Star, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card/Card";
// Mock data for sellers
const mockSellers = [
  {
    id: "seller1",
    name: "วรรณกรรม หนังสือดี",
    avatar: "/placeholder.svg?height=80&width=80",
    joinDate: "2022-05-15",
    totalSales: 128,
    bio: "ร้านหนังสือที่รวบรวมวรรณกรรมคุณภาพ ทั้งไทยและต่างประเทศ เน้นสภาพหนังสือดี ราคาเป็นมิตร",
    averageRating: 4.7,
    totalReviews: 42,
  },
  {
    id: "seller2",
    name: "หนังสือมือสอง คุณภาพดี",
    avatar: "/placeholder.svg?height=80&width=80",
    joinDate: "2021-10-08",
    totalSales: 256,
    bio: "จำหน่ายหนังสือมือสองสภาพดี ราคาถูก มีหนังสือหลากหลายประเภท ทั้งนิยาย การ์ตูน และตำราเรียน",
    averageRating: 4.2,
    totalReviews: 78,
  },
  {
    id: "seller3",
    name: "นิยายไทย",
    avatar: "/placeholder.svg?height=80&width=80",
    joinDate: "2022-01-20",
    totalSales: 95,
    bio: "ร้านหนังสือนิยายไทยคุณภาพ ทั้งนิยายรัก นิยายแฟนตาซี และนิยายสืบสวน",
    averageRating: 4.9,
    totalReviews: 36,
  },
  {
    id: "seller4",
    name: "ตำราเรียน มือหนึ่ง-มือสอง",
    avatar: "/placeholder.svg?height=80&width=80",
    joinDate: "2021-08-15",
    totalSales: 312,
    bio: "จำหน่ายตำราเรียนทุกระดับชั้น ทั้งมือหนึ่งและมือสอง ราคานักศึกษา",
    averageRating: 4.5,
    totalReviews: 124,
  },
  {
    id: "seller5",
    name: "หนังสือการ์ตูนญี่ปุ่น",
    avatar: "/placeholder.svg?height=80&width=80",
    joinDate: "2022-03-10",
    totalSales: 187,
    bio: "จำหน่ายการ์ตูนญี่ปุ่นทั้งภาษาไทยและภาษาญี่ปุ่น มีทั้งเล่มเดี่ยวและชุด",
    averageRating: 4.6,
    totalReviews: 67,
  },
  {
    id: "seller6",
    name: "หนังสือแนะแนวการศึกษา",
    avatar: "/placeholder.svg?height=80&width=80",
    joinDate: "2022-07-22",
    totalSales: 76,
    bio: "จำหน่ายหนังสือเตรียมสอบทุกระดับ ทั้ง O-NET, GAT/PAT, 9 วิชาสามัญ และอื่นๆ",
    averageRating: 4.3,
    totalReviews: 29,
  },
  {
    id: "seller7",
    name: "หนังสือภาษาอังกฤษ",
    avatar: "/placeholder.svg?height=80&width=80",
    joinDate: "2021-12-05",
    totalSales: 143,
    bio: "จำหน่ายหนังสือภาษาอังกฤษทั้งเพื่อการเรียนและความบันเทิง นำเข้าจากต่างประเทศ",
    averageRating: 4.8,
    totalReviews: 52,
  },
  {
    id: "seller8",
    name: "หนังสือพัฒนาตนเอง",
    avatar: "/placeholder.svg?height=80&width=80",
    joinDate: "2022-02-18",
    totalSales: 209,
    bio: "รวมหนังสือพัฒนาตนเอง ธุรกิจ การเงิน และจิตวิทยา ทั้งไทยและแปล",
    averageRating: 4.4,
    totalReviews: 83,
  },
];

// Star Rating component
const StarRating = ({ rating }: { rating: number }) => {
  return (
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
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function SellerReviewsListPage() {
  const [sellers, setSellers] = useState<typeof mockSellers>([]);
  const [filteredSellers, setFilteredSellers] = useState<typeof mockSellers>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("rating"); // rating, reviews, sales, newest

  useEffect(() => {
    // Simulate API call to fetch sellers
    setLoading(true);

    // Sort sellers based on sortBy
    const sortedSellers = [...mockSellers].sort((a, b) => {
      if (sortBy === "rating") return b.averageRating - a.averageRating;
      if (sortBy === "reviews") return b.totalReviews - a.totalReviews;
      if (sortBy === "sales") return b.totalSales - a.totalSales;
      if (sortBy === "newest") return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      return 0;
    });

    setSellers(sortedSellers);
    setFilteredSellers(sortedSellers);
    setLoading(false);
  }, [sortBy]);

  useEffect(() => {
    // Filter sellers based on search query
    if (searchQuery.trim() === "") {
      setFilteredSellers(sellers);
    } else {
      const filtered = sellers.filter(
        (seller) =>
          seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          seller.bio.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSellers(filtered);
    }
  }, [searchQuery, sellers]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">ผู้ขายทั้งหมด</h1>

      {/* Search and Filter Controls */}
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

      {/* Sellers Grid */}
      {filteredSellers.length === 0 ? (
        <div className="py-12 text-center">
          <h3 className="text-xl font-medium text-gray-500">ไม่พบร้านค้าที่ตรงกับการค้นหา</h3>
          <p className="mt-2 text-gray-400">ลองค้นหาด้วยคำอื่น หรือล้างการค้นหา</p>
          <Button
            onClick={() => {
              setSearchQuery("");
            }}
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

                <div className="mt-4 line-clamp-2 text-sm text-gray-600">{seller.bio}</div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium">{seller.totalSales}</span> รายการขายแล้ว
                  </div>

                  {/*TODO: Implement dynamic link seller-reviews page */}
                  <Link href="/seller-reviews" passHref legacyBehavior>
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
