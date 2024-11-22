/*
  Warnings:

  - You are about to drop the column `testcaseId` on the `Result` table. All the data in the column will be lost.
  - You are about to drop the `TestCase` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `testcaseIndex` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Result` DROP FOREIGN KEY `Result_testcaseId_fkey`;

-- DropForeignKey
ALTER TABLE `TestCase` DROP FOREIGN KEY `TestCase_problemId_fkey`;

-- AlterTable
ALTER TABLE `Result` DROP COLUMN `testcaseId`,
    ADD COLUMN `testcaseIndex` INTEGER NOT NULL;

-- DropTable
DROP TABLE `TestCase`;
