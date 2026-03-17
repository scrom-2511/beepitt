import { Loading } from '@/components/Loading';
import { getBillingDetailsHandler, SubscriptionTier } from '@/requestHandler/billing/getBillingDetails.reqhandler';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentConfirmation = () => {
  const {
    data: billingDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['billingDetails'],
    queryFn: getBillingDetailsHandler,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (billingDetails?.subscription_tier === SubscriptionTier.Starter) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

      return () => clearTimeout(timer);
    } else if (billingDetails?.subscription_tier === SubscriptionTier.Free) {
      const timer = setTimeout(() => {
        navigate('/pricing');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [billingDetails?.subscription_tier, navigate]);

  if (isLoading) {
    return <Loading title="Confirming payment" />;
  }

  if (isError) {
    return <h1>Something went wrong</h1>;
  }

  if (billingDetails?.subscription_tier === SubscriptionTier.Free) {
    return <h1>Payment unsuccessful. Money will be refunded in case of deduction.</h1>;
  }

  if (billingDetails?.subscription_tier === SubscriptionTier.Starter) {
    return <h1>Payment Successful</h1>;
  }

  return null;
};

export default PaymentConfirmation;

// // This is your Prisma schema file,
// // learn more about it in the docs: https://pris.ly/d/prisma-schema

// // Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// // Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

// generator client {
//   provider = "prisma-client"
//   output   = "../generated/prisma"
// }

// datasource db {
//   provider = "cockroachdb"
// }

// enum SubscriptionTier {
//   Free
//   Starter
// }

// enum AuthProvider {
//   LOCAL
//   GOOGLE
//   DISCORD
// }

// model User {
//   id            String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
//   otpVerified   Boolean  @default(false)
//   identifierKey String   @unique
//   username      String   @unique
//   firstName     String?
//   lastName      String?
//   email         String   @unique
//   password      String
//   city          String?
//   timezone      String?
//   createdAt     DateTime @default(now())
//   updatedAt     DateTime @updatedAt

//   authAccounts   AuthAccount[]
//   issues         Issue[]
//   contactDetails ContactDetails?
//   orders         Orders[]
//   incidents      Incident[]
//   billing        Billing?
// }

// enum CurrentStatus {
//   Active
//   Inactive
// }

// model Billing {
//   id                String           @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
//   subscription_tier SubscriptionTier
//   currentStatus     CurrentStatus
//   validTill         DateTime
//   userId            String           @unique
//   user              User             @relation(fields: [userId], references: [id])
// }

// model AuthAccount {
//   id         String       @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
//   provider   AuthProvider
//   providerId String       @unique
//   userId     String

//   user User @relation(fields: [userId], references: [id])
// }

// enum IssuePriority {
//   Unseen
//   Critical
//   High
//   Low
//   Closed
// }

// model Issue {
//   id                      String        @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
//   issueName               String
//   issueDesc               String
//   issuePriority           IssuePriority
//   issueDateAndTime        DateTime      @default(now())
//   issueResolveDateAndTime DateTime?
//   filePath                String?
//   userId                  String
//   user                    User          @relation(fields: [userId], references: [id])
// }

// model Incident {
//   id                  String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
//   incidentName        String
//   incidentDesc        String
//   incidentSeen        Boolean  @default(false)
//   incidentDateAndTime DateTime @default(now())
//   filePath            String?
//   userId              String
//   user                User     @relation(fields: [userId], references: [id])
// }

// model ContactDetails {
//   id              String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
//   telegramChatIds String[]
//   discordChatIds  String[]
//   userId          String   @unique
//   user            User     @relation(fields: [userId], references: [id])
// }

// enum OrderStatus {
//   Pending
//   Successful
//   Failed
// }

// model Orders {
//   id                String      @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
//   razorPayOrderId   String      @unique
//   razorPayPaymentId String?
//   amount            Int
//   status            OrderStatus
//   note              String?
//   userId            String
//   user              User        @relation(fields: [userId], references: [id])
//   createdAt         DateTime    @default(now())
//   updatedAt         DateTime    @default(now()) @updatedAt
// }
