"use client"
import Image from 'next/image'
import picture1 from '@/app/searchPage/pic/Picture1.png';



import BookList from "@/app/searchPage/components/bookList";
import Header from "@/app/searchPage/components/header";
import SearchByDetail from "@/app/searchPage/components/search_w_detail";
//ยาวจัด


// font
import { Kanit } from "next/font/google";
import { useEffect, useState } from "react";

const KanitFont = Kanit({
  subsets: ["latin"],
  weight: "400",
});
// ----

function SearchPage() {
  const [detailSearch, setDetailSearch] = useState(false);
  const [specialSearch, setSpecialSearch] = useState(false);


  const books = [
    {
      id: 0,
      bookname: "สถาปัตยกรรมคอมพิวเตอร์",
      author: "ดร.เกริก พิรมย์โสภา",
      desc: "หนังสือง่าย ๆ สำหรับการออกแบบสถาปัตยกรรมเนื้อหาประกอบด้วยการวิเคราะห์สมรรถภาพและสถาปัตยกรรมแบบต่าง ๆ",
      price: 129
    },
    {
      id: 1,
      bookname: "สถาปัตยกรรมคอมพิวเตอร์",
      author: "ดร.เกริก พิรมย์โสภา",
      desc: "หนังสือง่าย ๆ สำหรับการออกแบบสถาปัตยกรรมเนื้อหาประกอบด้วยการวิเคราะห์สมรรถภาพและสถาปัตยกรรมแบบต่าง ๆ",
      price: 129
    },
    {
      id: 2,
      bookname: "สถาปัตยกรรมคอมพิวเตอร์",
      author: "ดร.เกริก พิรมย์โสภา",
      desc: "หนังสือง่าย ๆ สำหรับการออกแบบสถาปัตยกรรมเนื้อหาประกอบด้วยการวิเคราะห์สมรรถภาพและสถาปัตยกรรมแบบต่าง ๆ",
      price: 129
    },
    {
      id: 3,
      bookname: "สถาปัตยกรรมคอมพิวเตอร์",
      author: "ดร.เกริก พิรมย์โสภา",
      desc: "หนังสือง่าย ๆ สำหรับการออกแบบสถาปัตยกรรมเนื้อหาประกอบด้วยการวิเคราะห์สมรรถภาพและสถาปัตยกรรมแบบต่าง ๆ",
      price: 129
    },
    {
      id: 4,
      bookname: "สถาปัตยกรรมคอมพิวเตอร์",
      author: "ดร.เกริก พิรมย์โสภา",
      desc: "หนังสือง่าย ๆ สำหรับการออกแบบสถาปัตยกรรมเนื้อหาประกอบด้วยการวิเคราะห์สมรรถภาพและสถาปัตยกรรมแบบต่าง ๆ",
      price: 129
    },
    {
      id: 5,
      bookname: "สถาปัตยกรรมคอมพิวเตอร์",
      author: "ดร.เกริก พิรมย์โสภา",
      desc: "หนังสือง่าย ๆ สำหรับการออกแบบสถาปัตยกรรมเนื้อหาประกอบด้วยการวิเคราะห์สมรรถภาพและสถาปัตยกรรมแบบต่าง ๆ",
      price: 129
    },
    {
      id: 6,
      bookname: "สถาปัตยกรรมคอมพิวเตอร์",
      author: "ดร.เกริก พิรมย์โสภา",
      desc: "หนังสือง่าย ๆ สำหรับการออกแบบสถาปัตยกรรมเนื้อหาประกอบด้วยการวิเคราะห์สมรรถภาพและสถาปัตยกรรมแบบต่าง ๆ",
      price: 129
    },
    {
      id: 7,
      bookname: "สถาปัตยกรรมคอมพิวเตอร์",
      author: "ดร.เกริก พิรมย์โสภา",
      desc: "หนังสือง่าย ๆ สำหรับการออกแบบสถาปัตยกรรมเนื้อหาประกอบด้วยการวิเคราะห์สมรรถภาพและสถาปัตยกรรมแบบต่าง ๆ",
      price: 129
    },
    {
      id: 8,
      bookname: "สถาปัตยกรรมคอมพิวเตอร์",
      author: "ดร.เกริก พิรมย์โสภา",
      desc: "หนังสือง่าย ๆ สำหรับการออกแบบสถาปัตยกรรมเนื้อหาประกอบด้วยการวิเคราะห์สมรรถภาพและสถาปัตยกรรมแบบต่าง ๆ",
      price: 129
    },
    {
      id: 9,
      bookname: "สถาปัตยกรรมคอมพิวเตอร์",
      author: "ดร.เกริก พิรมย์โสภา",
      desc: "หนังสือง่าย ๆ สำหรับการออกแบบสถาปัตยกรรมเนื้อหาประกอบด้วยการวิเคราะห์สมรรถภาพและสถาปัตยกรรมแบบต่าง ๆ",
      price: 129
    },
    {
      id: 10,
      bookname: "สถาปัตยกรรมคอมพิวเตอร์",
      author: "ดร.เกริก พิรมย์โสภา",
      desc: "หนังสือง่าย ๆ สำหรับการออกแบบสถาปัตยกรรมเนื้อหาประกอบด้วยการวิเคราะห์สมรรถภาพและสถาปัตยกรรมแบบต่าง ๆ",
      price: 129
    },
    {
      id: 11,
      bookname: "สถาปัตยกรรมคอมพิวเตอร์",
      author: "ดร.เกริก พิรมย์โสภา",
      desc: "หนังสือง่าย ๆ สำหรับการออกแบบสถาปัตยกรรมเนื้อหาประกอบด้วยการวิเคราะห์สมรรถภาพและสถาปัตยกรรมแบบต่าง ๆ",
      price: 129
    },
    {
      id: 12,
      bookname: "สถาปัตยกรรมคอมพิวเตอร์",
      author: "ดร.เกริก พิรมย์โสภา",
      desc: "หนังสือง่าย ๆ สำหรับการออกแบบสถาปัตยกรรมเนื้อหาประกอบด้วยการวิเคราะห์สมรรถภาพและสถาปัตยกรรมแบบต่าง ๆ",
      price: 129
    },
    {
      id: 13,
      bookname: "สถาปัตยกรรมคอมพิวเตอร์",
      author: "ดร.เกริก พิรมย์โสภา",
      desc: "หนังสือง่าย ๆ สำหรับการออกแบบสถาปัตยกรรมเนื้อหาประกอบด้วยการวิเคราะห์สมรรถภาพและสถาปัตยกรรมแบบต่าง ๆ",
      price: 129
    },
    {
      id: 14,
      bookname: "สถาปัตยกรรมคอมพิวเตอร์",
      author: "ดร.เกริก พิรมย์โสภา",
      desc: "หนังสือง่าย ๆ สำหรับการออกแบบสถาปัตยกรรมเนื้อหาประกอบด้วยการวิเคราะห์สมรรถภาพและสถาปัตยกรรมแบบต่าง ๆ",
      price: 129
    },
    {
      id: 15,
      bookname: "สถาปัตยกรรมคอมพิวเตอร์",
      author: "ดร.เกริก พิรมย์โสภา",
      desc: "หนังสือง่าย ๆ สำหรับการออกแบบสถาปัตยกรรมเนื้อหาประกอบด้วยการวิเคราะห์สมรรถภาพและสถาปัตยกรรมแบบต่าง ๆ",
      price: 129
    }
  ]

  console.log(detailSearch)
  return (
    <>
      <div className="m-0 p-0 box-border">
          <Header></Header>
          <main className={`${KanitFont.className}`}>
            <div className="flex gap-16">
              <div>
                <Image src={picture1} alt="Illustration" className="max-w-[300px] h-auto"></Image>
              </div>
              <div className="w-[200%]">
                <h2 className="text-3xl mb-2.5">ค้นหาหนังสือ</h2>
                <div className="flex flex-row mb-5">
                  <input className="flex-1 p-2.5 border border-gray-300 rounded-md" type="text" placeholder="ชื่อหนังสือ"></input>
                  <button className="p-2.5 bg-[#9dc4de] text-white border-none rounded-md cursor-pointer">ค้นหาข้อมูล</button>
                </div>
                <div className="advanced-search-toggle">
                  <button className={specialSearch ? "btnAct" : "btnUnact"} onClick={() => { setSpecialSearch(true); setDetailSearch(false) }}>ค้นหาด้วยเงื่อนไขพิเศษ</button>
                  <button className={detailSearch ? "btnAct" : "btnUnact"} onClick={() => { setDetailSearch(true); setSpecialSearch(false) }}>ค้นหาด้วยรายละเอียดเพิ่มเติม</button>
                </div>
                {(detailSearch && !specialSearch) && <SearchByDetail></SearchByDetail>}
                {(!detailSearch && specialSearch) && <div>ขี้เกียจทำละ</div>}
              </div>
            </div>
            {(!detailSearch && !specialSearch) && <BookList books={books}></BookList>}
          </main>
      </div>
    </>
  );
}

export default SearchPage;