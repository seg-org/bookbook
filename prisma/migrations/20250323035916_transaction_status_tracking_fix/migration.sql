/*
  Warnings:

  - The values [approving,paying] on the enum `transaction_status_type` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `tracking_number` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "transaction_status_type_new" AS ENUM ('packing', 'delivering', 'complete', 'hold', 'fail');
ALTER TABLE "transactions" ALTER COLUMN "status" TYPE "transaction_status_type_new" USING ("status"::text::"transaction_status_type_new");
ALTER TYPE "transaction_status_type" RENAME TO "transaction_status_type_old";
ALTER TYPE "transaction_status_type_new" RENAME TO "transaction_status_type";
DROP TYPE "transaction_status_type_old";
COMMIT;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "tracking_number" TEXT NOT NULL;
