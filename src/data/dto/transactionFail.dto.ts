import { TransactionFailTypeType } from "@/app/api/transaction/transaction_enum";

import { Transaction } from "./transaction.dto";

export type TransactionFail = {
  id: string;
  transaction: Transaction;
  transactionId: string;
  evidenceURL: string[];
  detail: string[];
  failType: TransactionFailTypeType;
};
