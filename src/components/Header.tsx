"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

function Header() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <header className="flex flex-row items-center justify-between border-b border-gray-300 bg-white p-2.5">
      <Link href="/" className="text-2xl font-bold leading-tight text-blue-500">
        BOOK<br></br>BOOK
      </Link>
      <nav>
        <ul className="flex list-none items-center justify-between gap-4">
          <li className="max-sm:invisible sm:visible">
            <Link href="#" className="font-bold text-gray-800 hover:text-[#304674] hover:underline">
              ค้นหาหนังสือ
            </Link>
          </li>
          <li className="max-sm:invisible sm:visible">
            <Link href="#" className="font-bold text-gray-800 hover:text-[#304674] hover:underline">
              ประวัติการสั่งซื้อ
            </Link>
          </li>
          <li className="max-sm:invisible sm:visible">
            <Link href="#" className="font-bold text-gray-800 hover:text-[#304674] hover:underline">
              ติดต่อเรา
            </Link>
          </li>
          <li>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link href="/profile">
                  <div className="relative h-10 w-10 rounded-full bg-gray-300">
                    <Image
                      src={session?.user?.image || "/images/profile.jpg"}
                      alt="Profile"
                      fill={true}
                      className="rounded-full"
                    />
                  </div>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="rounded bg-red-400 px-2 py-2 font-bold text-white hover:bg-red-500"
                >
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
              >
                เข้าสู่ระบบ
              </button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
