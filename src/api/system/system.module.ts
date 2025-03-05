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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SystemMenunNetities,
      DictionaryInfoNetities,
      DictionaryNetities,
      SysDept,
    ]),
  ],
  controllers: [SystemController, DeptController],
  providers: [SystemService, DeptService],
})
export class SystemModule {}
