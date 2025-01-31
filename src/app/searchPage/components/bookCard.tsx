import bookCover from '@/app/searchPage/pic/bookCover.png';
// import bookCover from '@/app/searchPage/pic/bookCover.jpg';
import Image from 'next/image'

function bookCard({ book }: any) {
    return (
        <>
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden flex flex-col p-2.5">
                <div className="flex flex-row m-2.5 justify-between text-xl">
                    <h3>{book.bookname}</h3>
                    <span>{book.price} ฿</span>
                </div>
                <div className="flex flex-row m-2.5">
                    <Image className="m-2.5 max-h-[30%] w-auto rounded-lg" src={bookCover} alt="Book Cover"></Image>
                    <div className="flex flex-col">
                        <div><strong>ผู้เขียน  </strong>{book.author}</div>
                        <div><div><strong>รายละเอียด</strong></div> {book.desc}</div>
                        <div className="flex justify-center items-center mt-2.5">
                            <button className=" border-2 border-[#B8B8B8] bg-white text-black p-1.5 text-sm rounded-sm m-2.5 cursor-pointer"><div>ดูข้อมูล</div></button>
                            <button className="border-2 border-[#B8B8B8] bg-[#8BB9D8] text-white p-1.5 text-sm rounded-sm">เพิ่มใส่ตะกร้า</button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

export default bookCard;