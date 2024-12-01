/*
  Warnings:

  - You are about to drop the column `isActive` on the `Problem` table. All the data in the column will be lost.

*/
-- AlterTable
# ALTER TABLE `Problem` DROP COLUMN `isActive`,
#     ADD COLUMN `status` BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE `Problem` RENAME COLUMN `isActive` TO `status`;
