/*
  Warnings:

  - You are about to drop the column `providerAccountId` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the `derivatives` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `educational_resources` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `etf_holdings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `etf_quotes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `etfs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `index_constituents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `market_indices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quotes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stocks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `watchlists` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[provider,provider_account_id]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider_account_id` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_userId_fkey";

-- DropForeignKey
ALTER TABLE "derivatives" DROP CONSTRAINT "derivatives_underlying_asset_id_fkey";

-- DropForeignKey
ALTER TABLE "etf_holdings" DROP CONSTRAINT "etf_holdings_etf_id_fkey";

-- DropForeignKey
ALTER TABLE "etf_holdings" DROP CONSTRAINT "etf_holdings_stock_id_fkey";

-- DropForeignKey
ALTER TABLE "etf_quotes" DROP CONSTRAINT "etf_quotes_etf_id_fkey";

-- DropForeignKey
ALTER TABLE "index_constituents" DROP CONSTRAINT "index_constituents_index_id_fkey";

-- DropForeignKey
ALTER TABLE "index_constituents" DROP CONSTRAINT "index_constituents_stock_id_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_fkey";

-- DropForeignKey
ALTER TABLE "quotes" DROP CONSTRAINT "quotes_stock_id_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "watchlists" DROP CONSTRAINT "watchlists_stock_id_fkey";

-- DropForeignKey
ALTER TABLE "watchlists" DROP CONSTRAINT "watchlists_user_id_fkey";

-- DropIndex
DROP INDEX "accounts_provider_providerAccountId_key";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "providerAccountId",
DROP COLUMN "userId",
ADD COLUMN     "provider_account_id" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "derivatives";

-- DropTable
DROP TABLE "educational_resources";

-- DropTable
DROP TABLE "etf_holdings";

-- DropTable
DROP TABLE "etf_quotes";

-- DropTable
DROP TABLE "etfs";

-- DropTable
DROP TABLE "index_constituents";

-- DropTable
DROP TABLE "market_indices";

-- DropTable
DROP TABLE "notifications";

-- DropTable
DROP TABLE "quotes";

-- DropTable
DROP TABLE "stocks";

-- DropTable
DROP TABLE "user";

-- DropTable
DROP TABLE "watchlists";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "username" VARCHAR(100),
    "password" VARCHAR(200),
    "email" VARCHAR(255) NOT NULL,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
