import { DamageType, PaymentMethod, ShipmentMethod, TransactionFailType, TransactionStatus } from "@prisma/client";
import Image from "next/image";

import { Transaction } from "@/data/dto/transaction.dto";

const TransactionDetails = ({ transaction }: { transaction: Transaction | undefined }) => {
  const statusMap: Record<TransactionStatus, { label: string; color: string }> = {
    [TransactionStatus.PACKING]: { label: "กำลังเตรียม", color: "text-gray-300" },
    [TransactionStatus.DELIVERING]: { label: "จัดส่ง", color: "text-gray-300" },
    [TransactionStatus.COMPLETE]: { label: "สำเร็จ", color: "text-green-500" },
    [TransactionStatus.HOLD]: { label: "ตรวจสอบ", color: "text-yellow-500" },
    [TransactionStatus.FAIL]: { label: "ยกเลิก", color: "text-red-500" },
  };

  const paymentMethodMap: Record<PaymentMethod, { label: string; color: string }> = {
    [PaymentMethod.CREDIT_CARD]: { label: "เครดิตการ์ด", color: "text-slate-500" },
    [PaymentMethod.ONLINE_BANKING]: { label: "โอนจ่าย", color: "text-slate-500" },
    [PaymentMethod.UNDEFINED]: { label: "ไม่ระบุ", color: "text-slate-500" },
  };

  const shipmentMethodMap: Record<ShipmentMethod, { label: string; color: string }> = {
    [ShipmentMethod.STANDARD]: { label: "ปกติ", color: "text-slate-500" },
    [ShipmentMethod.EXPRESS]: { label: "เร่งด่วน", color: "text-slate-500" },
    [ShipmentMethod.UNDEFINED]: { label: "ไม่ระบุ", color: "text-slate-500" },
  };

  const FailTypeMap: Record<TransactionFailType, { label: string }> = {
    [TransactionFailType.UNDELIVERED]: { label: "ไม่จัดส่ง" },
    [TransactionFailType.UNQUALIFIED]: { label: "ของขาดคุณภาพ" },
    [TransactionFailType.REJECT]: { label: "ยกเลิก" },
    [TransactionFailType.TERMINATION]: { label: "บังคับยกเลิก" },
    [TransactionFailType.OTHER]: { label: "อื่น" },
    [TransactionFailType.UNDEFINED]: { label: "ไม่ระบุ" },
  };

  const DamageTypeMap: Record<DamageType, { label: string }> = {
    [DamageType.NO_DAMAGED]: { label: "สมบูรณ์" },
    [DamageType.SLIGHTLY_DAMAGED]: { label: "เกือบสมบูรณ์" },
    [DamageType.DAMAGED]: { label: "ได้รับความเสียหาย" },
  };

  const dateString = (date: Date | undefined) => {
    if (date === undefined) return "";
    return date.toLocaleDateString("en-GB").replace(/\//g, "/");
  };

  const displayLink = (URLs: string | undefined) => {
    if (URLs === undefined) return "";
    return URLs.replace(/,/g, "\n");
  };

  if (transaction) {
    return (
      <>
        <div className="flex flex-row space-x-2">
          <Image
            className="rounded-lg object-cover"
            src={transaction?.post.book.coverImageUrl || ""}
            alt="Book Cover"
            height={256}
            width={180}
          />
          <div className="grid max-h-64 w-96 grid-cols-[100px_220px] gap-2 overflow-y-auto rounded-lg border bg-white p-4 shadow-md">
            <p className="text-lg font-extrabold underline">สถานะ :</p>
            <p>
              <label className={`text-lg ${statusMap[transaction.status]?.color} font-extrabold`}>
                {statusMap[transaction.status]?.label}
              </label>
            </p>
            <p className="font-bold text-slate-500">รหัร : </p>
            <p className="text-slate-500">{transaction?.id}</p>
            <p className="font-bold text-slate-500">สร้าง : </p>
            <p className="text-slate-500">{dateString(transaction?.createdAt)}</p>
            <p className="font-bold text-slate-500">แก้ไขล่าสุด : </p>
            <p className="text-slate-500">{dateString(transaction?.updatedAt)}</p>
            <p className="font-bold text-slate-500">การจ่าย : </p>
            <p className="text-slate-500">{paymentMethodMap[transaction.paymentMethod]?.label}</p>
            <p className="font-bold text-slate-500">การส่ง : </p>
            <p className="text-slate-500">{shipmentMethodMap[transaction.shipmentMethod]?.label}</p>
            <p className="font-bold text-slate-500">ที่อยู่ : </p>
            <p className="text-slate-500">{transaction?.address}</p>
            <p className="col-span-2 text-lg font-extrabold underline">ข้อมูลหนังสือ</p>
            <p className="font-bold text-slate-500">รหัร : </p>
            <p className="text-slate-500">{transaction?.post.book.id}</p>
            <p className="font-bold text-slate-500">ชื่อ : </p>
            <p className="text-slate-500">{transaction?.post?.book?.title}</p>
            <p className="font-bold text-slate-500">รหัร isbn : </p>
            <p className="text-slate-500">{transaction?.post?.book?.isbn}</p>
            <p className="font-bold text-slate-500">ผู้เขียน : </p>
            <p className="text-slate-500">{transaction?.post?.book?.author}</p>
            <p className="font-bold text-slate-500">ผู้ตีพิมพ์ : </p>
            <p className="text-slate-500">{transaction?.post?.book?.publisher}</p>
            <p className="font-bold text-slate-500">คำอธิบาย : </p>
            <p className="text-slate-500">{transaction?.post?.book?.description}</p>
            <p className="font-bold text-slate-500">จำนวนหน้า : </p>
            <p className="text-slate-500">{transaction?.post?.book?.pages}</p>
            <p className="font-bold text-slate-500">หมวดหมู่ : </p>
            <p className="text-slate-500">
              {transaction?.post?.book?.bookGenres
                ? transaction?.post?.book?.bookGenres
                    .map((str) =>
                      str
                        .toLowerCase()
                        .split("_")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" "),
                    )
                    .join(",")
                : ""}
            </p>
            <p className="font-bold text-slate-500">แท็ก : </p>
            <p className="text-slate-500">
              {transaction?.post?.book?.bookTags
                ? transaction?.post?.book?.bookTags
                    .map((str) =>
                      str
                        .toLowerCase()
                        .split("_")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" "),
                    )
                    .join(" ,")
                : ""}
            </p>
            <p className="col-span-2 text-lg font-extrabold underline">โพสต์</p>
            <p className="font-bold text-slate-500">รหัร : </p>
            <p className="text-slate-500">{transaction?.post.id}</p>
            <p className="font-bold text-slate-500">ชื่อ : </p>
            <p className="text-slate-500">{transaction?.post?.title}</p>
            <p className="font-bold text-slate-500">เนื้อหา : </p>
            <p className="text-slate-500">{transaction?.post?.content}</p>
            <p className="font-bold text-slate-500">ความพิเศษ : </p>
            <p className="text-slate-500">
              {transaction?.post?.specialDescriptions
                ? transaction?.post?.specialDescriptions
                    .map((str) =>
                      str
                        .toLowerCase()
                        .split("_")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" "),
                    )
                    .join(" ,")
                : ""}
            </p>
            <p className="font-bold text-slate-500">ความสมบูรณ์ : </p>
            <p className="text-slate-500">
              {DamageTypeMap[transaction?.post.damage]?.label}
              {"\n\n"}
              {transaction?.post.damageURLs.map((url) => {
                {
                  return displayLink(url);
                }
              })}
            </p>
            <p className="col-span-2 text-lg font-extrabold underline">ผู้ขาย</p>
            <p className="font-bold text-slate-500">รหัร : </p>
            <p className="text-slate-500">{transaction?.seller.id}</p>
            <p className="font-bold text-slate-500">ชื่อ : </p>
            <p className="text-slate-500">{transaction?.seller?.firstName + " " + transaction?.seller?.lastName}</p>
            <p className="font-bold text-slate-500">อีเมล : </p>
            <p className="text-slate-500">{transaction?.seller?.email}</p>
            <p className="font-bold text-slate-500">เบอร์โทร : </p>
            <p className="text-slate-500">{transaction?.seller?.phoneNumber}</p>
            <p className="col-span-2 text-lg font-extrabold underline">ผู้ซื้อ</p>
            <p className="font-bold text-slate-500">รหัร : </p>
            <p className="text-slate-500">{transaction?.buyer.id}</p>
            <p className="font-bold text-slate-500">ชื่อ : </p>
            <p className="text-slate-500">{transaction?.buyer?.firstName + " " + transaction?.seller?.lastName}</p>
            <p className="font-bold text-slate-500">อีเมล : </p>
            <p className="text-slate-500">{transaction?.buyer?.email}</p>
            <p className="font-bold text-slate-500">เบอร์โทร : </p>
            <p className="text-slate-500">{transaction?.buyer?.phoneNumber}</p>
            {transaction?.status !== "PACKING" && (transaction?.trackingNumber || transaction?.trackingURL) && (
              <>
                <p className="col-span-2 text-lg font-extrabold underline">รายละเอียดการจัดส่ง</p>

                {transaction?.trackingNumber && (
                  <>
                    <p className="font-bold text-slate-500">หมายเลขพัสดุ : </p>
                    <p className="break-all text-slate-500">{transaction.trackingNumber}</p>
                  </>
                )}

                {transaction?.trackingURL && (
                  <>
                    <p className="font-bold text-slate-500">ลิงก์ติดตาม : </p>
                    <p className="break-all text-slate-500">
                      <a
                        href={transaction.trackingURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {transaction.trackingURL}
                      </a>
                    </p>
                  </>
                )}
              </>
            )}
            {transaction?.status == TransactionStatus.HOLD && (
              <>
                <p className="col-span-2 text-lg font-extrabold text-yellow-700 underline">การรายงาน</p>
                <p className="font-bold text-yellow-500">รายละเอียด : </p>
                <p className="text-yellow-500">{transaction?.failData?.detail.join(" ,")}</p>
                <p className="font-bold text-yellow-500">หลักฐาน : </p>
                <p className="text-yellow-500">
                  {transaction?.failData?.evidenceURL.map((str) => {
                    return displayLink(str);
                  })}
                </p>
              </>
            )}

            {transaction?.status == TransactionStatus.FAIL && (
              <>
                <p className="col-span-2 text-lg font-extrabold text-red-600 underline">สาเหตุการยกเลิก</p>
                <p className="font-bold text-red-400">หมวดหมู่ : </p>
                <p className="text-red-400">
                  {FailTypeMap[transaction?.failData?.failType || TransactionFailType.UNDEFINED].label}
                </p>
                <p className="font-bold text-red-400">รายละเอียด : </p>
                <p className="text-red-400">{transaction?.failData?.detail}</p>
              </>
            )}
            {transaction?.review && (
              <>
                <p className="col-span-2 text-lg font-extrabold underline">การตอบกลับ</p>
                <p className="font-bold text-slate-500">คะแนน : </p>
                <p
                  className={` ${transaction?.review.rating === 1 ? "text-red-500" : ""} ${transaction?.review.rating === 2 ? "text-orange-500" : ""} ${transaction?.review.rating === 3 ? "text-yellow-500" : ""} ${transaction?.review.rating === 4 ? "text-green-500" : ""} ${transaction?.review.rating === 5 ? "text-green-700" : ""} `}
                >
                  {transaction?.review.rating}
                </p>
                <p className="font-bold text-slate-500">ความคิดเห็น : </p>
                <p className="text-slate-500">{transaction?.review.comment}</p>
              </>
            )}
          </div>
        </div>
      </>
    );
  }
};

export default TransactionDetails;
