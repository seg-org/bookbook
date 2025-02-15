/*
  Warnings:

  - You are about to drop the column `last_read` on the `chat_rooms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chat_rooms" DROP COLUMN "last_read",
ADD COLUMN     "last_read_a" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "last_read_b" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
