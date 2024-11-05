/*
  Warnings:

  - You are about to drop the column `permission` on the `Menu` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Menu_permission_key";

-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "permission";
