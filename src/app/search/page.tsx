"use client";
import Image from "next/image";

import SearchByDetail from "@/app/search/components/SearchByDetail";

import { Kanit } from "next/font/google";
import { useState } from "react";
import { PostList } from "./components/PostList";
import SpecialSearch from "./components/SpecialSearch";

const KanitFont = Kanit({
  subsets: ["latin"],
  weight: "400",
});

function SearchPage() {
  const [detailSearch, setDetailSearch] = useState(false);
  const [specialSearch, setSpecialSearch] = useState(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <>
      <div className="m-0 box-border p-0">
        <main className={`${KanitFont.className}`}>
          <div className="flex gap-16 max-md:flex-col">
            <div className="relative h-[200px] min-w-[300px] max-md:w-[200px]">
              <Image src="/images/search/man-with-book.png" alt="Illustration" fill={true} />
            </div>
            <div className="w-[100%]">
              <h2 className="mb-2.5 text-3xl max-sm:text-2xl">ค้นหาหนังสือ</h2>
              <div className="mb-5 flex flex-row">
                <input
                  className="flex-1 rounded-md border border-gray-300 p-1"
                  type="text"
                  placeholder="ชื่อหนังสือ"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                ></input>
                <button className="ml-1.5 cursor-pointer rounded-md border-none bg-[#9dc4de] p-2.5 text-white">
                  ค้นหาข้อมูล
                </button>
              </div>
              <div className="advanced-search-toggle flex flex-row">
                <button
                  className={`m-[10px] mb-5 p-3.5 ${specialSearch ? `bg-[#48AFF3]` : `bg-[#babcbd]`} cursor-pointer rounded-lg border-none text-white`}
                  onClick={() => {
                    setSpecialSearch(true);
                    setDetailSearch(false);
                  }}
                >
                  ค้นหาด้วยเงื่อนไขพิเศษ
                </button>
                <button
                  className={`m-[10px] mb-5 p-3.5 ${detailSearch ? `bg-[#48AFF3]` : `bg-[#babcbd]`} cursor-pointer rounded-lg border-none text-white`}
                  onClick={() => {
                    setDetailSearch(true);
                    setSpecialSearch(false);
                  }}
                >
                  ค้นหาด้วยรายละเอียดเพิ่มเติม
                </button>
              </div>
              {detailSearch && !specialSearch && <SearchByDetail />}
              {!detailSearch && specialSearch && <SpecialSearch />}
            </div>
          </div>
          {!detailSearch && !specialSearch && <PostList inputSearchValue={inputValue} />}
        </main>
      </div>
    </>
  );
}

export default SearchPage;
