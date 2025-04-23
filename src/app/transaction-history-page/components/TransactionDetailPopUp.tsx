import {
  BookTagType,
  DamageType,
  GenreType,
  PaymentMethod,
  ShipmentMethod,
  SpecialDescriptionType,
  TransactionFailType,
  TransactionStatus,
} from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ShippingDetailsDialog } from "@/app/transaction-history-page/components/ShippingDetailsDialog";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { Button } from "@/components/ui/Button";
import { useTransactionContext } from "@/context/transactionContext";
import { createNotification } from "@/data/notification";
import { useGetTransaction } from "@/hooks/useGetTransactions";

const TransactionDetailsPopup = () => {
  const router = useRouter();
  const { selectingTransaction, setSelectingTransaction, userId } = useTransactionContext();
  const { transaction, loading, error } = useGetTransaction(selectingTransaction);
  const [shippingDialogOpen, setShippingDialogOpen] = useState(false);
  // pardon me with this curse, I just want to code to work
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

  const GenresTypeMap: Record<GenreType, { label: string }> = {
    [GenreType.FICTION]: { label: "นิยาย" },
    [GenreType.NON_FICTION]: { label: "สารคดี" },
    [GenreType.MYSTERY]: { label: "ลึกลับ" },
    [GenreType.THRILLER]: { label: "ระทึกขวัญ" },
    [GenreType.ROMANCE]: { label: "โรแมนติก" },
    [GenreType.SCIENCE_FICTION]: { label: "นิยายวิทยาศาสตร์" },
    [GenreType.FANTASY]: { label: "แฟนตาซี" },
    [GenreType.HISTORICAL_FICTION]: { label: "นิยายอิงประวัติศาสตร์" },
    [GenreType.HORROR]: { label: "สยองขวัญ" },
    [GenreType.BIOGRAPHY]: { label: "ชีวประวัติ" },
    [GenreType.MEMOIR]: { label: "บันทึกความทรงจำ" },
    [GenreType.SELF_HELP]: { label: "พัฒนาตนเอง" },
    [GenreType.HEALTH_WELLNESS]: { label: "สุขภาพและสุขภาวะ" },
    [GenreType.PSYCHOLOGY]: { label: "จิตวิทยา" },
    [GenreType.POETRY]: { label: "บทกวี" },
    [GenreType.DRAMA]: { label: "ละคร" },
    [GenreType.ADVENTURE]: { label: "ผจญภัย" },
    [GenreType.CHILDRENS_LITERATURE]: { label: "วรรณกรรมเด็ก" },
    [GenreType.YOUNG_ADULT]: { label: "วรรณกรรมวัยรุ่น" },
    [GenreType.GRAPHIC_NOVELS_COMICS]: { label: "นิยายภาพและการ์ตูน" },
    [GenreType.CRIME]: { label: "อาชญากรรม" },
    [GenreType.TRUE_CRIME]: { label: "อาชญากรรมจริง" },
    [GenreType.DYSTOPIAN]: { label: "ดิสโทเปีย" },
    [GenreType.CONTEMPORARY]: { label: "ร่วมสมัย" },
    [GenreType.RELIGIOUS_SPIRITUAL]: { label: "ศาสนาและจิตวิญญาณ" },
  };

  const TagTypeMap: Record<BookTagType, { label: string }> = {
    [BookTagType.BESTSELLER]: { label: "หนังสือขายดี" },
    [BookTagType.NEW_RELEASE]: { label: "ออกใหม่" },
    [BookTagType.CLASSIC]: { label: "คลาสสิก" },
    [BookTagType.AWARD_WINNING]: { label: "รางวัลยอดเยี่ยม" },
    [BookTagType.MUST_READ]: { label: "ต้องอ่าน" },
    [BookTagType.HIGHLY_RECOMMENDED]: { label: "แนะนำอย่างยิ่ง" },
    [BookTagType.INSPIRATIONAL]: { label: "สร้างแรงบันดาลใจ" },
    [BookTagType.COMING_OF_AGE]: { label: "การเติบโตของตัวละคร" },
    [BookTagType.FAMILY_SAGA]: { label: "เรื่องราวครอบครัว" },
    [BookTagType.HISTORICAL]: { label: "ประวัติศาสตร์" },
    [BookTagType.DARK_FANTASY]: { label: "ดาร์คแฟนตาซี" },
    [BookTagType.DETECTIVE]: { label: "นักสืบ" },
    [BookTagType.LGBTQ_PLUS]: { label: "LGBTQ+" },
    [BookTagType.YOUNG_ADULT]: { label: "วรรณกรรมวัยรุ่น" },
    [BookTagType.CHILDRENS_BOOK]: { label: "หนังสือเด็ก" },
    [BookTagType.SHORT_STORIES]: { label: "เรื่องสั้น" },
    [BookTagType.MYSTERY]: { label: "ลึกลับ" },
    [BookTagType.SELF_HELP]: { label: "พัฒนาตนเอง" },
    [BookTagType.THRILLER]: { label: "ระทึกขวัญ" },
    [BookTagType.ROMANTIC_COMEDY]: { label: "โรแมนติกคอมเมดี้" },
  };

  const SpecialDescriptionMap: Record<SpecialDescriptionType, { label: string }> = {
    [SpecialDescriptionType.AUTHOR_SIGNATURE]: { label: "ลายเซ็นผู้เขียน" },
    [SpecialDescriptionType.LIMITED_EDITION]: { label: "มีจำกัด" },
    [SpecialDescriptionType.FIRST_EDITION]: { label: "ฉบับแรก" },
    [SpecialDescriptionType.SPECIAL_COVER_ART]: { label: "ปกอาร์ต" },
    [SpecialDescriptionType.ILLUSTRATED_EDITION]: { label: "ฉบับภาพประกอบ" },
    [SpecialDescriptionType.COLLECTORS_EDITION]: { label: "ฉบับสะสม" },
    [SpecialDescriptionType.SLIPCASE_EDITION]: { label: "ฉบับกล่องแข็ง" },
    [SpecialDescriptionType.LEATHER_BOUND]: { label: "ปกหนัง" },
    [SpecialDescriptionType.GILDED_EDGES]: { label: "ขอบทอง" },
    [SpecialDescriptionType.DECKLE_EDGES]: { label: "ขอบกระดาษหยัก" },
    [SpecialDescriptionType.POP_UP_ELEMENTS]: { label: "องค์ประกอบป๊อปอัพ" },
    [SpecialDescriptionType.FOLD_OUT_PAGES]: { label: "หน้ากระดาษพับขยายได้" },
    [SpecialDescriptionType.HANDWRITTEN_NOTES_BY_AUTHOR]: { label: "บันทึกลายมือผู้เขียน" },
    [SpecialDescriptionType.PERSONALIZED_MESSAGE]: { label: "ข้อความเฉพาะบุคคล" },
    [SpecialDescriptionType.NUMBERED_EDITION]: { label: "ฉบับลำดับเลข" },
    [SpecialDescriptionType.EXCLUSIVE_ARTWORK]: { label: "ภาพประกอบพิเศษ" },
    [SpecialDescriptionType.EMBOSSED_COVER]: { label: "ปกนูน" },
    [SpecialDescriptionType.GOLD_FOIL_STAMPING]: { label: "ปั๊มฟอยล์ทอง" },
    [SpecialDescriptionType.BOX_SET]: { label: "ชุดกล่อง" },
    [SpecialDescriptionType.ANNIVERSARY_EDITION]: { label: "ฉบับครบรอบ" },
    [SpecialDescriptionType.HARDCOVER_WITH_DUST_JACKET]: { label: "ปกแข็งพร้อมปกกระดาษ" },
    [SpecialDescriptionType.TRANSPARENT_COVER]: { label: "ปกโปร่งใส" },
    [SpecialDescriptionType.ANNOTATED_EDITION]: { label: "ฉบับมีคำอธิบายประกอบ" },
    [SpecialDescriptionType.SIGNED_BY_ILLUSTRATOR]: { label: "ลายเซ็นนักวาดภาพประกอบ" },
    [SpecialDescriptionType.MAP_INSERT]: { label: "แผนที่แนบ" },
    [SpecialDescriptionType.SUPPLEMENTARY_MATERIALS]: { label: "เอกสารเสริม" },
    [SpecialDescriptionType.EXCLUSIVE_CONTENT]: { label: "เนื้อหาพิเศษ" },
    [SpecialDescriptionType.FAN_ART_EDITION]: { label: "ฉบับแฟนอาร์ต" },
    [SpecialDescriptionType.INTERACTIVE_ELEMENTS]: { label: "องค์ประกอบเชิงโต้ตอบ" },
    [SpecialDescriptionType.BILINGUAL_EDITION]: { label: "ฉบับสองภาษา" },
  };

  const dateString = (date: Date | undefined) => {
    if (date === undefined) return "";
    return date.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const timeString = (date: Date | undefined) => {
    if (date === undefined) return "";
    return date.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
  };

  const displayLink = (URLs: string | undefined) => {
    if (URLs === undefined) return "";
    return URLs.replace(/,/g, "\n");
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
              src={transaction?.post?.book?.coverImageUrl || "../pic/defaultBook.png"}
              alt="Book Cover"
              height={312}
              width={220}
            />
            <div>
              <div className="max-w- grid max-h-64 grid-cols-[96px_232px] gap-2 overflow-y-auto rounded-lg border bg-white p-4 shadow-md">
                <p className="text-lg font-extrabold underline">สถานะ :</p>
                <p>
                  <label className={`text-lg ${statusMap[transaction.status]?.color} font-extrabold`}>
                    {statusMap[transaction.status]?.label}
                  </label>
                </p>
                <p className="font-bold text-slate-500">สร้าง : </p>
                <p className="max-w-56 break-words text-slate-500">
                  {dateString(transaction?.createdAt)} {timeString(transaction?.createdAt)}
                  {"น."}
                </p>
                <p className="font-bold text-slate-500">แก้ไขล่าสุด : </p>
                <p className="max-w-56 break-words text-slate-500">
                  {dateString(transaction?.updatedAt)} {timeString(transaction?.updatedAt)}
                  {"น."}
                </p>
                <p className="font-bold text-slate-500">การจ่าย : </p>
                <p className="max-w-56 break-words text-slate-500">
                  {paymentMethodMap[transaction.paymentMethod]?.label}
                </p>
                <p className="font-bold text-slate-500">การส่ง : </p>
                <p className="max-w-56 break-words text-slate-500">
                  {shipmentMethodMap[transaction.shipmentMethod]?.label}
                </p>
                <p className="font-bold text-slate-500">ที่อยู่ : </p>
                <p className="max-w-56 break-words text-slate-500">{transaction?.address}</p>
                <p className="col-span-2 text-lg font-extrabold underline">ข้อมูลหนังสือ</p>
                <p className="font-bold text-slate-500">ชื่อ : </p>
                <p className="max-w-56 break-words text-slate-500">{transaction?.post?.book?.title}</p>
                <p className="font-bold text-slate-500">รหัส isbn : </p>
                <p className="max-w-56 break-words text-slate-500">{transaction?.post?.book?.isbn}</p>
                <p className="font-bold text-slate-500">ผู้เขียน : </p>
                <p className="max-w-56 break-words text-slate-500">{transaction?.post?.book?.author}</p>
                <p className="font-bold text-slate-500">ผู้ตีพิมพ์ : </p>
                <p className="max-w-56 break-words text-slate-500">{transaction?.post?.book?.publisher}</p>
                <p className="w-56 font-bold text-slate-500">คำอธิบาย : </p>
                <p className="max-w-56 break-words text-slate-500">{transaction?.post?.book?.description}</p>
                <p className="font-bold text-slate-500">จำนวนหน้า : </p>
                <p className="max-w-56 break-words text-slate-500">{transaction?.post?.book?.pages}</p>
                <p className="font-bold text-slate-500">หมวดหมู่ : </p>
                <p className="max-w-56 break-words text-slate-500">
                  {transaction?.post?.book?.bookGenres
                    ? transaction.post.book.bookGenres
                        .map((genre) => {
                          return GenresTypeMap[genre].label;
                        })
                        .join(", ")
                    : ""}
                </p>
                <p className="font-bold text-slate-500">แท็ก : </p>
                <p className="max-w-56 break-words text-slate-500">
                  {transaction?.post?.book?.bookTags
                    ? transaction.post.book.bookTags
                        .map((tag) => {
                          return TagTypeMap[tag].label;
                        })
                        .join(", ")
                    : ""}
                </p>
                <p className="col-span-2 text-lg font-extrabold underline">โพสต์</p>
                <p className="font-bold text-slate-500">ชื่อ : </p>
                <p className="max-w-56 break-words text-slate-500">{transaction?.post?.title}</p>
                <p className="font-bold text-slate-500">เนื้อหา : </p>
                <p className="max-w-56 break-words text-slate-500">{transaction?.post?.content}</p>
                <p className="font-bold text-slate-500">ความพิเศษ : </p>
                <p className="max-w-56 break-words text-slate-500">
                  {transaction?.post?.specialDescriptions
                    ? transaction.post.specialDescriptions
                        .map((desc) => {
                          return SpecialDescriptionMap[desc].label;
                        })
                        .join(", ")
                    : ""}
                </p>
                <p className="font-bold text-slate-500">ความสมบูรณ์ : </p>
                <p className="max-w-56 break-words text-slate-500">{DamageTypeMap[transaction?.post.damage]?.label}</p>
                {transaction?.post.damageURLs.map((url) => {
                  {
                    return (
                      <>
                        <p></p>
                        <a
                          href={url}
                          className="max-w-56 break-words text-blue-600 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {displayLink(url)}
                        </a>
                      </>
                    );
                  }
                })}
                {transaction.buyerId == userId && (
                  <>
                    <p className="col-span-2 text-lg font-extrabold underline">ผู้ขาย</p>
                    <p className="font-bold text-slate-500">ชื่อ : </p>
                    <p className="max-w-56 break-words text-slate-500">
                      {transaction?.seller?.firstName + " " + transaction?.seller?.lastName}
                    </p>
                    <p className="font-bold text-slate-500">อีเมล : </p>
                    <p className="max-w-56 break-words text-slate-500">{transaction?.seller?.email}</p>
                  </>
                )}
                {transaction.sellerId == userId && (
                  <>
                    <p className="col-span-2 text-lg font-extrabold underline">ผู้ซื้อ</p>
                    <p className="font-bold text-slate-500">ชื่อ : </p>
                    <p className="max-w-56 break-words text-slate-500">
                      {transaction?.buyer?.firstName + " " + transaction?.buyer?.lastName}
                    </p>
                    <p className="font-bold text-slate-500">อีเมล : </p>
                    <p className="max-w-56 break-words text-slate-500">{transaction?.buyer?.email}</p>
                  </>
                )}
                {transaction?.status !== "PACKING" && (transaction?.trackingNumber || transaction?.trackingURL) && (
                  <>
                    <p className="col-span-2 text-lg font-extrabold underline">รายละเอียดการจัดส่ง</p>

                    {transaction?.trackingNumber && (
                      <>
                        <p className="font-bold text-slate-500">หมายเลขพัสดุ : </p>
                        <p className="max-w-56 break-words break-all text-slate-500">{transaction.trackingNumber}</p>
                      </>
                    )}

                    {transaction?.trackingURL && (
                      <>
                        <p className="font-bold text-slate-500">ลิงก์ติดตาม : </p>
                        <p className="max-w-56 break-words break-all text-slate-500">
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
                    <p className="font-bold text-red-400">หลักฐาน : </p>
                    <a
                      href={
                        transaction?.failData?.evidenceURL[0]
                          ? "https://bookbook-bucket.s3.ap-southeast-1.amazonaws.com/report_evidence/" +
                            transaction.failData.evidenceURL[0]
                          : ""
                      }
                      className="max-w-56 break-words text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {displayLink(transaction?.failData?.evidenceURL[0])}
                    </a>
                  </>
                )}
                {transaction?.review && (
                  <>
                    <p className="col-span-2 text-lg font-extrabold underline">การตอบกลับ</p>
                    <p className="max-w-56 break-words font-bold text-slate-500">คะแนน : </p>
                    <p
                      className={` ${transaction?.review.rating === 1 ? "text-red-500" : ""} ${transaction?.review.rating === 2 ? "text-orange-500" : ""} ${transaction?.review.rating === 3 ? "text-yellow-500" : ""} ${transaction?.review.rating === 4 ? "text-green-500" : ""} ${transaction?.review.rating === 5 ? "text-green-700" : ""} `}
                    >
                      {transaction?.review.rating}
                    </p>
                    <p className="font-bold text-slate-500">ความคิดเห็น : </p>
                    <p className="max-w-56 break-words text-slate-500">{transaction?.review.comment}</p>
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
                  {transaction?.status == TransactionStatus.PACKING &&
                    transaction?.buyerId === userId &&
                    transaction?.createdAt < oneWeekAgo && (
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
                  {transaction?.status == TransactionStatus.PACKING &&
                    transaction?.buyerId === userId &&
                    transaction?.createdAt >= oneWeekAgo && (
                      <Button
                        className="mt-4 px-6 py-3"
                        variant="destructive"
                        onClick={() => {
                          alert("การขอยกเลิกสามารถขอได้หลังส่งซื้ออย่างน้อย 1 สัปดาห์");
                        }}
                      >
                        รายงาน
                      </Button>
                    )}
                  {transaction?.status == TransactionStatus.PACKING && transaction?.sellerId === userId && (
                    <Button className="mt-4 px-4 py-2" variant="default" onClick={() => setShippingDialogOpen(true)}>
                      ใส่รายละเอียดจัดส่ง
                    </Button>
                  )}
                  <ShippingDetailsDialog
                    open={shippingDialogOpen}
                    onClose={() => {
                      setShippingDialogOpen(false);
                      setSelectingTransaction("");
                      window.location.reload();
                    }}
                    onConfirm={async (trackingNumber, trackingURL) => {
                      try {
                        await fetch(`/api/transaction/${transaction.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ trackingNumber, trackingURL, status: "DELIVERING" }),
                        });

                        createNotification(
                          transaction.buyerId,
                          "หนังสือ " + transaction.post.book.title + " ที่คุณสั่งกำลังถูกจัดส่ง",
                        );
                        router.refresh(); // or router.push(...) if needed
                      } catch (e) {
                        console.error("Update failed", e);
                      }
                    }}
                  />
                  {transaction?.status == TransactionStatus.DELIVERING &&
                    transaction?.buyerId === userId &&
                    transaction?.updatedAt >= oneWeekAgo && (
                      <Button
                        className="mt-4 px-4 py-2"
                        variant="destructive"
                        onClick={() => {
                          alert("การขอยกเลิกสามารถขอได้หลังเริ่มจัดส่งอย่างน้อย 1 สัปดาห์");
                        }}
                      >
                        รายงาน
                      </Button>
                    )}
                  {transaction?.status == TransactionStatus.DELIVERING &&
                    transaction?.buyerId === userId &&
                    transaction?.updatedAt < oneWeekAgo && (
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
                  {transaction?.status === TransactionStatus.DELIVERING && transaction?.buyerId === userId && (
                    <Button
                      className="mt-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none"
                      onClick={async () => {
                        try {
                          // Update transaction status to COMPLETE
                          await fetch(`/api/transaction/${transaction.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ status: "COMPLETE" }),
                          });
                          await fetch(`/api/profile/seller/balance/${transaction.sellerId}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              diff: transaction.amount,
                            }),
                          });

                          createNotification(
                            transaction.sellerId,
                            transaction.buyer.firstName +
                              " รับหนังสือ" +
                              transaction.post.book.title +
                              "เรียบร้อย เงินจำนวน " +
                              transaction.amount +
                              " บาทได้ถูกโอนถ่ายไปให้คุณ",
                          );

                          router.push(`/review/${transaction.id}`);
                        } catch (err) {
                          alert("เกิดข้อผิดพลาดขณะอัปเดตรายการ");
                          console.error(err);
                        }
                        setSelectingTransaction("");
                      }}
                    >
                      รับสำเร็จ
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
