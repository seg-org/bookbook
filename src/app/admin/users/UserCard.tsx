import clsx from "clsx";
import { Mail, MailX, Phone, UserPen } from "lucide-react";
import Link from "next/link";

import type { getUsers } from "./query";

type UserCardProps = {
  user: Awaited<ReturnType<typeof getUsers>>[number];
};

export default function UserCard({ user }: UserCardProps) {
  return (
    <div className="mx-4 flex w-screen max-w-3xl flex-row items-center gap-4 rounded-xl bg-white p-4 shadow">
      <div className="flex-1">
        <p>
          <span className="font-bold">
            {user.firstName} {user.lastName}
          </span>
          {user.isSeller && user.sellerProfile?.isApproved && (
            <span className="mx-2 rounded-xl bg-pink-300 px-2 text-sm">ผู้ขาย</span>
          )}
          {user.isAdmin && <span className="mx-2 rounded-xl bg-yellow-300 px-2 text-sm">แอดมิน</span>}
        </p>
        <p>{user.email}</p>
      </div>

      <div>
        <p className="font-bold">การยืนยัน</p>
        <div className="flex justify-around">
          {user.emailVerified ? <Mail className="text-green-500" /> : <MailX className="text-red-500" />}

          {user.phoneVerified ? <Phone className="text-green-500" /> : <Phone className="text-red-500" />}
        </div>
      </div>
      <div>
        <p className="font-bold">จำนวนยอดซื้อ</p>
        <p>{user._count.buyTransactions}</p>
      </div>
      <div className={clsx(user.isSeller || "text-gray-500")}>
        <p className="font-bold">จำนวนยอดขาย</p>
        <p>{user.isSeller ? user._count.sellTransactions : "-"}</p>
      </div>
      <div className={clsx(user.isSeller || "text-gray-500")}>
        <p className="font-bold">จำนวนโพสต์</p>
        <p>{user.isSeller ? user._count.posts : "-"}</p>
      </div>
      <div>
        <Link href={`/admin/users/${user.id}`}>
          <button className="rounded-xl bg-blue-500 p-2 transition-colors hover:bg-blue-500/80">
            <UserPen className="text-white" />
          </button>
        </Link>
      </div>
    </div>
  );
}
