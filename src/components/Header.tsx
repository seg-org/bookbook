"use client";

import { Menu, Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Transaction {
  id: string;
  status: "PACKING" | "DELIVERING" | "COMPLETE" | "HOLD" | "FAIL";
  postTitle: string;
  coverImageUrl: string;
}

function Header() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [menuOpen, setMenuOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    async function fetchTransactions() {
      if (!session?.user?.id) return;

      const response = await fetch(
        `/api/transaction?forNotifications=true&userId=${session.user.id}&asBuyer=true`
      );
      const data: Transaction[] = await response.json();
      setTransactions(data);
    }

    fetchTransactions();
  }, [session]);

  return (
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
        {isAuthenticated && (
          <div className="relative">
            <button
              className="relative flex items-center"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Bell className="h-6 w-6 text-white" />
              {transactions.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {transactions.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white p-4 shadow-lg">
                <h3 className="mb-2 text-sm font-semibold text-gray-700">
                  Notifications
                </h3>
                <ul className="space-y-2">
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <li
                        key={transaction.id}
                        className="flex items-center gap-2 rounded-md p-2 bg-gray-100 text-gray-600"
                      >
                        <img
                          src={transaction.coverImageUrl}
                          alt={transaction.postTitle}
                          className="h-10 w-10 rounded object-cover"
                        />
                        <div>
                          <div className="font-medium">{transaction.postTitle}</div>
                          <div className="text-sm">
                            Status:{" "}
                            {transaction.status === "COMPLETE"
                              ? "Completed"
                              : transaction.status === "FAIL"
                              ? "Failed"
                              : transaction.status === "PACKING"
                              ? "Packing"
                              : transaction.status === "DELIVERING"
                              ? "Delivering"
                              : "On Hold"}
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-500">No notifications</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

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
  );
}

export default Header;
