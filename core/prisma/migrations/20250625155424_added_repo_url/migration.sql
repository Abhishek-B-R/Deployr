/*
  Warnings:

  - Added the required column `repo_url` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "repo_url" TEXT NOT NULL;
