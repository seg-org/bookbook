import profile from '@/app/searchPage/pic/profile.jpg';
import Image from 'next/image'

function header() {
  return (
    <header>
      <div className="logo">BOOK<br></br>BOOK</div>
      <nav>
        <ul>
          <li><a href="#">ค้นหาหนังสือ</a></li>
          <li><a href="#">ประวัติการสั่งซื้อ</a></li>
          <li><a href="#">ติดต่อเรา</a></li>
          <li>
            <div className="profile">
              <Image src={profile} alt="Profile"></Image>
            </div>
          </li>
        </ul>

      </nav>
    </header>
  );
}

export default header;