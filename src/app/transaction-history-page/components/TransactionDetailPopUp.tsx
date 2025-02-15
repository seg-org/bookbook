import { useGetTransaction } from "@/hooks/useGetTransactions";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Props {
  selectingTransaction: string
  setSelectingTransaction: (val: string) => void
}

const TransactionDetailsPopup = ({ selectingTransaction, setSelectingTransaction } : Props) => {
  const { transaction, loading, error } = useGetTransaction(selectingTransaction)
  const [ returnComponent, setReturnComponent ] = useState<React.JSX.Element>(<></>)

  useEffect(() => {
    if(selectingTransaction == "---") {
      console.log("active no use")
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
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full flexs">
            <h2 className="text-2xl font-semibold mb-4">Transaction Details</h2>
            <Image className="w-32 h-32 object-cover rounded-lg" 
                   src={transaction?.post.book.coverImageUrl || "f"}
                   alt="Book Cover"
                   height={160}
                   width={90}/>
            <p><strong>Title:</strong> </p>
            <p><strong>Amount:</strong></p>
            <p><strong>Date:</strong> </p>
            <button
              
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )
    }
    
  }, [selectingTransaction, loading, error, transaction]);

  return returnComponent
};

export default TransactionDetailsPopup