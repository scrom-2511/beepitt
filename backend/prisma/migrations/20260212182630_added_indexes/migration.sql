/*
  Warnings:

  - The values [Started,Frontend_Success] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `incidentPriority` on the `Incident` table. All the data in the column will be lost.
  - You are about to drop the column `incidentResolveDateAndTime` on the `Incident` table. All the data in the column will be lost.
  - You are about to drop the column `dateFormat` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `subscription_tier` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,providerId]` on the table `AuthAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "CurrentStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "IssuePriority" AS ENUM ('Unseen', 'Critical', 'High', 'Low', 'Closed');

-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('Pending', 'Successful', 'Failed');
ALTER TABLE "Orders" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "public"."OrderStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Incident" DROP COLUMN "incidentPriority",
DROP COLUMN "incidentResolveDateAndTime",
ADD COLUMN     "filePath" TEXT,
ADD COLUMN     "incidentSeen" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "dateFormat",
DROP COLUMN "subscription_tier";

-- DropEnum
DROP TYPE "IncidentPriority";

-- CreateTable
CREATE TABLE "Billing" (
    "id" SERIAL NOT NULL,
    "subscription_tier" "SubscriptionTier" NOT NULL,
    "currentStatus" "CurrentStatus" NOT NULL,
    "validTill" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Billing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Issue" (
    "id" SERIAL NOT NULL,
    "issueName" TEXT NOT NULL,
    "issueDesc" TEXT NOT NULL,
    "issuePriority" "IssuePriority" NOT NULL,
    "issueDateAndTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "issueResolveDateAndTime" TIMESTAMP(3),
    "filePath" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Billing_userId_key" ON "Billing"("userId");

-- CreateIndex
CREATE INDEX "Issue_userId_idx" ON "Issue"("userId");

-- CreateIndex
CREATE INDEX "Issue_userId_issuePriority_idx" ON "Issue"("userId", "issuePriority");

-- CreateIndex
CREATE INDEX "AuthAccount_userId_idx" ON "AuthAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthAccount_provider_providerId_key" ON "AuthAccount"("provider", "providerId");

-- CreateIndex
CREATE INDEX "Incident_userId_idx" ON "Incident"("userId");

-- CreateIndex
CREATE INDEX "Incident_userId_incidentSeen_idx" ON "Incident"("userId", "incidentSeen");

-- CreateIndex
CREATE INDEX "Orders_userId_idx" ON "Orders"("userId");

-- AddForeignKey
ALTER TABLE "Billing" ADD CONSTRAINT "Billing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
