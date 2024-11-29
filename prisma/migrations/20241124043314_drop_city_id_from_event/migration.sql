/*
  Warnings:

  - You are about to drop the column `city_id` on the `event` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_city_id_fkey";

-- AlterTable
ALTER TABLE "event" DROP COLUMN "city_id";
