"use client"
import React from 'react'
import Image from 'next/image'

import ImageDummySrc from "../pic/bookCover.jpg"
import BoughtIcon from "../pic/BoughtIcon.png"
import SoldIcon from "../pic/soldIcon.png"

// Note 1: type and sttatus should be enum type
// Note 2: currently using image dummy source

export interface TransactionBoxProps{
  id: string,
  name: string,
  image: string,
  price: number,
  type: string,
  date: Date,
  status: string,
}

const TransactionBox = ({ id,name,image,price,type,date,status } : TransactionBoxProps) => {

  const cap_overflow_string = (str: string) => {
    if(str.length >= 30) return str.substring(0,30) + "...";
    else return str
  }

  return (
    <div className='relative p-4 bg-white rounded-lg border border-gray-300 flex flex-row items-center justify-between gap-x-10 transition-transform duration-200 transform hover:scale-105 hover:shadow-xl'>
      
      <div className='flex flex-row items-center justify-start gap-5'>
        <Image src={ImageDummySrc} alt="Book Cover" width={90} height={160}></Image>
        <div className='flex flex-col'>
          <label className='font-semibold text-xl'>{cap_overflow_string(name)}</label>
          <label className='text-gray-400 text-lg'>{date.toDateString()} {date.getHours()}:{date.getMinutes()}</label>
          <label className='text-xl'>{price}.-</label>
        </div>
      </div>
      
      <div className="text-xl font-bold flex flex-col justify-end items-center">
        {
          status == "approving" && <label className='text-gray-300'>Approving</label> ||
          status == "paying" && <label className='text-gray-300'>Paying</label> ||
          status == "verifying" && <label className='text-gray-300'>Verifying</label> || 
          status == "complete" && <label className="text-green-500">Complete</label> ||
          status == "fail" && <label className="text-red-500">Failed</label>
        }
      </div>


      <div className="absolute bottom-2 right-2">
        {
          type == "buy" && <Image src={BoughtIcon} alt="" width={25} height={25}></Image> ||
          type == "sell" && <Image src={SoldIcon} alt="" width={25} height={25}></Image>
        }
      </div>
    </div>
  )
}

export default TransactionBox