import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChildrenModule } from './children/children.module';
import { FamiliesModule } from './families/families.module';
import { PrismaModule } from './prisma/prisma.module';
import { QuestAssignmentsModule } from './quest-assignments/quest-assignments.module';
import { QuestsModule } from './quests/quests.module';
import { RewardsModule } from './rewards/rewards.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    AuthModule,
    ChildrenModule,
    FamiliesModule,
    QuestAssignmentsModule,
    QuestsModule,
    RewardsModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
