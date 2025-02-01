// import bookCover from '@/app/searchPage/pic/bookCover.png';
import bookCover from '../pic/bookCover.jpg';
import YbookCover from '../pic/YuriShosetsu.png';
import Image from 'next/image'

function bookCard({ book }: any) {
    return (
        <>
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden flex flex-col p-2.5">
                <div className="flex flex-row m-2.5 justify-between text-lg">
                    <h3>{book.bookname}</h3>
                    <span>{book.price} ฿</span>
                </div>
                <div className="flex flex-row m-2.5">     

                    {/*src  sui here*/}

                    <Image className="m-2.5 h-40 w-auto rounded-lg" src={book.id==1 ? YbookCover : bookCover} width={500} height={500} alt="Book Cover"></Image>
                    <div className="flex flex-col justify-between max-h-[275px]  h-screen">
                        <div>
                        <div><strong>ผู้เขียน  </strong>{book.author}</div>
                        <div><div><strong>รายละเอียด</strong></div> {book.desc}</div>
                        </div>
                        <div className="flex justify-center items-center mt-2.5">
                            <button className="border-2 border-[#B8B8B8] bg-white text-black p-1.5 text-sm rounded-sm m-2.5 cursor-pointer pr-2 pl-2 py-2 px-4"><div>ดูข้อมูล</div></button>
                            <button className="border-2 border-[#B8B8B8] bg-[#8BB9D8] text-white p-1.5 text-sm rounded-sm pr-2 pl-2 py-2 px-4">เพิ่มใส่ตะกร้า</button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

export default bookCard;