import { IsOptional, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryLogInLog {
  @IsOptional()
  @IsNumberString()
  @ApiProperty({ description: '分页大小', required: false, minimum: 1 })
  pageSize: number;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ description: '页码', required: false, minimum: 1 })
  page: number;
}
