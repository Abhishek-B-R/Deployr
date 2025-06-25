/*
  Warnings:

  - You are about to drop the column `repo_url` on the `Project` table. All the data in the column will be lost.
  - Added the required column `buildCommand` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `framework` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `installCommand` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `outputDirectory` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rootDirectory` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Made the column `repo_name` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `branch` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `github_id` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "repo_url",
ADD COLUMN     "buildCommand" TEXT NOT NULL,
ADD COLUMN     "framework" TEXT NOT NULL,
ADD COLUMN     "installCommand" TEXT NOT NULL,
ADD COLUMN     "outputDirectory" TEXT NOT NULL,
ADD COLUMN     "rootDirectory" TEXT NOT NULL,
ALTER COLUMN "repo_name" SET NOT NULL,
ALTER COLUMN "branch" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "github_id" SET NOT NULL;
