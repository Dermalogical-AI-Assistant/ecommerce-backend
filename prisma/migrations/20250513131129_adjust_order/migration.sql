/*
  Warnings:

  - You are about to drop the column `quantity` on the `order_item` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[product_id]` on the table `order_item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,product_id]` on the table `order_item` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "fk_order_item_product";

-- AlterTable
ALTER TABLE "order" ALTER COLUMN "total_amount" SET DEFAULT 0,
ALTER COLUMN "total_discount" SET DEFAULT 0,
ALTER COLUMN "final_amount" SET DEFAULT 0,
ALTER COLUMN "payment_method" SET DEFAULT 'COD';

-- AlterTable
ALTER TABLE "order_item" DROP COLUMN "quantity";

-- CreateIndex
CREATE UNIQUE INDEX "order_item_product_id_key" ON "order_item"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_item_user_id_product_id_key" ON "order_item"("user_id", "product_id");

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "fk_order_item_cart_item" FOREIGN KEY ("user_id", "product_id") REFERENCES "cart_item"("user_id", "product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
