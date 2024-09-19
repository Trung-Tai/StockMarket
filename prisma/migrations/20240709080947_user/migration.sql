/*
  Warnings:

  - You are about to drop the column `country` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `date_of_birth` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `hashed_password` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `covered_warrants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "covered_warrants" DROP CONSTRAINT "covered_warrants_underlying_asset_id_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "country",
DROP COLUMN "date_of_birth",
DROP COLUMN "full_name",
DROP COLUMN "hashed_password",
DROP COLUMN "phone",
ADD COLUMN     "password" VARCHAR(200);

-- DropTable
DROP TABLE "covered_warrants";
