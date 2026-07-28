CREATE UNIQUE INDEX "RewardRedemption_active_reward_child_key"
ON "RewardRedemption" ("rewardId", "childProfileId")
WHERE "status" IN ('REQUESTED', 'APPROVED');
