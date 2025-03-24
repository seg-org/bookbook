import { TransactionFailType, TransactionStatus } from "@prisma/client";
import { useRouter } from "next/navigation";

import Image from "next/image";

import { LoadingAnimation } from "@/components/LoadingAnimation";
import { useTransactionContext } from "@/context/transactionContext";
import { useGetTransaction } from "@/hooks/useGetTransactions";

const TransactionDetailsPopup = () => {
  const router = useRouter();
  const { selectingTransaction, setSelectingTransaction, userId } = useTransactionContext();
  const { transaction, loading, error } = useGetTransaction(selectingTransaction);

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
                <p className="font-bold text-slate-500">ชื่อ : </p>
                <p className="text-slate-500">{transaction?.post?.book?.title}</p>
                <p className="font-bold text-slate-500">ผู้เขียน : </p>
                <p className="text-slate-500">{transaction?.post?.book?.author}</p>
                <p className="font-bold text-slate-500">คำอธิบาย : </p>
                <p className="text-slate-500">{transaction?.post?.book?.description}</p>
                <p className="font-bold text-slate-500">จำนวนหน้า : </p>
                <p className="text-slate-500">{transaction?.post?.book?.pages}</p>
                <p className="font-bold text-slate-500">หมวดหมู่ : </p>
                <p className="text-slate-500">{transaction?.post?.book?.genre}</p>
                <p className="col-span-2 text-lg font-extrabold underline">โพสต์</p>
                <p className="font-bold text-slate-500">ชื่อ : </p>
                <p className="text-slate-500">{transaction?.post?.title}</p>
                <p className="font-bold text-slate-500">เนื้อหา : </p>
                <p className="text-slate-500">{transaction?.post?.content}</p>
                <p className="col-span-2 text-lg font-extrabold underline">ผู้ขาย</p>
                <p className="font-bold text-slate-500">ชื่อ : </p>
                <p className="text-slate-500">{transaction?.seller?.firstName + " " + transaction?.seller?.lastName}</p>
                <p className="font-bold text-slate-500">อีเมล : </p>
                <p className="text-slate-500">{transaction?.seller?.email}</p>
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
                <p className="text-xl font-bold">{transaction?.post?.price}.-</p>
                <div className="flex flex-row justify-end space-x-2">
                  {transaction?.status == TransactionStatus.PACKING &&
                    transaction?.buyerId === userId &&
                    transaction?.createdAt < oneWeekAgo && (
                      <button
                        className="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none"
                        onClick={() => {
                          router.push(`/transaction-deny/${transaction.id}`);
                        }}
                      >
                        รายงาน
                      </button>
                    )}
                  {transaction?.status == TransactionStatus.PACKING &&
                    transaction?.buyerId === userId &&
                    transaction?.createdAt >= oneWeekAgo && (
                      <button
                        className="mt-4 rounded bg-gray-400 px-4 py-2 text-white focus:outline-none"
                        onClick={() => {
                          alert("การขอยกเลิกสามารถขอได้หลังส่งซื้ออย่างน้อย 1 สัปดาห์");
                        }}
                      >
                        รายงาน
                      </button>
                    )}
                  {transaction?.status == TransactionStatus.PACKING && transaction?.sellerId === userId && (
                    <button
                      className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
                      onClick={() => {}}
                    >
                      ใส่รายละเอียดจัดส่ง
                    </button>
                  )}
                  {transaction?.status == TransactionStatus.DELIVERING &&
                    transaction?.buyerId === userId &&
                    transaction?.updatedAt >= oneWeekAgo && (
                      <button
                        className="mt-4 rounded bg-gray-400 px-4 py-2 text-white focus:outline-none"
                        onClick={() => {
                          alert("การขอยกเลิกสามารถขอได้หลังเริ่มจัดส่งอย่างน้อย 1 สัปดาห์");
                        }}
                      >
                        รายงาน
                      </button>
                    )}
                  {transaction?.status == TransactionStatus.DELIVERING &&
                    transaction?.buyerId === userId &&
                    transaction?.updatedAt < oneWeekAgo && (
                      <button
                        className="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none"
                        onClick={() => {
                          router.push(`/transaction-deny/${transaction.id}`);
                        }}
                      >
                        รายงาน
                      </button>
                    )}
                  {transaction?.status == TransactionStatus.HOLD && transaction?.buyerId === userId && (
                    <button
                      className="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none"
                      onClick={() => {
                        router.push(`/transaction-deny/${transaction.id}`);
                      }}
                    >
                      รายงานเพิ่มเติม
                    </button>
                  )}
                  {transaction?.status == TransactionStatus.DELIVERING && transaction?.buyerId === userId && (
                    <button
                      className="mt-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none"
                      onClick={() => {}}
                    >
                      รับสำเร็จ
                    </button>
                  )}
                  <button
                    className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
                    onClick={() => {
                      setSelectingTransaction("");
                    }}
                  >
                    ปิด
                  </button>
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
