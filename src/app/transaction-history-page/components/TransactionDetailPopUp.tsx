import { LoadingAnimation } from "@/components/LoadingAnimation";
import { useTransactionContext } from "@/context/transactionContext";
import { useGetTransaction } from "@/hooks/useGetTransactions";
import { TransactionStatus } from "@prisma/client";
import Image from "next/image";

const TransactionDetailsPopup = () => {
  const { selectingTransaction, setSelectingTransaction } = useTransactionContext();
  const { transaction, loading, error } = useGetTransaction(selectingTransaction);

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
          <h2 className="mb-4 text-2xl font-semibold">Transaction Details</h2>

          <div className="flex items-center gap-4">
            <Image
              className="rounded-lg object-cover"
              src={transaction?.post?.book?.coverImageUrl || "f"}
              alt="Book Cover"
              height={312}
              width={220}
            />
            <div>
              <div className="grid max-h-64 w-72 grid-cols-[auto_1fr] gap-2 overflow-y-auto rounded-lg border bg-white p-4 shadow-md">
                <p className="text-lg font-extrabold">status:</p>
                <p>
                  {(transaction?.status == TransactionStatus.APPROVING && (
                    <label className="text-lg text-gray-300">Approving</label>
                  )) ||
                    (transaction?.status == TransactionStatus.PAYING && (
                      <label className="text-lg text-gray-300">Paying</label>
                    )) ||
                    (transaction?.status == TransactionStatus.PACKING && (
                      <label className="text-lg text-gray-300">Packing</label>
                    )) ||
                    (transaction?.status == TransactionStatus.DELIVERING && (
                      <label className="text-lg text-gray-300">Delivering</label>
                    )) ||
                    (transaction?.status == TransactionStatus.COMPLETE && (
                      <label className="text-lg text-green-500">Complete</label>
                    )) ||
                    (transaction?.status == TransactionStatus.HOLD && (
                      <label className="text-lg text-yellow-500">Hold</label>
                    )) ||
                    (transaction?.status == TransactionStatus.FAIL && (
                      <label className="text-lg text-red-500">Failed</label>
                    ))}
                </p>
                <p className="font-bold">Created : </p>
                <p>
                  {transaction?.createdAt.getDay().toString() +
                    "/" +
                    transaction?.createdAt.getMonth().toString() +
                    "/" +
                    transaction?.createdAt.getFullYear().toString()}
                </p>
                <p className="font-bold">Last Update : </p>
                <p>
                  {transaction?.updatedAt.getDay().toString() +
                    "/" +
                    transaction?.updatedAt.getMonth().toString() +
                    "/" +
                    transaction?.updatedAt.getFullYear().toString()}
                </p>
                <p className="col-span-2 text-lg font-extrabold">Book</p>
                <p className="font-bold">Title : </p>
                <p>{transaction?.post?.book?.title}</p>
                <p className="font-bold">Author : </p>
                <p>{transaction?.post?.book?.author}</p>
                <p className="font-bold">Description : </p>
                <p>{transaction?.post?.book?.description}</p>
                <p className="font-bold">Pages : </p>
                <p>{transaction?.post?.book?.pages}</p>
                <p className="font-bold">Genre : </p>
                <p>{transaction?.post?.book?.genre}</p>
                <p className="col-span-2 text-lg font-extrabold">Post</p>
                <p className="font-bold">Title : </p>
                <p>{transaction?.post?.title}</p>
                <p className="font-bold">Content : </p>
                <p>{transaction?.post?.content}</p>
                <p className="col-span-2 text-lg font-extrabold">Seller</p>
                <p className="font-bold">Name : </p>
                <p>{transaction?.seller?.firstName + " " + transaction?.seller?.lastName}</p>
                <p className="font-bold">Email : </p>
                <p>{transaction?.seller?.email}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold">{transaction?.post?.price}.-</p>
                <button
                  className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
                  onClick={() => {
                    setSelectingTransaction("");
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default TransactionDetailsPopup;
