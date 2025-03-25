"use client";

import { Star, StarHalf, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { Card } from "@/components/ui/card/Card";

// Mock data types
interface Seller {
  id: string;
  name: string;
  avatar?: string;
  joinDate: string;
  totalSales: number;
  bio: string;
}

interface Review {
  id: string;
  sellerId: string;
  rating: number;
  comment: string;
  createdAt: string;
  buyer: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  book: {
    id: string;
    title: string;
    cover?: string;
  };
}

// Mock data
const mockSellers: Seller[] = [
  {
    id: "seller1",
    name: "วรรณกรรม หนังสือดี",
    avatar: "/placeholder.svg?height=80&width=80",
    joinDate: "2022-05-15",
    totalSales: 128,
    bio: "ร้านหนังสือที่รวบรวมวรรณกรรมคุณภาพ ทั้งไทยและต่างประเทศ เน้นสภาพหนังสือดี ราคาเป็นมิตร",
  },
  {
    id: "seller2",
    name: "หนังสือมือสอง คุณภาพดี",
    avatar: "/placeholder.svg?height=80&width=80",
    joinDate: "2021-10-08",
    totalSales: 256,
    bio: "จำหน่ายหนังสือมือสองสภาพดี ราคาถูก มีหนังสือหลากหลายประเภท ทั้งนิยาย การ์ตูน และตำราเรียน",
  },
];

const mockReviews: Review[] = [
  {
    id: "review1",
    sellerId: "seller1",
    rating: 5,
    comment: "หนังสือสภาพดีมาก ส่งเร็ว แพ็คดี คุ้มค่ากับราคา",
    createdAt: "2023-11-15T08:30:00Z",
    buyer: {
      id: "buyer1",
      firstName: "สมชาย",
      lastName: "ใจดี",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    book: {
      id: "book1",
      title: "เจ้าชายน้อย",
      cover: "/placeholder.svg?height=60&width=40",
    },
  },
  {
    id: "review2",
    sellerId: "seller1",
    rating: 4,
    comment: "หนังสือสภาพดี แต่ส่งช้ากว่าที่คาดไว้นิดหน่อย",
    createdAt: "2023-10-20T14:15:00Z",
    buyer: {
      id: "buyer2",
      firstName: "สมหญิง",
      lastName: "รักการอ่าน",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    book: {
      id: "book2",
      title: "แฮร์รี่ พอตเตอร์ กับศิลาอาถรรพ์",
      cover: "/placeholder.svg?height=60&width=40",
    },
  },
  {
    id: "review3",
    sellerId: "seller1",
    rating: 5,
    comment: "ประทับใจมาก ผู้ขายใส่ใจในรายละเอียด มีโน้ตเล็กๆ แถมมาด้วย",
    createdAt: "2023-09-05T11:45:00Z",
    buyer: {
      id: "buyer3",
      firstName: "วิชัย",
      lastName: "ชอบอ่าน",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    book: {
      id: "book3",
      title: "คิดแบบเศรษฐศาสตร์",
      cover: "/placeholder.svg?height=60&width=40",
    },
  },
  {
    id: "review4",
    sellerId: "seller1",
    rating: 3,
    comment: "หนังสือโอเค แต่มีรอยพับที่มุมนิดหน่อย ไม่ได้ระบุในรายละเอียด",
    createdAt: "2023-08-12T09:20:00Z",
    buyer: {
      id: "buyer4",
      firstName: "นภา",
      lastName: "ฟ้าใส",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    book: {
      id: "book4",
      title: "ประวัติศาสตร์ไทย",
      cover: "/placeholder.svg?height=60&width=40",
    },
  },
  {
    id: "review5",
    sellerId: "seller1",
    rating: 5,
    comment: "ดีมากครับ ส่งไว สภาพหนังสือเหมือนใหม่",
    createdAt: "2023-07-28T16:50:00Z",
    buyer: {
      id: "buyer5",
      firstName: "ธนา",
      lastName: "ทรัพย์มาก",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    book: {
      id: "book5",
      title: "พ่อรวยสอนลูก",
      cover: "/placeholder.svg?height=60&width=40",
    },
  },
  {
    id: "review6",
    sellerId: "seller2",
    rating: 4,
    comment: "หนังสือสภาพดี ราคาเหมาะสม",
    createdAt: "2023-11-10T10:30:00Z",
    buyer: {
      id: "buyer6",
      firstName: "มานี",
      lastName: "มีนา",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    book: {
      id: "book6",
      title: "มานี มีนา",
      cover: "/placeholder.svg?height=60&width=40",
    },
  },
];

// Helper: Review stats
const calculateReviewStats = (reviews: Review[]) => {
  if (!reviews.length) return { average: 0, total: 0, counts: [] };
  const total = reviews.length;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  const average = sum / total;
  const counts = [1, 2, 3, 4, 5].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: (reviews.filter((r) => r.rating === rating).length / total) * 100,
  }));
  return { average, total, counts };
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && <StarHalf className="h-5 w-5 fill-yellow-400 text-yellow-400" />}
      {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
      ))}
    </div>
  );
};

