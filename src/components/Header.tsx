"use client";

import { Menu, MessageCircleQuestion } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

import NotificationBell from "@/components/NotificationBell";
import { useIsBanned } from "@/hooks/useIsBanned";

function Header() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [menuOpen, setMenuOpen] = useState(false);
  const { isBanned, bannedUntil, banReason } = useIsBanned();

  return (
    <>
      <header className="relative flex w-full items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 text-white shadow-md">
        {/* Logo */}
        <Link href="/" className="text-3xl font-extrabold tracking-wide">
          BOOK<span className="text-yellow-300">BOOK</span> 📚
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex">
          <ul className="flex items-center gap-6 text-lg font-medium">
            <li>
              <Link href="/search" className="transition hover:text-yellow-300">
                ค้นหาหนังสือ
              </Link>
            </li>
            <li>
              <Link href="/chat" className="transition hover:text-yellow-300">
                แชท
              </Link>
            </li>
            {/* <li>
            <Link href="/transaction-history-page" className="transition hover:text-yellow-300">
              ประวัติการสั่งซื้อ
            </Link>
          </li> */}
            <li>
              <Link href="/about-us" className="transition hover:text-yellow-300">
                เกี่ยวกับเรา
              </Link>
            </li>
            {/* <li>
            <Link href="/seller-registration" className="transition hover:text-yellow-300">
              ลงทะเบียนผู้ขาย
            </Link>
          </li> */}
          </ul>
        </nav>

        {/* Authentication & Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          {isAuthenticated && <NotificationBell />}

          <div>
            <Link href="/report-problem" title="แจ้งปัญหาการใช้งาน">
              <MessageCircleQuestion className="h-8 w-8" />
            </Link>
          </div>

          {/* Authentication */}
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link href="/profile">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-md">
                  <Image
                    src={session?.user?.image || "/images/profile.jpg"}
                    alt="Profile"
                    fill={true}
                    className="object-cover"
                  />
                </div>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                data-test-id="sign-out"
              >
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-gray-900 transition hover:bg-yellow-500"
            >
              เข้าสู่ระบบ
            </button>
          )}

          {/* Mobile Menu Button */}
          <button className="block md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu size={28} />
          </button>
        </div>

        {/* Mobile Navigation (Dropdown) */}
        {menuOpen && (
          <div className="absolute right-6 top-16 w-48 rounded-lg bg-white p-4 shadow-lg md:hidden">
            <ul className="space-y-3 text-gray-900">
              <li>
                <Link href="/search" className="block rounded px-3 py-2 hover:bg-gray-100">
                  ค้นหาหนังสือ
                </Link>
              </li>
              {/* <li>
              <Link href="/transaction-history-page" className="block rounded px-3 py-2 hover:bg-gray-100">
                ประวัติการสั่งซื้อ
              </Link>
            </li> */}
              <li>
                <Link href="/chat" className="block rounded px-3 py-2 hover:bg-gray-100">
                  แชท
                </Link>
              </li>
              {/* <li>
              <Link href="/seller-registration" className="block rounded px-3 py-2 hover:bg-gray-100">
                ลงทะเบียนผู้ขาย
              </Link>
            </li> */}
              <li>
                <Link href="/about-us" className="block rounded px-3 py-2 hover:bg-gray-100">
                  เกี่ยวกับเรา
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>

      {isBanned && (
        <div className="bg-red-300 p-4">
          แจ้งเตือน: คุณถูกระงับการใช้งานจนถึง {bannedUntil?.toLocaleString("th-TH")} เนื่องจาก {banReason}{" "}
          หากคุณมีข้อสงสัยเกี่ยวกับการระงับการใช้งานนี้ กรุณาติดต่อผู้ดูแลระบบ
        </div>
      )}
    </>
  );
}

export default Header;
