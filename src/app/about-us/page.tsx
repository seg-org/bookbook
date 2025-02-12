import Link from "next/link";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 text-gray-900">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-3xl font-bold text-blue-600">เกี่ยวกับเรา</h1>
        <p className="mb-4 text-lg">
          BOOKBOOK เป็นแพลตฟอร์มที่ช่วยให้ผู้ซื้อและผู้ขายสามารถแลกเปลี่ยนหนังสือได้อย่างสะดวกและปลอดภัย
          ด้วยระบบที่ช่วยจับคู่ผู้ซื้อกับผู้ขายตามเกณฑ์ที่กำหนด และให้คำแนะนำด้านราคาอย่างมีประสิทธิภาพ
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-blue-500">ฟีเจอร์หลักของเรา</h2>
        <ul className="mt-2 list-inside list-disc space-y-2">
          <li>
            <strong>ระบบลงทะเบียน</strong> - ผู้ใช้สามารถสมัครสมาชิกและเข้าสู่ระบบได้
          </li>
          <li>
            <strong>ระบบผู้ขาย</strong> - ลงทะเบียนเป็นผู้ขาย, ดูข้อมูลหนังสือ, และโพสต์ขายหนังสือ
          </li>
          <li>
            <strong>ระบบแนะนำ</strong> - แนะนำราคาขายหนังสือ และช่วยเติมคำอัตโนมัติสำหรับการค้นหา
          </li>
          <li>
            <strong>การจับคู่</strong> - จับคู่ระหว่างผู้ซื้อและผู้ขายตามเงื่อนไขที่ตรงกัน
          </li>
          <li>
            <strong>ธุรกรรมที่ปลอดภัย</strong> - รองรับการชำระเงินผ่านบัตรเครดิตและกระเป๋าเงินดิจิทัล
          </li>
          <li>
            <strong>ระบบบันทึก</strong> - ผู้ซื้อสามารถบันทึกหนังสือที่สนใจเพื่อดูภายหลัง
          </li>
        </ul>

        <h2 className="mt-6 text-2xl font-semibold text-blue-500">ทำไมต้องเลือกเรา?</h2>
        <p className="mt-2">
          เรามุ่งมั่นพัฒนาแพลตฟอร์มที่ใช้งานง่าย ปลอดภัย และเป็นประโยชน์ต่อผู้ใช้ทุกคน ไม่ว่าคุณจะเป็นผู้ซื้อหรือผู้ขาย
          BOOKBOOK พร้อมช่วยให้คุณพบหนังสือที่ต้องการและทำธุรกรรมได้อย่างมั่นใจ
        </p>

        <div className="mt-6">
          <Link href="/contact">
            <span className="text-lg font-semibold text-blue-600 hover:underline">ติดต่อเรา : 0987654321</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
