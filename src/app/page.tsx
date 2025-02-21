import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6 text-gray-900">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-blue-600">ยินดีต้อนรับสู่ Book Book 📚</h1>
        <p className="mt-3 text-lg text-gray-700">ซื้อ-ขาย และค้นพบหนังสือเล่มโปรดเล่มต่อไปของคุณ!</p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/search">
            <button className="rounded-lg bg-blue-600 px-6 py-2 text-white shadow-md transition hover:bg-blue-700">
              ค้นหาหนังสือ
            </button>
          </Link>
          <Link href="/sell-book">
            <button className="rounded-lg border border-blue-600 px-6 py-2 text-blue-600 shadow-md transition hover:bg-blue-600 hover:text-white">
              ขายหนังสือของคุณ
            </button>
          </Link>
        </div>
      </section>

      <section className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-semibold">สำรวจหน้าต่างๆ ของเรา</h2>
        <ul className="space-y-3">
          <li>
            <Link href="/search" className="block text-blue-600 hover:text-blue-800">
              🔍 ค้นหาหนังสือ
            </Link>
          </li>
          <li>
            <Link href="/add-book" className="block text-blue-600 hover:text-blue-800">
              📖 เพิ่มหนังสือ
            </Link>
          </li>
          <li>
            <Link href="/my-books" className="block text-blue-600 hover:text-blue-800">
              📚 รายการหนังสือของฉัน
            </Link>
          </li>
          <li>
            <Link href="/potential-matches" className="block text-blue-600 hover:text-blue-800">
              🤝 แนะนำผู้ซื้อที่ตรงกับคุณ
            </Link>
          </li>
          <li>
            <Link href="/transaction-initiation" className="block text-blue-600 hover:text-blue-800">
              💰 ใบเสนอขาย
            </Link>
          </li>
          <li>
            <Link href="/transaction-history-page" className="block text-blue-600 hover:text-blue-800">
              📜 ประวัติการสั่งซื้อ
            </Link>
          </li>
          <li>
            <Link href="/shipping-methods" className="block text-blue-600 hover:text-blue-800">
              Shipping methods
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
