"use client"
import React from 'react'
import TransactionBox, { TransactionBoxProps } from './TransactionBox'
import LineSeparator from './LineSperator';
import { FilterType } from './FilterBar';
import { useGetTransaction } from '@/hooks/useGetTransactions';

interface TransactionListProps {
  filter: FilterType,
  userId: string
}

const TransactionList = ({ filter, userId }: TransactionListProps) => {

  const { transactions, loading, error } = useGetTransaction(filter, "");
  if (loading) {
    return <div className='text-4xl font-bold text-gray-400 grid place-items-center h-screen v-screen'>Loading...</div>;
  }
  if (error) {
    return <div className='text-4xl font-bold text-gray-400 grid place-items-center h-screen v-screen'>Failed to get transactions</div>;
  }
  if (transactions.length == 0) {
    return <div className='text-4xl font-bold text-gray-400 grid place-items-center h-screen v-screen'>No transaction found</div>;
  }

  const sort_transactions = transactions.sort((a,b) => -(a.createOn.getTime() - b.createOn.getTime()));
  
  const first_date = new Date()
        first_date.setHours(0, 0, 0, 0);
  const second_date = new Date(first_date)
        second_date.setDate(second_date.getDate() - 1)
  const previous_month = new Date(first_date)
        previous_month.setMonth(previous_month.getMonth() - 1)
  const this_year = new Date(first_date.getFullYear(),0,1,0,0,0,0)


  let child_components = []
  let it = 0;

  if(it < sort_transactions.length && sort_transactions[it].createOn >= first_date)
    child_components.push(<LineSeparator key={"today_line"} text={first_date.toDateString()}/>)
  while(it < sort_transactions.length && sort_transactions[it].createOn >= first_date) {
    let ts = sort_transactions[it];
    child_components.push(<TransactionBox key={ts.id} id={ts.id} name={ts.post.book.title} image={ts.post.book.coverImageUrl} price={ts.amount} type={userId == ts.sellerId ? "sell" : "buy"} date={ts.createOn} status={ts.status}/>);
    ++it;
  }

  if(it < sort_transactions.length && sort_transactions[it].createOn >= second_date)
    child_components.push(<LineSeparator key={"yesterday_line"} text="Yesterday"/>);
  while(it < sort_transactions.length && sort_transactions[it].createOn >= second_date) {
    let ts = sort_transactions[it];
    child_components.push(<TransactionBox key={ts.id} id={ts.id} name={ts.post.book.title} image={ts.post.book.coverImageUrl} price={ts.amount} type={userId == ts.sellerId ? "sell" : "buy"} date={ts.createOn} status={ts.status}/>);
    ++it;
  }

  if(it < sort_transactions.length && sort_transactions[it].createOn >= previous_month)
    child_components.push(<LineSeparator key={"previous_month_line"} text="This Month"/>);
  while(it < sort_transactions.length && sort_transactions[it].createOn >= previous_month) {
    let ts = sort_transactions[it];
    child_components.push(<TransactionBox key={ts.id} id={ts.id} name={ts.post.book.title} image={ts.post.book.coverImageUrl} price={ts.amount} type={userId == ts.sellerId ? "sell" : "buy"} date={ts.createOn} status={ts.status}/>);
    ++it;
  }

  if(it < sort_transactions.length && sort_transactions[it].createOn >= this_year)
    child_components.push(<LineSeparator key={"this_year_line"} text="This Year"/>);
  while(it < sort_transactions.length && sort_transactions[it].createOn >= this_year) {
    let ts = sort_transactions[it];
    child_components.push(<TransactionBox key={ts.id} id={ts.id} name={ts.post.book.title} image={ts.post.book.coverImageUrl} price={ts.amount} type={userId == ts.sellerId ? "sell" : "buy"} date={ts.createOn} status={ts.status}/>);
    ++it;
  }

  let year = new Date(this_year)
  while(it < sort_transactions.length) {
    let ts = sort_transactions[it];
    if(ts.createOn < year) {
      year.setFullYear(new Date(sort_transactions[it].createOn).getFullYear())
      child_components.push(<LineSeparator key={year.getFullYear() + "year_line"} text={year.getFullYear().toString()}/>);
    } 
    child_components.push(<TransactionBox key={ts.id} id={ts.id} name={ts.post.book.title} image={ts.post.book.coverImageUrl} price={ts.amount} type={userId == ts.sellerId ? "sell" : "buy"} date={ts.createOn} status={ts.status}/>);
    ++it;
  }

  console.log(child_components)

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols_5 gap-4 p-4'>
      {child_components}
    </div>
  )
}

export default TransactionList