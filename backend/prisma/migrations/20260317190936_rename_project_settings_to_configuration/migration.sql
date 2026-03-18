/*
  Warnings:

  - You are about to drop the `ProjectSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProjectSettings" DROP CONSTRAINT "ProjectSettings_userId_fkey";

-- DropTable
DROP TABLE "ProjectSettings";

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

-- CreateIndex
CREATE UNIQUE INDEX "Configuration_userId_key" ON "Configuration"("userId");

-- AddForeignKey
ALTER TABLE "Configuration" ADD CONSTRAINT "Configuration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
