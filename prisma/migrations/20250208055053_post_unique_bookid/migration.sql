/*
  Warnings:

  - A unique constraint covering the columns `[book_id]` on the table `post` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "post_book_id_key" ON "post"("book_id");
