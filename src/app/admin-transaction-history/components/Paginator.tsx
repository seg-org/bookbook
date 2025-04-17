"use client";
import React, { useEffect, useState } from "react";

import { useTransactionAdminContext } from "@/context/transactionAdminContext";

import PageBox from "./PageBox";

const Paginator = () => {
  const {
    userId,
    filter,
    paginator,
    paginator: { selectingPage },
    transactionCount,
    transactionCountLoading,
    transactionCountError,
  } = useTransactionAdminContext();

  const [childComponents, setChildComponents] = useState<React.JSX.Element[]>([]);

  useEffect(() => {
    if (transactionCountLoading || transactionCountError) {
      setChildComponents([]);
      return;
    }

    const maxPageNumber = Math.ceil(transactionCount / paginator.transactionPerPage);
    const newChildComponents: React.JSX.Element[] = [];
    const leftPageNumber = Math.max(Math.min(selectingPage - 2, maxPageNumber - 4), 1);
    const rightPageNumber = Math.min(Math.max(selectingPage + 2, 5), maxPageNumber);

    if (maxPageNumber != 0) {
      newChildComponents.push(<PageBox key={-1} pageNumber={selectingPage != 1 ? -1 : -2} />);
      for (let i = leftPageNumber; i <= rightPageNumber; i++) {
        newChildComponents.push(<PageBox key={i} pageNumber={i} />);
      }
      newChildComponents.push(<PageBox key={-2} pageNumber={rightPageNumber != selectingPage ? -3 : -4} />);
    }

    setChildComponents(newChildComponents);
  }, [transactionCount, paginator, transactionCountLoading, transactionCountError, userId, filter, selectingPage]);

  return <div className="mb-4 flex w-full items-center justify-center gap-2">{childComponents}</div>;
};

export default Paginator;
