import React from 'react'
import Image from 'next/image'

import ImageDummySrc from "../pic/bookCover.jpg"
import TransactionList from './transactionList'

// Note 1: type and sttatus should be enum type
// Note 2: currently using image dummy source

export interface TransactionBoxProps{
  id: number,
  name: string,
  image: string,
  price: number,
  type: string,
  date: Date,
  status: string,
}

const TransactionBox = ({ id,name,image,price,type,date,status } : TransactionBoxProps) => {
 

  return (
    <div className='p-4 bg-white rounded-lg border border-gray-300 flex flex-row items-center justify-between gap-x-10'>
      
      <div className='flex flex-row items-center justify-start gap-5'>
        <Image src={ImageDummySrc} alt="Book Cover" width={90} height={160}></Image>
        <div className='flex flex-col'>
          <label className='font-semibold text-xl'>{name}</label>
          <label className='text-gray-400 text-lg'>{date.getDate()}/{date.getMonth()}/{date.getFullYear()} | {date.getHours()}:{date.getMinutes()}</label>
          <label className='text-xl'>{price}.-</label>
        </div>
      </div>
      
      <div className="text-xl font-bold">{
        status == "approving" && <label className='text-gray-300'>Approving</label> ||
        status == "paying" && <label className='text-gray-300'>Paying</label> ||
        status == "verifying" && <label className='text-gray-300'>Verifying</label> || 
        status == "complete" && <label className="text-green-500">Complete</label> ||
        status == "fail" && <label className="text-red-500">Failed</label>
      }</div>
    </div>
  )
}

export default TransactionBox