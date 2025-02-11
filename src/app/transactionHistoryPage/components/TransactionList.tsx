import React from 'react'
import TransactionBox, { TransactionBoxProps } from './TransactionBox'
import LineSeparator from './LineSperator';

const TransactionList = ({ transactions } : {transactions : TransactionBoxProps[]}) => {

  const sort_transactions = transactions.sort((a,b) => -(a.date.getTime() - b.date.getTime()));
  
  const first_date = new Date(sort_transactions[0].date)
        first_date.setHours(0, 0, 0, 0);
  const second_date = new Date(first_date)
        second_date.setDate(second_date.getDate() - 1)
  const previous_month = new Date(first_date)
        previous_month.setMonth(previous_month.getMonth() - 1)
  const this_year = new Date(sort_transactions[0].date.getFullYear(),0,1,0,0,0,0)

  let child_compoents = []

  let it = 0;

  child_compoents.push(<LineSeparator text={first_date.toDateString()}/>)
  while(it < sort_transactions.length && sort_transactions[it].date >= first_date) {
    let ts = sort_transactions[it];
    child_compoents.push(<TransactionBox key={ts.id} id={ts.id} name={ts.name} image={ts.image} price={ts.price} type={ts.type} date={ts.date} status={ts.status}/>);
    ++it;
  }

  if(it < sort_transactions.length && sort_transactions[it].date >= second_date)
    child_compoents.push(<LineSeparator text="Yesterday"/>);
  while(it < sort_transactions.length && sort_transactions[it].date >= second_date) {
    let ts = sort_transactions[it];
    child_compoents.push(<TransactionBox key={ts.id} id={ts.id} name={ts.name} image={ts.image} price={ts.price} type={ts.type} date={ts.date} status={ts.status}/>);
    ++it;
  }

  if(it < sort_transactions.length && sort_transactions[it].date >= previous_month)
    child_compoents.push(<LineSeparator text="This Month"/>);
  while(it < sort_transactions.length && sort_transactions[it].date >= previous_month) {
    let ts = sort_transactions[it];
    child_compoents.push(<TransactionBox key={ts.id} id={ts.id} name={ts.name} image={ts.image} price={ts.price} type={ts.type} date={ts.date} status={ts.status}/>);
    ++it;
  }

  if(it < sort_transactions.length && sort_transactions[it].date >= this_year)
    child_compoents.push(<LineSeparator text="This Year"/>);
  while(it < sort_transactions.length && sort_transactions[it].date >= this_year) {
    let ts = sort_transactions[it];
    child_compoents.push(<TransactionBox key={ts.id} id={ts.id} name={ts.name} image={ts.image} price={ts.price} type={ts.type} date={ts.date} status={ts.status}/>);
    ++it;
  }

  let year = new Date(this_year)
  while(it < sort_transactions.length) {
    let ts = sort_transactions[it];
    if(ts.date < year) {
      year.setFullYear(sort_transactions[it].date.getFullYear())
      child_compoents.push(<LineSeparator text={year.getFullYear().toString()}/>);
    } 
    child_compoents.push(<TransactionBox key={ts.id} id={ts.id} name={ts.name} image={ts.image} price={ts.price} type={ts.type} date={ts.date} status={ts.status}/>);
    ++it;
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols_5 gap-4 p-4'>
      {child_compoents}
    </div>
  )
}

export default TransactionList