import { LoadingAnimation } from "@/components/LoadingAnimation";
import { useGetTransaction } from "@/hooks/useGetTransactions";
import Image from "next/image";

const TransactionDetails = ({ id }: { id: string }) => {
  const { transaction, loading, error } = useGetTransaction(id);

  if (loading) {
    return <LoadingAnimation />;
  }

  if (error) {
    return <label className="text-5xl font-extrabold text-red-600">Error Loading Details</label>;
  }

  return (
    <>
      <Image
        className="m-2.5 mt-0 h-80 w-auto rounded-lg"
        src={transaction?.post.book.coverImageUrl || ""}
        alt="Book Cover"
        height={2040}
        width={1305}
      ></Image>
      <div className="mt-2 flex w-full flex-row justify-start space-x-1">
        <label className="font-extrabold">ชื่อโพสต์ : </label>
        <label className="flex-1 truncate">{transaction?.post.title}</label>
      </div>
      <div className="flex w-full flex-row justify-start space-x-1">
        <label className="font-extrabold">ชื่อหนังสือ : </label>
        <label className="flex-1 truncate">{transaction?.post.book.title}</label>
      </div>
      <div className="flex w-full flex-row justify-start space-x-1">
        <label className="font-extrabold">ผู้ขาย : </label>
        <label className="flex-1 truncate">{transaction?.seller.firstName + " " + transaction?.seller.lastName}</label>
      </div>
      <div className="flex w-full flex-row justify-start space-x-1">
        <label className="font-extrabold">วันที่สร้าง : </label>
        <label className="flex-1 truncate">
          {transaction?.createdAt.getDay().toString() +
            "/" +
            transaction?.createdAt.getMonth().toString() +
            "/" +
            transaction?.createdAt.getFullYear().toString()}
        </label>
      </div>
      <div className="flex w-full flex-row justify-start space-x-1">
        <label className="font-extrabold">วันที่จ่าย : </label>
        <label className="flex-1 truncate">
          {transaction?.paidOn.getDay().toString() +
            "/" +
            transaction?.paidOn.getMonth().toString() +
            "/" +
            transaction?.paidOn.getFullYear().toString()}
        </label>
      </div>
      <div className="flex w-full flex-row justify-start space-x-1">
        <label className="font-extrabold">ราคา : </label>
        <label className="flex-1 truncate">{transaction?.amount + ".-"}</label>
      </div>
    </>
  );
};

export default TransactionDetails;
