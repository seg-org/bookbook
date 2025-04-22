import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { TransactionFailType } from "@prisma/client";
import { z } from "zod";

import {
  PaymentMethodType,
  ShipmentMethodType,
  TransactionFailTypeType,
  TransactionStatusType,
} from "@/app/api/transaction/transaction_enum";

extendZodWithOpenApi(z);

const TransactionPureRespone = z.object({
  id: z.string().openapi({ example: "transaction_1" }),
  // transaction
  buyerId: z.string().openapi({ example: "buyer_1" }),
  sellerId: z.string().openapi({ example: "seller_2" }),
  postId: z.string().openapi({ example: "post_3" }),
  createdAt: z.date().openapi({ example: "2021-09-01T00:00:00.000Z" }),
  updatedAt: z.date().openapi({ example: "2021-09-01T00:00:00.000Z" }),
  status: TransactionStatusType.openapi({ example: "PACKING" }),
  // payment
  paymentMethod: PaymentMethodType.openapi({ example: "CREDIT_CARD" }),
  hashId: z.string().openapi({ example: "ABCDEFGHIJKLMAO" }),
  paidOn: z.date().openapi({ example: "2021-09-01T00:00:00.000Z" }),
  amount: z.number().openapi({ example: 420.0 }),
  // shipment
  shipmentMethod: ShipmentMethodType.openapi({ example: "EXPRESS" }),
  address: z.string().openapi({ example: "Chulalongkorn Pattumwan BKK 10110" }),
  trackingURL: z.string().openapi({ example: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }),
  trackingNumber: z.string().openapi({ example: "489464684321351354" }),
  isDelivered: z.boolean().openapi({ example: false }),
});

export const TransactionUpdateRespone = TransactionPureRespone;

export const UpdateTransactionRequest = z.object({
  status: TransactionStatusType.optional().openapi({ example: "HOLD" }),

  paymentMethod: PaymentMethodType.optional().openapi({ example: "CREDIT_CARD" }),
  hashId: z.string().optional().openapi({ example: "ABCDEFGHIJKLMAO" }),
  amount: z.number().optional().openapi({ example: 546 }),

  shipmentMethod: ShipmentMethodType.optional().openapi({ example: "EXPRESS" }),
  address: z.string().optional().openapi({ example: "Chulalongkorn Pattumwan BKK 10110" }),
  trackingURL: z.string().optional().openapi({ example: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }),
  trackingNumber: z.string().optional().openapi({ example: "9986484684684548" }),
  isDelivered: z.boolean().optional().openapi({ example: true }),

  // for fail and hold status only
  evidenceURL: z
    .array(z.string())
    .optional()
    .transform((value) => value ?? [])
    .openapi({
      example: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ", "https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    }),
  detail: z
    .array(z.string())
    .optional()
    .transform((value) => value ?? [])
    .openapi({ example: ["The product wasn't delivered", "I hate him"] }),
  failType: TransactionFailTypeType.optional()
    .transform((value) => value ?? TransactionFailType.UNDEFINED)
    .openapi({ example: "UNDELIVERED" }),
});
