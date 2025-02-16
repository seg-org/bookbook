/*
  Warnings:

  - You are about to drop the column `paymentMethod` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `shipmentMethod` on the `transactions` table. All the data in the column will be lost.
  - Changed the type of `fail_type` on the `transaction_fails` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `payment_method` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipment_method` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "transaction_status_type" AS ENUM ('approving', 'paying', 'verifying', 'complete', 'fail');

-- CreateEnum
CREATE TYPE "transaction_fail_type" AS ENUM ('cheat');

-- CreateEnum
CREATE TYPE "payment_method_type" AS ENUM ('credit_card', 'online_banking');

-- CreateEnum
CREATE TYPE "shipment_method_type" AS ENUM ('delivery');

-- AlterTable
ALTER TABLE "transaction_fails" DROP COLUMN "fail_type",
ADD COLUMN     "fail_type" "transaction_fail_type" NOT NULL;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "paymentMethod",
DROP COLUMN "shipmentMethod",
ADD COLUMN     "payment_method" "payment_method_type" NOT NULL,
ADD COLUMN     "shipment_method" "shipment_method_type" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "transaction_status_type" NOT NULL;

-- DropEnum
DROP TYPE "PaymentMethod";

-- DropEnum
DROP TYPE "ShipmentMethod";

-- DropEnum
DROP TYPE "TransactionFailType";

-- DropEnum
DROP TYPE "TransactionStatus";
