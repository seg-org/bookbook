import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { BookSearch } from "./BookSearch";

export default async function SellBookPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    redirect("/login");
  }

  const seller = await prisma.sellerProfile.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!seller && !session.user.isAdmin) {
    return <h1 className="my-4 text-center text-2xl font-bold">กรุณาลงทะเบียนผู้ขายก่อนใช้งาน</h1>;
  }

  return (
    <>
      <h1 className="my-4 text-center text-2xl font-bold">ขายหนังสือ</h1>

      <main className="flex flex-col items-center gap-4">
        <BookSearch>
          <p>
            ไม่พบหนังสือ? เพิ่มหนังสือได้
            <Link href="/add-book" className="text-blue-500">
              ที่นี่
            </Link>
          </p>
        </BookSearch>
      </main>
    </>
  );
}
