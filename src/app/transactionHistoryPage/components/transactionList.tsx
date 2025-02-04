import React from 'react'
import TransactionBox, { TransactionBoxProps } from './transactionBox'

const TransactionList = ({ transactions } : {transactions : TransactionBoxProps[]}) => {
  
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols_5 gap-4 p-4'>
      {transactions.map((ts: TransactionBoxProps) => 
        (<TransactionBox key={ts.id} id={ts.id} name={ts.name} image={ts.image} price={ts.price} type={ts.type} date={ts.date} status={ts.status}/>))}
    </div>
  )
}

export default TransactionList