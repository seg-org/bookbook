/*
  Warnings:

  - You are about to drop the column `id_card_image` on the `seller_profiles` table. All the data in the column will be lost.
  - Added the required column `id_card_image_key` to the `seller_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "seller_profiles" DROP COLUMN "id_card_image",
ADD COLUMN     "id_card_image_key" TEXT NOT NULL;
