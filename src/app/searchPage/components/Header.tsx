import Image from "next/image";

function Header() {
  return (
    <header className="flex flex-row items-center justify-between border-b border-gray-300 bg-white p-2.5">
      <a href ="/" className="text-2xl font-bold leading-tight text-blue-500">
        BOOK<br></br>BOOK
      </a>
      <nav>
        <ul className="flex list-none items-center justify-between gap-4">
          <li className="sm:visible max-sm:invisible">
            <a href="#" className="font-bold text-gray-800 hover:text-[#304674] hover:underline">
              ค้นหาหนังสือ
            </a>
          </li>
          <li className="sm:visible max-sm:invisible">
            <a href="#" className="font-bold text-gray-800 hover:text-[#304674] hover:underline">
              ประวัติการสั่งซื้อ
            </a>
          </li>
          <li className="sm:visible max-sm:invisible">
            <a href="#" className="font-bold text-gray-800 hover:text-[#304674] hover:underline">
              ติดต่อเรา
            </a>
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
