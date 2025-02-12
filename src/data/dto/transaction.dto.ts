import { User } from "./user.dto";
import { Post } from "./post.dto";
import { TransactionStatus } from "@prisma/client";
import { PaymentMethod } from "@prisma/client";
import { ShipmentMethod } from "@prisma/client";

export type Transaction = {
  id: string,
  buyer: User,
  buyerId: String,
  seller: User,
  sellerId: String,
  post: Post,
  postId: string,
  createOn: Date,
  updateOn: Date,
  status: TransactionStatus,
  
  paymentMethod: PaymentMethod,
  hasId: String,
  paidOn: Date,
  amount: number,

  shipmentMethod: ShipmentMethod,
  trackingURL: string,
  isDelivered: boolean
};
  