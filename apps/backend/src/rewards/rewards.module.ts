import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RewardRedemptionsController } from './reward-redemptions.controller';
import { RewardShopController } from './reward-shop.controller';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';

@Module({
  imports: [AuthModule],
  controllers: [RewardsController, RewardShopController, RewardRedemptionsController],
  providers: [RewardsService]
})
export class RewardsModule {}
