import Image from "next/image";
import Link from "next/link";

function Header() {
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
            <div className="relative h-10 w-10 rounded-full bg-gray-300">
              <Image src="/images/profile.jpg" alt="Profile" fill={true} />
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
