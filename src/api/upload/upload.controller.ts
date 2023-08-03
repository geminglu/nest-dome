import { Controller, Post, UseInterceptors, UploadedFiles, Get, Res, Param, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { join } from 'path';
import { UploadService } from './upload.service';
import { ApiTags, ApiConsumes, ApiBody, ApiParam, ApiOperation } from '@nestjs/swagger';
import { zip } from 'compressing';
import { FileUploadDto } from './dto/create-upload.dto';
import { ResUnauthorized, ResServerErrorResponse } from 'src/utils/api.Response';

@Controller({
  path: 'upload',
  version: '1',
})
@ApiTags('上传和下载')
@ResUnauthorized()
@ResServerErrorResponse()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('file')
  @UseInterceptors(FilesInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '文件',
    type: FileUploadDto,
  })
  @ApiOperation({
    summary: '上传文件',
  })
  uploadFile(@UploadedFiles() file: Express.Multer.File[]) {
    return this.uploadService.addFile(file[0]);
  }

  @Get('file/:id')
  @ApiParam({ name: 'id', description: '文件ID' })
  @ApiOperation({
    summary: '下载文件',
  })
  async download(@Param('id') id: string, @Res() res: Response) {
    const fileDes = await this.uploadService.findFile(id);

    const file = createReadStream(
      join(process.cwd(), '/uploads/168214613037686e48e4b-bf81-48bf-adf2-62305e1fc96f.jpg'),
    );

    const tarStream = new zip.Stream();
    tarStream.addEntry(join(process.cwd(), '/uploads/168214613037686e48e4b-bf81-48bf-adf2-62305e1fc96f.jpg'));
    res.set({
      'Content-Type': fileDes.mimetype,
      'Content-Disposition': `attachment; filename="${fileDes.filename}"`,
    });

    // res.set({
    //   'Content-Type': 'application/octet-stream',
    //   'Content-Disposition': 'attachment; filename="package.json"',
    // });
    tarStream.pipe(res);
    // return new StreamableFile(file);
  }
}
