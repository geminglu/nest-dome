import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({ title: '文件', type: 'string', format: 'binary' })
  file: any;
}
