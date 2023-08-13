import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntities } from 'src/entities/user.entities';
import { LoginLogNetities } from 'src/entities/loginLog.netities';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntities, LoginLogNetities])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //
  }
}
