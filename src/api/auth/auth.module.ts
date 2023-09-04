import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from '../../guard/auth/auth.guard';
import { AuthService } from './auth.service';
import { UserModule } from 'src/api/user/user.module';
import { AuthController } from './auth.controller';
import { RolesGuard } from 'src/guard/auth/roles';
import { GraphicCodeNetities } from 'src/entities/graphicCode.netities';
import { LoginLogNetities } from 'src/entities/loginLog.netities';

@Module({
  imports: [
    TypeOrmModule.forFeature([GraphicCodeNetities, LoginLogNetities]),
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('config.secret'),
        signOptions: { expiresIn: configService.get('config.verifyCodeExpirationTime') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
