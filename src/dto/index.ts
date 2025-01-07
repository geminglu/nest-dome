import { IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryLogInLog {
  @IsNumberString()
  @ApiProperty({ description: '分页大小', required: true, minimum: 1 })
  pageSize: number;

  @IsNumberString()
  @ApiProperty({ description: '页码', required: true, minimum: 1 })
  page: number;
}
