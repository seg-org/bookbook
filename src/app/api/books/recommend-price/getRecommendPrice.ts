import { prisma } from "@/lib/prisma";

export async function getRecommendPrice(bookId: string) {
  const result = await prisma.post.aggregate({
    where: { bookId },
    _avg: { price: true },
  });

  return result._avg.price;
}
