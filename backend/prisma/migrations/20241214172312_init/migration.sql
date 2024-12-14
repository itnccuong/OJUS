-- CreateTable
CREATE TABLE `User` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `fullname` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Problem` (
    `problemId` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `difficulty` INTEGER NOT NULL,
    `tags` VARCHAR(191) NOT NULL,
    `timeLimit` INTEGER NOT NULL,
    `memoryLimit` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `authorId` INTEGER NOT NULL,
    `fileId` INTEGER NOT NULL,

    UNIQUE INDEX `Problem_title_key`(`title`),
    UNIQUE INDEX `Problem_fileId_key`(`fileId`),
    PRIMARY KEY (`problemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Files` (
    `fileId` INTEGER NOT NULL AUTO_INCREMENT,
    `filename` VARCHAR(191) NOT NULL,
    `filesize` INTEGER NOT NULL,
    `fileType` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`fileId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Submission` (
    `submissionId` INTEGER NOT NULL AUTO_INCREMENT,
    `problemId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `code` TEXT NOT NULL,
    `language` VARCHAR(191) NOT NULL,
    `verdict` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `stderr` LONGTEXT NOT NULL,

    PRIMARY KEY (`submissionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Result` (
    `resultId` INTEGER NOT NULL AUTO_INCREMENT,
    `submissionId` INTEGER NOT NULL,
    `output` LONGTEXT NOT NULL,
    `testcaseIndex` INTEGER NOT NULL,
    `verdict` VARCHAR(191) NOT NULL,
    `time` DOUBLE NOT NULL,
    `memory` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`resultId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Problem` ADD CONSTRAINT `Problem_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Problem` ADD CONSTRAINT `Problem_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `Files`(`fileId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_problemId_fkey` FOREIGN KEY (`problemId`) REFERENCES `Problem`(`problemId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Result` ADD CONSTRAINT `Result_submissionId_fkey` FOREIGN KEY (`submissionId`) REFERENCES `Submission`(`submissionId`) ON DELETE RESTRICT ON UPDATE CASCADE;
