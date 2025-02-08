/*
  Warnings:

  - Added the required column `sellerId` to the `book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerId` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('approving', 'paying', 'verifying', 'complete', 'fail');

-- CreateEnum
CREATE TYPE "TransactionFailType" AS ENUM ('cheat');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('credit_card', 'online_banking');

-- CreateEnum
CREATE TYPE "ShipmentMethod" AS ENUM ('delivery');

-- AlterTable
ALTER TABLE "book" ADD COLUMN     "sellerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "post" ADD COLUMN     "sellerId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "transaction" (
    "id" TEXT NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "create_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_on" TIMESTAMP(3) NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "hashId" TEXT NOT NULL,
    "paid_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" INTEGER NOT NULL,
    "shipmentMethod" "ShipmentMethod" NOT NULL,
    "tracking_url" TEXT NOT NULL,
    "is_delivered" BOOLEAN NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_fail" (
    "id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "evidence_url" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "fail_type" "TransactionFailType" NOT NULL,

    CONSTRAINT "transaction_fail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "transaction_buyer_id_create_on_idx" ON "transaction"("buyer_id", "create_on");

-- CreateIndex
CREATE INDEX "transaction_seller_id_create_on_idx" ON "transaction"("seller_id", "create_on");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_fail_transaction_id_key" ON "transaction_fail"("transaction_id");

-- AddForeignKey
ALTER TABLE "book" ADD CONSTRAINT "book_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_fail" ADD CONSTRAINT "transaction_fail_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
