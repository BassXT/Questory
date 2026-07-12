import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChildrenModule } from './children/children.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { FamiliesModule } from './families/families.module';
import { PrismaModule } from './prisma/prisma.module';
import { QuestAssignmentsModule } from './quest-assignments/quest-assignments.module';
import { QuestsModule } from './quests/quests.module';
import { RewardsModule } from './rewards/rewards.module';
import { SuggestionsModule } from './suggestions/suggestions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    AuthModule,
    ChildrenModule,
    DashboardModule,
    FamiliesModule,
    QuestAssignmentsModule,
    QuestsModule,
    RewardsModule,
    SuggestionsModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
