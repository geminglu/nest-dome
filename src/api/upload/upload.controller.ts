import { Controller, Post, UseInterceptors, UploadedFiles, Get, Res } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { join } from 'path';
import { UploadService } from './upload.service';
import { ApiTags, ApiConsumes, ApiBody, ApiOAuth2 } from '@nestjs/swagger';
import { FileUploadDto } from './dto/create-upload.dto';

@Controller({
  path: 'upload',
  version: '1',
})
@ApiOAuth2(['pets:write'])
@ApiTags('上传和下载')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('file')
  @UseInterceptors(FilesInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '文件',
    type: FileUploadDto,
  })
  uploadFile(@UploadedFiles() file: Express.Multer.File[]) {
    return this.uploadService.addFile(file[0]);
  }

  @Get('export')
  download(@Res() res: Response) {
    const url = join(__dirname, '../uploads/对应分析.html');
    res.download(url);
  }
}
