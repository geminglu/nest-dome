import { Module, Logger, Dependencies } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import dsConfig from 'src/config/dbConfig';
import { UserModule } from './api/user/user.module';
import { UploadModule } from './api/upload/upload.module';
import { AuthModule } from './api/auth/auth.module';
import { SystemModule } from './api/system/system.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`],
      isGlobal: true,
      load: [dsConfig],
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (ConfigService: ConfigService) => {
        return {
          ...(await ConfigService.get('database')),
        };
      },
      inject: [ConfigService],
    }),
    UploadModule,
    UserModule,
    AuthModule,
    SystemModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
