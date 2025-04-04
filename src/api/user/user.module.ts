import { Module, NestModule, MiddlewareConsumer, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { DeptService } from 'src/api/system/dept/dept.service';
import { UserController } from './user.controller';
import { UserEntities } from 'src/entities/user.entities';
import { LoginLogNetities } from 'src/entities/loginLog.netities';
import { AuthModule } from '../auth/auth.module';
import { SysDept } from 'src/entities/SysDept';
import { SysUserRoleNetities } from 'src/entities/sysUserRole.etities';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntities, LoginLogNetities, SysDept, SysUserRoleNetities]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, DeptService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(_consumer: MiddlewareConsumer) {
    //
  }
}
