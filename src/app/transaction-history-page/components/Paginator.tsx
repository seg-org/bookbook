"use client"
import React, { useEffect, useMemo, useState } from 'react'
import PageBox from "./PageBox"

interface Props {
  maxPageNumber: number,
  selectingPage: number,
  setSelectingPage: (curPage : number) => void
}

const Paginator = ({maxPageNumber, selectingPage, setSelectingPage} : Props) => {
  const [ childComponents, setChildCompoent ] = useState<React.JSX.Element[]>([])

  useEffect(() =>{
    const newChildComponents: React.JSX.Element[] = []
    const leftPageNumber = Math.max(Math.min(selectingPage - 2, maxPageNumber - 4), 1)
    const rightPageNumber = Math.min(Math.max(selectingPage + 2, 5),maxPageNumber)
    
    newChildComponents.push(<PageBox key={-1} pageNumber={selectingPage != 1 ? -1 : -2} selectingPage={selectingPage} setSelectingPage={setSelectingPage} />)
    for(let i = leftPageNumber;i <= rightPageNumber;i++) {
      newChildComponents.push(<PageBox key={i} pageNumber={i} selectingPage={selectingPage} setSelectingPage={setSelectingPage} />)
    }
    newChildComponents.push(<PageBox key={-2} pageNumber={rightPageNumber != selectingPage ? -3 : -4} selectingPage={selectingPage} setSelectingPage={setSelectingPage} />)
    
    setChildCompoent(newChildComponents)
  }, [maxPageNumber, selectingPage])

  return (
    <div className="flex justify-center items-center gap-2 w-full mb-4">
      {childComponents}
    </div>
  )
}

export default Paginator