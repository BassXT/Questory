CREATE TABLE "RewardAssignment" (
    "id" TEXT NOT NULL,
    "rewardId" TEXT NOT NULL,
    "childProfileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RewardAssignment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RewardAssignment_rewardId_childProfileId_key" ON "RewardAssignment"("rewardId", "childProfileId");
CREATE INDEX "RewardAssignment_rewardId_idx" ON "RewardAssignment"("rewardId");
CREATE INDEX "RewardAssignment_childProfileId_idx" ON "RewardAssignment"("childProfileId");

ALTER TABLE "RewardAssignment" ADD CONSTRAINT "RewardAssignment_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "Reward"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RewardAssignment" ADD CONSTRAINT "RewardAssignment_childProfileId_fkey" FOREIGN KEY ("childProfileId") REFERENCES "ChildProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
