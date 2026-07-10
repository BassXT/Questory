import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RewardShopController } from './reward-shop.controller';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';

@Module({
  imports: [AuthModule],
  controllers: [RewardsController, RewardShopController],
  providers: [RewardsService]
})
export class RewardsModule {}
