import { TransactionFailType } from "@prisma/client";

import { Transaction } from "./transaction.dto";

export type TransactionFail = {
  id: string;
  transaction: Transaction;
  transactionId: string;
  evidenceURL: string[];
  detail: string[];
  failType: TransactionFailType;
};
