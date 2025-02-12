export default function SpecialSearch() {
  return (
    <>
      <p className="mb-2 font-semibold">ค้นหาหนังสือด้วยเงื่อนไขพิเศษ</p>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-3">
          <label className="flex items-center gap-3">
            <input type="checkbox" />
            หนังสือพร้อมลายมือชื่อ
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" />
            ปกทำจากหนังเท่านั้น
          </label>
        </div>
        <label className="flex items-center gap-3">
          <input type="checkbox" />
          ไร้รอยเขียน
        </label>
      </div>
    </>
  );
}
