import bookCover from "@/app/searchPage/pic/bookCover.png";
import { Book } from "@/types/book";
import Image from "next/image";
import YbookCover from "../pic/YuriShosetsu.png";

type BookCardProps = {
  book: Book;
};

function BookCard({ book }: BookCardProps) {
  return (
    <>
      <div className="flex flex-col overflow-hidden rounded-lg border border-gray-300 bg-white p-2.5">
        <div className="m-2.5 flex flex-row justify-between text-lg">
          <h3>{book.bookname}</h3>
          <span>{book.price} ฿</span>
        </div>
        <div className="m-2.5 flex flex-row">
          <Image
            className="m-2.5 h-40 w-auto rounded-lg"
            src={book.id == 1 ? YbookCover : bookCover}
            width={500}
            height={500}
            alt="Book Cover"
          ></Image>
          <div className="flex h-screen max-h-[275px] flex-col justify-between">
            <div>
              <div>
                <strong>ผู้เขียน </strong>
                {book.author}
              </div>
              <div>
                <div>
                  <strong>รายละเอียด</strong>
                </div>{" "}
                {book.desc}
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-center">
              <button className="m-2.5 cursor-pointer rounded-sm border-2 border-[#B8B8B8] bg-white p-1.5 px-4 py-2 pl-2 pr-2 text-sm text-black">
                <div>ดูข้อมูล</div>
              </button>
              <button className="rounded-sm border-2 border-[#B8B8B8] bg-[#8BB9D8] p-1.5 px-4 py-2 pl-2 pr-2 text-sm text-white">
                เพิ่มใส่ตะกร้า
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookCard;
