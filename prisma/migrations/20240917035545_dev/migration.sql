/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId]` on the table `Likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,commentId]` on the table `Likes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Likes_userId_postId_commentId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Likes_userId_postId_key" ON "Likes"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "Likes_userId_commentId_key" ON "Likes"("userId", "commentId");
