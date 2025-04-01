import { BookMarked, BookOpen, ChevronRight, FileText, PlusCircle, Search, Star, Store, UserPlus } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Book Book",
  description: "ซื้อ-ขาย และค้นพบหนังสือเล่มโปรดเล่มต่อไปของคุณ!",
};

export default function Home() {
  return (
    <main className="min-h-screen text-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-6 pb-12 pt-6 sm:pb-16 sm:pt-8 md:pb-20 md:pt-10">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-6 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 backdrop-blur-md transition-all duration-300">
              ร้านหนังสือออนไลน์
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 transition-colors duration-300 sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Book Book
              </span>
              <span className="ml-2 inline-block">📚</span>
            </h1>

            <p className="mb-8 max-w-2xl text-base text-gray-600 transition-colors duration-300 sm:text-lg md:text-xl">
              ซื้อ-ขาย และค้นพบหนังสือเล่มโปรดเล่มต่อไปของคุณ!
            </p>

            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
              <Link href="/search">
                <button
                  aria-label="ค้นหาหนังสือ"
                  className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-4 font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                >
                  <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-blue-600 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                  <span className="relative flex items-center">
                    <Search className="mr-2 h-5 w-5" />
                    ค้นหาหนังสือ
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </button>
              </Link>

              <Link href="/book/sell">
                <button className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white px-10 py-4 font-medium text-blue-600 ring-1 ring-blue-200 transition-all duration-300 hover:bg-gray-50 hover:shadow-lg">
                  <span className="relative flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    ขายหนังสือของคุณ
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 pb-24 sm:pb-28 md:pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="relative rounded-3xl bg-white/80 p-6 shadow-xl backdrop-blur-xl transition-colors duration-300 sm:p-8">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 transform rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-lg">
              <BookMarked className="h-6 w-6" />
            </div>

            <h2 className="mb-8 pt-6 text-center text-xl font-bold text-gray-800 transition-colors duration-300 sm:text-2xl">
              สำรวจหน้าต่างๆ ของเรา
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                // { href: "/search", icon: <Search />, text: "🔍 ค้นหาหนังสือ" },
                { href: "/add-book", icon: <PlusCircle />, text: "📖 เพิ่มหนังสือ" },
                // { href: "/my-books", icon: <BookMarked />, text: "📚 รายการหนังสือของฉัน" },
                // { href: "/potential-matches", icon: <Handshake />, text: "🤝 แนะนำผู้ซื้อที่ตรงกับคุณ" },
                { href: "/transaction-history-page", icon: <FileText />, text: "📜 ประวัติการสั่งซื้อ" },
                // { href: "/checkout", icon: <ShoppingCart />, text: "ทำการสั่งซื้อ (Checkout)" },
                // { href: "/order-status", icon: <Package />, text: "การซื้อของฉัน (Order status)" },
                { href: "/seller-registration", icon: <UserPlus />, text: "ลงทะเบียนผู้ขาย" },
                { href: "/seller-reviews", icon: <Star />, text: "ดูรีวิวผู้ขาย" },
                { href: "/my-post", icon: <Store />, text: "โพสต์ของฉัน" },
              ].map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="group flex items-center rounded-2xl bg-white p-5 ring-1 ring-gray-100 transition-all duration-300 hover:scale-[1.02] hover:bg-blue-50 hover:shadow-lg"
                >
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                    {item.icon}
                  </div>
                  <span className="font-medium text-gray-700 transition-colors duration-300 group-hover:text-blue-600">
                    {item.text}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
