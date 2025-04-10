/*
  Warnings:

  - You are about to drop the column `genre` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `damageURLs` on the `posts` table. All the data in the column will be lost.
  - The `evidence_url` column on the `transaction_fails` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `detail` column on the `transaction_fails` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `damage` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DamageType" AS ENUM ('no_damaged', 'slightly_damaged', 'damaged');

-- AlterTable
ALTER TABLE "books" DROP COLUMN "genre";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "damageURLs",
ADD COLUMN     "damage" "DamageType" NOT NULL,
ADD COLUMN     "damage_urls" TEXT[];

-- AlterTable
ALTER TABLE "transaction_fails" DROP COLUMN "evidence_url",
ADD COLUMN     "evidence_url" TEXT[],
DROP COLUMN "detail",
ADD COLUMN     "detail" TEXT[];
