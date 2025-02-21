/*
  Warnings:

  - The values [delivery] on the enum `shipment_method_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "payment_method_type" ADD VALUE 'undefined';

-- AlterEnum
BEGIN;
CREATE TYPE "shipment_method_type_new" AS ENUM ('standard', 'express', 'undefined');
ALTER TABLE "transactions" ALTER COLUMN "shipment_method" TYPE "shipment_method_type_new" USING ("shipment_method"::text::"shipment_method_type_new");
ALTER TYPE "shipment_method_type" RENAME TO "shipment_method_type_old";
ALTER TYPE "shipment_method_type_new" RENAME TO "shipment_method_type";
DROP TYPE "shipment_method_type_old";
COMMIT;
