import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { isUserBanned } from "@/lib/ban";
import { prisma } from "@/lib/prisma";

import CheckoutPage from "./Checkout";

export default async function CheckoutPageWrapper() {
  const user = await getServerSession(authOptions);

  if (!user) {
    redirect("/login");
  }

  // Check if user is banned
  const pUser = await prisma.user.findUnique({
    where: {
      id: user.user.id,
    },
    select: {
      id: true,
      bannedUntil: true,
      banReason: true,
    },
  });

  if (!pUser) {
    redirect("/login");
  }

  if (isUserBanned(pUser)) {
    return <h1 className="my-4 text-center text-2xl font-bold">ไม่สามารถดำเนินการสั่งซื้อได้ขณะถูกระงับการใช้งาน</h1>;
  }

  return <CheckoutPage />;
}
