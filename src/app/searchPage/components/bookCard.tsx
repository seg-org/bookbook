import bookCover from '@/app/searchPage/pic/bookCover.png';
import Image from 'next/image'

function bookCard({ book }: any) {
    return (
        <>
            <div className="book-card">
                <div className="book_name_price">
                    <h3>{book.bookname}</h3>
                    <span>{book.price} ฿</span>
                </div>
                <div className="book_desc_container">
                    <Image src={bookCover} alt="Book Cover"></Image>
                    <div className="book-info">
                        <div><strong>ผู้เขียน  </strong>{book.author}</div>
                        <div><div><strong>รายละเอียด</strong></div> {book.desc}</div>
                        <div className="book-footer">
                            <button className="detail"><div>ดูข้อมูล</div></button>
                            <button className="addToCart">เพิ่มใส่ตะกร้า</button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

export default bookCard;