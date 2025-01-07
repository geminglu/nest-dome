import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemMenunNetities } from 'src/entities/systemMenun.etities';
import { DictionaryInfoNetities } from 'src/entities/dictionaryInfo.netities';
import { DictionaryNetities } from 'src/entities/dictionary.netities';

@Module({
  imports: [
    TypeOrmModule.forFeature([SystemMenunNetities, DictionaryInfoNetities, DictionaryNetities]),
  ],
  controllers: [SystemController],
  providers: [SystemService],
})
export class SystemModule {}
