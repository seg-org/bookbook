import { z } from "zod";

export const TransactionStatusType = z.enum(["PACKING", "DELIVERING", "COMPLETE", "HOLD", "FAIL"]);

export type TransactionStatusType = z.infer<typeof TransactionStatusType>;

export const PaymentMethodType = z.enum(["CREDIT_CARD", "ONLINE_BANKING", "UNDEFINED"]);

export type PaymentMethodType = z.infer<typeof PaymentMethodType>;

export const ShipmentMethodType = z.enum(["STANDARD", "EXPRESS", "UNDEFINED"]);

export type ShipmentMethodType = z.infer<typeof ShipmentMethodType>;

export const TransactionFailTypeType = z.enum([
  "UNDELIVERED",
  "UNQUALIFIED",
  "REJECT",
  "TERMINATION",
  "OTHER",
  "UNDEFINED",
]);

export type TransactionFailTypeType = z.infer<typeof TransactionFailTypeType>;
