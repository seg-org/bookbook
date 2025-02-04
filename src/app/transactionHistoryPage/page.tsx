"use client"
import Header from "@/app/transactionHistoryPage/components/header";
import FilterBar from "./components/filterBar";
import TransactionList from "./components/transactionList";

import { TransactionBoxProps } from "./components/transactionBox";

// Note 1: Currently using header and filter in local components.

function TransactionPage() {
  const transactions: TransactionBoxProps[] = [
    {
      id: 0,
      name: "สถาปัตยกรรมคอมพิวเตอร์",
      image: "../pic/bookCover.jpg",
      price: 129,
      type: "buy",
      date: new Date(2001,9,11,8,15),
      status: "verifying"
    },
    {
      id: 1,
      name: "สถาปัตยกรรมคอมพิวเตอร์",
      image: "../pic/bookCover.jpg",
      price: 69,
      type: "sell",
      date: new Date(2001,9,11,8,15),
      status: "approving"
    },
    {
      id: 2,
      name: "สถาปัตยกรรมคอมพิวเตอร์",
      image: "../pic/bookCover.jpg",
      price: 129,
      type: "sell",
      date: new Date(2001,9,11,8,15),
      status: "complete"
    },
    {
      id: 3,
      name: "สถาปัตยกรรมคอมพิวเตอร์",
      image: "../pic/bookCover.jpg",
      price: 112,
      type: "buy",
      date: new Date(2001,9,11,8,15),
      status: "fail"
    },
    {
      id: 4,
      name: "สถาปัตยกรรมคอมพิวเตอร์",
      image: "../pic/bookCover.jpg",
      price: 129,
      type: "sell",
      date: new Date(2001,9,11,8,15),
      status: "paying"
    },
    {
      id: 5,
      name: "สถาปัตยกรรมคอมพิวเตอร์",
      image: "../pic/bookCover.jpg",
      price: 129,
      type: "sell",
      date: new Date(2001,9,11,8,15),
      status: "complete"
    },
    {
      id: 6,
      name: "สถาปัตยกรรมคอมพิวเตอร์",
      image: "../pic/bookCover.jpg",
      price: 420,
      type: "buy",
      date: new Date(2001,9,11,8,15),
      status: "fail"
    },
    {
      id: 7,
      name: "สถาปัตยกรรมคอมพิวเตอร์",
      image: "../pic/bookCover.jpg",
      price: 129,
      type: "sell",
      date: new Date(2001,9,11,8,15),
      status: "fail"
    },
    {
      id: 8,
      name: "สถาปัตยกรรมคอมพิวเตอร์",
      image: "../pic/bookCover.jpg",
      price: 129,
      type: "buy",
      date: new Date(2001,9,11,8,15),
      status: "complete"
    },
    {
      id: 9,
      name: "สถาปัตยกรรมคอมพิวเตอร์",
      image: "../pic/bookCover.jpg",
      price: 30,
      type: "buy",
      date: new Date(2001,9,11,8,15),
      status: "complete"
    },
    {
      id: 10,
      name: "สถาปัตยกรรมคอมพิวเตอร์",
      image: "../pic/bookCover.jpg",
      price: 129,
      type: "sell",
      date: new Date(2001,9,11,8,15),
      status: "paying"
    },
  ]

  return (
    <>
      <Header />
      <FilterBar />
      <TransactionList transactions = {transactions}/>
    </>
  );
}

export default TransactionPage;