export default function SellerReviewsPage() {
  const searchParams = useSearchParams();
  const sellerId = searchParams.get("id") || "seller1";

  const [sortBy, setSortBy] = useState<string>("newest");

  const seller = useMemo(() => mockSellers.find((s) => s.id === sellerId) || null, [sellerId]);

  const sellerReviews = useMemo(() => mockReviews.filter((r) => r.sellerId === sellerId), [sellerId]);

  const reviews = useMemo(() => {
    return [...sellerReviews].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });
  }, [sellerReviews, sortBy]);

  const stats = useMemo(() => calculateReviewStats(sellerReviews), [sellerReviews]);

  if (!seller) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">ไม่พบข้อมูลผู้ขาย</h1>
        <p className="mt-4">
          <Link href="/search" className="text-blue-500 hover:underline">
            กลับไปยังหน้าค้นหา
          </Link>
        </p>
      </div>
    );
  }

  // ... UI rendering from original code (not repeated here for brevity)
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Seller Profile */}
      <Card className="mb-8">
        <div className="flex flex-col items-start gap-6 p-4 md:flex-row md:items-center">
          <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gray-100">
            {seller.avatar ? (
              <Image src={seller.avatar || "/placeholder.svg"} alt={seller.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold">{seller.name}</h1>
            <p className="mt-1 text-gray-600">สมาชิกตั้งแต่ {formatDate(seller.joinDate)}</p>
            <p className="text-gray-600">ขายแล้ว {seller.totalSales} รายการ</p>
            <p className="mt-2">{seller.bio}</p>
          </div>

          <div className="flex flex-col items-center rounded-lg bg-gray-50 p-4">
            <div className="text-3xl font-bold text-blue-600">{stats.average.toFixed(1)}</div>
            <StarRating rating={stats.average} />
            <div className="mt-1 text-sm text-gray-500">{stats.total} รีวิว</div>
          </div>
        </div>
      </Card>

      {/* Rating Statistics */}
      <Card className="mb-8">
        <div className="p-4">
          <h2 className="mb-4 text-xl font-semibold">สถิติคะแนน</h2>

          <div className="space-y-2">
            {stats.counts
              .slice()
              .reverse()
              .map((stat) => (
                <div key={stat.rating} className="flex items-center gap-2">
                  <div className="w-16 text-sm font-medium">{stat.rating} ดาว</div>
                  <div className="h-4 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full rounded-full bg-yellow-400" style={{ width: `${stat.percentage}%` }}></div>
                  </div>
                  <div className="w-16 text-right text-sm">{stat.count} รีวิว</div>
                </div>
              ))}
          </div>
        </div>
      </Card>

      {/* Sort Controls */}
      <div className="mb-4 flex justify-end">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">ล่าสุด</option>
          <option value="oldest">เก่าสุด</option>
          <option value="highest">คะแนนสูงสุด</option>
          <option value="lowest">คะแนนต่ำสุด</option>
        </select>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Card>
          <div className="p-8 text-center">
            <h3 className="text-xl font-medium text-gray-500">ยังไม่มีรีวิว</h3>
            <p className="mt-2 text-gray-400">เมื่อมีลูกค้ารีวิว รีวิวจะแสดงที่นี่</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <div className="p-4">
                {/* Review Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                      {review.buyer.avatar ? (
                        <Image
                          src={review.buyer.avatar || "/placeholder.svg"}
                          alt={`${review.buyer.firstName} ${review.buyer.lastName}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <User className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        {review.buyer.firstName} {review.buyer.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{formatDate(review.createdAt)}</div>
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                </div>

                {/* Book Info */}
                <div className="mb-4 flex items-center gap-3 rounded-md bg-gray-50 p-3">
                  <div className="h-15 relative w-10 overflow-hidden">
                    <Image
                      src={review.book.cover || "/placeholder.svg"}
                      alt={review.book.title}
                      width={40}
                      height={60}
                      className="object-cover"
                    />
                  </div>
                  <div className="font-medium">{review.book.title}</div>
                </div>

                {/* Review Comment */}
                <div className="text-gray-700">{review.comment}</div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination - would be implemented with real data */}
      {reviews.length > 0 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center gap-1">
            <button className="rounded border px-3 py-1 hover:bg-gray-100 disabled:opacity-50" disabled>
              &laquo; ก่อนหน้า
            </button>
            <button className="rounded border bg-blue-500 px-3 py-1 text-white">1</button>
            <button className="rounded border px-3 py-1 hover:bg-gray-100">2</button>
            <button className="rounded border px-3 py-1 hover:bg-gray-100">3</button>
            <button className="rounded border px-3 py-1 hover:bg-gray-100">ถัดไป &raquo;</button>
          </nav>
        </div>
      )}
    </div>
  );
}
