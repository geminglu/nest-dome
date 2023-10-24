import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [OpenaiController],
  providers: [OpenaiService],
})
export class OpenaiModule {}
