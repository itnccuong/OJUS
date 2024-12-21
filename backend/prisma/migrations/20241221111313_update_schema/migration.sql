-- AlterTable
ALTER TABLE `Problem` ADD COLUMN `dislikes` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `likes` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `Comment` (
    `commentId` INTEGER NOT NULL AUTO_INCREMENT,
    `parentCommentId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `likes` INTEGER NOT NULL DEFAULT 0,
    `dislikes` INTEGER NOT NULL DEFAULT 0,
    `content` TEXT NOT NULL,
    `userId` INTEGER NOT NULL,
    `problemId` INTEGER NOT NULL,

    PRIMARY KEY (`commentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_parentCommentId_fkey` FOREIGN KEY (`parentCommentId`) REFERENCES `Comment`(`commentId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_problemId_fkey` FOREIGN KEY (`problemId`) REFERENCES `Problem`(`problemId`) ON DELETE RESTRICT ON UPDATE CASCADE;
