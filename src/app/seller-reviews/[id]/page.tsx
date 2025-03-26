"use client";

import { Book,Star, StarHalf, User } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Card } from "@/components/ui/card/Card";
import { apiClient } from "@/data/axios";

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
  transaction: {
    buyer: {
      id: string;
      firstName: string;
      lastName: string;
      avatar?: string;
    };
    post: {
      book: {
        title: string;
        coverImageKey?: string;
      };
    };
  };
}

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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const StarRating = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex">
      {[...Array(full)].map((_, i) => (
        <Star key={`full-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      ))}
      {half && <StarHalf className="h-5 w-5 fill-yellow-400 text-yellow-400" />}
      {[...Array(5 - full - (half ? 1 : 0))].map((_, i) => (
        <Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
      ))}
    </div>
  );
};

export default function SellerReviewsPage() {
  const { id: sellerId } = useParams();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, rRes] = await Promise.all([
          apiClient.get(`/profile/seller/${sellerId}`),
          apiClient.get(`/reviews/seller/${sellerId}`),
        ]);

        const user = sRes.data;
        setSeller({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          avatar: undefined,
          joinDate: user.createdAt,
          totalSales: 0,
          bio: "",
        });

        setReviews(rRes.data);
      } catch (err) {
        console.error("Failed to load seller/reviews", err);
      }
    };

    if (sellerId) fetchData();
  }, [sellerId]);

  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "lowest") return a.rating - b.rating;
      return 0;
    });
  }, [reviews, sortBy]);

  const stats = useMemo(() => calculateReviewStats(reviews), [reviews]);

  if (!seller) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">รีวิวผู้ขาย</h1>

        {/* Seller info skeleton */}
        <Card className="mb-8 animate-pulse">
          <div className="flex flex-col items-start gap-6 p-4 md:flex-row md:items-center">
            <div className="h-20 w-20 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-6 w-2/3 rounded bg-gray-200" />
              <div className="h-4 w-1/2 rounded bg-gray-200" />
              <div className="h-4 w-1/3 rounded bg-gray-200" />
            </div>
            <div className="w-24 rounded bg-gray-100 p-4 text-center">
              <div className="mx-auto mb-2 h-6 w-10 rounded bg-gray-300" />
              <div className="h-4 w-full rounded bg-gray-300" />
            </div>
          </div>
        </Card>

        {/* Rating stat skeleton */}
        <Card className="mb-8 animate-pulse">
          <div className="space-y-3 p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-4 w-16 rounded bg-gray-200" />
                <div className="h-4 flex-1 rounded-full bg-gray-200" />
                <div className="h-4 w-12 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </Card>

        {/* Review cards skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse space-y-4 p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                  <div className="h-3 w-1/4 rounded bg-gray-100" />
                </div>
                <div className="h-4 w-20 rounded bg-gray-200" />
              </div>

              <div className="flex items-center gap-3 rounded-md bg-gray-100 p-3">
                <div className="h-15 w-10 rounded bg-gray-300" />
                <div className="h-4 w-1/3 rounded bg-gray-200" />
              </div>

              <div className="h-4 w-full rounded bg-gray-200" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">รีวิวผู้ขาย</h1>
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
            <p className="mt-2">{seller.bio}</p>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-gray-50 p-4">
            <div className="text-3xl font-bold text-blue-600">{stats.average.toFixed(1)}</div>
            <StarRating rating={stats.average} />
            <div className="mt-1 text-sm text-gray-500">{stats.total} รีวิว</div>
          </div>
        </div>
      </Card>

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

      {sortedReviews.length === 0 ? (
        <Card>
          <div className="p-8 text-center">
            <h3 className="text-xl font-medium text-gray-500">ยังไม่มีรีวิว</h3>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <Card key={review.id} className="overflow-hidden">
              <div className="p-4">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-6 w-6 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      {review.transaction?.buyer?.firstName} {review.transaction?.buyer?.lastName}
                      <div className="text-sm text-gray-500">{formatDate(review.createdAt)}</div>
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <div className="mb-4 flex items-center gap-3 rounded-md bg-gray-50 p-3">
                  <div className="h-15 relative w-10 overflow-hidden">
                    {/* TODO: fix image not showing */}
                    {/* <Image
                      src={
                        review.transaction?.post?.book?.coverImageKey
                          ? `https://bookbook-bucket.s3.ap-southeast-1.amazonaws.com/book_covers/${review.transaction.post.book.coverImageKey}`
                          : "/placeholder.svg"
                      }
                      alt={review.transaction?.post?.book?.title || "Book cover"}
                      width={40}
                      height={60}
                      className="object-cover"
                    /> */}
                    <Book /> {/* use Book icon from lucide-react instead */}
                  </div>
                  <div className="font-medium">{review.transaction.post.book.title}</div>
                </div>
                <div className="text-gray-700">{review.comment}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
