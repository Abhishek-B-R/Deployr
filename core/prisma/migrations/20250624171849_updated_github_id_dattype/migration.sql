/*
  Warnings:

  - The `github_id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "github_id",
ADD COLUMN     "github_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_github_id_key" ON "User"("github_id");
