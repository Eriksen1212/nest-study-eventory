/*
  Warnings:

  - Made the column `description` on table `club` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "club" ALTER COLUMN "description" SET NOT NULL;
