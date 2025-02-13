import { Book } from "@/data/dto/book.dto";
import Image from "next/image";

type BookCardProps = {
  book: Book;
};

const cut = (s: string, n: number) => {
  if (s.length > n) {
    return s.slice(0, n) + "...";
  }
  return s;
};

function BookCard({ book }: BookCardProps) {
  return (
    <>
      {/* <div className="flex flex-col overflow-hidden rounded-lg border border-gray-300 bg-white max-md:w-full md:w-[100%] lg:w-[48%] xl:w-[32%]"> */}
      <div className="m-2 flex w-full flex-row max-sm:text-sm">
        <Image
          className="m-2.5 h-40 w-auto rounded-lg"
          src={book.coverImageUrl}
          width={500}
          height={500}
          alt="Book Cover"
        />

        <div className="flex w-full flex-col pr-8">
          <div className="flex-grow">
            <div>
              <strong>ชื่อหนังสือ </strong>
              {book.title}
            </div>
            <div>
              <strong>ผู้เขียน </strong>
              {cut(book.author, 40)}
            </div>
            <div>
              <strong>รายละเอียด</strong>
              {cut(book.description, 65)}
            </div>
          </div>
          <div className="mt-auto flex gap-2 self-end">
            <button className="cursor-pointer rounded-lg border-2 border-[#B8B8B8] bg-[#8BB9D8] p-1.5 text-sm text-white">
              แก้ไข
            </button>
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
}

export default BookCard;
