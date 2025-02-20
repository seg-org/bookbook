"use client";
import { TransactionContext } from "@/context/transactionContext";
import { useGetTransactionCount } from "@/hooks/useGetTransactions";
import React, { useContext, useEffect, useState } from "react";
import PageBox from "./PageBox";

const Paginator = () => {
  const { userId, filter, paginator, transactions } = useContext(TransactionContext);

  const { transactionCount, loading, error } = useGetTransactionCount(userId, filter);
  const [childComponents, setChildCompoent] = useState<React.JSX.Element[]>([]);

  useEffect(() => {
    if (loading || error) {
      setChildCompoent([]);
      return;
    }

    const maxPageNumber = Math.ceil(transactionCount / paginator.transactionPerPage);
    const newChildComponents: React.JSX.Element[] = [];
    const leftPageNumber = Math.max(Math.min(paginator.selectingPage - 2, maxPageNumber - 4), 1);
    const rightPageNumber = Math.min(Math.max(paginator.selectingPage + 2, 5), maxPageNumber);

    if (maxPageNumber != 0) {
      newChildComponents.push(<PageBox key={-1} pageNumber={paginator.selectingPage != 1 ? -1 : -2} />);
      for (let i = leftPageNumber; i <= rightPageNumber; i++) {
        newChildComponents.push(<PageBox key={i} pageNumber={i} />);
      }
      newChildComponents.push(<PageBox key={-2} pageNumber={rightPageNumber != paginator.selectingPage ? -3 : -4} />);
    }

    setChildCompoent(newChildComponents);
  }, [transactionCount, paginator, error, loading, userId, filter]);

  return <div className="mb-4 flex w-full items-center justify-center gap-2">{childComponents}</div>;
};

export default Paginator;
