"use client"
import React, { useEffect, useMemo } from 'react'
import { number } from 'zod'
import PageBox from "./PageBox"

interface Props {
  maxPageNumber: number,
  selectingPage: number,
  setSelectingPage: (curPage : number) => void
}

const Paginator = ({maxPageNumber, selectingPage, setSelectingPage} : Props) => {

  const child_components: React.JSX.Element[] = []

  return (
    <div>
      {child_components}
    </div>
  )
}

export default Paginator