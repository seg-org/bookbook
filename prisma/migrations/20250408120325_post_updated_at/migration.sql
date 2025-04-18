/*
  Warnings:

  - You are about to drop the column `create_on` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `update_on` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "transactions_buyer_id_create_on_idx";

-- DropIndex
DROP INDEX "transactions_seller_id_create_on_idx";

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "create_on",
DROP COLUMN "update_on",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "transactions_buyer_id_created_at_idx" ON "transactions"("buyer_id", "created_at");

-- CreateIndex
CREATE INDEX "transactions_seller_id_created_at_idx" ON "transactions"("seller_id", "created_at");
