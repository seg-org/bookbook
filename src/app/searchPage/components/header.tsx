import profile from "@/app/searchPage/pic/profile.jpg";
import Image from "next/image";

function Header() {
  return (
    <header className="flex flex-row items-center justify-between border-b border-gray-300 bg-white p-2.5">
      <div className="text-2xl font-bold leading-tight text-blue-500">
        BOOK<br></br>BOOK
      </div>
      <nav>
        <ul className="flex list-none items-center justify-between gap-4">
          <li>
            <a href="#" className="font-bold text-gray-800 no-underline">
              ค้นหาหนังสือ
            </a>
          </li>
          <li>
            <a href="#" className="font-bold text-gray-800 no-underline">
              ประวัติการสั่งซื้อ
            </a>
          </li>
          <li>
            <a href="#" className="font-bold text-gray-800 no-underline">
              ติดต่อเรา
            </a>
          </li>
          <li>
            <div className="h-10 w-10 rounded-full bg-gray-300">
              <Image src={profile} alt="Profile"></Image>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
