function SearchByDetail() {
  return (
    <>
      <div className="pr-3 mb-3 font-semibold">ค้นหาหนังสือด้วยรายละเอียดเพิ่มเติม</div>
      <form className="grid gap-2.5">
        <input className="rounded-sm border border-gray-300 p-2.5" type="text" placeholder="ชื่อหนังสือ"></input>
        <input className="rounded-sm border border-gray-300 p-2.5" type="text" placeholder="ผู้เขียน"></input>
        <input className="rounded-sm border border-gray-300 p-2.5" type="text" placeholder="สำนักพิมพ์"></input>
        <input className="rounded-sm border border-gray-300 p-2.5" type="text" placeholder="ISBN"></input>
      </form>
    </>
  );
}

export default SearchByDetail;
