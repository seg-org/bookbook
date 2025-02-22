/*
  Warnings:

  - The values [cheat] on the enum `transaction_fail_type` will be removed. If these variants are still used in the database, this will fail.
  - The values [verifying] on the enum `transaction_status_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "transaction_fail_type_new" AS ENUM ('undelivered', 'unqualified', 'reject', 'termination', 'other');
ALTER TABLE "transaction_fails" ALTER COLUMN "fail_type" TYPE "transaction_fail_type_new" USING ("fail_type"::text::"transaction_fail_type_new");
ALTER TYPE "transaction_fail_type" RENAME TO "transaction_fail_type_old";
ALTER TYPE "transaction_fail_type_new" RENAME TO "transaction_fail_type";
DROP TYPE "transaction_fail_type_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "transaction_status_type_new" AS ENUM ('approving', 'paying', 'packing', 'delivering', 'complete', 'hold', 'fail');
ALTER TABLE "transactions" ALTER COLUMN "status" TYPE "transaction_status_type_new" USING ("status"::text::"transaction_status_type_new");
ALTER TYPE "transaction_status_type" RENAME TO "transaction_status_type_old";
ALTER TYPE "transaction_status_type_new" RENAME TO "transaction_status_type";
DROP TYPE "transaction_status_type_old";
COMMIT;
