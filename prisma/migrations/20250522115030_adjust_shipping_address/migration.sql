/*
  Warnings:

  - Added the required column `title` to the `shipping_address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shipping_address" ADD COLUMN     "title" VARCHAR(100) NOT NULL;


-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'DRAFT';
