import { PaymentMethod, Review, ShipmentMethod, TransactionFail, TransactionStatus } from "@prisma/client";

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
  status: TransactionStatus;

  paymentMethod: PaymentMethod;
  hasId: string;
  paidOn: Date;
  amount: number;

  shipmentMethod: ShipmentMethod;
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
};
