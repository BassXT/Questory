import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from './password.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') ?? 'change-this-in-production',
        signOptions: {
          expiresIn: '7d'
        }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordService],
  exports: [AuthService]
})
export class AuthModule {}
