"use client"
import React from 'react'
import Image from 'next/image'
import { Transaction } from '@/data/dto/transaction.dto'
import { TransactionStatus } from '@prisma/client'

import BoughtIcon from "../pic/boughtIcon.png"
import SoldIcon from "../pic/soldIcon.png"

// Note 1: type and sttatus should be enum type
// Note 2: currently using image dummy source

export interface TransactionBoxProps{
  transaction: Transaction,
  type: string
}

const TransactionBox = ({ transaction, type } : TransactionBoxProps) => {

  const cap_overflow_string = (str: string) => {
    if(str.length >= 30) return str.substring(0,30) + "...";
    else return str
  }

  return (
    <div className='relative p-4 bg-white rounded-lg border border-gray-300 flex flex-row items-center justify-between gap-x-10 transition-transform duration-200 transform hover:scale-105 hover:shadow-xl'>
      
      <div className='flex flex-row items-center justify-start gap-5'>
        <Image className="m-2.5 h-40 w-auto rounded-lg" src={transaction.post.book.coverImageUrl} alt="Book Cover" height={90} width={160}></Image>
        <div className='flex flex-col'>
          <label className='font-semibold text-xl'>{cap_overflow_string(transaction.post.book.title)}</label>
          <label className='text-gray-400 text-lg'>{transaction.createdAt.toDateString()} {transaction.createdAt.getHours()}:{transaction.createdAt.getMinutes()}</label>
          <label className='text-xl'>{transaction.amount}.-</label>
        </div>
      </div>
      
      <div className="text-xl font-bold flex flex-col justify-end items-center">
        {
          transaction.status == TransactionStatus.APPROVING && <label className='text-gray-300'>Approving</label> ||
          transaction.status == TransactionStatus.PAYING && <label className='text-gray-300'>Paying</label> ||
          transaction.status == TransactionStatus.VERIFYING && <label className='text-gray-300'>Verifying</label> || 
          transaction.status == TransactionStatus.COMPLETE && <label className="text-green-500">Complete</label> ||
          transaction.status == TransactionStatus.FAIL && <label className="text-red-500">Failed</label>
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