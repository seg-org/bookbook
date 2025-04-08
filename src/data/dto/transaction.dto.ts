import {
  PaymentMethodType,
  ShipmentMethodType,
  TransactionFailTypeType,
  TransactionStatusType,
} from "../../app/api/transaction/transaction_enum";

import { Review } from "./review.dto";

import { Post } from "./post.dto";
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

  shipmentMethod: ShipmentMethodType;
  trackingURL: string;
  trackingNumber: string;
  isDelivered: boolean;

  failData?: TransactionFailTypeType;

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
