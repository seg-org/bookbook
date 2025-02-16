import { useGetTransaction } from "@/hooks/useGetTransactions";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { TransactionStatus } from "@prisma/client";

interface Props {
  selectingTransaction: string
  setSelectingTransaction: (val: string) => void
}

const TransactionDetailsPopup = ({ selectingTransaction, setSelectingTransaction } : Props) => {
  const { transaction, loading, error } = useGetTransaction(selectingTransaction)
  const [ returnComponent, setReturnComponent ] = useState<React.JSX.Element>(<></>)

  useEffect(() => {
    if(selectingTransaction == "---") {
      setReturnComponent(<></>)
    }
    else if(loading) {
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
        <LoadingAnimation />
      </div>
    }
    else if(error) {
      console.log(error)
    }
    else {
      setReturnComponent(
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Transaction Details</h2>

            <div className="flex items-center gap-4">
              <Image className="object-cover rounded-lg" 
                   src={transaction?.post.book.coverImageUrl || "f"}
                   alt="Book Cover"
                   height={312}
                   width={220}/>
              <div>
                <div className="grid grid-cols-[auto_1fr] gap-2 w-72 max-h-64 overflow-y-auto p-4 border rounded-lg shadow-md bg-white">
                  <p className="font-extrabold text-lg">status:</p>
                  <p>
                    {(transaction?.status == TransactionStatus.APPROVING && <label className="text-gray-300 text-lg">Approving</label>) ||
                     (transaction?.status == TransactionStatus.PAYING && <label className="text-gray-300 text-lg">Paying</label>) ||
                     (transaction?.status == TransactionStatus.VERIFYING && <label className="text-gray-300 text-lg">Verifying</label>) ||
                     (transaction?.status == TransactionStatus.COMPLETE && <label className="text-green-500 text-lg">Complete</label>) ||
                     (transaction?.status == TransactionStatus.FAIL && <label className="text-red-500 text-lg">Failed</label>)}
                  </p>
                  <p className="font-bold">Created : </p>
                  <p>{transaction?.createdAt.getDay().toString() + "/" + transaction?.createdAt.getMonth().toString() + "/" + transaction?.createdAt.getFullYear().toString()}</p>
                  <p className="font-bold">Last Update : </p>
                  <p>{transaction?.updatedAt.getDay().toString() + "/" + transaction?.updatedAt.getMonth().toString() + "/" + transaction?.updatedAt.getFullYear().toString()}</p>
                  <p className="col-span-2 font-extrabold text-lg">Book</p>
                  <p className="font-bold">Title : </p>
                  <p>{transaction?.post.book.title}</p>
                  <p className="font-bold">Author : </p>
                  <p>{transaction?.post.book.author}</p>
                  <p className="font-bold">Description : </p>
                  <p>{transaction?.post.book.description}</p>
                  <p className="font-bold">Pages : </p>
                  <p>{transaction?.post.book.pages}</p>
                  <p className="font-bold">Genre : </p>
                  <p>{transaction?.post.book.genre}</p>
                  <p className="col-span-2 font-extrabold text-lg">Post</p>
                  <p className="font-bold">Title : </p>
                  <p>{transaction?.post.title}</p>
                  <p className="font-bold">Content : </p>
                  <p>{transaction?.post.content}</p>
                  <p className="col-span-2 font-extrabold text-lg">Seller</p>
                  <p className="font-bold">Name : </p>
                  <p>{transaction?.seller.firstName + " " + transaction?.seller.lastName}</p>
                  <p className="font-bold">Email : </p>
                  <p>{transaction?.seller.email}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xl font-bold">
                    {transaction?.post.price}.-
                  </p>
                  <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                    onClick={() => {setSelectingTransaction("---")}}>
                    Close
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      )
    } 
  }, [selectingTransaction, loading, error, transaction]);

  return returnComponent
};

export default TransactionDetailsPopup