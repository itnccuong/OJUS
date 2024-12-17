/*
  Warnings:

  - A unique constraint covering the columns `[avatarId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `avatarId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_avatarId_key` ON `User`(`avatarId`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_avatarId_fkey` FOREIGN KEY (`avatarId`) REFERENCES `Files`(`fileId`) ON DELETE SET NULL ON UPDATE CASCADE;
