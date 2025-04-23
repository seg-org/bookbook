import { prisma } from "@/lib/prisma";

export async function getUsers() {
  return await prisma.user.findMany({
    include: {
      _count: {
        select: {
          buyTransactions: true,
          sellTransactions: true,
          posts: true,
        },
      },
      sellerProfile: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
