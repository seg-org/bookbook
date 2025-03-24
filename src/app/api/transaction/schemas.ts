import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { TransactionFailType } from "@prisma/client";
import { z } from "zod";

import { UserResponse } from "../auth/schemas";
import { PostResponse } from "../posts/schemas";
import { ReviewResponse } from "../reviews/schemas";

extendZodWithOpenApi(z);

const beginningOfTime = new Date("0000-01-01T00:00:00Z");
const endOfTime = new Date("9999-12-31T23:59:59Z");

const TransactionStatusEnum = z.enum(["PACKING", "DELIVERING", "COMPLETE", "HOLD", "FAIL"]);
const PaymentMethodEnum = z.enum(["CREDIT_CARD", "ONLINE_BANKING", "UNDEFINED"]);
const ShipmentMethodEnum = z.enum(["STANDARD", "EXPRESS", "UNDEFINED"]);
const TransactionFailTypeEnum = z.enum(["UNDELIVERED", "UNQUALIFIED", "REJECT", "TERMINATION", "OTHER", "UNDEFINED"]);

const parseToBoolean = (dft: boolean) => {
  return (val: string | undefined) => (val ? val == "true" : dft);
};

const parseToPosInt = (dft: number) => {
  return (val: string | undefined) => (val ? Math.max(parseInt(val), 0) : dft);
};

const parseToDate = (dft: Date) => {
  return (val: string | undefined) => (val ? new Date(val) : dft);
};

const GetTransactionBase = z.object({
  userId: z.string().optional().openapi({ example: "user_1" }),
  startDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), { message: "Invalid date format" })
    .transform(parseToDate(beginningOfTime))
    .openapi({ example: "2021-09-01T00:00:00.000Z" }),
  endDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), { message: "Invalid date format" })
    .transform((val) => (val == undefined ? endOfTime : new Date(val)))
    .openapi({ example: "2021-09-01T00:00:00.000Z" }),
  asBuyer: z.string().optional().transform(parseToBoolean(false)).openapi({ example: "true" }),
  asSeller: z.string().optional().transform(parseToBoolean(false)).openapi({ example: "true" }),
  IsPacking: z.string().optional().transform(parseToBoolean(false)).openapi({ example: "true" }),
  IsDelivering: z.string().optional().transform(parseToBoolean(false)).openapi({ example: "true" }),
  IsComplete: z.string().optional().transform(parseToBoolean(false)).openapi({ example: "true" }),
  IsHold: z.string().optional().transform(parseToBoolean(false)).openapi({ example: "true" }),
  IsFail: z.string().optional().transform(parseToBoolean(false)).openapi({ example: "true" }),
});

export const GetTransactionAmountRequest = GetTransactionBase;

export const GetTransactionCountRequest = GetTransactionBase;

export const GetTransactionRequest = GetTransactionBase.merge(
  z.object({
    skip: z.string().optional().transform(parseToPosInt(0)).openapi({ example: "3" }),
    take: z.string().optional().transform(parseToPosInt(-1)).openapi({ example: "10" }),
  })
);

export const CreateTransactionRequest = z.object({
  buyerId: z.string().openapi({ example: "user_1" }),
  postId: z.string().openapi({ example: "post_1" }),

  paymentMethod: PaymentMethodEnum.openapi({ example: "CREDIT_CARD" }),
  hashId: z.string().openapi({ example: "ABCDEFGHIJKLMAO" }),

  shipmentMethod: ShipmentMethodEnum.openapi({ example: "EXPRESS" }),
  address: z.string().openapi({ example: "Chulalongkorn Pattumwan BKK 10110" }),
});

const TransactionFailData = z.object({
  id: z.string().openapi({ example: "transaction_fail_1" }),
  transactionId: z.string().openapi({ example: "transaction_1" }),
  evidenceURL: z.string().openapi({ example: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }),
  detail: z.string().openapi({ example: "The product wasn't delivered" }),
  failType: TransactionFailTypeEnum.openapi({ example: "UNDELIVERED" }),
});

const TransactionPureRespone = z.object({
  id: z.string().openapi({ example: "transaction_1" }),
  // transaction
  buyerId: z.string().openapi({ example: "buyer_1" }),
  sellerId: z.string().openapi({ example: "seller_2" }),
  postId: z.string().openapi({ example: "post_3" }),
  createdAt: z.date().openapi({ example: "2021-09-01T00:00:00.000Z" }),
  updatedAt: z.date().openapi({ example: "2021-09-01T00:00:00.000Z" }),
  status: TransactionStatusEnum.openapi({ example: "PACKING" }),
  // payment
  paymentMethod: PaymentMethodEnum.openapi({ example: "CREDIT_CARD" }),
  hashId: z.string().openapi({ example: "ABCDEFGHIJKLMAO" }),
  paidOn: z.date().openapi({ example: "2021-09-01T00:00:00.000Z" }),
  amount: z.number().openapi({ example: 420.0 }),
  // shipment
  shipmentMethod: ShipmentMethodEnum.openapi({ example: "EXPRESS" }),
  address: z.string().openapi({ example: "Chulalongkorn Pattumwan BKK 10110" }),
  trackingURL: z.string().openapi({ example: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }),
  trackingNumber: z.string().openapi({ example: "489464684321351354" }),
  isDelivered: z.boolean().openapi({ example: false }),
});

export const TransactionRespone = TransactionPureRespone.merge(
  z.object({
    buyer: UserResponse,
    seller: UserResponse,
    post: PostResponse,
    failData: TransactionFailData.nullable(),

    review: ReviewResponse.nullable(),
  })
);

export const TransactionCreateRespone = TransactionPureRespone;

export const TransactionUpdateRespone = TransactionPureRespone;

export const TransactionsRespone = z.array(TransactionRespone);

export const TransactionAmountRespone = z.number().openapi({ example: 20 });

export const TransactionCountRespone = z.number().openapi({ example: 20 });

export const UpdateTransactionRequest = z.object({
  status: TransactionStatusEnum.optional().openapi({ example: "HOLD" }),

  paymentMethod: PaymentMethodEnum.optional().openapi({ example: "CREDIT_CARD" }),
  hashId: z.string().optional().openapi({ example: "ABCDEFGHIJKLMAO" }),
  amount: z.number().optional().openapi({ example: 546 }),

  shipmentMethod: ShipmentMethodEnum.optional().openapi({ example: "EXPRESS" }),
  address: z.string().optional().openapi({ example: "Chulalongkorn Pattumwan BKK 10110" }),
  trackingURL: z.string().optional().openapi({ example: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }),
  trackingNumber: z.string().optional().openapi({ example: "9986484684684548" }),
  isDelivered: z.boolean().optional().openapi({ example: true }),

  // for fail and hold status only
  evidenceURL: z
    .string()
    .optional()
    .transform((value) => value ?? "")
    .openapi({ example: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }),
  detail: z
    .string()
    .optional()
    .transform((value) => value ?? "")
    .openapi({ example: "The product wasn't delivered" }),
  failType: TransactionFailTypeEnum.optional()
    .transform((value) => value ?? TransactionFailType.UNDEFINED)
    .openapi({ example: "UNDELIVERED" }),
});
