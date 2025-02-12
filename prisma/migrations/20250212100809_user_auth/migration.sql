/*
  Warnings:

  - You are about to drop the column `sellerId` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `sellerId` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[isbn]` on the table `books` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[book_id]` on the table `posts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `seller_id` to the `books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seller_id` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "books" DROP CONSTRAINT "books_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_sellerId_fkey";

-- AlterTable
ALTER TABLE "books" DROP COLUMN "sellerId",
ADD COLUMN     "seller_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "sellerId",
ADD COLUMN     "seller_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
DROP COLUMN "name",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email_verified" TIMESTAMP(3),
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "is_seller" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "pdpa_consent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "phone_verified" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "seller_profiles" (
    "id" TEXT NOT NULL,
    "id_card_number" TEXT NOT NULL,
    "id_card_image" TEXT NOT NULL,
    "bank_account" TEXT NOT NULL,
    "bank_name" TEXT NOT NULL,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "approved_at" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,

    CONSTRAINT "seller_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "seller_profiles_user_id_key" ON "seller_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "books_isbn_key" ON "books"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "posts_book_id_key" ON "posts"("book_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- AddForeignKey
ALTER TABLE "seller_profiles" ADD CONSTRAINT "seller_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
