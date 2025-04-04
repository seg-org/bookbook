import { TransactionFailType, TransactionStatus } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { LoadingAnimation } from "@/components/LoadingAnimation";
import { Button } from "@/components/ui/Button";
import { useTransactionAdminContext } from "@/context/transactionAdminContext";
import { useGetTransaction } from "@/hooks/useGetTransactions";

const TransactionDetailsPopup = () => {
  const router = useRouter();
  const { selectingTransaction, setSelectingTransaction, userId } = useTransactionAdminContext();
  const { transaction, loading, error } = useGetTransaction(selectingTransaction);
  const [shippingDialogOpen, setShippingDialogOpen] = useState(false);
  const statusMap: Record<TransactionStatus, { label: string; color: string }> = {
    [TransactionStatus.PACKING]: { label: "กำลังเตรียม", color: "text-gray-300" },
    [TransactionStatus.DELIVERING]: { label: "จัดส่ง", color: "text-gray-300" },
    [TransactionStatus.COMPLETE]: { label: "สำเร็จ", color: "text-green-500" },
    [TransactionStatus.HOLD]: { label: "ตรวจสอบ", color: "text-yellow-500" },
    [TransactionStatus.FAIL]: { label: "ยกเลิก", color: "text-red-500" },
  };

  const FailTypeMap: Record<TransactionFailType, { label: string }> = {
    [TransactionFailType.UNDELIVERED]: { label: "ไม่จัดส่ง" },
    [TransactionFailType.UNQUALIFIED]: { label: "ของขาดคุณภาพ" },
    [TransactionFailType.REJECT]: { label: "ยกเลิก" },
    [TransactionFailType.TERMINATION]: { label: "บังคับยกเลิก" },
    [TransactionFailType.OTHER]: { label: "อื่น" },
    [TransactionFailType.UNDEFINED]: { label: "ไม่ระบุ" },
  };

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  if (selectingTransaction == "") {
    return <></>;
  } else if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <LoadingAnimation />
      </div>
    );
  } else if (error) {
    console.log(error);
    return <></>;
  } else if (transaction) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-semibold">รายละเอียด</h2>

          <div className="flex items-center gap-4">
            <Image
              className="rounded-lg object-cover"
              src={transaction?.post?.book?.coverImageUrl || "f"}
              alt="Book Cover"
              height={312}
              width={220}
            />
            <div>
              <div className="grid max-h-64 w-80 grid-cols-[auto_1fr] gap-2 overflow-y-auto rounded-lg border bg-white p-4 shadow-md">
                <p className="text-lg font-extrabold underline">สถานะ :</p>
                <p>
                  <label className={`text-lg ${statusMap[transaction.status]?.color} font-extrabold`}>
                    {statusMap[transaction.status]?.label}
                  </label>
                </p>
                <p className="font-bold text-slate-500">รหัร : </p>
                <p className="text-slate-500">{transaction?.id}</p>
                <p className="font-bold text-slate-500">สร้าง : </p>
                <p className="text-slate-500">
                  {transaction?.createdAt.getDay().toString() +
                    "/" +
                    transaction?.createdAt.getMonth().toString() +
                    "/" +
                    transaction?.createdAt.getFullYear().toString()}
                </p>
                <p className="font-bold text-slate-500">แก้ไขล่าสุด : </p>
                <p className="text-slate-500">
                  {transaction?.updatedAt.getDay().toString() +
                    "/" +
                    transaction?.updatedAt.getMonth().toString() +
                    "/" +
                    transaction?.updatedAt.getFullYear().toString()}
                </p>
                <p className="col-span-2 text-lg font-extrabold underline">ข้อมูลหนังสือ</p>
                <p className="font-bold text-slate-500">รหัร : </p>
                <p className="text-slate-500">{transaction?.post.book.id}</p>
                <p className="font-bold text-slate-500">ชื่อ : </p>
                <p className="text-slate-500">{transaction?.post?.book?.title}</p>
                <p className="font-bold text-slate-500">ผู้เขียน : </p>
                <p className="text-slate-500">{transaction?.post?.book?.author}</p>
                <p className="font-bold text-slate-500">ผู้ตีพิมพ์ : </p>
                <p className="text-slate-500">{transaction?.post?.book?.publisher}</p>
                <p className="font-bold text-slate-500">คำอธิบาย : </p>
                <p className="text-slate-500">{transaction?.post?.book?.description}</p>
                <p className="font-bold text-slate-500">รหัร isbn : </p>
                <p className="text-slate-500">{transaction?.post?.book?.isbn}</p>
                <p className="font-bold text-slate-500">จำนวนหน้า : </p>
                <p className="text-slate-500">{transaction?.post?.book?.pages}</p>
                <p className="font-bold text-slate-500">หมวดหมู่ : </p>
                <p className="text-slate-500">{transaction?.post?.book?.genre}</p>
                <p className="col-span-2 text-lg font-extrabold underline">โพสต์</p>
                <p className="font-bold text-slate-500">รหัร : </p>
                <p className="text-slate-500">{transaction?.post.id}</p>
                <p className="font-bold text-slate-500">ชื่อ : </p>
                <p className="text-slate-500">{transaction?.post?.title}</p>
                <p className="font-bold text-slate-500">เนื้อหา : </p>
                <p className="text-slate-500">{transaction?.post?.content}</p>
                <p className="col-span-2 text-lg font-extrabold underline">ผู้ขาย</p>
                <p className="font-bold text-slate-500">ชื่อ : </p>
                <p className="text-slate-500">{transaction?.seller?.firstName + " " + transaction?.seller?.lastName}</p>
                <p className="font-bold text-slate-500">อีเมล : </p>
                <p className="text-slate-500">{transaction?.seller?.email}</p>
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
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold">{transaction?.amount}.-</p>
                <div className="flex flex-row justify-end space-x-2">
                  <Button
                    className="mt-4 px-6 py-3"
                    variant="secondary"
                    onClick={() => {
                      setSelectingTransaction("");
                    }}
                  >
                    ปิด
                  </Button>
                  {transaction?.status == TransactionStatus.PACKING && transaction?.buyerId === userId && (
                    <Button
                      className="mt-4 px-4 py-2"
                      variant="destructive"
                      onClick={() => {
                        router.push(`/transaction-deny/${transaction.id}`);
                      }}
                    >
                      รายงาน
                    </Button>
                  )}
                  {transaction?.status == TransactionStatus.DELIVERING && transaction?.buyerId === userId && (
                    <Button
                      className="mt-4 px-4 py-2"
                      variant="destructive"
                      onClick={() => {
                        router.push(`/transaction-deny/${transaction.id}`);
                      }}
                    >
                      รายงาน
                    </Button>
                  )}
                  {transaction?.status == TransactionStatus.HOLD && transaction?.buyerId === userId && (
                    <Button
                      className="mt-4 px-4 py-2"
                      variant="destructive"
                      onClick={() => {
                        router.push(`/transaction-deny/${transaction.id}`);
                      }}
                    >
                      รายงานเพิ่มเติม
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default TransactionDetailsPopup;
