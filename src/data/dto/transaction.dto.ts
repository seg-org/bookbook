import {
  PaymentMethodType,
  ShipmentMethodType,
  TransactionStatusType,
} from "../../app/api/transaction/transaction_enum";
import { Post } from "./post.dto";
import { Review } from "./review.dto";
import { TransactionFail } from "./transactionFail.dto";
import { User } from "./user.dto";

export type Transaction = {
  id: string;
  buyer: User;
  buyerId: string;
  seller: User;
  sellerId: string;
  post: Post;
  postId: string;
  createdAt: Date;
  updatedAt: Date;
  status: TransactionStatusType;

  paymentMethod: PaymentMethodType;
  hasId: string;
  paidOn: Date;
  amount: number;

  shipmentMethod: ShipmentMethod;
  address: String;
  trackingURL: string;
  trackingNumber: string;
  isDelivered: boolean;

  failData?: TransactionFail;

  review?: Review;
};

export type CreateTransactionDto = {
  buyerId: string;
  postId: string;

  paymentMethod: "CREDIT_CARD" | "ONLINE_BANKING" | "UNDEFINED";
  hashId: string;

  shipmentMethod: "STANDARD" | "EXPRESS" | "UNDEFINED";
  address: string;

  amount: number;
};
