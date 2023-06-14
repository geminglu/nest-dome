import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemMenunNetities } from 'src/entities/systemMenun.etities';

@Module({
  imports: [TypeOrmModule.forFeature([SystemMenunNetities])],
  controllers: [SystemController],
  providers: [SystemService],
})
export class SystemModule {}
