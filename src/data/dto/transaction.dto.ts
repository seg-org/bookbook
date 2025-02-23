import { PaymentMethod, ShipmentMethod, TransactionStatus } from "@prisma/client";

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
  isDelivered: boolean;
};
