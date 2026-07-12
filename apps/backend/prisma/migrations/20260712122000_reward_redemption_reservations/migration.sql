ALTER TYPE "RewardRedemptionStatus" ADD VALUE 'CANCELLED';

ALTER TABLE "RewardRedemption"
ADD COLUMN "cancelledAt" TIMESTAMP(3);
