/*
  Warnings:

  - You are about to drop the `userproblemstatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `userproblemstatus` DROP FOREIGN KEY `UserProblemStatus_problemId_fkey`;

-- DropForeignKey
ALTER TABLE `userproblemstatus` DROP FOREIGN KEY `UserProblemStatus_userId_fkey`;

-- DropTable
DROP TABLE `userproblemstatus`;
