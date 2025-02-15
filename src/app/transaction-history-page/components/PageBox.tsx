import React from 'react'

interface Props {
    pageNumber: number
    setSelectingPage: (selectingPage: number) => void
}

const PageBox = ({ pageNumber, setSelectingPage } : Props) => {
  return (
    <div className="w-10 h-10 flex items-center justify-center bg-white text-black border border-gray-300 rounded-full shadow"
      onClick={() => setSelectingPage(pageNumber)}>
      {pageNumber}
    </div>
  )
}

export default PageBox