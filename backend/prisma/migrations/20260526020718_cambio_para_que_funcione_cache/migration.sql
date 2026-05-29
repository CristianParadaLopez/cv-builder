/*
  Warnings:

  - You are about to drop the `CVProfile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[googleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `formData` to the `CV` table without a default value. This is not possible if the table is not empty.
  - Added the required column `style` to the `CV` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `CV` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CVProfile" DROP CONSTRAINT "CVProfile_userId_fkey";

-- AlterTable
ALTER TABLE "CV" ADD COLUMN     "formData" JSONB NOT NULL,
ADD COLUMN     "htmlATS" TEXT,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mode" TEXT NOT NULL DEFAULT 'designed',
ADD COLUMN     "style" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "photoURL" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "CVProfile";

-- CreateTable
CREATE TABLE "FormCache" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "formData" JSONB NOT NULL,
    "html" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormCache_sessionId_key" ON "FormCache"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
