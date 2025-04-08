import { Transaction } from "./transaction.dto";
import { TransactionFailTypeType } from "@/app/api/transaction/transaction_enum";

export type TransactionFail = {
  id: string;
  transaction: Transaction;
  transactionId: string;
  evidenceURL: string[];
  detail: string[];
  failType: TransactionFailTypeType;
};
