import { Transaction } from "./transaction.dto";
import { TransactionFailType } from "@prisma/client";

export type TransactionFail = {
  id: string;
  transaction: Transaction,
  transactionId: string,
  evidenceURL: string,
  detail: string,
  failType: TransactionFailType
};
  