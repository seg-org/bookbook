import profile from '@/app/transactionHistoryPage/pic/profile.jpg';
import Image from 'next/image'

function header() {
  return (
    <header className='flex flex-row justify-between items-center p-2.5 bg-white border-b border-gray-300'>
      <div className="text-2xl font-bold text-blue-500 leading-tight">BOOK<br></br>BOOK</div>
      <nav>
        <ul className="list-none flex justify-between items-center gap-4">
          <li><a href="#" className="no-underline text-gray-800 font-bold">ค้นหาหนังสือ</a></li>
          <li><a href="#" className="no-underline text-gray-800 font-bold">ประวัติการสั่งซื้อ</a></li>
          <li><a href="#" className="no-underline text-gray-800 font-bold">ติดต่อเรา</a></li>
          <li>
            <div className="w-10 h-10 rounded-full bg-gray-300">
              <Image src={profile} alt="Profile"></Image>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default header;