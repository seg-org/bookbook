import { forbidden } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { SellerVerificationList } from "./SellerVerificationList";

async function getUnverifiedSellers() {
  return await prisma.sellerProfile.findMany({
    where: {
      isApproved: false,
    },
    include: {
      user: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
        },
      },
    },
  });
}

export default async function AdminVerifySellersPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.isAdmin === true;

  if (!isAdmin) {
    forbidden();
  }

  const unverifiedSellers = await getUnverifiedSellers();

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">ยืนยันผู้ขาย</h1>
      <SellerVerificationList sellers={unverifiedSellers} />
    </div>
  );
}
