/*
  Warnings:

  - You are about to drop the column `seller_id` on the `books` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[isbn]` on the table `books` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "books" DROP CONSTRAINT "books_seller_id_fkey";

-- AlterTable
ALTER TABLE "books" DROP COLUMN "seller_id";

-- CreateIndex
CREATE UNIQUE INDEX "books_isbn_key" ON "books"("isbn");
