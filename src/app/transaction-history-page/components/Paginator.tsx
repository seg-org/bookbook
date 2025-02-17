"use client"
import React, { useEffect, useState } from 'react'
import PageBox from "./PageBox"
import { FilterType } from './FilterBar'
import { useGetTransactionCount } from '@/hooks/useGetTransactions'


interface Props {
  filter: FilterType,
  userId: string,
  selectingPage: number,
  setSelectingPage: (toPage : number) => void,
  transactionPerPage: number,
}

const Paginator = ({ filter, userId, selectingPage, setSelectingPage, transactionPerPage }: Props) => {
  const { transactionCount, loading, error } = useGetTransactionCount(filter, userId)
  const [ childComponents, setChildCompoent ] = useState<React.JSX.Element[]>([])

  useEffect(() =>{
    if(loading || error) {
      setChildCompoent([])
      return
    }

    const maxPageNumber = Math.ceil(transactionCount / transactionPerPage);
    const newChildComponents: React.JSX.Element[] = []
    const leftPageNumber = Math.max(Math.min(selectingPage - 2, maxPageNumber - 4), 1)
    const rightPageNumber = Math.min(Math.max(selectingPage + 2, 5),maxPageNumber)

    if(maxPageNumber != 0) {
      newChildComponents.push(<PageBox key={-1} pageNumber={selectingPage != 1 ? -1 : -2} selectingPage={selectingPage} setSelectingPage={setSelectingPage} />)
      for(let i = leftPageNumber;i <= rightPageNumber;i++) {
        newChildComponents.push(<PageBox key={i} pageNumber={i} selectingPage={selectingPage} setSelectingPage={setSelectingPage} />)
      }
      newChildComponents.push(<PageBox key={-2} pageNumber={rightPageNumber != selectingPage ? -3 : -4} selectingPage={selectingPage} setSelectingPage={setSelectingPage} />)
    }

    setChildCompoent(newChildComponents)
  }, [transactionCount, selectingPage, error, loading, userId, filter, transactionPerPage, setSelectingPage])

  return (
    <div className="flex justify-center items-center gap-2 w-full mb-4">
      {childComponents}
    </div>
  )
}

export default Paginator