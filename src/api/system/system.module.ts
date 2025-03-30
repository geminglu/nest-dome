import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemMenunNetities } from 'src/entities/systemMenun.etities';
import { DictionaryInfoNetities } from 'src/entities/dictionaryInfo.netities';
import { DictionaryNetities } from 'src/entities/dictionary.netities';
import { DeptService } from './dept/dept.service';
import { DeptController } from './dept/dept.controller';
import { SysDept } from 'src/entities/SysDept';
import { SysRoleNetities } from 'src/entities/sysRole.etities';
import { SysRoleMenuNetities } from 'src/entities/sysRoleMenu.etities';
import { SysUserRoleNetities } from 'src/entities/sysUserRole.etities';
import { RoleController } from 'src/api/system/role/role.controller';
import { RoleService } from 'src/api/system/role/role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SystemMenunNetities,
      DictionaryInfoNetities,
      DictionaryNetities,
      SysRoleNetities,
      SysRoleMenuNetities,
      SysUserRoleNetities,
      SysDept,
    ]),
  ],
  controllers: [SystemController, DeptController, RoleController],
  providers: [SystemService, DeptService, RoleService],
})
export class SystemModule {}
