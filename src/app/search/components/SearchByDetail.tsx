function SearchByDetail() {
  return (
    <>
      <div className="mb-3 pr-3 font-semibold">ค้นหาหนังสือด้วยรายละเอียดเพิ่มเติม</div>
      <form className="grid gap-2.5">
        <input className="rounded-md border border-gray-300 p-2.5" type="text" placeholder="ชื่อหนังสือ"></input>
        <input className="rounded-md border border-gray-300 p-2.5" type="text" placeholder="ผู้เขียน"></input>
        <input className="rounded-md border border-gray-300 p-2.5" type="text" placeholder="สำนักพิมพ์"></input>
        <input className="rounded-md border border-gray-300 p-2.5" type="text" placeholder="ISBN"></input>
        <button className="cursor-pointer rounded-md border-none bg-[#9dc4de] p-2.5 text-white">
          ค้นหาข้อมูลด้วยรายละเอียดเพิ่มเติม
        </button>
      </form>
    </>
  );
}

export default SearchByDetail;
