"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import SearchByDetail from "@/app/search/components/SearchByDetail";

import { usePostContext } from "@/context/postContext";
import { Pagination } from "./components/Pagination";
import { PostList } from "./components/PostList";
import SpecialSearch from "./components/SpecialSearch";

function SearchPage() {
  const [detailSearch, setDetailSearch] = useState(false);
  const [specialSearch, setSpecialSearch] = useState(false);
  const [title, setTitle] = useState("");

  const { setPostsFilters } = usePostContext();
  useEffect(() => {
    setPostsFilters((prev) => ({ ...prev, title }));
  }, [title]);

  return (
    <>
      <div className="m-0 box-border p-0">
        <div className="m-2 flex flex-col items-center p-2">
          <div className="flex gap-16 max-md:flex-col">
            <div className="relative h-[200px] min-w-[300px] max-md:w-[200px]">
              <Image src="/images/search/man-with-book.png" alt="Illustration" fill />
            </div>
            <div className="w-[100%]">
              <h2 className="mb-2.5 text-3xl max-sm:text-2xl">ค้นหาหนังสือ</h2>
              <div className="mb-5 flex flex-row">
                <input
                  className="flex-1 rounded-md border border-gray-300 p-1"
                  type="text"
                  placeholder="ชื่อหนังสือ"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <button className="ml-1.5 cursor-pointer rounded-md border-none bg-[#9dc4de] p-2.5 text-white">
                  ค้นหาข้อมูล
                </button>
              </div>
              <div className="flex flex-row">
                <button
                  className={`m-[10px] mb-5 p-3.5 ${specialSearch ? `bg-[#48AFF3]` : `bg-[#babcbd]`} cursor-pointer rounded-lg border-none text-white`}
                  onClick={() => {
                    setSpecialSearch((prev) => !prev);
                    setDetailSearch(false);
                  }}
                >
                  ค้นหาด้วยเงื่อนไขพิเศษ
                </button>
                <button
                  className={`m-[10px] mb-5 p-3.5 ${detailSearch ? `bg-[#48AFF3]` : `bg-[#babcbd]`} cursor-pointer rounded-lg border-none text-white`}
                  onClick={() => {
                    setDetailSearch((prev) => !prev);
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
          <PostList />
          <Pagination />
        </div>
      </div>
    </>
  );
}

export default SearchPage;
