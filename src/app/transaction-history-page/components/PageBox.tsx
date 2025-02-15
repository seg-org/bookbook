import React from 'react'

interface Props {
    pageNumber: number,
    selectingPage: number,
    setSelectingPage: (selectingPage: number) => void
}

const PageBox = ({ pageNumber, setSelectingPage, selectingPage } : Props) => {
  if(pageNumber == -1) {
    return <div className="bg-white w-10 h-10 flex items-center justify-center text-black border border-gray-300 rounded-lg shadow transform hover:scale-110 transition-all duration-300"
      onClick={() => setSelectingPage(selectingPage - 1)}>
      {"<"}
    </div>
  }
  if(pageNumber == -2) {
    return <div className="bg-gray-400 w-10 h-10 flex items-center justify-center text-black border border-gray-300 rounded-lg shadow ">
      {"<"}
    </div>
  }
  if(pageNumber == -3) {
    return <div className="bg-white w-10 h-10 flex items-center justify-center text-black border border-gray-300 rounded-lg shadow transform hover:scale-110 transition-all duration-300"
      onClick={() => setSelectingPage(selectingPage + 1)}>
      {">"}
    </div>
  }
  if(pageNumber == -4) {
    return <div className="bg-gray-400 w-10 h-10 flex items-center justify-center text-black border border-gray-300 rounded-lg shadow ">
      {">"}
    </div>
  }

  return (
    <div className={`${pageNumber === selectingPage ? 'bg-blue-500' : 'bg-white'} w-10 h-10 flex items-center justify-center text-black border border-gray-300 rounded-lg shadow  {}transform hover:scale-110 transition-all duration-300"`}
      onClick={() => setSelectingPage(pageNumber)}>
      {pageNumber}
    </div>
  )
}

export default PageBox