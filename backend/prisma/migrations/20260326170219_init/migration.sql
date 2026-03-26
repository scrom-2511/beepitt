-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('free', 'starter', 'pro');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('local', 'google', 'discord');

-- CreateEnum
CREATE TYPE "NotificationChannels" AS ENUM ('telegram', 'discord', 'slack', 'email');

-- CreateEnum
CREATE TYPE "CurrentStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "IssuePriority" AS ENUM ('unseen', 'critical', 'high', 'low', 'closed');

-- CreateEnum
CREATE TYPE "Environment" AS ENUM ('production', 'staging', 'development', 'qa', 'uat', 'sandbox');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('issue', 'incident');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'successful', 'failed');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "username" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "city" TEXT,
    "timezone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuration" (
    "id" SERIAL NOT NULL,
    "eventsUsed" INTEGER NOT NULL,
    "globalThrottleWindow" INTEGER NOT NULL,
    "eventTriggerCount" INTEGER NOT NULL,
    "eventTriggerWindow" INTEGER NOT NULL,
    "maxRetries" INTEGER NOT NULL,
    "retryOffset" INTEGER NOT NULL,
    "notificationChannels" "NotificationChannels"[] DEFAULT ARRAY[]::"NotificationChannels"[],
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Configuration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "identifierKey" TEXT NOT NULL,
    "identifierKey2" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "projectDesc" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "AuthAccount" (
    "id" SERIAL NOT NULL,
    "provider" "AuthProvider" NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AuthAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "type" "EventType" NOT NULL,
    "projectName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "IssuePriority",
    "throttlingWindow" INTEGER NOT NULL,
    "environment" "Environment" NOT NULL DEFAULT 'production',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "seenAt" TIMESTAMP(3),
    "filePath" TEXT,
    "occurrences" INTEGER NOT NULL DEFAULT 1,
    "occurrencesFromLastNotificationSent" INTEGER NOT NULL,
    "firstOccurenceAfterLastNotificationSent" TIMESTAMP(3),
    "lineNumber" INTEGER,
    "columnNumber" INTEGER,
    "lastNotificationSent" TIMESTAMP(3) NOT NULL,
    "eventHashKey" TEXT NOT NULL,
    "group" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactDetails" (
    "id" SERIAL NOT NULL,
    "telegramChatIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "telegramChatIds2" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "discordChatIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "discordChatIds2" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "emailIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "emailIds2" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "ContactDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" SERIAL NOT NULL,
    "razorPayOrderId" TEXT NOT NULL,
    "razorPayPaymentId" TEXT,
    "amount" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "note" TEXT,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Configuration_userId_key" ON "Configuration"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_identifierKey_key" ON "Project"("identifierKey");

-- CreateIndex
CREATE UNIQUE INDEX "Project_identifierKey2_key" ON "Project"("identifierKey2");

-- CreateIndex
CREATE UNIQUE INDEX "Project_projectName_userId_key" ON "Project"("projectName", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Billing_userId_key" ON "Billing"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthAccount_providerId_key" ON "AuthAccount"("providerId");

-- CreateIndex
CREATE INDEX "AuthAccount_userId_idx" ON "AuthAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthAccount_provider_providerId_key" ON "AuthAccount"("provider", "providerId");

-- CreateIndex
CREATE INDEX "Event_userId_idx" ON "Event"("userId");

-- CreateIndex
CREATE INDEX "Event_userId_type_idx" ON "Event"("userId", "type");

-- CreateIndex
CREATE INDEX "Event_userId_priority_idx" ON "Event"("userId", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "ContactDetails_projectId_key" ON "ContactDetails"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Orders_razorPayOrderId_key" ON "Orders"("razorPayOrderId");

-- CreateIndex
CREATE INDEX "Orders_userId_idx" ON "Orders"("userId");

-- AddForeignKey
ALTER TABLE "Configuration" ADD CONSTRAINT "Configuration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Billing" ADD CONSTRAINT "Billing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthAccount" ADD CONSTRAINT "AuthAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactDetails" ADD CONSTRAINT "ContactDetails_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
