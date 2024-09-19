/*
  Warnings:

  - You are about to drop the column `groupId` on the `Stock` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_groupId_fkey";

-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "groupId";

-- CreateTable
CREATE TABLE "StockOnGroup" (
    "stockSymbol" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "StockOnGroup_pkey" PRIMARY KEY ("stockSymbol","groupId")
);

-- AddForeignKey
ALTER TABLE "StockOnGroup" ADD CONSTRAINT "StockOnGroup_stockSymbol_fkey" FOREIGN KEY ("stockSymbol") REFERENCES "Stock"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockOnGroup" ADD CONSTRAINT "StockOnGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
