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
  // const session = await getServerSession(authOptions);

  // TODO : Uncomment this after adding isAdmin to the user model
  // if (!session?.user?.isAdmin) {
  //   redirect("/");
  // }

  const unverifiedSellers = await getUnverifiedSellers();

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-2xl font-bold">ยืนยันผู้ขาย</h1>
      <SellerVerificationList sellers={unverifiedSellers} />
    </div>
  );
}
