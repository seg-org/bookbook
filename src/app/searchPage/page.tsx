"use client";
import Image from "next/image";

import SearchByDetail from "@/app/searchPage/components/SearchByDetail";

import { books } from "@/data/books";
import { Kanit } from "next/font/google";
import { useState } from "react";
import BookList from "./components/BookList";

const KanitFont = Kanit({
  subsets: ["latin"],
  weight: "400",
});

function SearchPage() {
  const [detailSearch, setDetailSearch] = useState(false);
  const [specialSearch, setSpecialSearch] = useState(false);

  console.log(detailSearch);
  return (
    <>
      <div className="m-0 box-border p-0">
        <main className={`${KanitFont.className}`}>
          <div className="flex gap-16">
            <div className="relative h-auto min-w-[300px] max-w-[300px]">
              <Image src="/images/searchPage/man-with-book.png" alt="Illustration" fill={true} />
            </div>
            <div className="w-[200%]">
              <h2 className="mb-2.5 text-3xl">ค้นหาหนังสือ</h2>
              <div className="mb-5 flex flex-row">
                <input
                  className="flex-1 rounded-md border border-gray-300 p-2.5"
                  type="text"
                  placeholder="ชื่อหนังสือ"
                ></input>
                <button className="cursor-pointer rounded-md border-none bg-[#9dc4de] p-2.5 text-white">
                  ค้นหาข้อมูล
                </button>
              </div>
              <div className="advanced-search-toggle">
                <button
                  className={`m-[15px_15px_10px_15px] mb-5 p-3.5 ${specialSearch ? `bg-[#48AFF3]` : `bg-[#babcbd]`} cursor-pointer rounded-sm border-none text-white`}
                  onClick={() => {
                    setSpecialSearch(true);
                    setDetailSearch(false);
                  }}
                >
                  ค้นหาด้วยเงื่อนไขพิเศษ
                </button>
                <button
                  className={`m-[15px_15px_10px_15px] mb-5 p-3.5 ${detailSearch ? `bg-[#48AFF3]` : `bg-[#babcbd]`} cursor-pointer rounded-sm border-none text-white`}
                  onClick={() => {
                    setDetailSearch(true);
                    setSpecialSearch(false);
                  }}
                >
                  ค้นหาด้วยรายละเอียดเพิ่มเติม
                </button>
              </div>
              {detailSearch && !specialSearch && <SearchByDetail />}
              {!detailSearch && specialSearch && <div>ขี้เกียจทำละ</div>}
            </div>
          </div>
          {!detailSearch && !specialSearch && <BookList books={books} />}
        </main>
      </div>
    </>
  );
}

export default SearchPage;
